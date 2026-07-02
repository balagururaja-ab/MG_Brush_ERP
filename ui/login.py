from services.authentication import authenticate


def login_screen():

    print("=" * 40)
    print("        MG Brush ERP")
    print("=" * 40)

    username = input("Username : ")

    password = input("Password : ")

    success = authenticate(username, password)

    if success:
        print("\nLogin Successful")
    else:
        print("\nInvalid Username or Password")