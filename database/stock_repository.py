"""
Stock Repository

Handles Stock Ledger & Stock Balance Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class StockRepository(BaseRepository):

    # ---------------------------------------------------------
    # Create Stock Ledger Entry
    # ---------------------------------------------------------

    def create_stock_ledger(
        self,
        ledger: dict
    ) -> int:

        return self.insert(
            Tables.STOCK_LEDGER,
            ledger,
            "stock_ledger_id"
        )

    # ---------------------------------------------------------
    # Get Stock Ledger
    # ---------------------------------------------------------

    def get_stock_ledger(self):

        sql = f"""
        SELECT

            sl.*,

            i.item_code,

            i.item_name

        FROM {Tables.STOCK_LEDGER} sl

        JOIN {Tables.ITEMS} i

            ON sl.item_id = i.item_id

        ORDER BY

            sl.transaction_date DESC,

            sl.stock_ledger_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Get Item Ledger
    # ---------------------------------------------------------

    def get_item_stock_ledger(
        self,
        item_id: int
    ):

        sql = f"""
        SELECT *

        FROM {Tables.STOCK_LEDGER}

        WHERE item_id=%s

        ORDER BY

            transaction_date,

            stock_ledger_id
        """

        return self.fetch_all(
            sql,
            (item_id,)
        )

    # ---------------------------------------------------------
    # Get Stock Balance
    # ---------------------------------------------------------

    def get_stock_balance(
        self,
        item_id: int,
        warehouse: str = "MAIN"
    ):

        sql = f"""
        SELECT *

        FROM {Tables.STOCK_BALANCE}

        WHERE

            item_id=%s

        AND

            warehouse=%s
        """

        return self.fetch_one(
            sql,
            (
                item_id,
                warehouse
            )
        )

    # ---------------------------------------------------------
    # Create Stock Balance
    # ---------------------------------------------------------

    def create_stock_balance(
        self,
        balance: dict
    ):

        return self.insert(
            Tables.STOCK_BALANCE,
            balance,
            "item_id"
        )
    
        # ---------------------------------------------------------
    # Update Stock Balance
    # ---------------------------------------------------------

    def update_stock_balance(
        self,
        item_id: int,
        warehouse: str,
        current_qty: float,
        average_cost: float = 0,
        last_purchase_cost: float = 0
    ):

        sql = f"""
        UPDATE {Tables.STOCK_BALANCE}

        SET

            current_qty=%s,

            average_cost=%s,

            last_purchase_cost=%s,

            updated_at=CURRENT_TIMESTAMP

        WHERE

            item_id=%s

        AND

            warehouse=%s
        """

        return self.execute(

            sql,

            (

                current_qty,

                average_cost,

                last_purchase_cost,

                item_id,

                warehouse

            )

        )

    # ---------------------------------------------------------
    # Increase Stock
    # ---------------------------------------------------------

    def increase_stock(

        self,

        item_id: int,

        quantity: float,

        unit_cost: float,

        warehouse: str = "MAIN"

    ):

        balance = self.get_stock_balance(

            item_id,

            warehouse

        )

        if balance:

            new_qty = float(

                balance["current_qty"]

            ) + quantity

            self.update_stock_balance(

                item_id,

                warehouse,

                new_qty,

                balance["average_cost"],

                unit_cost

            )

        else:

            self.create_stock_balance(

                {

                    "item_id": item_id,

                    "warehouse": warehouse,

                    "current_qty": quantity,

                    "average_cost": unit_cost,

                    "last_purchase_cost": unit_cost

                }

            )

    # ---------------------------------------------------------
    # Decrease Stock
    # ---------------------------------------------------------

    def decrease_stock(

        self,

        item_id: int,

        quantity: float,

        warehouse: str = "MAIN"

    ):

        balance = self.get_stock_balance(

            item_id,

            warehouse

        )

        if not balance:

            raise Exception(

                "Stock not available."

            )

        current_qty = float(

            balance["current_qty"]

        )

        if current_qty < quantity:

            raise Exception(

                "Insufficient stock."

            )

        self.update_stock_balance(

            item_id,

            warehouse,

            current_qty - quantity,

            balance["average_cost"],

            balance["last_purchase_cost"]

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

            sb.current_qty,

            sb.average_cost,

            sb.last_purchase_cost,

            (sb.current_qty * sb.average_cost)

                AS stock_value,

            sb.updated_at

        FROM {Tables.ITEMS} i

        LEFT JOIN

            {Tables.STOCK_BALANCE} sb

        ON

            i.item_id = sb.item_id

        ORDER BY

            i.item_name

        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Low Stock Report
    # ---------------------------------------------------------

    def get_low_stock(self):

        sql = f"""

        SELECT

            i.item_id,

            i.item_code,

            i.item_name,

            i.reorder_level,

            COALESCE(

                sb.current_qty,

                0

            ) AS current_qty

        FROM {Tables.ITEMS} i

        LEFT JOIN

            {Tables.STOCK_BALANCE} sb

        ON

            i.item_id = sb.item_id

        WHERE

            COALESCE(

                sb.current_qty,

                0

            ) <=

            COALESCE(

                i.reorder_level,

                0

            )

        ORDER BY

            i.item_name

        """

        return self.fetch_all(sql)
    
    # ---------------------------------------------------------
    # Current Stock
    # ---------------------------------------------------------

    def get_current_stock(
        self,
        item_id: int
    ):

        sql = f"""
        SELECT

            sb.item_id,

            i.item_code,

            i.item_name,

            sb.warehouse,

            sb.current_qty,

            sb.average_cost,

            sb.last_purchase_cost,

            sb.updated_at

        FROM {Tables.STOCK_BALANCE} sb

        INNER JOIN {Tables.ITEMS} i

                ON sb.item_id = i.item_id

        WHERE sb.item_id=%s
        """

        return self.fetch_one(
            sql,
            (item_id,)
        )