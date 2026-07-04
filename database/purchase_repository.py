"""
Purchase Repository

Handles Purchase CRUD Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class PurchaseRepository(BaseRepository):

    def create_purchase(self, purchase: dict) -> int:

        return self.insert(
            Tables.PURCHASE_HEADER,
            purchase,
            "purchase_id"
        )

    def get_purchase_by_id(self, purchase_id: int):

        return self.find_one(
            Tables.PURCHASE_HEADER,
            {"purchase_id": purchase_id}
        )

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