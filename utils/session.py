current_user = {}


def login(user):
    current_user["user_id"] = user["user_id"]
    current_user["username"] = user["username"]
    current_user["role"] = user["role"]


def logout():
    current_user.clear()


def is_logged_in():
    return len(current_user) > 0