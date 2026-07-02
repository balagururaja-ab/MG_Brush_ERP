"""
MG Brush ERP

Seed Master Data

This script inserts default master data required for development
and automated testing. Safe to run multiple times.
"""

from database.connection import db


class SeedMasterData:

    def __init__(self):
        self.conn = db.connect()

    def record_exists(self, table, column, value):
        query = f"SELECT 1 FROM {table} WHERE {column}=%s LIMIT 1"

        with self.conn.cursor() as cur:
            cur.execute(query, (value,))
            return cur.fetchone() is not None

    def insert_role(self):

        if self.record_exists("roles", "role_name", "Admin"):
            print("✓ Role already exists")
            return

        with self.conn.cursor() as cur:

            cur.execute("""
                INSERT INTO roles
                (
                    role_name,
                    description
                )
                VALUES
                (
                    %s,
                    %s
                )
            """, (
                "Admin",
                "System Administrator"
            ))

        self.conn.commit()

        print("✓ Admin Role Created")

    def insert_admin_user(self):

        if self.record_exists("users", "username", "admin"):
            print("✓ Admin User already exists")
            return

        # bcrypt hash for password: admin123
        password_hash = "$2b$12$QY7qM2Jm4N9qJv6lCkqv4ev9kRkZkYQ6WvR.5t8Czj0XJd2W1w2sC"

        with self.conn.cursor() as cur:

            cur.execute("""
                INSERT INTO users
                (
                    username,
                    full_name,
                    password_hash,
                    role_id,
                    email,
                    mobile,
                    active
                )
                VALUES
                (
                    %s,%s,%s,%s,%s,%s,%s
                )
            """,
            (
                "admin",
                "Administrator",
                password_hash,
                1,
                "admin@mgbrush.com",
                "9999999999",
                True
            ))

        self.conn.commit()

        print("✓ Admin User Created")

    def insert_supplier(self):

        if self.record_exists("suppliers", "supplier_code", "SUP001"):
            print("✓ Supplier already exists")
            return

        with self.conn.cursor() as cur:

            cur.execute("""
            INSERT INTO suppliers
            (
                supplier_code,
                supplier_name,
                contact_person,
                phone,
                mobile,
                email,
                city,
                state,
                payment_terms
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,%s,%s
            )
            """,
            (
                "SUP001",
                "Stallone Overseas",
                "Sanjeev Jain",
                "9876543210",
                "9876543210",
                "sales@stallone.com",
                "Delhi",
                "Delhi",
                "30 DAYS"
            ))

        self.conn.commit()

        print("✓ Supplier Created")

    def insert_customer(self):

        if self.record_exists("customers", "customer_code", "CUS001"):
            print("✓ Customer already exists")
            return

        with self.conn.cursor() as cur:

            cur.execute("""
            INSERT INTO customers
            (
                customer_code,
                customer_name,
                phone,
                city,
                state
            )
            VALUES
            (
                %s,%s,%s,%s,%s
            )
            """,
            (
                "CUS001",
                "Demo Customer",
                "9876543210",
                "Chennai",
                "Tamil Nadu"
            ))

        self.conn.commit()

        print("✓ Customer Created")

    def run(self):

        print("=" * 50)
        print("MG Brush ERP - Seed Master Data")
        print("=" * 50)

        self.insert_role()
        self.insert_admin_user()
        self.insert_supplier()
        self.insert_customer()

        print("=" * 50)
        print("Seed Completed Successfully")
        print("=" * 50)


if __name__ == "__main__":

    SeedMasterData().run()