"""
Purchase Service

Contains Purchase Business Logic
"""

from __future__ import annotations

from datetime import date

from database.constants import Tables
from database.purchase_repository import PurchaseRepository


class PurchaseService:

    def __init__(self):

        self.repo = PurchaseRepository()

    # ---------------------------------------------------------
    # Generate Purchase Number
    # ---------------------------------------------------------

    def generate_purchase_no(self) -> str:

        return self.repo.generate_next_number(
            table=Tables.PURCHASE_HEADER,
            id_column="purchase_id",
            number_column="purchase_no",
            prefix="PUR"
        )

    # ---------------------------------------------------------
    # Validate Supplier
    # ---------------------------------------------------------

    def validate_supplier(
        self,
        supplier_id: int
    ):

        supplier = self.repo.get_supplier(supplier_id)

        if supplier is None:
            raise ValueError("Supplier does not exist.")

    # ---------------------------------------------------------
    # Validate Items
    # ---------------------------------------------------------

    def validate_items(
        self,
        items: list[dict]
    ):

        item_ids=[]
        
        if len(items) == 0:

            raise ValueError(
                "Purchase must contain at least one item."
            )

        for item in items:

            item_master = self.repo.get_item(item["item_id"])

            if item_master is None:
                raise ValueError(
                    f"Item {item['item_id']} does not exist."
                )
            
            if item["item_id"] in item_ids:
                raise ValueError(
                    "Duplicate Item found."
                )

            item_ids.append(item["item_id"])
            
            if item["quantity"] <= 0:

                raise ValueError(
                    "Quantity must be greater than zero."
                )

            if item["rate"] < 0:

                raise ValueError(
                    "Invalid Rate."
                )
            
            if item["unit_id"] <= 0:
                raise ValueError("Invalid Unit.")

    # ---------------------------------------------------------
    # Calculate Totals
    # ---------------------------------------------------------

    def calculate_totals(
        self,
        items: list[dict]
    ):

        subtotal = 0

        cgst = 0

        sgst = 0

        igst = 0

        grand_total = 0

        for item in items:

            taxable = item["quantity"] * item["rate"]

            discount = taxable * item["discount_percent"] / 100

            taxable -= discount

            item["discount_amount"] = round(discount, 2)

            item["taxable_amount"] = round(taxable, 2)

            item["cgst_amount"] = round(taxable * 0.09, 2)

            item["sgst_amount"] = round(taxable * 0.09, 2)

            item["igst_amount"] = 0

            item["total_amount"] = round(

                taxable +
                item["cgst_amount"] +
                item["sgst_amount"],

                2

            )

            subtotal += taxable

            cgst += item["cgst_amount"]

            sgst += item["sgst_amount"]

            igst += item["igst_amount"]

            grand_total += item["total_amount"]

        return {

            "subtotal": round(subtotal, 2),

            "discount_amount": round(
                sum(i["discount_amount"] for i in items),
                2
            ),

            "taxable_amount": round(subtotal, 2),

            "cgst_amount": round(cgst, 2),

            "sgst_amount": round(sgst, 2),

            "igst_amount": round(igst, 2),

            "cess_amount": 0,

            "freight_amount": 0,

            "other_charges": 0,

            "round_off": 0,

            "grand_total": round(grand_total, 2)

        }

    # ---------------------------------------------------------
    # Create Purchase
    # ---------------------------------------------------------

    def create_purchase(

        self,

        purchase: dict,

        items: list[dict]

    ) -> int:

        self.validate_supplier(
            purchase["supplier_id"]
        )

        self.validate_items(items)

        totals = self.calculate_totals(items)

        purchase["purchase_no"] = self.generate_purchase_no()

        purchase.setdefault("purchase_date", date.today())

        purchase.update(totals)

        try:

            purchase_id = self.repo.create_purchase(purchase)

            for index, item in enumerate(items, start=1):

                item["purchase_id"] = purchase_id
                item["line_no"] = index

                self.repo.create_purchase_item(item)

            self.repo.commit()

            return purchase_id

        except Exception:

            self.repo.rollback()
            raise

    # ---------------------------------------------------------
    # Update Purchase
    # ---------------------------------------------------------

    def update_purchase(

        self,

        purchase_id: int,

        purchase: dict,

        items: list[dict]

    ):

        existing = self.repo.get_purchase_by_id(
            purchase_id
        )

        if existing is None:

            raise ValueError(
                "Purchase not found."
            )

        self.validate_supplier(
            purchase["supplier_id"]
        )

        self.validate_items(items)

        totals = self.calculate_totals(items)

        purchase.update(totals)

        try:

            # Update Purchase Header
            self.repo.update_purchase(
                purchase_id,
                purchase
            )

            # Delete Existing Purchase Items
            old_items = self.repo.get_purchase_items(
                purchase_id
            )

            for old in old_items:

                self.repo.delete_purchase_item(
                    old["purchase_detail_id"]
                )

            # Insert New Purchase Items
            for line_no, item in enumerate(
                items,
                start=1
            ):

                item["purchase_id"] = purchase_id

                item["line_no"] = line_no

                self.repo.create_purchase_item(
                    item
                )

            self.repo.commit()

            return purchase_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Delete Purchase
    # ---------------------------------------------------------

    def delete_purchase(

        self,

        purchase_id: int

    ):

        purchase = self.repo.get_purchase_by_id(
            purchase_id
        )

        if purchase is None:

            raise ValueError(
                "Purchase not found."
            )

        try:

            self.repo.delete_purchase(
                purchase_id
            )

            self.repo.commit()

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # List Purchases
    # ---------------------------------------------------------

    def list_purchases(self):

        return self.repo.list_purchases()


    # ---------------------------------------------------------
    # Get Purchase
    # ---------------------------------------------------------

    def get_purchase(self, purchase_id: int):

        purchase = self.repo.get_purchase_by_id(
            purchase_id
        )

        if purchase is None:

            raise ValueError(
                "Purchase not found."
            )

        purchase["items"] = self.repo.get_purchase_items(
            purchase_id
        )

        return purchase
    
    