from utils.session import current_user
from models.role import permissions


def dashboard():

    role = current_user["role"]

    print()

    print("Welcome", current_user["username"])

    print("Role :", role)

    print()

    print("Available Modules")

    print("------------------")

    for module in permissions[role]:
        print(module)