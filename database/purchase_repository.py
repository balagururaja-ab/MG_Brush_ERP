"""
Purchase Repository

Handles Purchase CRUD Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository


class PurchaseRepository(BaseRepository):

    def create_purchase(
        self,
        purchase: dict
    ) -> int:

        sql = """
        INSERT INTO purchase_header
        (
            purchase_no,
            supplier_id,
            invoice_no,
            invoice_date,
            purchase_date,
            subtotal,
            discount_amount,
            taxable_amount,
            cgst_amount,
            sgst_amount,
            igst_amount,
            cess_amount,
            freight_amount,
            other_charges,
            round_off,
            grand_total,
            payment_status,
            remarks,
            created_by
        )
        VALUES
        (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,%s
        )
        RETURNING purchase_id;
        """

        with self.conn.cursor() as cursor:

            cursor.execute(sql, (

                purchase["purchase_no"],
                purchase["supplier_id"],
                purchase["invoice_no"],
                purchase["invoice_date"],
                purchase["purchase_date"],
                purchase["subtotal"],
                purchase["discount_amount"],
                purchase["taxable_amount"],
                purchase["cgst_amount"],
                purchase["sgst_amount"],
                purchase["igst_amount"],
                purchase["cess_amount"],
                purchase["freight_amount"],
                purchase["other_charges"],
                purchase["round_off"],
                purchase["grand_total"],
                purchase["payment_status"],
                purchase["remarks"],
                purchase["created_by"]

            ))

            purchase_id = cursor.fetchone()["purchase_id"]

        self.commit()

        return purchase_id

    def create_purchase_item(
        self,
        item: dict
    ) -> int:

        sql = """
        INSERT INTO purchase_detail
        (
            purchase_id,
            line_no,
            item_id,
            quantity,
            unit_id,
            rate,
            discount_percent,
            discount_amount,
            taxable_amount,
            cgst_percent,
            cgst_amount,
            sgst_percent,
            sgst_amount,
            igst_percent,
            igst_amount,
            total_amount
        )
        VALUES
        (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s
        )
        RETURNING purchase_detail_id;
        """

        with self.conn.cursor() as cur:

            cur.execute(sql, (

                item["purchase_id"],
                item["line_no"],
                item["item_id"],
                item["quantity"],
                item["unit_id"],
                item["rate"],
                item["discount_percent"],
                item["discount_amount"],
                item["taxable_amount"],
                item["cgst_percent"],
                item["cgst_amount"],
                item["sgst_percent"],
                item["sgst_amount"],
                item["igst_percent"],
                item["igst_amount"],
                item["total_amount"]

            ))

            return cur.fetchone()["purchase_detail_id"]
        
    def get_purchase_items(
        self,
        purchase_id: int
    ) -> list[dict]:

        sql = """
        SELECT
            pd.*,
            i.item_name,
            u.unit_name
        FROM purchase_detail pd
        JOIN items i
            ON pd.item_id=i.item_id
        JOIN unit_master u
            ON pd.unit_id=u.unit_id
        WHERE pd.purchase_id=%s
        ORDER BY pd.line_no
        """

        return self.fetch_all(sql, (purchase_id,))
    
    def update_purchase_item(
        self,
        item: dict
    ):

        sql = """
        UPDATE purchase_detail
        SET

            quantity=%s,
            rate=%s,
            discount_percent=%s,
            discount_amount=%s,
            taxable_amount=%s,
            cgst_percent=%s,
            cgst_amount=%s,
            sgst_percent=%s,
            sgst_amount=%s,
            igst_percent=%s,
            igst_amount=%s,
            total_amount=%s

        WHERE purchase_detail_id=%s
        """

        self.execute(sql, (

            item["quantity"],
            item["rate"],
            item["discount_percent"],
            item["discount_amount"],
            item["taxable_amount"],
            item["cgst_percent"],
            item["cgst_amount"],
            item["sgst_percent"],
            item["sgst_amount"],
            item["igst_percent"],
            item["igst_amount"],
            item["total_amount"],
            item["purchase_detail_id"]

        ))

    def delete_purchase_item(
        self,
        purchase_detail_id: int
    ):

        sql = """
        DELETE
        FROM purchase_detail
        WHERE purchase_detail_id=%s
        """

        self.execute(sql, (purchase_detail_id,))