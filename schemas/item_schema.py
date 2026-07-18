from typing import Optional
from decimal import Decimal

from pydantic import BaseModel


class ItemBase(BaseModel):

    item_code: str
    item_name: str

    category_id: int
    unit_id: int

    tax_id: Optional[int] = None

    brand_id: Optional[int] = None

    brush_size_id: Optional[int] = None

    bristle_type: Optional[str] = None
    handle_type: Optional[str] = None
    ferrule_type: Optional[str] = None
    color: Optional[str] = None

    purchase_rate: Decimal = 0
    selling_rate: Decimal = 0

    opening_stock: Decimal = 0
    minimum_stock: Decimal = 0
    maximum_stock: Decimal = 0
    reorder_level: Decimal = 0

    weight_per_piece: Optional[Decimal] = None

    barcode: Optional[str] = None
    hsn_code: Optional[str] = None

    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    pass


class ItemResponse(ItemBase):

    item_id: int
    is_active: bool

    class Config:
        from_attributes = True