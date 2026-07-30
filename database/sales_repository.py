from datetime import datetime

from database.base_repository import BaseRepository
from database.constants import Tables


class SalesRepository(BaseRepository):

    SALES_DETAIL_COLUMNS = {
        "sales_id",
        "line_no",
        "item_id",
        "unit_id",
        "quantity",
        "rate",
        "discount_percent",
        "discount_amount",
        "taxable_amount",
        "tax_id",
        "cgst_amount",
        "sgst_amount",
        "igst_amount",
        "total_amount",
    }

    # ---------------------------------------------------------
    # Get Sales By Id
    # ---------------------------------------------------------

    def get_sales_by_id(
        self,
        sales_id: int
    ):

        sql = f"""
            SELECT
                sh.*,
                c.customer_name
            FROM {Tables.SALES_HEADER} sh
            LEFT JOIN {Tables.CUSTOMERS} c
                ON sh.customer_id = c.customer_id
            WHERE sh.sales_id = %s
        """

        return self.fetch_one(sql, [sales_id])

    # ---------------------------------------------------------
    # Get Sales By Order Id
    # ---------------------------------------------------------

    def get_sales_by_order_id(
        self,
        order_id: int
    ):

        sql = f"""
            SELECT
                sh.*,
                c.customer_name
            FROM {Tables.SALES_HEADER} sh
            LEFT JOIN {Tables.CUSTOMERS} c
                ON sh.customer_id = c.customer_id
            WHERE sh.order_id = %s
            ORDER BY sh.sales_id DESC
            LIMIT 1
        """

        try:
            sale = self.fetch_one(sql, [order_id])
        except Exception:
            sale = None

        if sale is not None:
            return sale

        order = self.find_one(
            Tables.ORDER_HEADER,
            {
                "order_id": order_id
            }
        )

        if order is None:
            return None

        order_no = order.get("order_no")
        if not order_no:
            return None

        fallback_sql = f"""
            SELECT
                sh.*,
                c.customer_name
            FROM {Tables.SALES_HEADER} sh
            LEFT JOIN {Tables.CUSTOMERS} c
                ON sh.customer_id = c.customer_id
            WHERE sh.remarks ILIKE %s
            ORDER BY sh.sales_id DESC
            LIMIT 1
        """

        return self.fetch_one(
            fallback_sql,
            [f"%Created from order {order_no}%"]
        )

    # ---------------------------------------------------------
    # Get Sales Items
    # ---------------------------------------------------------

    def get_sales_items(
        self,
        sales_id: int
    ):

        sql = f"""
            SELECT *
            FROM {Tables.SALES_DETAILS}
            WHERE sales_id=%s
            ORDER BY line_no
        """

        return self.fetch_all(
            sql,
            [sales_id]
        )

    # ---------------------------------------------------------
    # Get Sales Payment History
    # ---------------------------------------------------------

    def get_sales_payment_history(
        self,
        sales_id: int
    ):

        sql = f"""
            SELECT
                payment_id,
                sales_id,
                receipt_no,
                payment_date,
                amount,
                payment_mode,
                reference_no,
                remarks,
                created_at
            FROM {Tables.SALES_PAYMENT_HISTORY}
            WHERE sales_id = %s
            ORDER BY payment_date DESC, payment_id DESC
        """

        try:
            return self.fetch_all(sql, [sales_id])
        except Exception as exc:
            if "sales_payment_history" in str(exc):
                return []
            raise

    # ---------------------------------------------------------
    # List Sales
    # ---------------------------------------------------------

    def list_sales(self):

        sql = f"""
            SELECT
                sh.sales_id,
                sh.customer_id,
                sh.sales_no,
                sh.sales_date,
                sh.invoice_no,
                sh.invoice_generated,
                sh.grand_total,
                sh.paid_amount,
                sh.pending_amount,
                sh.payment_status,
                c.customer_name
            FROM {Tables.SALES_HEADER} sh
            INNER JOIN {Tables.CUSTOMERS} c
                    ON sh.customer_id = c.customer_id
            ORDER BY sh.sales_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Create Sales Header
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict
    ) -> int:

        return self.insert(
            Tables.SALES_HEADER,
            sales_header,
            "sales_id"
        )

    # ---------------------------------------------------------
    # Update Sales Header
    # ---------------------------------------------------------

    def update_sales(
        self,
        sales_id: int,
        sales_header: dict
    ):

        return self.update(
            Tables.SALES_HEADER,
            sales_header,
            {
                "sales_id": sales_id
            }
        )

    # ---------------------------------------------------------
    # Update Sales Payment / Invoice Fields
    # ---------------------------------------------------------

    def update_sales_payment(
        self,
        sales_id: int,
        payment_data: dict
    ):

        return self.update(
            Tables.SALES_HEADER,
            payment_data,
            {
                "sales_id": sales_id
            }
        )

    # ---------------------------------------------------------
    # Apply Payment (History + Header)
    # ---------------------------------------------------------

    def apply_payment(
        self,
        sales_id: int,
        payment_entry: dict,
        payment_update: dict
    ):

        self._ensure_connection()

        insert_sql = f"""
            INSERT INTO {Tables.SALES_PAYMENT_HISTORY}
            (
                sales_id,
                payment_date,
                amount,
                payment_mode,
                reference_no,
                remarks
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING payment_id
        """

        update_receipt_sql = f"""
            UPDATE {Tables.SALES_PAYMENT_HISTORY}
            SET receipt_no = %s
            WHERE payment_id = %s
        """

        update_columns = list(payment_update.keys())
        set_clause = ", ".join(
            f"{column} = %s"
            for column in update_columns
        )

        update_sql = f"""
            UPDATE {Tables.SALES_HEADER}
            SET {set_clause}
            WHERE sales_id = %s
        """

        try:
            with self.conn.cursor() as cursor:
                cursor.execute(
                    insert_sql,
                    [
                        sales_id,
                        payment_entry.get("payment_date"),
                        payment_entry.get("amount"),
                        payment_entry.get("payment_mode"),
                        payment_entry.get("reference_no"),
                        payment_entry.get("remarks")
                    ]
                )

                payment_row = cursor.fetchone()

                payment_id = payment_row.get("payment_id")
                receipt_no = (
                    f"RCPT-{datetime.now().year}-{payment_id:06d}"
                )

                cursor.execute(
                    update_receipt_sql,
                    [
                        receipt_no,
                        payment_id
                    ]
                )

                update_values = [
                    payment_update[column]
                    for column in update_columns
                ] + [sales_id]

                cursor.execute(update_sql, update_values)

                self.conn.commit()

                return {
                    "payment_id": payment_id,
                    "receipt_no": receipt_no
                }

        except Exception:
            self.rollback()
            raise

    # ---------------------------------------------------------
    # Delete Sales Header
    # ---------------------------------------------------------

    def delete_sales(
        self,
        sales_id: int
    ):

        return self.delete(
            Tables.SALES_HEADER,
            {
                "sales_id": sales_id
            }
        )

    # ---------------------------------------------------------
    # Create Sales Item
    # ---------------------------------------------------------

    def create_sales_item(
        self,
        item: dict
    ):

        item_data = dict(item)

        item_id = item_data.get("item_id")
        if item_id in (None, ""):
            raise ValueError("Please select a valid item.")

        item_data["item_id"] = int(item_id)

        if item_data.get("unit_id") in (None, ""):
            item_master = self.get_item(item_data["item_id"])
            if item_master is None:
                raise ValueError("Invalid item selected.")

            item_data["unit_id"] = item_master.get("unit_id")

            if item_data.get("tax_id") in (None, ""):
                item_data["tax_id"] = item_master.get("tax_id")

        if item_data.get("unit_id") in (None, ""):
            raise ValueError("Item is missing unit mapping. Please update item master.")

        payload = {
            key: value
            for key, value in item_data.items()
            if key in self.SALES_DETAIL_COLUMNS
        }

        return self.insert(
            Tables.SALES_DETAILS,
            payload,
            "sales_detail_id"
        )
    
    # ---------------------------------------------------------
    # Delete Sales Item
    # ---------------------------------------------------------

    def delete_sales_item(
        self,
        sales_detail_id: int
    ):

        return self.delete(
            Tables.SALES_DETAILS,
            {
                "sales_detail_id": sales_detail_id
            }
        )
    
    # ---------------------------------------------------------
    # Delete All Sales Items
    # ---------------------------------------------------------

    def delete_sales_items(
        self,
        sales_id: int
    ):

        return self.delete(
            Tables.SALES_DETAILS,
            {
                "sales_id": sales_id
            }
        )
    
    # ---------------------------------------------------------
    # Get Customer
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
    # Get Item By Brand And Brush Size
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

    def get_items_for_order_item(
        self,
        brand_id: int,
        brush_size_id: int,
        brand_name: str | None = None
    ):

        sql = f"""
            SELECT *
            FROM {Tables.ITEMS}
            WHERE brand_id = %s
              AND brush_size_id = %s
            ORDER BY item_id
        """

        items = self.fetch_all(
            sql,
            [brand_id, brush_size_id]
        )

        if len(items) > 0:
            return items

        if brand_name:
            sql = f"""
                SELECT *
                FROM {Tables.ITEMS}
                WHERE brush_size_id = %s
                  AND item_name ILIKE %s
                ORDER BY item_id
            """

            items = self.fetch_all(
                sql,
                [brush_size_id, f"%{brand_name}%"]
            )

            if len(items) > 0:
                return items

        sql = f"""
            SELECT *
            FROM {Tables.ITEMS}
            WHERE brush_size_id = %s
            ORDER BY item_id
        """

        return self.fetch_all(
            sql,
            [brush_size_id]
        )

    def get_item_for_order_item(
        self,
        brand_id: int,
        brush_size_id: int,
        brand_name: str | None = None
    ):
        items = self.get_items_for_order_item(
            brand_id,
            brush_size_id,
            brand_name
        )

        if len(items) == 0:
            return None

        return items[0]

    def get_customer_outstanding_balance(
        self,
        customer_id: int
    ) -> float:

        sql = f"""
            SELECT COALESCE(SUM(pending_amount), 0) AS outstanding_balance
            FROM {Tables.SALES_HEADER}
            WHERE customer_id = %s
        """

        row = self.fetch_one(sql, [customer_id])
        return float(row.get("outstanding_balance", 0) or 0)

    # ---------------------------------------------------------
    # Customer Pending Summary
    # ---------------------------------------------------------

    def get_customer_pending_summary(self):

        sql = f"""
            SELECT
                sh.customer_id,
                c.customer_name,
                COUNT(*) AS total_sales,
                SUM(
                    CASE
                        WHEN COALESCE(sh.pending_amount, 0) > 0 THEN 1
                        ELSE 0
                    END
                ) AS pending_sales,
                COALESCE(SUM(sh.grand_total), 0) AS total_billed,
                COALESCE(SUM(sh.paid_amount), 0) AS total_paid,
                COALESCE(SUM(sh.pending_amount), 0) AS total_pending
            FROM {Tables.SALES_HEADER} sh
            INNER JOIN {Tables.CUSTOMERS} c
                    ON sh.customer_id = c.customer_id
            GROUP BY sh.customer_id, c.customer_name
            HAVING COALESCE(SUM(sh.pending_amount), 0) > 0
            ORDER BY total_pending DESC, c.customer_name
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Sales / Invoice Number Generation
    # ---------------------------------------------------------

    def generate_sales_number(
        self,
        sales_id: int
    ) -> str:

        year = datetime.now().year

        return f"SAL-{year}-{sales_id:06d}"

    def generate_invoice_number(
        self,
        sales_id: int
    ) -> str:

        year = datetime.now().year

        return f"INV-{year}-{sales_id:06d}"

    def update_sales_numbers(
        self,
        sales_id: int,
        sales_no: str,
        invoice_no: str | None = None
    ):

        update_data = {
            "sales_no": sales_no
        }

        if invoice_no is not None:
            update_data["invoice_no"] = invoice_no

        return self.update(
            Tables.SALES_HEADER,
            update_data,
            {
                "sales_id": sales_id
            }
        )