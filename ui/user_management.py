def menu():

    while True:

        print()

        print("1 Add User")
        print("2 Update User")
        print("3 Delete User")
        print("4 Search User")
        print("5 List Users")
        print("0 Exit")

        choice = input("Choice : ")

        if choice == "1":
            print("Add User")

        elif choice == "2":
            print("Update User")

        elif choice == "3":
            print("Delete User")

        elif choice == "4":
            print("Search User")

        elif choice == "5":
            print("List Users")

        elif choice == "0":
            break