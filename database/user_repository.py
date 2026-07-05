"""
User Repository
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class UserRepository(BaseRepository):

    def create_user(
        self,
        user: dict
    ) -> int:

        return self.insert(
            Tables.USERS,
            user,
            "user_id"
        )

    def get_user(
        self,
        user_id: int
    ):

        return self.find_by_id(
            Tables.USERS,
            "user_id",
            user_id
        )

    def get_user_by_username(
        self,
        username: str
    ):

        return self.find_one(
            Tables.USERS,
            {
                "username": username
            }
        )

    def list_users(self):

        return self.find_all(
            Tables.USERS,
            order_by="username"
        )

    def username_exists(
        self,
        username: str
    ) -> bool:

        return self.exists(
            Tables.USERS,
            {
                "username": username
            }
        )

    def is_active(
        self,
        user_id: int
    ) -> bool:

        user = self.get_user(user_id)

        return user is not None and user["active"]

    
    def update_user(
        self,
        user_id: int,
        user: dict
    ):

        return self.update(
            Tables.USERS,
            user,
            {
                "user_id": user_id
            }
        )

    def set_active(
        self,
        user_id: int,
        active: bool
    ):

        return self.update(
            Tables.USERS,
            {
                "active": active
            },
            {
                "user_id": user_id
            }
        )

    def delete_user(
        self,
        user_id: int
    ):

        return self.delete(
            Tables.USERS,
            {
                "user_id": user_id
            }
        )