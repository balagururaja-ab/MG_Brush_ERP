"""
Authentication Service

Contains Authentication Business Logic
"""

from __future__ import annotations

from datetime import datetime, timedelta
import bcrypt
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from database.user_repository import UserRepository


import os

from dotenv import load_dotenv

load_dotenv()


class AuthService:

    def __init__(self):

        self.repo = UserRepository()

        self.secret_key = os.getenv("JWT_SECRET_KEY")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.token_expire_minutes = int(
            os.getenv("JWT_EXPIRE_MINUTES", "60")
        )

    # ---------------------------------------------------------
    # Hash Password
    # ---------------------------------------------------------

    def hash_password(
        self,
        password: str
    ) -> str:

        return bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

    # ---------------------------------------------------------
    # Verify Password
    # ---------------------------------------------------------

    def verify_password(
        self,
        password: str,
        password_hash: str
    ) -> bool:

        return bcrypt.checkpw(
            password.encode(),
            password_hash.encode()
        )

    # ---------------------------------------------------------
    # Authenticate User
    # ---------------------------------------------------------

    def authenticate(
        self,
        username: str,
        password: str
    ):

        user = self.repo.get_user_by_username(
            username
        )

        if user is None:
            raise ValueError(
                "Invalid Username."
            )

        if not user["active"]:
            raise ValueError(
                "User is inactive."
            )

        if not self.verify_password(
            password,
            user["password_hash"]
        ):
            raise ValueError(
                "Invalid Password."
            )

        return user

    # ---------------------------------------------------------
    # Generate JWT Token
    # ---------------------------------------------------------

    def generate_token(
        self,
        user: dict
    ) -> str:

        payload = {

            "user_id": user["user_id"],
            "username": user["username"],
            "role": user["role"],
            "exp": datetime.utcnow() + timedelta(
                minutes=self.token_expire_minutes
)

        }

        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.algorithm
        )

    # ---------------------------------------------------------
    # Verify JWT Token
    # ---------------------------------------------------------

    def verify_token(
        self,
        token: str
    ):

        try:

            return jwt.decode(

                token,

                self.secret_key,

                algorithms=[self.algorithm]

            )

        except ExpiredSignatureError:

            raise ValueError(
                "Token has expired."
            )

        except InvalidTokenError:

            raise ValueError(
                "Invalid token."
            )

    # ---------------------------------------------------------
    # Create User
    # ---------------------------------------------------------

    def create_user(
        self,
        user: dict
    ) -> int:

        if self.repo.username_exists(
            user["username"]
        ):

            raise ValueError(
                "Username already exists."
            )

        user["password_hash"] = self.hash_password(
            user["password_hash"]
        )

        return self.repo.create_user(
            user
        )

    
    # ---------------------------------------------------------
    # Change Password
    # ---------------------------------------------------------

    def change_password(

        self,

        user_id: int,

        old_password: str,

        new_password: str

    ):

        user = self.repo.get_user(user_id)

        if user is None:

            raise ValueError(
                "User not found."
            )

        if not self.verify_password(
            old_password,
            user["password_hash"]
        ):

            raise ValueError(
                "Old password is incorrect."
            )

        password_hash = self.hash_password(
            new_password
        )

        self.repo.update_user(
            user_id,
            {
                "password_hash": password_hash
            }
        )

        return True
    
    # ---------------------------------------------------------
    # Get Current User
    # ---------------------------------------------------------

    def get_current_user(
        self,
        username: str
    ):

        user = self.repo.get_user_by_username(username)

        if user is None:

            raise ValueError(
                "User not found."
            )

        if not user["active"]:

            raise ValueError(
                "User is inactive."
            )

        return user