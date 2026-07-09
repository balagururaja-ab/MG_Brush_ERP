from database.supplier_repository import SupplierRepository


class SupplierService:

    def __init__(self):

        self.repo = SupplierRepository()

    def get_all(self):

        return self.repo.get_all()

    def get_by_id(self, supplier_id):

        supplier = self.repo.get_by_id(supplier_id)

        if supplier is None:
            raise ValueError("Supplier not found.")

        return supplier

    def create(self, supplier):

        if self.repo.get_by_code(
            supplier["supplier_code"]
        ):

            raise ValueError(
                "Supplier Code already exists."
            )

        return self.repo.create(supplier)

    def update(
        self,
        supplier_id,
        supplier
    ):

        if self.repo.get_by_id(supplier_id) is None:

            raise ValueError("Supplier not found.")

        duplicate = self.repo.get_by_code_except_id(
            supplier["supplier_code"],
            supplier_id
        )

        if duplicate:

            raise ValueError(
                "Supplier Code already exists."
            )

        return self.repo.update(
            supplier_id,
            supplier
        )

    def delete(self, supplier_id):

        if self.repo.get_by_id(supplier_id) is None:

            raise ValueError("Supplier not found.")

        self.repo.delete(supplier_id)