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
    # Create Sales
    # ---------------------------------------------------------

    def create_sales(
        self,
        sales_header: dict,
        items: list
    ):

        sales_id = self.insert(
            Tables.SALES_HEADER,
            sales_header
        )

        for line_no, item in enumerate(items, start=1):

            item["sales_id"] = sales_id
            item["line_no"] = line_no

            self.insert(
                Tables.SALES_DETAILS,
                item
            )

        self.commit()

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

        self.update(
            Tables.SALES_HEADER,
            sales_header,
            {
                "sales_id": sales_id
            }
        )

        self.delete(
            Tables.SALES_DETAILS,
            {
                "sales_id": sales_id
            }
        )

        for line_no, item in enumerate(items, start=1):

            item["sales_id"] = sales_id
            item["line_no"] = line_no

            self.insert(
                Tables.SALES_DETAILS,
                item
            )

        self.commit()

    # ---------------------------------------------------------
    # Delete Sales
    # ---------------------------------------------------------

    def delete_sales(
        self,
        sales_id: int
    ):

        self.delete(
            Tables.SALES_HEADER,
            {
                "sales_id": sales_id
            }
        )

        self.commit()