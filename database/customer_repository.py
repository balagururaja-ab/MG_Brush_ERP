"""
Customer Repository

Handles Customer CRUD Operations
"""

from __future__ import annotations

from database.base_repository import BaseRepository
from database.constants import Tables


class CustomerRepository(BaseRepository):

    # ---------------------------------------------------------
    # Get All Customers
    # ---------------------------------------------------------

    def get_all(self):

        sql = f"""
            SELECT *

            FROM {Tables.CUSTOMERS}

            ORDER BY customer_name
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Get Customer By Id
    # ---------------------------------------------------------

    def get_by_id(
        self,
        customer_id: int
    ):

        return self.find_one(
            Tables.CUSTOMERS,
            {
                "customer_id": customer_id
            }
        )

    # ---------------------------------------------------------
    # Create Customer
    # ---------------------------------------------------------

    def create(
        self,
        customer: dict
    ):

        return self.insert(
            Tables.CUSTOMERS,
            customer,
            "customer_id"
        )

    # ---------------------------------------------------------
    # Update Customer
    # ---------------------------------------------------------

    def update_customer(
        self,
        customer_id: int,
        customer: dict
    ):

        return self.update(
            Tables.CUSTOMERS,
            customer,
            {
                "customer_id": customer_id
            }
        )

    # ---------------------------------------------------------
    # Delete Customer
    # ---------------------------------------------------------

    def delete_customer(
        self,
        customer_id: int
    ):

        return self.delete(
            Tables.CUSTOMERS,
            {
                "customer_id": customer_id
            }
        )

    # ---------------------------------------------------------
    # Exists Customer Code
    # ---------------------------------------------------------

    def exists_customer_code(
        self,
        customer_code: str
    ) -> bool:

        customer = self.find_one(
            Tables.CUSTOMERS,
            {
                "customer_code": customer_code
            }
        )

        return customer is not None