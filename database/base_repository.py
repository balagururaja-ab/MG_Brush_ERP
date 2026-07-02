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

    def execute(
        self,
        query: str,
        params: tuple | None = None
    ) -> None:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

    def fetch_one(
        self,
        query: str,
        params: tuple | None = None
    ) -> dict | None:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

            return cursor.fetchone()

    def fetch_all(
        self,
        query: str,
        params: tuple | None = None
    ) -> list[dict]:

        with self.conn.cursor() as cursor:

            cursor.execute(query, params)

            return cursor.fetchall()

    def commit(self):

        self.conn.commit()

    def rollback(self):

        self.conn.rollback()