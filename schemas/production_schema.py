"""
Production Schemas
"""

from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


# ---------------------------------------------------------
# Raw Material Detail
# ---------------------------------------------------------

class ProductionRMItem(BaseModel):

    item_id: int

    quantity: Decimal

    remarks: Optional[str] = None


# ---------------------------------------------------------
# Finished Goods Detail
# ---------------------------------------------------------

class ProductionFGItem(BaseModel):

    brand_id: int

    brush_size_id: int

    quantity: Decimal

    remarks: Optional[str] = None


# ---------------------------------------------------------
# Production Header
# ---------------------------------------------------------

class ProductionHeader(BaseModel):

    production_date: date

    remarks: Optional[str] = None

    status: Optional[str] = "DRAFT"


# ---------------------------------------------------------
# Create Production
# ---------------------------------------------------------

class ProductionCreate(BaseModel):

    production: ProductionHeader

    raw_materials: list[ProductionRMItem]

    finished_goods: list[ProductionFGItem]


# ---------------------------------------------------------
# Update Production
# ---------------------------------------------------------

class ProductionUpdate(ProductionCreate):

    pass


# ---------------------------------------------------------
# Production Response
# ---------------------------------------------------------

class ProductionResponse(BaseModel):

    production_id: int

    production_no: str