"""
Stock Repository

Handles Stock Transaction CRUD Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class StockRepository(BaseRepository):

    # ---------------------------------------------------------
    # Create Stock Transaction
    # ---------------------------------------------------------

    def create_stock_transaction(
        self,
        transaction: dict
    ) -> int:

        return self.insert(
            Tables.STOCK_TRANSACTIONS,
            transaction,
            "stock_transaction_id"
        )

    # ---------------------------------------------------------
    # Get Transaction By ID
    # ---------------------------------------------------------

    def get_transaction_by_id(
        self,
        stock_transaction_id: int
    ):

        return self.find_one(
            Tables.STOCK_TRANSACTIONS,
            {
                "stock_transaction_id":
                    stock_transaction_id
            }
        )

    # ---------------------------------------------------------
    # List All Transactions
    # ---------------------------------------------------------

    def list_stock_transactions(
        self
    ) -> list[dict]:

        sql = f"""
        SELECT
            st.*,
            i.item_code,
            i.item_name,
            u.unit_name
        FROM {Tables.STOCK_TRANSACTIONS} st
        JOIN {Tables.ITEMS} i
            ON st.item_id=i.item_id
        JOIN {Tables.UNIT_MASTER} u
            ON st.unit_id=u.unit_id
        ORDER BY
            st.transaction_date DESC,
            st.stock_transaction_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Item Stock Ledger
    # ---------------------------------------------------------

    def get_item_stock_ledger(
        self,
        item_id: int
    ) -> list[dict]:

        sql = f"""
        SELECT *
        FROM {Tables.STOCK_TRANSACTIONS}
        WHERE item_id=%s
        ORDER BY
            transaction_date,
            stock_transaction_id
        """

        return self.fetch_all(
            sql,
            (item_id,)
        )

    # ---------------------------------------------------------
    # Current Stock
    # ---------------------------------------------------------

    def get_current_stock(
        self,
        item_id: int
    ):

        sql = f"""
        SELECT
            COALESCE(
                SUM(quantity_in - quantity_out),
                0
            ) AS current_stock
        FROM {Tables.STOCK_TRANSACTIONS}
        WHERE item_id=%s
        """

        return self.fetch_one(
            sql,
            (item_id,)
        )

    # ---------------------------------------------------------
    # Update Transaction
    # ---------------------------------------------------------

    def update_stock_transaction(
        self,
        stock_transaction_id: int,
        transaction: dict
    ):

        return self.update(
            Tables.STOCK_TRANSACTIONS,
            transaction,
            {
                "stock_transaction_id":
                    stock_transaction_id
            }
        )

    # ---------------------------------------------------------
    # Delete Transaction
    # ---------------------------------------------------------

    def delete_stock_transaction(
        self,
        stock_transaction_id: int
    ):

        return self.delete(
            Tables.STOCK_TRANSACTIONS,
            {
                "stock_transaction_id":
                    stock_transaction_id
            }
        )

    # ---------------------------------------------------------
    # Transactions By Reference
    # ---------------------------------------------------------

    def get_transactions_by_reference(
        self,
        reference_type: str,
        reference_id: int
    ) -> list[dict]:

        return self.find_all(
            Tables.STOCK_TRANSACTIONS,
            {
                "reference_type":
                    reference_type,
                "reference_id":
                    reference_id
            },
            order_by="transaction_date"
        )

    # ---------------------------------------------------------
    # Transactions By Item
    # ---------------------------------------------------------

    def get_transactions_by_item(
        self,
        item_id: int
    ) -> list[dict]:

        return self.find_all(
            Tables.STOCK_TRANSACTIONS,
            {
                "item_id": item_id
            },
            order_by="transaction_date"
        )

    # ---------------------------------------------------------
    # Stock Summary
    # ---------------------------------------------------------

    def get_stock_summary(self):

        sql = f"""
        SELECT
            i.item_id,
            i.item_code,
            i.item_name,

            COALESCE(
                SUM(st.quantity_in),
                0
            ) AS total_in,

            COALESCE(
                SUM(st.quantity_out),
                0
            ) AS total_out,

            COALESCE(
                SUM(
                    st.quantity_in -
                    st.quantity_out
                ),
                0
            ) AS current_stock

        FROM {Tables.ITEMS} i

        LEFT JOIN {Tables.STOCK_TRANSACTIONS} st
            ON i.item_id=st.item_id

        GROUP BY
            i.item_id,
            i.item_code,
            i.item_name

        ORDER BY
            i.item_name
        """

        return self.fetch_all(sql)