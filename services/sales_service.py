from datetime import date

from database.sales_repository import SalesRepository
from services.stock_service import StockService


class SalesService:

    def __init__(self):

        self.repo = SalesRepository()
        self.stock_service = StockService()

    # ---------------------------------------------------------
    # Calculate Totals
    # ---------------------------------------------------------

    def calculate_totals(
        self,
        items: list[dict]
    ) -> dict:

        gross_amount = 0
        discount_amount = 0
        taxable_amount = 0
        cgst_amount = 0
        sgst_amount = 0
        igst_amount = 0
        grand_total = 0

        for item in items:
            quantity = float(item.get("quantity", 0))
            rate = float(item.get("rate", 0))
            gross_line = quantity * rate

            discount_line = float(item.get("discount_amount", 0))
            if discount_line == 0 and item.get("discount_percent", 0):
                discount_line = gross_line * float(item["discount_percent"]) / 100

            taxable_line = gross_line - discount_line
            cgst_line = float(item.get("cgst_amount", 0))
            sgst_line = float(item.get("sgst_amount", 0))
            igst_line = float(item.get("igst_amount", 0))
            total_line = float(item.get("total_amount", 0))

            if total_line == 0:
                total_line = taxable_line + cgst_line + sgst_line + igst_line

            item["discount_amount"] = round(discount_line, 2)
            item["taxable_amount"] = round(taxable_line, 2)
            item["total_amount"] = round(total_line, 2)

            gross_amount += gross_line
            discount_amount += discount_line
            taxable_amount += taxable_line
            cgst_amount += cgst_line
            sgst_amount += sgst_line
            igst_amount += igst_line
            grand_total += item["total_amount"]

        return {
            "gross_amount": round(gross_amount, 2),
            "discount_amount": round(discount_amount, 2),
            "taxable_amount": round(taxable_amount, 2),
            "cgst_amount": round(cgst_amount, 2),
            "sgst_amount": round(sgst_amount, 2),
            "igst_amount": round(igst_amount, 2),
            "grand_total": round(grand_total, 2)
        }

    # ---------------------------------------------------------
    # Create Sales
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict,
        items: list[dict]
    ):

        if len(items) == 0:
            raise ValueError("Please add at least one item.")

        self.validate_customer(sales_header["customer_id"])

        for item in items:
            self.stock_service.validate_stock(
                item["item_id"],
                float(item["quantity"])
            )

        totals = self.calculate_totals(items)

        sales_header.update(totals)
        sales_header.setdefault("sales_date", date.today())
        sales_header.setdefault("paid_amount", 0)
        sales_header["pending_amount"] = round(
            float(sales_header["grand_total"]) - float(sales_header["paid_amount"]),
            2
        )
        sales_header.setdefault("invoice_generated", False)
        sales_header.setdefault("is_gst", False)
        sales_header.setdefault("gst_percent", 0)

        try:
            sales_id = self.repo.create_sales(sales_header)

            sales_no = self.repo.generate_sales_number(sales_id)
            self.repo.update_sales_numbers(
                sales_id=sales_id,
                sales_no=sales_no
            )

            for line_no, item in enumerate(items, start=1):
                item["sales_id"] = sales_id
                item["line_no"] = line_no

                self.repo.create_sales_item(item)

                self.stock_service.sales_stock(
                    sales_id=sales_id,
                    sales_no=sales_no,
                    item=item
                )

            self.repo.commit()
            return sales_id

        except Exception:
            self.repo.rollback()
            raise

    # ---------------------------------------------------------
    # Update Sales
    # ---------------------------------------------------------

    def update_sales(
        self,
        sales_id: int,
        sales_header: dict,
        items: list[dict]
    ):

        if len(items) == 0:
            raise ValueError("Please add at least one item.")

        self.validate_customer(sales_header["customer_id"])

        existing = self.repo.get_sales_by_id(sales_id)
        if existing is None:
            raise ValueError("Sales entry not found.")

        for item in items:
            self.stock_service.validate_stock(
                item["item_id"],
                float(item["quantity"])
            )

        totals = self.calculate_totals(items)

        sales_header.update(totals)
        sales_header["paid_amount"] = float(existing.get("paid_amount", 0))
        sales_header["pending_amount"] = round(
            float(sales_header["grand_total"]) - float(sales_header["paid_amount"]),
            2
        )
        sales_header["invoice_generated"] = existing.get("invoice_generated", False)
        sales_header["is_gst"] = existing.get("is_gst", False)
        sales_header["gst_percent"] = existing.get("gst_percent", 0)
        sales_header["invoice_no"] = existing.get("invoice_no")

        try:
            self.repo.update_sales(sales_id, sales_header)
            self.repo.delete_sales_items(sales_id)

            for line_no, item in enumerate(items, start=1):
                item["sales_id"] = sales_id
                item["line_no"] = line_no

                self.repo.create_sales_item(item)

            self.repo.commit()
            return sales_id

        except Exception:
            self.repo.rollback()
            raise

    # ---------------------------------------------------------
    # Generate Invoice
    # ---------------------------------------------------------

    def generate_invoice(
        self,
        sales_id: int,
        invoice_data: dict
    ) -> str:

        sales = self.repo.get_sales_by_id(sales_id)
        if sales is None:
            raise ValueError("Sales entry not found.")

        invoice_no = sales.get("invoice_no")
        if not invoice_no:
            invoice_no = self.repo.generate_invoice_number(sales_id)

        invoice_date = invoice_data.get("invoice_date") or date.today()
        is_gst = invoice_data.get("is_gst", False)
        gst_percent = float(invoice_data.get("gst_percent", 0))

        update_data = {
            "invoice_no": invoice_no,
            "invoice_date": invoice_date,
            "invoice_generated": True,
            "is_gst": is_gst,
            "gst_percent": gst_percent
        }

        self.repo.update_sales_payment(sales_id, update_data)
        return invoice_no

    # ---------------------------------------------------------
    # Record Payment
    # ---------------------------------------------------------

    def record_payment(
        self,
        sales_id: int,
        payment: dict
    ) -> dict:

        sales = self.repo.get_sales_by_id(sales_id)
        if sales is None:
            raise ValueError("Sales entry not found.")

        amount = float(payment["amount"])
        if amount <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        paid_amount = round(float(sales.get("paid_amount", 0)) + amount, 2)
        grand_total = float(sales.get("grand_total", 0))
        pending_amount = round(max(grand_total - paid_amount, 0), 2)
        if paid_amount <= 0:
            payment_status = "PENDING"
        elif pending_amount == 0:
            payment_status = "PAID"
        else:
            payment_status = "PARTIAL"

        update_data = {
            "paid_amount": paid_amount,
            "pending_amount": pending_amount,
            "payment_status": payment_status
        }

        self.repo.update_sales_payment(sales_id, update_data)
        return update_data

    # ---------------------------------------------------------
    # Delete Sales
    # ---------------------------------------------------------

    def delete_sales(
        self,
        sales_id: int
    ):

        sale = self.repo.get_sales_by_id(sales_id)
        if sale is None:
            raise ValueError("Sales entry not found.")

        self.repo.delete_sales(sales_id)

    # ---------------------------------------------------------
    # Validate Customer
    # ---------------------------------------------------------

    def validate_customer(
        self,
        customer_id: int
    ):

        customer = self.repo.get_customer(customer_id)
        if customer is None:
            raise ValueError("Customer does not exist.")