"""
Stock Service

Handles all inventory movements.

Purchase  -> Increase Stock
Sales     -> Decrease Stock
Opening   -> Opening Stock
Adjustment-> Manual Adjustment
"""

from database.stock_repository import StockRepository


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
    # Opening Stock
    # ---------------------------------------------------------

    def opening_stock(

        self,

        item_id: int,

        quantity: float,

        rate: float

    ):

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
        quantity: float
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

            raise ValueError(

                f"Insufficient stock. "
                f"Available: {current_qty}, "
                f"Requested: {quantity}"

            )