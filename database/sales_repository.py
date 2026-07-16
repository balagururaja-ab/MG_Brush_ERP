from database.base_repository import BaseRepository
from database.constants import Tables


class SalesRepository(BaseRepository):

    # ---------------------------------------------------------
    # Get Sales By Id
    # ---------------------------------------------------------

    def get_sales_by_id(
        self,
        sales_id: int
    ):

        return self.find_one(
            Tables.SALES_HEADER,
            {
                "sales_id": sales_id
            }
        )

    # ---------------------------------------------------------
    # Get Sales Items
    # ---------------------------------------------------------

    def get_sales_items(
        self,
        sales_id: int
    ):

        sql = f"""
            SELECT *

            FROM {Tables.SALES_DETAILS}

            WHERE sales_id=%s

            ORDER BY line_no
        """

        return self.fetch_all(
            sql,
            [sales_id]
        )

    # ---------------------------------------------------------
    # List Sales
    # ---------------------------------------------------------

    def list_sales(self):

        sql = f"""
            SELECT

                sh.sales_id,
                sh.sales_no,
                sh.sales_date,
                sh.invoice_no,
                sh.grand_total,
                sh.payment_status,

                c.customer_name

            FROM {Tables.SALES_HEADER} sh

            INNER JOIN {Tables.CUSTOMERS} c

                    ON sh.customer_id=c.customer_id

            ORDER BY sh.sales_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Create Sales Header
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict
    ) -> int:

        return self.insert(
            Tables.SALES_HEADER,
            sales_header,
            "sales_id"
        )

    # ---------------------------------------------------------
    # Update Sales Header
    # ---------------------------------------------------------

    def update_sales(
        self,
        sales_id: int,
        sales_header: dict
    ):

        return self.update(

            Tables.SALES_HEADER,

            sales_header,

            {
                "sales_id": sales_id
            }

        )

    # ---------------------------------------------------------
    # Delete Sales Header
    # ---------------------------------------------------------

    def delete_sales(
        self,
        sales_id: int
    ):

        return self.delete(

            Tables.SALES_HEADER,

            {
                "sales_id": sales_id
            }

        )

    # ---------------------------------------------------------
    # Create Sales Item
    # ---------------------------------------------------------

    def create_sales_item(
        self,
        item: dict
    ):

        return self.insert(
            Tables.SALES_DETAILS,
            item,
            "sales_detail_id"
        )
    
    # ---------------------------------------------------------
    # Delete Sales Item
    # ---------------------------------------------------------

    def delete_sales_item(
        self,
        sales_detail_id: int
    ):

        return self.delete(

            Tables.SALES_DETAILS,

            {
                "sales_detail_id": sales_detail_id
            }

        )
    
    # ---------------------------------------------------------
    # Delete All Sales Items
    # ---------------------------------------------------------

    def delete_sales_items(
        self,
        sales_id: int
    ):

        return self.delete(

            Tables.SALES_DETAILS,

            {
                "sales_id": sales_id
            }

        )
    
    # ---------------------------------------------------------
    # Get Customer
    # ---------------------------------------------------------

    def get_customer(
        self,
        customer_id: int
    ):

        return self.find_one(

            Tables.CUSTOMERS,

            {
                "customer_id": customer_id
            }

        )