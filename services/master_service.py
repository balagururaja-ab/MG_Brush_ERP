from database.master_repository import MasterRepository


class MasterService:

    def __init__(self):
        self.repo = MasterRepository()

    # ---------------------------------------

    def get_item_categories(self):
        return self.repo.get_item_categories()

    # ---------------------------------------

    def get_units(self):
        return self.repo.get_units()

    # ---------------------------------------

    def get_taxes(self):
        return self.repo.get_taxes()