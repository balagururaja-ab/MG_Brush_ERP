"""
Order Repository

Handles Order CRUD Operations
"""

from database.base_repository import BaseRepository
from database.constants import Tables


class OrderRepository(BaseRepository):

    def _order_details_has_item_id(self) -> bool:

        sql = """
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = %s
              AND table_name = %s
              AND column_name = 'item_id'
            LIMIT 1
        """

        result = self.fetch_one(
            sql,
            ["mgbrush", "order_details"]
        )

        return result is not None

    # ---------------------------------------------------------
    # Customer
    # ---------------------------------------------------------

    def get_customer(
        self,
        customer_id: int
    ):

        return self.find_one(

            Tables.CUSTOMERS,

            {
                "customer_id": customer_id
            }

        )

    # ---------------------------------------------------------
    # Item
    # ---------------------------------------------------------

    def get_item(
        self,
        item_id: int
    ):

        return self.find_one(

            Tables.ITEMS,

            {
                "item_id": item_id
            }

        )

    def get_items_for_brand_and_size(
        self,
        brand_id: int,
        brush_size_id: int
    ):

        sql = f"""
            SELECT *
            FROM {Tables.ITEMS}
            WHERE brand_id = %s
              AND brush_size_id = %s
            ORDER BY item_id
        """

        return self.fetch_all(
            sql,
            [brand_id, brush_size_id]
        )

    # ---------------------------------------------------------
    # Brand
    # ---------------------------------------------------------

    def get_brand(
        self,
        brand_id: int
    ):

        return self.find_one(

            Tables.BRAND_MASTER,

            {
                "brand_id": brand_id
            }

        )


    # ---------------------------------------------------------
    # Brush Size
    # ---------------------------------------------------------

    def get_brush_size(
        self,
        brush_size_id: int
    ):

        return self.find_one(

            Tables.BRUSH_SIZE_MASTER,

            {
                "brush_size_id": brush_size_id
            }

        )
    # ---------------------------------------------------------
    # Create Order Header
    # ---------------------------------------------------------

    def create_order(
        self,
        order_header: dict
    ) -> int:

        return self.insert(

            Tables.ORDER_HEADER,

            order_header,

            "order_id"

        )

    # ---------------------------------------------------------
    # Create Order Item
    # ---------------------------------------------------------

    def create_order_item(
        self,
        item: dict
    ):

        insert_item = dict(item)

        if not self._order_details_has_item_id():
            insert_item.pop("item_id", None)

        return self.insert(

            Tables.ORDER_DETAILS,

            insert_item,

            "order_detail_id"

        )

    # ---------------------------------------------------------
    # Update Order Header
    # ---------------------------------------------------------

    def update_order(
        self,
        order_id: int,
        order_header: dict
    ):

        return self.update(

            Tables.ORDER_HEADER,

            order_header,

            {
                "order_id": order_id
            },

            auto_commit=False

        )

    def delete_order_item_no_commit(
        self,
        order_detail_id: int
    ):
        """Delete an order item without auto-committing (use inside a transaction)."""
        return self.delete(

            Tables.ORDER_DETAILS,

            {
                "order_detail_id": order_detail_id
            },

            auto_commit=False

        )

    # ---------------------------------------------------------
    # Delete Order Header
    # ---------------------------------------------------------

    def delete_order(
        self,
        order_id: int
    ):

        return self.delete(

            Tables.ORDER_HEADER,

            {
                "order_id": order_id
            }

        )

    # ---------------------------------------------------------
    # Delete Order Item
    # ---------------------------------------------------------

    def delete_order_item(
        self,
        order_detail_id: int
    ):

        return self.delete(

            Tables.ORDER_DETAILS,

            {
                "order_detail_id": order_detail_id
            }

        )

    # ---------------------------------------------------------
    # Get Order By Id
    # ---------------------------------------------------------

    def get_order_by_id(
        self,
        order_id: int
    ):

        sql = f"""
            SELECT

                oh.*,

                c.customer_name

            FROM {Tables.ORDER_HEADER} oh

            INNER JOIN {Tables.CUSTOMERS} c
                    ON oh.customer_id = c.customer_id

            WHERE oh.order_id = %s
        """

        return self.fetch_one(

            sql,

            [order_id]

        )

    # ---------------------------------------------------------
    # Get Order Items
    # ---------------------------------------------------------

    def get_order_items(
        self,
        order_id: int
    ):
        sql = f"""
            SELECT

                od.order_detail_id,
                od.order_id,
                od.line_no,
                od.item_id,

                od.brand_id,
                b.brand_name,

                od.brush_size_id,
                bs.size_name,

                i.item_name,
                i.item_code,

                od.quantity,
                od.rate,
                od.amount

            FROM {Tables.ORDER_DETAILS} od

            INNER JOIN {Tables.BRAND_MASTER} b
                    ON od.brand_id = b.brand_id

            INNER JOIN {Tables.BRUSH_SIZE_MASTER} bs
                    ON od.brush_size_id = bs.brush_size_id

            LEFT JOIN {Tables.ITEMS} i
                    ON od.item_id = i.item_id

            WHERE od.order_id = %s

            ORDER BY od.line_no
        """

        try:
            return self.fetch_all(
                sql,
                [order_id]
            )
        except Exception as exc:
            # Backward compatibility for databases that have not yet applied
            # the migration adding order_details.item_id.
            if "column od.item_id does not exist" not in str(exc):
                raise

            legacy_sql = f"""
                SELECT

                    od.order_detail_id,
                    od.order_id,
                    od.line_no,
                    NULL::integer AS item_id,

                    od.brand_id,
                    b.brand_name,

                    od.brush_size_id,
                    bs.size_name,

                    NULL::text AS item_name,
                    NULL::text AS item_code,

                    od.quantity,
                    od.rate,
                    od.amount

                FROM {Tables.ORDER_DETAILS} od

                INNER JOIN {Tables.BRAND_MASTER} b
                        ON od.brand_id = b.brand_id

                INNER JOIN {Tables.BRUSH_SIZE_MASTER} bs
                        ON od.brush_size_id = bs.brush_size_id

                WHERE od.order_id = %s

                ORDER BY od.line_no
            """

            return self.fetch_all(
                legacy_sql,
                [order_id]
            )

    # ---------------------------------------------------------
    # List Orders
    # ---------------------------------------------------------

    def list_orders(self):

        sql = f"""
            SELECT

                oh.order_id,

                oh.order_no,

                oh.order_date,

                oh.expected_delivery,

                oh.status,

                c.customer_name,

                COALESCE(

                    SUM(od.amount),

                    0

                ) AS grand_total

            FROM {Tables.ORDER_HEADER} oh

            INNER JOIN {Tables.CUSTOMERS} c

                    ON oh.customer_id=c.customer_id

            LEFT JOIN {Tables.ORDER_DETAILS} od

                   ON oh.order_id=od.order_id

            GROUP BY

                oh.order_id,

                oh.order_no,

                oh.order_date,

                oh.expected_delivery,

                oh.status,

                c.customer_name

            ORDER BY

                oh.order_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Generate Order Number
    # ---------------------------------------------------------

    def generate_next_order_no(self):

        return self.generate_next_number(

            table=Tables.ORDER_HEADER,

            id_column="order_id",

            number_column="order_no",

            prefix="ORD"

        )