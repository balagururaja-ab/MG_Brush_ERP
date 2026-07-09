from decimal import Decimal

from pydantic import BaseModel


class StockResponse(BaseModel):

    item_id: int

    item_code: str

    item_name: str

    available_stock: Decimal

    minimum_stock: Decimal

    reorder_level: Decimal

    class Config:
        from_attributes = True