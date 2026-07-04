"""
Purchase Service

Contains Purchase Business Logic
"""

from __future__ import annotations

from datetime import date

from database.purchase_repository import PurchaseRepository


class PurchaseService:

    def __init__(self):

        self.repo = PurchaseRepository()

    # ---------------------------------------------------------
    # Generate Purchase Number
    # ---------------------------------------------------------

    def generate_purchase_no(self) -> str:

        purchases = self.repo.list_purchases()

        if not purchases:

            return "PUR000001"

        last_purchase = purchases[0]["purchase_no"]

        number = int(last_purchase.replace("PUR", ""))

        return f"PUR{number + 1:06d}"

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

        if len(items) == 0:

            raise ValueError(
                "Purchase must contain at least one item."
            )

        for item in items:

            if item["quantity"] <= 0:

                raise ValueError(
                    "Quantity must be greater than zero."
                )

            if item["rate"] < 0:

                raise ValueError(
                    "Invalid Rate."
                )

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