"""
Supplier Repository
"""

from database.connection import db


class SupplierRepository:

    # --------------------------------------------------
    # Get All
    # --------------------------------------------------

    def get_all(self):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM suppliers

                    WHERE is_active=TRUE

                    ORDER BY supplier_name

                """)

                return cur.fetchall()

        except Exception as ex:

            conn.rollback()
            print("GET ALL SUPPLIER ERROR:", ex)
            raise

    # --------------------------------------------------
    # Get By Id
    # --------------------------------------------------

    def get_by_id(self, supplier_id: int):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM suppliers

                    WHERE supplier_id=%s

                    AND is_active=TRUE

                """, (supplier_id,))

                return cur.fetchone()

        except Exception as ex:

            conn.rollback()
            print("GET SUPPLIER ERROR:", ex)
            raise

    # --------------------------------------------------
    # Get By Code
    # --------------------------------------------------

    def get_by_code(self, supplier_code: str):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM suppliers

                    WHERE supplier_code=%s

                """, (supplier_code,))

                return cur.fetchone()

        except Exception as ex:

            conn.rollback()
            print("GET BY CODE ERROR:", ex)
            raise

    # --------------------------------------------------
    # Get By Code Except Id
    # --------------------------------------------------

    def get_by_code_except_id(
        self,
        supplier_code,
        supplier_id
    ):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM suppliers

                    WHERE supplier_code=%s

                    AND supplier_id<>%s

                """, (supplier_code, supplier_id))

                return cur.fetchone()

        except Exception as ex:

            conn.rollback()
            print("GET CODE EXCEPT ID ERROR:", ex)
            raise

    # --------------------------------------------------
    # Create
    # --------------------------------------------------

    def create(self, supplier: dict):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    INSERT INTO suppliers
                    (
                        supplier_code,
                        supplier_name,
                        contact_person,
                        gstin,
                        pan_number,
                        phone,
                        mobile,
                        email,
                        address1,
                        address2,
                        city,
                        state,
                        pincode,
                        country,
                        payment_terms,
                        credit_days,
                        bank_name,
                        account_number,
                        ifsc_code,
                        remarks
                    )

                    VALUES
                    (
                        %(supplier_code)s,
                        %(supplier_name)s,
                        %(contact_person)s,
                        %(gstin)s,
                        %(pan_number)s,
                        %(phone)s,
                        %(mobile)s,
                        %(email)s,
                        %(address1)s,
                        %(address2)s,
                        %(city)s,
                        %(state)s,
                        %(pincode)s,
                        %(country)s,
                        %(payment_terms)s,
                        %(credit_days)s,
                        %(bank_name)s,
                        %(account_number)s,
                        %(ifsc_code)s,
                        %(remarks)s
                    )

                    RETURNING *

                """, supplier)

                result = cur.fetchone()

            conn.commit()

            return result

        except Exception as ex:

            conn.rollback()
            print("CREATE SUPPLIER ERROR:", ex)
            raise

    # --------------------------------------------------
    # Update
    # --------------------------------------------------

    def update(
        self,
        supplier_id: int,
        supplier: dict
    ):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    UPDATE suppliers

                    SET

                        supplier_code=%(supplier_code)s,
                        supplier_name=%(supplier_name)s,
                        contact_person=%(contact_person)s,
                        gstin=%(gstin)s,
                        pan_number=%(pan_number)s,
                        phone=%(phone)s,
                        mobile=%(mobile)s,
                        email=%(email)s,
                        address1=%(address1)s,
                        address2=%(address2)s,
                        city=%(city)s,
                        state=%(state)s,
                        pincode=%(pincode)s,
                        country=%(country)s,
                        payment_terms=%(payment_terms)s,
                        credit_days=%(credit_days)s,
                        bank_name=%(bank_name)s,
                        account_number=%(account_number)s,
                        ifsc_code=%(ifsc_code)s,
                        remarks=%(remarks)s,
                        updated_at=CURRENT_TIMESTAMP

                    WHERE supplier_id=%(supplier_id)s

                    RETURNING *

                """, {**supplier, "supplier_id": supplier_id})

                result = cur.fetchone()

            conn.commit()

            return result

        except Exception as ex:

            conn.rollback()
            print("UPDATE SUPPLIER ERROR:", ex)
            raise

    # --------------------------------------------------
    # Delete
    # --------------------------------------------------

    def delete(self, supplier_id):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute("""

                    UPDATE suppliers

                    SET

                        is_active=FALSE,
                        updated_at=CURRENT_TIMESTAMP

                    WHERE supplier_id=%s

                """, (supplier_id,))

            conn.commit()

        except Exception as ex:

            conn.rollback()
            print("DELETE SUPPLIER ERROR:", ex)
            raise