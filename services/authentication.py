from database.users import get_user
from utils.password import verify_password
from utils.session import login


def authenticate(username, password):

    row = get_user(username)

    if row is None:
        return False

    user = {
        "user_id": row[0],
        "username": row[1],
        "password": row[2],
        "role": row[3]
    }

    if verify_password(password, user["password"]):

        login(user)

        return True

    return False