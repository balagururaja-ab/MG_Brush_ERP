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