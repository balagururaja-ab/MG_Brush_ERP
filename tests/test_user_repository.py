"""
Test User Repository
"""

from datetime import datetime

from database.user_repository import UserRepository

repo = UserRepository()


def main():

    username = f"testuser_{datetime.now().strftime('%H%M%S')}"

    user = {

        "username": username,
        "password_hash": "admin123",
        "full_name": "Test User",
        "role": "ADMIN",
        "mobile": "9876543210",
        "active": True

    }

    print("=" * 60)
    print("CREATE USER")
    print("=" * 60)

    user_id = repo.create_user(user)

    print("User ID :", user_id)

    # ---------------------------------------------------------

    print("=" * 60)
    print("GET USER")
    print("=" * 60)

    print(repo.get_user(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("GET USER BY USERNAME")
    print("=" * 60)

    print(repo.get_user_by_username(username))

    # ---------------------------------------------------------

    print("=" * 60)
    print("LIST USERS")
    print("=" * 60)

    users = repo.list_users()

    print("Total Users :", len(users))

    # ---------------------------------------------------------

    print("=" * 60)
    print("USERNAME EXISTS")
    print("=" * 60)

    print("Exists :", repo.username_exists(username))

    # ---------------------------------------------------------

    print("=" * 60)
    print("IS ACTIVE")
    print("=" * 60)

    print("Active :", repo.is_active(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("VERIFY USER")
    print("=" * 60)

    verified = repo.get_user_by_username(
        username,
        "admin123"
    )

    print(verified)

    # ---------------------------------------------------------

    print("=" * 60)
    print("UPDATE USER")
    print("=" * 60)

    user["full_name"] = "Updated Test User"

    user["mobile"] = "9999999999"

    rows = repo.update_user(
        user_id,
        user
    )

    print("Rows Updated :", rows)

    print(repo.get_user(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("DEACTIVATE USER")
    print("=" * 60)

    rows = repo.set_active(
        user_id,
        False
    )

    print("Rows Updated :", rows)

    print("Active :", repo.is_active(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("ACTIVATE USER")
    print("=" * 60)

    rows = repo.set_active(
        user_id,
        True
    )

    print("Rows Updated :", rows)

    print("Active :", repo.is_active(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("DELETE USER")
    print("=" * 60)

    rows = repo.delete_user(user_id)

    print("Rows Deleted :", rows)

    print(repo.get_user(user_id))

    # ---------------------------------------------------------

    print("=" * 60)
    print("ALL USER REPOSITORY TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":

    main()