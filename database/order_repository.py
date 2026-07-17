"""
Order Repository

Handles Order CRUD Operations
"""

from database.base_repository import BaseRepository
from database.constants import Tables


class OrderRepository(BaseRepository):

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

        return self.insert(

            Tables.ORDER_DETAILS,

            item,

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
            }

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

        return self.find_one(

            Tables.ORDER_HEADER,

            {
                "order_id": order_id
            }

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

                od.*,

                i.item_code,
                i.item_name,
                u.unit_name

            FROM {Tables.ORDER_DETAILS} od

            INNER JOIN {Tables.ITEMS} i

                    ON od.item_id=i.item_id

            LEFT JOIN {Tables.UNIT_MASTER} u

                   ON i.unit_id=u.unit_id

            WHERE od.order_id=%s

            ORDER BY od.line_no
        """

        return self.fetch_all(

            sql,

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