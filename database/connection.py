import psycopg2
from psycopg2.extras import RealDictCursor

from config import DB


class Database:

    def connect(self):
        conn = psycopg2.connect(
            host=DB.host,
            port=DB.port,
            database=DB.database,
            user=DB.user,
            password=DB.password,
            cursor_factory=RealDictCursor,
        )

        with conn.cursor() as cur:
            cur.execute(f"SET search_path TO {DB.schema}, public;")

        conn.commit()

        return conn

    def close(self, conn):
        if conn:
            conn.close()


db = Database()