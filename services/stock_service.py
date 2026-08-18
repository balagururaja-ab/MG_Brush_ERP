"""
Stock Service

Handles all inventory movements.

Purchase  -> Increase Stock
Sales     -> Decrease Stock
Opening   -> Opening Stock
Adjustment-> Manual Adjustment
"""

from database.stock_repository import StockRepository
from datetime import date

from database.constants import FINISHED_GOOD_CATEGORIES


class StockService:

    def __init__(self):

        self.repo = StockRepository()

    # ---------------------------------------------------------
    # Purchase Stock
    # ---------------------------------------------------------

    def purchase_stock(
        self,
        purchase_id: int,
        purchase_no: str,
        item: dict
    ):

        self.repo.create_stock_ledger(

            {

                "transaction_type": "PURCHASE",

                "reference_id": purchase_id,

                "reference_no": purchase_no,

                "item_id": item["item_id"],

                "warehouse": "MAIN",

                "qty_in": item["quantity"],

                "qty_out": 0,

                "unit_cost": item["rate"],

                "remarks": "Purchase Entry"

            }

        )

        self.repo.increase_stock(

            item_id=item["item_id"],

            quantity=float(item["quantity"]),

            unit_cost=float(item["rate"])

        )

    # ---------------------------------------------------------
    # Sales Stock
    # ---------------------------------------------------------

    def sales_stock(
        self,
        sales_id: int,
        sales_no: str,
        item: dict
    ):

        self.repo.create_stock_ledger(

            {

                "transaction_type": "SALES",

                "reference_id": sales_id,

                "reference_no": sales_no,

                "item_id": item["item_id"],

                "warehouse": "MAIN",

                "qty_in": 0,

                "qty_out": item["quantity"],

                "unit_cost": item["rate"],

                "remarks": "Sales Entry"

            }

        )

        self.repo.decrease_stock(

            item_id=item["item_id"],

            quantity=float(item["quantity"])

        )

    # ---------------------------------------------------------
    # Production Stock
    # ---------------------------------------------------------

    def production_stock(
        self,
        production_id: int,
        production_no: str,
        rm_items: list[dict],
        fg_items: list[dict],
        consume_rm: bool = False
    ):

        if consume_rm:

            for item in rm_items:

                self.repo.create_stock_ledger(

                    {

                        "transaction_type": "ADJUSTMENT",

                        "reference_id": production_id,

                        "reference_no": production_no,

                        "item_id": item["item_id"],

                        "warehouse": "MAIN",

                        "qty_in": 0,

                        "qty_out": item["quantity"],

                        "unit_cost": 0,

                        "remarks": "Production RM Consumption"

                    }

                )

                self.repo.decrease_stock(

                    item_id=item["item_id"],

                    quantity=float(item["quantity"])

                )

        for item in fg_items:

            self.repo.create_stock_ledger(

                {

                    "transaction_type": "ADJUSTMENT",

                    "reference_id": production_id,

                    "reference_no": production_no,

                    "item_id": item["item_id"],

                    "warehouse": "MAIN",

                    "qty_in": item["quantity"],

                    "qty_out": 0,

                    "unit_cost": 0,

                    "remarks": "Production FG Receipt"

                }

            )

            self.repo.increase_stock(

                item_id=item["item_id"],

                quantity=float(item["quantity"]),

                unit_cost=0

            )

    # ---------------------------------------------------------
    # Opening Stock
    # ---------------------------------------------------------

    def opening_stock(

        self,

        item_id: int,

        quantity: float,

        rate: float

    ):

        item = self.repo.get_item(item_id)

        if item is None:
            raise ValueError("Invalid item selected.")

        if item.get("category_id") in FINISHED_GOOD_CATEGORIES:
            raise ValueError(
                "Opening stock is allowed only for raw materials/components, not finished brushes."
            )

        if quantity <= 0:
            raise ValueError("Opening quantity must be greater than zero.")

        if rate < 0:
            raise ValueError("Opening rate cannot be negative.")

        self.repo.create_stock_ledger(

            {

                "transaction_type": "OPENING",

                "reference_id": None,

                "reference_no": "OPENING",

                "item_id": item_id,

                "warehouse": "MAIN",

                "qty_in": quantity,

                "qty_out": 0,

                "unit_cost": rate,

                "remarks": "Opening Stock"

            }

        )

        self.repo.increase_stock(

            item_id,

            quantity,

            rate

        )

    # ---------------------------------------------------------
    # Stock Adjustment
    # ---------------------------------------------------------

    def adjustment(

        self,

        item_id: int,

        quantity: float,

        remarks: str

    ):

        if quantity >= 0:

            qty_in = quantity

            qty_out = 0

            self.repo.increase_stock(

                item_id,

                quantity,

                0

            )

        else:

            qty_in = 0

            qty_out = abs(quantity)

            self.repo.decrease_stock(

                item_id,

                abs(quantity)

            )

        self.repo.create_stock_ledger(

            {

                "transaction_type": "ADJUSTMENT",

                "reference_id": None,

                "reference_no": "ADJUSTMENT",

                "item_id": item_id,

                "warehouse": "MAIN",

                "qty_in": qty_in,

                "qty_out": qty_out,

                "unit_cost": 0,

                "remarks": remarks

            }

        )

    # ---------------------------------------------------------
    # Material Issue (Raw Material Consumption)
    # ---------------------------------------------------------

    def material_issue(
        self,
        item_id: int,
        quantity: float,
        issue_date: date,
        batch_no: str | None,
        remarks: str | None
    ):

        if quantity <= 0:
            raise ValueError("Issue quantity must be greater than zero.")

        item_stock = self.repo.get_current_stock(item_id)
        available_qty = float(item_stock["current_qty"]) if item_stock else 0

        if available_qty < quantity:
            raise ValueError(
                f"Insufficient stock. Available: {available_qty}, Requested: {quantity}"
            )

        final_remarks = "Material Issue"
        if remarks:
            final_remarks = f"Material Issue - {remarks}"

        self.repo.create_stock_ledger(
            {
                "transaction_date": issue_date,
                "transaction_type": "ADJUSTMENT",
                "reference_id": None,
                "reference_no": batch_no or "MATERIAL_ISSUE",
                "item_id": item_id,
                "warehouse": "MAIN",
                "qty_in": 0,
                "qty_out": quantity,
                "unit_cost": 0,
                "remarks": final_remarks
            }
        )

        self.repo.decrease_stock(
            item_id=item_id,
            quantity=quantity
        )

    # ---------------------------------------------------------
    # Reports
    # ---------------------------------------------------------

    def get_stock_summary(self):

        return self.repo.get_stock_summary()

    def get_stock_ledger(self):

        return self.repo.get_stock_ledger()

    def get_item_stock_ledger(

        self,

        item_id: int

    ):

        return self.repo.get_item_stock_ledger(

            item_id

        )

    def get_low_stock(self):

        return self.repo.get_low_stock()
    
    # ---------------------------------------------------------
    # Current Stock
    # ---------------------------------------------------------

    def get_current_stock(
        self,
        item_id: int
    ):

        return self.repo.get_current_stock(
            item_id
        )
    
    # ---------------------------------------------------------
    # Check Available Stock
    # ---------------------------------------------------------

    def validate_stock(
        self,
        item_id: int,
        quantity: float,
        item_name: str | None = None,
        item_code: str | None = None
    ):

        stock = self.repo.get_current_stock(
            item_id
        )

        current_qty = 0

        if stock:

            current_qty = float(
                stock["current_qty"]
            )

        if current_qty < quantity:

            label = ""
            if item_code and item_name:
                label = f" for {item_name} ({item_code})"
            elif item_name:
                label = f" for {item_name}"

            raise ValueError(

                f"Insufficient stock{label}. "
                f"Available: {current_qty}, "
                f"Requested: {quantity}"

            )