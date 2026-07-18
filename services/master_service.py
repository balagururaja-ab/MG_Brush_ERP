from database.master_repository import MasterRepository

class MasterService:

    def __init__(self):
        self.repository = MasterRepository()

    def get_item_categories(self):
        return self.repository.get_item_categories()

    def get_units(self):
        return self.repository.get_units()

    def get_taxes(self):
        return self.repository.get_taxes()

    # NEW
    def get_brands(self):
        return self.repository.get_brands()

    # NEW
    def get_brush_sizes(self):
        return self.repository.get_brush_sizes()