"""
Customer Service

Contains Customer Business Logic
"""

from __future__ import annotations

from database.customer_repository import CustomerRepository


class CustomerService:

    def __init__(self):

        self.repo = CustomerRepository()

    # ---------------------------------------------------------
    # Get All Customers
    # ---------------------------------------------------------

    def get_all(self):

        return self.repo.get_all()

    # ---------------------------------------------------------
    # Get Customer By Id
    # ---------------------------------------------------------

    def get_by_id(
        self,
        customer_id: int
    ):

        customer = self.repo.get_by_id(
            customer_id
        )

        if customer is None:

            raise ValueError(
                "Customer not found."
            )

        return customer

    # ---------------------------------------------------------
    # Create Customer
    # ---------------------------------------------------------

    def create(
        self,
        customer: dict
    ):

        if self.repo.exists_customer_code(
            customer["customer_code"]
        ):

            raise ValueError(
                "Customer Code already exists."
            )

        return self.repo.create(
            customer
        )

    # ---------------------------------------------------------
    # Update Customer
    # ---------------------------------------------------------

    def update(
        self,
        customer_id: int,
        customer: dict
    ):

        existing = self.repo.get_by_id(
            customer_id
        )

        if existing is None:

            raise ValueError(
                "Customer not found."
            )

        self.repo.update_customer(
            customer_id,
            customer
        )

    # ---------------------------------------------------------
    # Delete Customer
    # ---------------------------------------------------------

    def delete(
        self,
        customer_id: int
    ):

        existing = self.repo.get_by_id(
            customer_id
        )

        if existing is None:

            raise ValueError(
                "Customer not found."
            )

        self.repo.delete_customer(
            customer_id
        )