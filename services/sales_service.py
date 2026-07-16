from database.sales_repository import SalesRepository
from services.stock_service import StockService


class SalesService:

    def __init__(self):

        self.repo = SalesRepository()

        self.stock_service = StockService()

    # ---------------------------------------------------------
    # Create Sales
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict,
        items: list[dict]
    ):

        if len(items) == 0:

            raise ValueError(
                "Please add at least one item."
            )
        
        self.validate_customer(
            sales_header["customer_id"]
        )

        try:

            # Create Header

            sales_id = self.repo.create_sales(
                sales_header
            )

            # Create Items

            for line_no, item in enumerate(
                items,
                start=1
            ):

                self.stock_service.validate_stock(

                    item["item_id"],

                    float(item["quantity"])

                )

                item["sales_id"] = sales_id

                item["line_no"] = line_no

                self.repo.create_sales_item(
                    item
                )

                # Update Inventory

                self.stock_service.sales_stock(

                    sales_id=sales_id,

                    sales_no=sales_header["sales_no"],

                    item=item

                )

            self.repo.commit()

            return sales_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Update Sales
    # ---------------------------------------------------------

    def update_sales(
        self,
        sales_id: int,
        sales_header: dict,
        items: list[dict]
    ):

        if len(items) == 0:

            raise ValueError(
                "Please add at least one item."
            )

        self.validate_customer(
            sales_header["customer_id"]
        )

        existing = self.repo.get_sales_by_id(
            sales_id
        )

        if existing is None:

            raise ValueError(
                "Sales entry not found."
            )

        try:

            # -------------------------------------------------
            # Update Sales Header
            # -------------------------------------------------

            self.repo.update_sales(
                sales_id,
                sales_header
            )

            # -------------------------------------------------
            # Delete Existing Sales Items
            # -------------------------------------------------

            self.repo.delete_sales_items(
                sales_id
            )

            # -------------------------------------------------
            # TODO
            #
            # Reverse previous stock movement
            # and recreate stock ledger
            #
            # Stock Phase-2
            # -------------------------------------------------

            # -------------------------------------------------
            # Insert New Sales Items
            # -------------------------------------------------

            for line_no, item in enumerate(
                items,
                start=1
            ):

                item["sales_id"] = sales_id

                item["line_no"] = line_no

                self.repo.create_sales_item(
                    item
                )

                # -------------------------------------------------
                # TODO
                # Re-apply stock after reverse stock is implemented
                # -------------------------------------------------

                # self.stock_service.sales_stock(
                #     sales_id=sales_id,
                #     sales_no=sales_header["sales_no"],
                #     item=item
                # )

            self.repo.commit()

            return sales_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Delete Sales
    # ---------------------------------------------------------

    def delete_sales(
        self,
        sales_id: int
    ):

        sale = self.repo.get_sales_by_id(
            sales_id
        )

        if sale is None:

            raise ValueError(
                "Sales entry not found."
            )

        # TODO:
        # Reverse stock ledger
        # Restore stock balance
        #
        # Stock Phase-2
        
        self.repo.delete_sales(
            sales_id
        )

    def validate_customer(
        self,
        customer_id: int
    ):

        customer = self.repo.get_customer(
            customer_id
        )

        if customer is None:

            raise ValueError(
                "Customer does not exist."
            )