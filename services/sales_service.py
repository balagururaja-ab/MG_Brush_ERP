from datetime import date

from database.order_repository import OrderRepository
from database.sales_repository import SalesRepository
from services.stock_service import StockService


class SalesService:

    def __init__(self):

        self.repo = SalesRepository()
        self.order_repo = OrderRepository()
        self.stock_service = StockService()

    # ---------------------------------------------------------
    # Ensure Item Fields
    # ---------------------------------------------------------

    def ensure_item_fields(
        self,
        item: dict
    ) -> None:

        if item.get("item_id") in (None, ""):
            raise ValueError("Please select a valid item.")

        item_id = int(item["item_id"])
        item["item_id"] = item_id

        item_master = self.repo.get_item(item_id)
        if item_master is None:
            raise ValueError("Invalid item selected.")

        # Backfill nullable detail fields from item master to satisfy DB constraints.
        if item.get("unit_id") in (None, ""):
            item["unit_id"] = item_master.get("unit_id")

        if item.get("tax_id") in (None, ""):
            item["tax_id"] = item_master.get("tax_id")

        if item.get("unit_id") in (None, ""):
            raise ValueError("Item is missing unit mapping. Please update item master.")

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
            self.ensure_item_fields(item)
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
            self.ensure_item_fields(item)
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
    # Create Sales From Order
    # ---------------------------------------------------------

    def create_sales_from_order(
        self,
        order_id: int
    ) -> int:

        order = self.order_repo.get_order_by_id(order_id)
        if order is None:
            raise ValueError("Order not found.")

        if order.get("status") == "INVOICED":
            raise ValueError("Order already converted to sales.")

        if order.get("status") != "CONFIRMED":
            raise ValueError(
                "Sales can only be created from confirmed orders."
            )

        order_items = self.order_repo.get_order_items(order_id)
        if len(order_items) == 0:
            raise ValueError("Order must contain at least one item.")

        sales_items = []
        for order_item in order_items:
            order_item_label = " ".join(
                part.strip()
                for part in [
                    str(order_item.get("brand_name") or ""),
                    str(order_item.get("size_name") or "")
                ]
                if part and part.strip()
            )

            item = None
            item_id = order_item.get("item_id")

            if item_id not in (None, ""):
                item = self.repo.get_item(int(item_id))

            if item is None:
                candidates = self.repo.get_items_for_order_item(
                    order_item["brand_id"],
                    order_item["brush_size_id"],
                    order_item.get("brand_name")
                )

                if len(candidates) == 0:
                    raise ValueError(
                        f"No matching item found for brand {order_item['brand_id']} and brush size {order_item['brush_size_id']}."
                    )

                if len(candidates) == 1:
                    item = candidates[0]
                else:
                    line_rate = float(order_item.get("rate") or 0)
                    rate_matches = [
                        row for row in candidates
                        if float(row.get("selling_rate") or 0) == line_rate
                    ]

                    if len(rate_matches) == 1:
                        item = rate_matches[0]
                    else:
                        raise ValueError(
                            f"Multiple items match {order_item_label or 'selected order line'}. Please edit the order and select the exact item."
                        )

            if item is None:
                raise ValueError(
                    f"No matching item found for brand {order_item['brand_id']} and brush size {order_item['brush_size_id']}."
                )

            self.stock_service.validate_stock(
                item["item_id"],
                float(order_item["quantity"]),
                item_name=order_item_label or item.get("item_name"),
                item_code=None
            )

            sales_items.append({
                "item_id": item["item_id"],
                "unit_id": item.get("unit_id"),
                "quantity": float(order_item["quantity"]),
                "rate": float(order_item["rate"]),
                "discount_percent": 0,
                "discount_amount": 0,
                "cgst_amount": 0,
                "sgst_amount": 0,
                "igst_amount": 0
            })

        sales_header = {
            "order_id": order_id,
            "customer_id": order["customer_id"],
            "sales_date": order.get("order_date") or date.today(),
            "remarks": f"Created from order {order.get('order_no')}",
            "payment_status": "PENDING",
            "paid_amount": 0,
            "pending_amount": 0,
            "invoice_generated": False,
            "is_gst": False,
            "gst_percent": 0
        }

        sales_id = self.create_sales(sales_header, sales_items)

        self.order_repo.update_order(
            order_id,
            {
                "status": "INVOICED"
            }
        )
        self.order_repo.commit()

        return sales_id

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

        payment_date = payment.get("payment_date") or date.today()
        sales_date = sales.get("sales_date")
        if sales_date and payment_date < sales_date:
            raise ValueError("Payment date cannot be before sales date.")

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

        payment_result = self.repo.apply_payment(
            sales_id,
            {
                "payment_date": payment_date,
                "amount": amount,
                "payment_mode": payment.get("payment_mode"),
                "reference_no": payment.get("reference_no"),
                "remarks": payment.get("remarks")
            },
            update_data
        )

        return {
            **update_data,
            "payment_id": payment_result["payment_id"],
            "receipt_no": payment_result["receipt_no"]
        }

    def get_sales_payment_receipt(
        self,
        sales_id: int,
        payment_id: int
    ) -> dict:

        sales = self.repo.get_sales_by_id(sales_id)
        if sales is None:
            raise ValueError("Sales entry not found.")

        payment = self.repo.get_sales_payment_by_id(sales_id, payment_id)
        if payment is None:
            raise ValueError("Payment receipt not found.")

        return {
            "sales_id": sales_id,
            "sales_no": sales.get("sales_no"),
            "customer_name": sales.get("customer_name"),
            "invoice_no": sales.get("invoice_no"),
            **payment
        }

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