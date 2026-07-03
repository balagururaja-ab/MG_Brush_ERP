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