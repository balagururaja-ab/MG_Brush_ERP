"""
Authentication API
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.params import Depends
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel

from services.auth_service import AuthService

router = APIRouter()

auth_service = AuthService()

security = HTTPBearer()


# ---------------------------------------------------------
# Request Models
# ---------------------------------------------------------

class LoginRequest(BaseModel):

    username: str
    password: str


class ChangePasswordRequest(BaseModel):

    old_password: str
    new_password: str


# ---------------------------------------------------------
# Login
# ---------------------------------------------------------

@router.post("/login")
def login(request: LoginRequest):

    try:

        user = auth_service.authenticate(
            request.username,
            request.password
        )

        token = auth_service.generate_token(user)

        return {

            "access_token": token,

            "token_type": "Bearer",

            "user": {

                "user_id": user["user_id"],

                "username": user["username"],

                "full_name": user["full_name"],

                "role": user["role"]

            }

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=401,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Current User Dependency
# ---------------------------------------------------------

def current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security)

):

    try:

        payload = auth_service.verify_token(
            credentials.credentials
        )

        return auth_service.get_current_user(
            payload["username"]
        )

    except ValueError as ex:

        raise HTTPException(
            status_code=401,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Current Logged-in User
# ---------------------------------------------------------

@router.get("/me")
def me(

    user=Depends(current_user)

):

    return {

        "user_id": user["user_id"],

        "username": user["username"],

        "full_name": user["full_name"],

        "role": user["role"]

    }


# ---------------------------------------------------------
# Change Password
# ---------------------------------------------------------

@router.post("/change-password")
def change_password(

    request: ChangePasswordRequest,

    user=Depends(current_user)

):

    auth_service.change_password(

        user["user_id"],

        request.old_password,

        request.new_password

    )

    return {

        "message": "Password changed successfully."

    }


# ---------------------------------------------------------
# Logout
# ---------------------------------------------------------

@router.post("/logout")
def logout():

    return {

        "message": "Logged out successfully."

    }

