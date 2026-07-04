"""
MG Brush ERP

Base Repository

Contains common database helper methods used by all repositories.
"""

from __future__ import annotations

import logging
from typing import Any

from database.connection import db


logger = logging.getLogger(__name__)


class BaseRepository:

    def __init__(self):

        self.conn = db.connect()

    # ------------------------------------------------------------------
    # Generic Execute
    # ------------------------------------------------------------------

    def execute(
        self,
        query: str,
        params: tuple | list | None = None
    ) -> int:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

            return cursor.rowcount

    # ------------------------------------------------------------------
    # Fetch One
    # ------------------------------------------------------------------

    def fetch_one(
        self,
        query: str,
        params: tuple | list | None = None
    ) -> dict | None:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

            return cursor.fetchone()

    # ------------------------------------------------------------------
    # Fetch All
    # ------------------------------------------------------------------

    def fetch_all(
        self,
        query: str,
        params: tuple | list | None = None
    ) -> list[dict]:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

            return cursor.fetchall()

    # ------------------------------------------------------------------
    # Generic INSERT
    # ------------------------------------------------------------------

    def insert(
        self,
        table: str,
        data: dict,
        returning: str | None = None
    ) -> Any:

        columns = list(data.keys())

        values = list(data.values())

        placeholders = ", ".join(["%s"] * len(columns))

        sql = f"""
            INSERT INTO {table}
            ({", ".join(columns)})
            VALUES ({placeholders})
        """

        if returning:

            sql += f" RETURNING {returning}"

        with self.conn.cursor() as cursor:

            cursor.execute(sql, values)

            result = cursor.fetchone() if returning else None

        self.commit()

        if returning:

            return result[returning]

        return cursor.rowcount

    # ------------------------------------------------------------------
    # Generic UPDATE
    # ------------------------------------------------------------------

    def update(
        self,
        table: str,
        data: dict,
        where: dict
    ) -> int:

        set_clause = ", ".join(
            f"{column}=%s"
            for column in data.keys()
        )

        where_clause = " AND ".join(
            f"{column}=%s"
            for column in where.keys()
        )

        sql = f"""
            UPDATE {table}
            SET {set_clause}
            WHERE {where_clause}
        """

        params = list(data.values()) + list(where.values())

        with self.conn.cursor() as cursor:

            cursor.execute(sql, params)

            rows = cursor.rowcount

        self.commit()

        return rows

    # ------------------------------------------------------------------
    # Generic DELETE
    # ------------------------------------------------------------------

    def delete(
        self,
        table: str,
        where: dict
    ) -> int:

        where_clause = " AND ".join(
            f"{column}=%s"
            for column in where.keys()
        )

        sql = f"""
            DELETE FROM {table}
            WHERE {where_clause}
        """

        with self.conn.cursor() as cursor:

            cursor.execute(sql, list(where.values()))

            rows = cursor.rowcount

        self.commit()

        return rows

    # ------------------------------------------------------------------
    # Generic Find One
    # ------------------------------------------------------------------

    def find_one(
        self,
        table: str,
        where: dict
    ) -> dict | None:

        where_clause = " AND ".join(
            f"{column}=%s"
            for column in where.keys()
        )

        sql = f"""
            SELECT *
            FROM {table}
            WHERE {where_clause}
        """

        return self.fetch_one(sql, list(where.values()))

    # ------------------------------------------------------------------
    # Generic Find All
    # ------------------------------------------------------------------

    def find_all(
        self,
        table: str,
        where: dict | None = None,
        order_by: str | None = None
    ) -> list[dict]:

        sql = f"SELECT * FROM {table}"

        params: list[Any] = []

        if where:

            where_clause = " AND ".join(
                f"{column}=%s"
                for column in where.keys()
            )

            sql += f" WHERE {where_clause}"

            params = list(where.values())

        if order_by:

            sql += f" ORDER BY {order_by}"

        return self.fetch_all(sql, params)

    # ------------------------------------------------------------------
    # Transaction
    # ------------------------------------------------------------------

    def commit(self):

        self.conn.commit()

    def rollback(self):

        self.conn.rollback()

    def find_by_id(
        self,
        table: str,
        id_column: str,
        id_value
    ) -> dict | None:

        sql = f"""
            SELECT *
            FROM {table}
            WHERE {id_column} = %s
        """

        return self.fetch_one(sql, (id_value,))
    
    def exists(
        self,
        table: str,
        conditions: dict
    ) -> bool:

        where_clause = " AND ".join(
            f"{column}=%s"
            for column in conditions.keys()
        )

        sql = f"""
            SELECT 1
            FROM {table}
            WHERE {where_clause}
            LIMIT 1
        """

        result = self.fetch_one(
            sql,
            tuple(conditions.values())
        )

        return result is not None
    
    def count(
        self,
        table: str,
        conditions: dict | None = None
    ) -> int:

        sql = f"""
            SELECT COUNT(*) AS total
            FROM {table}
        """

        params = ()

        if conditions:

            where_clause = " AND ".join(
                f"{column}=%s"
                for column in conditions.keys()
            )

            sql += f" WHERE {where_clause}"

            params = tuple(
                conditions.values()
            )

        result = self.fetch_one(
            sql,
            params
        )

        return result["total"]
    
    def find_all(
        self,
        table: str,
        conditions: dict | None = None,
        order_by: str | None = None
    ) -> list[dict]:

        sql = f"""
            SELECT *
            FROM {table}
        """

        params = ()

        if conditions:

            where_clause = " AND ".join(
                f"{column}=%s"
                for column in conditions.keys()
            )

            sql += f" WHERE {where_clause}"

            params = tuple(
                conditions.values()
            )

        if order_by:

            sql += f" ORDER BY {order_by}"

        return self.fetch_all(
            sql,
            params
        )
    
    def upsert(
        self,
        table: str,
        data: dict,
        key_columns: list[str]
    ):

        if not key_columns:
            raise ValueError(
                "key_columns cannot be empty."
            )

        conditions = {
            key: data[key]
            for key in key_columns
        }

        existing = self.find_one(
            table,
            conditions
        )

        if existing:

            update_data = data.copy()

            for key in key_columns:
                update_data.pop(key)

            return self.update(
                table,
                update_data,
                conditions
            )

        return self.insert(
            table,
            data
        )
    
    def find_value(
        self,
        table: str,
        column: str,
        conditions: dict
    ):

        where_clause = " AND ".join(
            f"{key}=%s"
            for key in conditions
        )

        sql = f"""
            SELECT {column}
            FROM {table}
            WHERE {where_clause}
            LIMIT 1
        """

        result = self.fetch_one(
            sql,
            tuple(conditions.values())
        )

        if result:
            return result[column]

        return None
    
    