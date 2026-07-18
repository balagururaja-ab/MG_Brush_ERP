"""
Item Service
"""

from database.item_repository import ItemRepository


class ItemService:

    def __init__(self):

        self.repo = ItemRepository()

    def get_all(self):

        return self.repo.get_all()

    def get_by_id(
        self,
        item_id: int
    ):

        item = self.repo.get_by_id(item_id)

        if item is None:

            raise ValueError(
                "Item not found."
            )

        return item

    def create(
        self,
        item: dict
    ):

        if self.repo.get_by_code(
            item["item_code"]
        ):

            raise ValueError(
                "Item Code already exists."
            )

        return self.repo.create(item)

    def update(
        self,
        item_id: int,
        item: dict
    ):

        if self.repo.get_by_id(item_id) is None:

            raise ValueError(
                "Item not found."
            )

        existing = self.repo.get_by_code_except_id(
            item["item_code"],
            item_id
        )

        if existing:

            raise ValueError(
                "Item Code already exists."
            )

        return self.repo.update(
            item_id,
            item
        )

    def delete(
        self,
        item_id: int
    ):

        if self.repo.get_by_id(item_id) is None:

            raise ValueError(
                "Item not found."
            )

        self.repo.delete(item_id)

    def activate(self, item_id: int):
        return self.repo.activate(item_id)