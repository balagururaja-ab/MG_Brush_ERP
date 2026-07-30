import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import pool as pg_pool

from config import DB


class Database:
    """Thin wrapper around a ThreadedConnectionPool.

    The pool keeps at most MAX_CONN live PostgreSQL connections shared
    across all repositories, so the server never exhausts pg max_connections.
    """

    MIN_CONN = 0   # lazy – no connections pre-opened at startup
    MAX_CONN = 20

    def __init__(self):
        self._pool: pg_pool.ThreadedConnectionPool | None = None

    def _get_pool(self) -> pg_pool.ThreadedConnectionPool:
        if self._pool is None or self._pool.closed:
            self._pool = pg_pool.ThreadedConnectionPool(
                self.MIN_CONN,
                self.MAX_CONN,
                host=DB.host,
                port=DB.port,
                database=DB.database,
                user=DB.user,
                password=DB.password,
                cursor_factory=RealDictCursor,
            )
        return self._pool

    def connect(self):
        """Acquire a connection from the pool.

        If the connection is dead (terminated externally), discard the
        pool and retry once with a fresh pool so the server self-heals
        after a PostgreSQL restart or manual pg_terminate_backend call.
        """
        for attempt in range(2):
            try:
                conn = self._get_pool().getconn()
                # Quick liveness check — catches externally killed connections
                try:
                    with conn.cursor() as cur:
                        cur.execute("SELECT 1")
                except Exception:
                    # Connection is dead; put it back and rebuild the pool
                    try:
                        self._get_pool().putconn(conn, close=True)
                    except Exception:
                        pass
                    raise  # triggers the outer except → pool reset
                with conn.cursor() as cur:
                    cur.execute(f"SET search_path TO {DB.schema}, public;")
                conn.commit()
                return conn
            except Exception:
                if attempt == 0 and self._pool is not None:
                    # Reset the pool and try once more
                    try:
                        self._pool.closeall()
                    except Exception:
                        pass
                    self._pool = None
                else:
                    raise

    def release(self, conn):
        """Return a connection to the pool."""
        if conn is not None:
            try:
                self._get_pool().putconn(
                    conn,
                    close=bool(getattr(conn, "closed", 0))
                )
            except Exception:
                pass

    def close(self, conn):
        """Alias kept for backward compatibility."""
        self.release(conn)


db = Database()