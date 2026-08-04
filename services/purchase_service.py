"""
Purchase Service

Contains Purchase Business Logic
"""

from __future__ import annotations

from datetime import date

from database.constants import Tables
from database.purchase_repository import PurchaseRepository
from services.stock_service import StockService


class PurchaseService:

    def __init__(self):

        self.repo = PurchaseRepository()

        self.stock_service = StockService()

    def _effective_grand_total(
        self,
        purchase: dict,
        items: list[dict]
    ) -> float:

        header_grand_total = float(
            purchase.get("grand_total", 0) or 0
        )

        if not items:
            return round(header_grand_total, 2)

        items_grand_total = round(
            sum(float(row.get("total_amount", 0) or 0) for row in items),
            2
        )

        # Prefer item totals when available because they are line-level tax-inclusive values.
        if items_grand_total > 0:
            return items_grand_total

        return round(header_grand_total, 2)

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

        item_keys = []
        
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
            
            item_key = (
                item["item_id"],
                str(item.get("item_spec") or "").strip()
            )

            if item_key in item_keys:
                raise ValueError(
                    "Duplicate Item found."
                )

            item_keys.append(item_key)
            
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

            line_total = item["quantity"] * item["rate"]

            discount = line_total * item.get("discount_percent", 0) / 100

            taxable = line_total - discount

            tax_percent = item.get("tax_percent", 0)

            gst = taxable * tax_percent / 100

            item["discount_amount"] = round(discount, 2)

            item["taxable_amount"] = round(taxable, 2)

            item["cgst_amount"] = round(gst / 2, 2)

            item["sgst_amount"] = round(gst / 2, 2)

            item["igst_amount"] = 0

            item["total_amount"] = round(

                taxable +
                gst,

                2

            )

            subtotal += line_total

            cgst += item["cgst_amount"]

            sgst += item["sgst_amount"]

            igst += item["igst_amount"]

            grand_total += item["total_amount"]

        taxable_amount = subtotal - sum(
            item["discount_amount"] for item in items
        )

        return {

            "subtotal": round(subtotal, 2),

            "discount_amount": round(
                sum(i["discount_amount"] for i in items),
                2
            ),

            "taxable_amount": round(taxable_amount, 2),

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

                # ---------------------------------------------
                # Update Inventory
                # ---------------------------------------------

                self.stock_service.purchase_stock(

                    purchase_id=purchase_id,

                    purchase_no=purchase["purchase_no"],

                    item=item

                )

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

            # -------------------------------------------------
            # TODO
            #
            # Reverse previous stock entries
            # and recreate them after inserting
            # the updated purchase items.
            #
            # Will be implemented in Stock Module Phase-2.
            # -------------------------------------------------
            
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

            # TODO:
            # Reverse stock ledger and stock balance
            # before deleting purchase.
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
    # Get Purchase Items
    # ---------------------------------------------------------

    def get_purchase_items(self, purchase_id: int):

        return self.repo.get_purchase_items(purchase_id)

    # ---------------------------------------------------------
    # Get Purchase Payment History
    # ---------------------------------------------------------

    def get_purchase_payment_history(self, purchase_id: int):

        return self.repo.get_purchase_payment_history(purchase_id)

    def get_purchase_payment_receipt(
        self,
        purchase_id: int,
        payment_id: int
    ) -> dict:

        purchase = self.repo.get_purchase_by_id(purchase_id)

        if purchase is None:
            raise ValueError("Purchase not found.")

        payment = self.repo.get_purchase_payment_by_id(purchase_id, payment_id)

        if payment is None:
            raise ValueError("Payment receipt not found.")

        return {
            "purchase_id": purchase_id,
            "purchase_no": purchase.get("purchase_no"),
            "supplier_name": purchase.get("supplier_name"),
            "invoice_no": purchase.get("invoice_no"),
            **payment
        }

    # ---------------------------------------------------------
    # Record Purchase Payment
    # ---------------------------------------------------------

    def record_payment(
        self,
        purchase_id: int,
        payment: dict
    ) -> dict:

        purchase = self.repo.get_purchase_by_id(purchase_id)

        if purchase is None:
            raise ValueError("Purchase not found.")

        amount = float(payment.get("amount", 0))

        if amount <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        payment_date = payment.get("payment_date") or date.today()

        purchase_date = purchase.get("purchase_date")

        if purchase_date and payment_date < purchase_date:
            raise ValueError("Payment date cannot be before purchase date.")

        existing_payments = self.repo.get_purchase_payment_history(purchase_id)

        items = self.repo.get_purchase_items(purchase_id)

        already_paid = round(
            sum(float(row.get("amount", 0)) for row in existing_payments),
            2
        )

        grand_total = self._effective_grand_total(
            purchase,
            items
        )

        current_pending = round(
            max(grand_total - already_paid, 0),
            2
        )

        if current_pending <= 0:
            raise ValueError("This purchase is already fully paid.")

        if amount > current_pending:
            raise ValueError(
                f"Payment amount cannot exceed pending amount ({current_pending:.2f})."
            )

        paid_amount = round(
            already_paid + amount,
            2
        )

        pending_amount = round(max(grand_total - paid_amount, 0), 2)

        if paid_amount <= 0:
            payment_status = "PENDING"
        elif pending_amount == 0:
            payment_status = "PAID"
        else:
            payment_status = "PARTIAL"

        payment_result = self.repo.apply_purchase_payment(
            purchase_id,
            {
                "payment_date": payment_date,
                "amount": amount,
                "payment_mode": payment.get("payment_mode"),
                "reference_no": payment.get("reference_no"),
                "remarks": payment.get("remarks")
            },
            {
                "payment_status": payment_status,
                "grand_total": grand_total
            }
        )

        return {
            "payment_id": payment_result["payment_id"],
            "receipt_no": payment_result["receipt_no"],
            "payment_status": payment_status,
            "paid_amount": paid_amount,
            "pending_amount": pending_amount
        }


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

        purchase["items"] = self.get_purchase_items(purchase_id)
        purchase["grand_total"] = self._effective_grand_total(
            purchase,
            purchase["items"]
        )
        purchase["payments"] = self.get_purchase_payment_history(purchase_id)

        return purchase
    
    