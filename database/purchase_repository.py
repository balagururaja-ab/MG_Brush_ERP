"""
Purchase Repository

Handles Purchase CRUD Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class PurchaseRepository(BaseRepository):

    PURCHASE_PAYMENT_COLUMNS = {
        "purchase_id",
        "payment_date",
        "amount",
        "payment_mode",
        "reference_no",
        "remarks",
    }

    def create_purchase(self, purchase: dict) -> int:

        return self.insert(
            Tables.PURCHASE_HEADER,
            purchase,
            "purchase_id"
        )

    def get_purchase_by_id(self, purchase_id: int):

        sql = f"""
            SELECT
                ph.*, 
                s.supplier_name
            FROM {Tables.PURCHASE_HEADER} ph
            LEFT JOIN {Tables.SUPPLIERS} s
                ON ph.supplier_id = s.supplier_id
            WHERE ph.purchase_id = %s
        """

        return self.fetch_one(sql, (purchase_id,))

    def list_purchases(self) -> list[dict]:

        sql = f"""
            SELECT
                ph.purchase_id,
                ph.purchase_no,
                ph.purchase_date,
                ph.invoice_no,
                ph.grand_total,
                ph.payment_status,
                s.supplier_name
            FROM {Tables.PURCHASE_HEADER} ph
            JOIN {Tables.SUPPLIERS} s
                ON ph.supplier_id = s.supplier_id
            ORDER BY ph.purchase_date DESC,
                    ph.purchase_id DESC
        """

        return self.fetch_all(sql)
    
    def update_purchase(
    self,
    purchase_id: int,
    purchase: dict
):

        return self.update(
            Tables.PURCHASE_HEADER,
            purchase,
            {"purchase_id": purchase_id}
        )
    
    def delete_purchase(self,purchase_id: int):

        self.delete(
            Tables.PURCHASE_DETAIL,
            {"purchase_id": purchase_id}
        )

        return self.delete(
            Tables.PURCHASE_HEADER,
            {"purchase_id": purchase_id}
        )

    def create_purchase_item(
        self,
        item: dict
    ):

        return self.insert(
            Tables.PURCHASE_DETAIL,
            item,
            "purchase_detail_id"
        )
        
    def get_purchase_items(
        self,
        purchase_id: int
    ) -> list[dict]:

        sql = f"""
            SELECT
                pd.*,
                i.item_name,
                u.unit_name
            FROM {Tables.PURCHASE_DETAIL} pd
            JOIN {Tables.ITEMS} i
                ON pd.item_id = i.item_id
            JOIN {Tables.UNIT_MASTER} u
                ON pd.unit_id = u.unit_id
            WHERE pd.purchase_id=%s
            ORDER BY pd.purchase_detail_id
            """

        return self.fetch_all(sql, (purchase_id,))

    def get_purchase_payment_history(
        self,
        purchase_id: int
    ) -> list[dict]:

        sql = f"""
            SELECT
                payment_id,
                purchase_id,
                receipt_no,
                payment_date,
                amount,
                payment_mode,
                reference_no,
                remarks,
                created_at
            FROM {Tables.PURCHASE_PAYMENT_HISTORY}
            WHERE purchase_id = %s
            ORDER BY payment_date DESC, payment_id DESC
        """

        try:
            return self.fetch_all(sql, (purchase_id,))
        except Exception as exc:
            if "purchase_payment_history" in str(exc):
                return []
            raise

    def get_purchase_payment_by_id(
        self,
        purchase_id: int,
        payment_id: int
    ) -> dict | None:

        sql = f"""
            SELECT
                payment_id,
                purchase_id,
                receipt_no,
                payment_date,
                amount,
                payment_mode,
                reference_no,
                remarks,
                created_at
            FROM {Tables.PURCHASE_PAYMENT_HISTORY}
            WHERE purchase_id = %s
              AND payment_id = %s
        """

        return self.fetch_one(sql, (purchase_id, payment_id))

    def apply_purchase_payment(
        self,
        purchase_id: int,
        payment_entry: dict,
        payment_update: dict
    ):

        self._ensure_connection()

        insert_sql = f"""
            INSERT INTO {Tables.PURCHASE_PAYMENT_HISTORY}
            (
                purchase_id,
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
            UPDATE {Tables.PURCHASE_PAYMENT_HISTORY}
            SET receipt_no = %s
            WHERE payment_id = %s
        """

        update_columns = list(payment_update.keys())
        set_clause = ", ".join(
            f"{column} = %s"
            for column in update_columns
        )

        update_sql = f"""
            UPDATE {Tables.PURCHASE_HEADER}
            SET {set_clause}
            WHERE purchase_id = %s
        """

        try:
            with self.conn.cursor() as cursor:
                cursor.execute(
                    insert_sql,
                    [
                        purchase_id,
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
                    f"PRCPT-{payment_id:06d}"
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
                ] + [purchase_id]

                cursor.execute(update_sql, update_values)

                self.conn.commit()

                return {
                    "payment_id": payment_id,
                    "receipt_no": receipt_no
                }

        except Exception:
            self.rollback()
            raise
    
    def update_purchase_item(
        self,
        item: dict
    ):

        purchase_detail_id = item.pop("purchase_detail_id")

        return self.update(
            Tables.PURCHASE_DETAIL,
            item,
            {"purchase_detail_id": purchase_detail_id}
        )

    def delete_purchase_item(
        self,
        purchase_detail_id: int
    ):

        return self.delete(
            Tables.PURCHASE_DETAIL,
            {"purchase_detail_id": purchase_detail_id}
        )
    
    def get_supplier(
        self,
        supplier_id: int
    ) -> dict | None:

        return self.find_one(
            Tables.SUPPLIERS,
            {
                "supplier_id": supplier_id,
                "is_active": True
            }
        )
    
    def get_item(
        self,
        item_id: int
    ) -> dict | None:

        return self.find_one(
            Tables.ITEMS,
            {
                "item_id": item_id,
                "is_active": True
            }
        )
    
    def get_tax(
        self,
        tax_id: int
    ) -> dict | None:

        return self.find_one(
            Tables.TAX_MASTER,
            {
                "tax_id": tax_id,
                "is_active": True
            }
        )
    
    def exists_purchase_no(
        self,
        purchase_no: str
    ) -> bool:

        purchase = self.find_one(
            Tables.PURCHASE_HEADER,
            {
                "purchase_no": purchase_no
            }
        )

        return purchase is not None
    
    def get_last_purchase(self):

        sql = f"""
            SELECT purchase_no
            FROM {Tables.PURCHASE_HEADER}
            ORDER BY purchase_id DESC
            LIMIT 1
        """

        return self.fetch_one(sql)