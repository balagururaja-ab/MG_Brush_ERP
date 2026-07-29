from datetime import datetime

from database.base_repository import BaseRepository
from database.constants import Tables


class SalesRepository(BaseRepository):

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
    # List Sales
    # ---------------------------------------------------------

    def list_sales(self):

        sql = f"""
            SELECT
                sh.sales_id,
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

        return self.insert(
            Tables.SALES_DETAILS,
            item,
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

    def get_item_for_order_item(
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
            LIMIT 1
        """

        item = self.fetch_one(
            sql,
            [brand_id, brush_size_id]
        )

        if item is not None:
            return item

        if brand_name:
            sql = f"""
                SELECT *
                FROM {Tables.ITEMS}
                WHERE brush_size_id = %s
                  AND item_name ILIKE %s
                ORDER BY item_id
                LIMIT 1
            """

            item = self.fetch_one(
                sql,
                [brush_size_id, f"%{brand_name}%"]
            )

            if item is not None:
                return item

        sql = f"""
            SELECT *
            FROM {Tables.ITEMS}
            WHERE brush_size_id = %s
            ORDER BY item_id
            LIMIT 1
        """

        return self.fetch_one(
            sql,
            [brush_size_id]
        )

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