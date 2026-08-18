from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class ReportRepository(BaseRepository):

    def get_customer_sales_history(
        self,
        customer_id: int | None = None,
        from_date: str | None = None,
        to_date: str | None = None
    ) -> list[dict]:

        conditions: list[str] = []
        params: list = []

        if customer_id:
            conditions.append("sh.customer_id = %s")
            params.append(customer_id)

        if from_date:
            conditions.append("sh.sales_date >= %s")
            params.append(from_date)

        if to_date:
            conditions.append("sh.sales_date <= %s")
            params.append(to_date)

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        sql = f"""
            SELECT
                sh.sales_id,
                sh.sales_no,
                sh.sales_date,
                sh.invoice_no,
                sh.customer_id,
                c.customer_name,
                sh.gross_amount,
                sh.discount_amount,
                sh.taxable_amount,
                sh.grand_total,
                sh.paid_amount,
                sh.pending_amount,
                sh.payment_status
            FROM {Tables.SALES_HEADER} sh
            INNER JOIN {Tables.CUSTOMERS} c
                    ON sh.customer_id = c.customer_id
            {where_clause}
            ORDER BY sh.sales_date DESC, sh.sales_id DESC
        """

        return self.fetch_all(sql, params)

    def get_supplier_purchase_history(
        self,
        supplier_id: int | None = None,
        from_date: str | None = None,
        to_date: str | None = None
    ) -> list[dict]:

        conditions: list[str] = []
        params: list = []

        if supplier_id:
            conditions.append("ph.supplier_id = %s")
            params.append(supplier_id)

        if from_date:
            conditions.append("ph.purchase_date >= %s")
            params.append(from_date)

        if to_date:
            conditions.append("ph.purchase_date <= %s")
            params.append(to_date)

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        sql = f"""
            SELECT
                ph.purchase_id,
                ph.purchase_no,
                ph.purchase_date,
                ph.invoice_no,
                ph.supplier_id,
                s.supplier_name,
                ph.subtotal,
                ph.discount_amount,
                ph.taxable_amount,
                ph.grand_total,
                ph.payment_status
            FROM {Tables.PURCHASE_HEADER} ph
            INNER JOIN {Tables.SUPPLIERS} s
                    ON ph.supplier_id = s.supplier_id
            {where_clause}
            ORDER BY ph.purchase_date DESC, ph.purchase_id DESC
        """

        return self.fetch_all(sql, params)

    def get_report_overview(self) -> dict:

        sales_sql = f"""
            SELECT
                COUNT(*) AS total_sales,
                COALESCE(SUM(grand_total), 0) AS sales_value,
                COALESCE(SUM(pending_amount), 0) AS sales_pending
            FROM {Tables.SALES_HEADER}
        """

        purchase_sql = f"""
            SELECT
                COUNT(*) AS total_purchases,
                COALESCE(SUM(grand_total), 0) AS purchase_value
            FROM {Tables.PURCHASE_HEADER}
        """

        low_stock_sql = f"""
            SELECT COUNT(*) AS low_stock_count
            FROM {Tables.ITEMS} i
            LEFT JOIN {Tables.STOCK_BALANCE} sb
                   ON i.item_id = sb.item_id
            WHERE COALESCE(sb.current_qty, 0) <= COALESCE(i.reorder_level, 0)
        """

        sales = self.fetch_one(sales_sql) or {}
        purchases = self.fetch_one(purchase_sql) or {}
        low_stock = self.fetch_one(low_stock_sql) or {}

        return {
            "total_sales": int(sales.get("total_sales", 0) or 0),
            "sales_value": float(sales.get("sales_value", 0) or 0),
            "sales_pending": float(sales.get("sales_pending", 0) or 0),
            "total_purchases": int(purchases.get("total_purchases", 0) or 0),
            "purchase_value": float(purchases.get("purchase_value", 0) or 0),
            "low_stock_count": int(low_stock.get("low_stock_count", 0) or 0)
        }
