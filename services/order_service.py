"""
Order Service

Contains Order Business Logic
"""

from __future__ import annotations

from datetime import date

from database.constants import Tables
from database.order_repository import OrderRepository


class OrderService:

    def __init__(self):

        self.repo = OrderRepository()

    # ---------------------------------------------------------
    # Generate Order Number
    # ---------------------------------------------------------

    def generate_order_no(self) -> str:

        return self.repo.generate_next_number(

            table=Tables.ORDER_HEADER,

            id_column="order_id",

            number_column="order_no",

            prefix="ORD"

        )

    # ---------------------------------------------------------
    # Validate Customer
    # ---------------------------------------------------------

    def validate_customer(
        self,
        customer_id: int
    ):

        customer = self.repo.get_customer(
            customer_id
        )

        if customer is None:

            raise ValueError(
                "Customer does not exist."
            )

    # ---------------------------------------------------------
    # Validate Order Items
    # ---------------------------------------------------------

    def validate_items(
        self,
        items: list[dict]
    ):

        if len(items) == 0:

            raise ValueError(
                "Order must contain at least one item."
            )

        combinations = []

        for item in items:

            brand = self.repo.get_brand(
                item["brand_id"]
            )

            if brand is None:

                raise ValueError(
                    "Invalid Brand."
                )

            brush_size = self.repo.get_brush_size(
                item["brush_size_id"]
            )

            if brush_size is None:

                raise ValueError(
                    "Invalid Brush Size."
                )

            key = (
                item["brand_id"],
                item["brush_size_id"]
            )

            if key in combinations:

                raise ValueError(
                    "Duplicate Brand & Brush Size found."
                )

            combinations.append(key)

            qty = float(item["quantity"])

            if qty <= 0:

                raise ValueError(
                    "Quantity must be greater than zero."
                )

            rate = float(item["rate"])

            if rate <= 0:

                raise ValueError(
                    "Rate must be greater than zero."
                )

    # ---------------------------------------------------------
    # Calculate Totals
    # ---------------------------------------------------------

    def calculate_totals(
        self,
        items: list[dict]
    ):

        grand_total = 0

        for item in items:

            amount = (

                item["quantity"] *

                item["rate"]

            )

            item["amount"] = round(
                amount,
                2
            )

            grand_total += amount

        return {

            "grand_total": round(
                grand_total,
                2
            )

        }
    
    # ---------------------------------------------------------
    # Create Order
    # ---------------------------------------------------------

    def create_order(

        self,

        order: dict,

        items: list[dict]

    ):

        self.validate_customer(
            order["customer_id"]
        )

        for item in items:

            item["brand_id"] = int(
                item["brand_id"]
            )

            item["brush_size_id"] = int(
                item["brush_size_id"]
            )

            item["quantity"] = float(
                item["quantity"]
            )

            item["rate"] = float(
                item["rate"]
            )

        self.validate_items(
            items
        )

        order["order_no"] = self.generate_order_no()

        order.setdefault(
            "order_date",
            date.today()
        )

        try:

            order_id = self.repo.create_order(
                order
            )

            for line_no, item in enumerate(
                items,
                start=1
            ):

                item["order_id"] = order_id

                item["line_no"] = line_no

                item["amount"] = round(

                    item["quantity"] *

                    item["rate"],

                    2

                )

                self.repo.create_order_item(
                    item
                )

            self.repo.commit()

            return order_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Update Order
    # ---------------------------------------------------------

    def update_order(

        self,

        order_id: int,

        order: dict,

        items: list[dict]

    ):

        if len(items) == 0:

            raise ValueError(
                "Please add at least one item."
            )

        self.validate_customer(
            order["customer_id"]
        )

        for item in items:

            item["brand_id"] = int(
                item["brand_id"]
            )

            item["brush_size_id"] = int(
                item["brush_size_id"]
            )

            item["quantity"] = float(
                item["quantity"]
            )

            item["rate"] = float(
                item["rate"]
            )

        self.validate_items(
            items
        )

        existing = self.repo.get_order_by_id(
            order_id
        )

        if existing is None:

            raise ValueError(
                "Order not found."
            )

        try:

            self.repo.update_order(

                order_id,

                order

            )

            old_items = self.repo.get_order_items(
                order_id
            )

            for old in old_items:

                self.repo.delete_order_item(

                    old["order_detail_id"]

                )

            for line_no, item in enumerate(

                items,

                start=1

            ):

                item["order_id"] = order_id

                item["line_no"] = line_no

                item["amount"] = round(

                    item["quantity"] *

                    item["rate"],

                    2

                )

                self.repo.create_order_item(
                    item
                )

            self.repo.commit()

            return order_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Delete Order
    # ---------------------------------------------------------

    def delete_order(

        self,

        order_id: int

    ):

        order = self.repo.get_order_by_id(
            order_id
        )

        if order is None:

            raise ValueError(
                "Order not found."
            )

        try:

            # -----------------------------------------
            # Delete Order Items
            # -----------------------------------------

            order_items = self.repo.get_order_items(
                order_id
            )

            for item in order_items:

                self.repo.delete_order_item(

                    item["order_detail_id"]

                )

            # -----------------------------------------
            # Delete Order Header
            # -----------------------------------------

            self.repo.delete_order(
                order_id
            )

            self.repo.commit()

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # List Orders
    # ---------------------------------------------------------

    def list_orders(self):

        return self.repo.list_orders()

    # ---------------------------------------------------------
    # Get Order
    # ---------------------------------------------------------

    def get_order(

        self,

        order_id: int

    ):

        order = self.repo.get_order_by_id(
            order_id
        )

        if order is None:

            raise ValueError(
                "Order not found."
            )

        order["items"] = self.repo.get_order_items(
            order_id
        )

        return order