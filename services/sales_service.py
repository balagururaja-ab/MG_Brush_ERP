from database.sales_repository import SalesRepository


class SalesService:

    def __init__(self):

        self.repo = SalesRepository()

    # ---------------------------------------------------------
    # Create Sales
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict,
        items: list
    ):

        if len(items) == 0:

            raise ValueError(
                "Please add at least one item."
            )

        sales_id = self.repo.create_sales(
            sales_header,
            items
        )

        return sales_id

    # ---------------------------------------------------------
    # Update Sales
    # ---------------------------------------------------------

    def update_sales(
        self,
        sales_id: int,
        sales_header: dict,
        items: list
    ):

        if len(items) == 0:

            raise ValueError(
                "Please add at least one item."
            )

        self.repo.update_sales(
            sales_id,
            sales_header,
            items
        )

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

        self.repo.delete_sales(
            sales_id
        )