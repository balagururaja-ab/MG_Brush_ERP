from database.base_repository import BaseRepository
from database.constants import Tables

class SupplierRepository(BaseRepository):

    def create_supplier(self, supplier):
        return self.insert(
            Tables.SUPPLIERS,
            supplier,
            "supplier_id"
        )

    def update_supplier(self, supplier_id, supplier):
        return self.update(
            Tables.SUPPLIERS,
            supplier,
            {"supplier_id": supplier_id}
        )

    def delete_supplier(self, supplier_id):
        return self.delete(
            Tables.SUPPLIERS,
            {"supplier_id": supplier_id}
        )