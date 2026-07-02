
import psycopg2
from psycopg2.extras import RealDictCursor

from config import DB


class Database:

    def __init__(self):
        self.connection = None

    def connect(self):

        if self.connection is None or self.connection.closed:

            self.connection = psycopg2.connect(
                host=DB.host,
                port=DB.port,
                database=DB.database,
                user=DB.user,
                password=DB.password,
                cursor_factory=RealDictCursor
            )

            with self.connection.cursor() as cur:
                cur.execute(f"SET search_path TO {DB.schema}, public;")

            self.connection.commit()

        return self.connection


db = Database()
