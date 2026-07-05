"""
Test Auth Service
"""

from datetime import datetime

from database.user_repository import UserRepository
from services.auth_service import AuthService


service = AuthService()
repo = UserRepository()


def main():

    username = f"testuser_{datetime.now().strftime('%H%M%S')}"

    print("=" * 60)
    print("HASH PASSWORD")
    print("=" * 60)

    password = "admin123"

    password_hash = service.hash_password(password)

    print(password_hash)

    assert password_hash != password

    print("✓ Hash Password Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("VERIFY PASSWORD")
    print("=" * 60)

    assert service.verify_password(
        password,
        password_hash
    )

    print("✓ Verify Password Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("WRONG PASSWORD")
    print("=" * 60)

    assert not service.verify_password(
        "wrongpassword",
        password_hash
    )

    print("✓ Wrong Password Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("CREATE USER")
    print("=" * 60)

    user = {

        "username": username,

        "password_hash": password,

        "full_name": "Test User",

        "role": "ADMIN",

        "mobile": "9999999999",

        "active": True

    }

    user_id = service.create_user(user)

    print("User ID :", user_id)

    # ---------------------------------------------------------

    print("=" * 60)
    print("DUPLICATE USERNAME")
    print("=" * 60)

    try:

        service.create_user(user)

        raise Exception(
            "Duplicate username allowed."
        )

    except ValueError:

        print("✓ Duplicate Username Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("AUTHENTICATE USER")
    print("=" * 60)

    logged_user = service.authenticate(
        username,
        password
    )

    print(logged_user)

    assert logged_user["user_id"] == user_id

    print("✓ Authenticate Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("INVALID USERNAME")
    print("=" * 60)

    try:

        service.authenticate(
            "invaliduser",
            password
        )

        raise Exception(
            "Invalid username accepted."
        )

    except ValueError:

        print("✓ Invalid Username Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("INVALID PASSWORD")
    print("=" * 60)

    try:

        service.authenticate(
            username,
            "wrongpassword"
        )

        raise Exception(
            "Wrong password accepted."
        )

    except ValueError:

        print("✓ Invalid Password Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("INACTIVE USER")
    print("=" * 60)

    repo.set_active(
        user_id,
        False
    )

    try:

        service.authenticate(
            username,
            password
        )

        raise Exception(
            "Inactive user authenticated."
        )

    except ValueError:

        print("✓ Inactive User Passed")

    repo.set_active(
        user_id,
        True
    )

    # ---------------------------------------------------------

    print("=" * 60)
    print("GENERATE JWT")
    print("=" * 60)

    token = service.generate_token(
        logged_user
    )

    print(token)

    assert token

    print("✓ JWT Generated")

    # ---------------------------------------------------------

    print("=" * 60)
    print("VERIFY JWT")
    print("=" * 60)

    payload = service.verify_token(
        token
    )

    print(payload)

    assert payload["username"] == username

    print("✓ JWT Verified")

    # ---------------------------------------------------------

    print("=" * 60)
    print("CHANGE PASSWORD")
    print("=" * 60)

    service.change_password(
        user_id,
        "newpassword123"
    )

    print("✓ Password Changed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("LOGIN WITH NEW PASSWORD")
    print("=" * 60)

    logged_user = service.authenticate(

        username,

        "newpassword123"

    )

    print(logged_user)

    print("✓ Login With New Password Passed")

    # ---------------------------------------------------------

    print("=" * 60)
    print("DELETE TEST USER")
    print("=" * 60)

    repo.delete_user(user_id)

    assert repo.get_user(user_id) is None

    print("✓ Test User Deleted")

    # ---------------------------------------------------------

    print("=" * 60)
    print("ALL AUTH SERVICE TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":

    main()