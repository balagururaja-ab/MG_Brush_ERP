"""
Item Repository
"""

from database.connection import db


class ItemRepository:

    # ---------------------------------------------------------
    # Get All Items
    # ---------------------------------------------------------

    def get_all(self):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM items

                    --WHERE is_active = TRUE

                    ORDER BY item_name

                """)

                return cur.fetchall()
        except Exception as ex:
            
            conn.rollback()
            print("GET ALL ERROR:", ex)

            raise

    # ---------------------------------------------------------
    # Get Item By Id
    # ---------------------------------------------------------

    def get_by_id(
        self,
        item_id: int
    ):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM items

                    WHERE item_id=%s

                    --AND is_active=TRUE

                """, (item_id,))

                return cur.fetchone()
        except Exception as ex:
            
            conn.rollback()
            print("GET BY ID ERROR:", ex)

            raise

    # ---------------------------------------------------------
    # Get Item By Code
    # ---------------------------------------------------------

    def get_by_code(
        self,
        item_code: str
    ):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM items

                    WHERE item_code=%s

                """, (item_code,))

                return cur.fetchone()
        except Exception as ex:
            
            conn.rollback()
            print("GET BY CODE ERROR:", ex)

            raise

    # ---------------------------------------------------------
    # Create Item
    # ---------------------------------------------------------

    def create(
        self,
        item: dict
    ):

        conn = db.connect()

        with conn.cursor() as cur:

            cur.execute("""

            INSERT INTO items
            (
                item_code,
                item_name,
                category_id,
                unit_id,
                tax_id,
                brush_size,
                bristle_type,
                handle_type,
                ferrule_type,
                color,
                purchase_rate,
                selling_rate,
                opening_stock,
                minimum_stock,
                maximum_stock,
                reorder_level,
                weight_per_piece,
                barcode,
                hsn_code,
                description,
                is_active
            )

            VALUES
            (
                %(item_code)s,
                %(item_name)s,
                %(category_id)s,
                %(unit_id)s,
                %(tax_id)s,
                %(brush_size)s,
                %(bristle_type)s,
                %(handle_type)s,
                %(ferrule_type)s,
                %(color)s,
                %(purchase_rate)s,
                %(selling_rate)s,
                %(opening_stock)s,
                %(minimum_stock)s,
                %(maximum_stock)s,
                %(reorder_level)s,
                %(weight_per_piece)s,
                %(barcode)s,
                %(hsn_code)s,
                %(description)s,
                %(is_active)s
            )

            RETURNING *

            """, item)

            result = cur.fetchone()

        conn.commit()

        return result

    # ---------------------------------------------------------
    # Update Item
    # ---------------------------------------------------------

    def update(self, item_id: int, item: dict):

        conn = db.connect()

        try:

            with conn.cursor() as cur:

                cur.execute(
                    """
                    UPDATE items
                    SET
                        item_code=%(item_code)s,
                        item_name=%(item_name)s,
                        category_id=%(category_id)s,
                        unit_id=%(unit_id)s,
                        tax_id=%(tax_id)s,
                        brush_size=%(brush_size)s,
                        bristle_type=%(bristle_type)s,
                        handle_type=%(handle_type)s,
                        ferrule_type=%(ferrule_type)s,
                        color=%(color)s,
                        purchase_rate=%(purchase_rate)s,
                        selling_rate=%(selling_rate)s,
                        opening_stock=%(opening_stock)s,
                        minimum_stock=%(minimum_stock)s,
                        maximum_stock=%(maximum_stock)s,
                        reorder_level=%(reorder_level)s,
                        weight_per_piece=%(weight_per_piece)s,
                        barcode=%(barcode)s,
                        hsn_code=%(hsn_code)s,
                        description=%(description)s,
                        is_active = %(is_active)s,
                        updated_at=CURRENT_TIMESTAMP
                    WHERE item_id=%(item_id)s
                    RETURNING *
                    """,
                    {**item, "item_id": item_id}
                )

                result = cur.fetchone()

            conn.commit()

            return result

        except Exception as ex:

            conn.rollback()

            print("=" * 60)
            print("UPDATE ERROR")
            print(type(ex))
            print(ex)

            if hasattr(ex, "pgerror"):
                print(ex.pgerror)

            if hasattr(ex, "diag"):
                print(ex.diag.message_primary)

            print("=" * 60)

            raise

    # ---------------------------------------------------------
    # Delete
    # ---------------------------------------------------------

    def delete(
        self,
        item_id: int
    ):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""

                    UPDATE items

                    SET is_active=FALSE,

                        updated_at=CURRENT_TIMESTAMP

                    WHERE item_id=%s

                """, (item_id,))

            conn.commit()
        except Exception:
            
            conn.rollback()

            raise

    # ---------------------------------------------------------
    # Get Item By Code Except Current Item
    # ---------------------------------------------------------

    def get_by_code_except_id(
        self,
        item_code: str,
        item_id: int
    ):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""

                    SELECT *

                    FROM items

                    WHERE item_code=%s

                    AND item_id<>%s

                """, (item_code, item_id))

                return cur.fetchone()
        except Exception as ex:
            
            conn.rollback()
            print("GET BY CODE EXCEPT ID ERROR:", ex)

            raise

    def activate(self, item_id: int):

        conn = db.connect()

        try:
            with conn.cursor() as cur:

                cur.execute("""
                    UPDATE items
                    SET is_active = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE item_id = %s
                """, (item_id,))

            conn.commit()

        except Exception:
            conn.rollback()
            raise