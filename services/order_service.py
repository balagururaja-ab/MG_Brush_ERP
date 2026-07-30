"""
Order Service

Contains Order Business Logic
"""

from __future__ import annotations

from datetime import date

from database.constants import Tables
from database.order_repository import OrderRepository


class OrderService:

    ORDER_HEADER_COLUMNS = {
        "order_id",
        "order_no",
        "customer_id",
        "order_date",
        "expected_delivery",
        "status",
        "remarks",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    }

    ORDER_DETAIL_COLUMNS = {
        "order_detail_id",
        "order_id",
        "line_no",
        "item_id",
        "brand_id",
        "brush_size_id",
        "quantity",
        "rate",
        "amount",
    }

    def __init__(self):

        self.repo = OrderRepository()

    # ---------------------------------------------------------
    # Sanitize Order Payload
    # ---------------------------------------------------------

    def sanitize_order_payload(self, order: dict) -> dict:

        return {
            key: value
            for key, value in order.items()
            if key in self.ORDER_HEADER_COLUMNS
            and not isinstance(value, (dict, list, tuple))
        }

    # ---------------------------------------------------------
    # Sanitize Order Item
    # ---------------------------------------------------------

    def sanitize_order_item(self, item: dict) -> dict:
        return {
            key: value
            for key, value in item.items()
            if key in self.ORDER_DETAIL_COLUMNS
        }

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

            brand_id = int(item["brand_id"])
            brush_size_id = int(item["brush_size_id"])

            brand = self.repo.get_brand(
                brand_id
            )

            if brand is None:

                raise ValueError(
                    "Invalid Brand."
                )

            brush_size = self.repo.get_brush_size(
                brush_size_id
            )

            if brush_size is None:

                raise ValueError(
                    "Invalid Brush Size."
                )

            key = (
                brand_id,
                brush_size_id
            )

            if key in combinations:

                raise ValueError(
                    "Duplicate Brand & Brush Size found."
                )

            combinations.append(key)

            item_id = item.get("item_id")

            if item_id not in (None, ""):

                item_id = int(item_id)
                resolved_item = self.repo.get_item(item_id)

                if resolved_item is None:
                    raise ValueError("Invalid Item.")

                if (
                    int(resolved_item.get("brand_id")) != brand_id
                    or int(resolved_item.get("brush_size_id")) != brush_size_id
                ):
                    raise ValueError(
                        "Selected item does not belong to chosen Brand and Brush Size."
                    )

                item["item_id"] = item_id

            else:
                candidates = self.repo.get_items_for_brand_and_size(
                    brand_id,
                    brush_size_id
                )

                if len(candidates) == 0:
                    raise ValueError(
                        "No item found for selected Brand and Brush Size."
                    )

                if len(candidates) == 1:
                    item["item_id"] = int(candidates[0]["item_id"])

                else:
                    rate = float(item["rate"])
                    rate_matches = [
                        row for row in candidates
                        if float(row.get("selling_rate") or 0) == rate
                    ]

                    if len(rate_matches) == 1:
                        item["item_id"] = int(rate_matches[0]["item_id"])
                    else:
                        raise ValueError(
                            "Multiple items exist for selected Brand and Brush Size. Please select the exact item."
                        )

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

        clean_order = self.sanitize_order_payload(order)

        self.validate_customer(
            clean_order["customer_id"]
        )

        for item in items:

            if item.get("item_id") not in (None, ""):
                item["item_id"] = int(item["item_id"])

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

        clean_order["order_no"] = self.generate_order_no()

        clean_order.setdefault(
            "order_date",
            date.today()
        )

        try:

            order_id = self.repo.create_order(
                clean_order
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
                    self.sanitize_order_item(item)
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

        clean_order = self.sanitize_order_payload(order)

        self.validate_customer(
            clean_order["customer_id"]
        )

        for item in items:

            if item.get("item_id") not in (None, ""):
                item["item_id"] = int(item["item_id"])

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

                clean_order

            )

            old_items = self.repo.get_order_items(
                order_id
            )

            for old in old_items:

                self.repo.delete_order_item_no_commit(

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
                    self.sanitize_order_item(item)
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