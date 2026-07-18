from decimal import Decimal
from pydantic import BaseModel


class ItemCategoryResponse(BaseModel):
    category_id: int
    category_code: str
    category_name: str


class UnitResponse(BaseModel):
    unit_id: int
    unit_code: str
    unit_name: str


class TaxResponse(BaseModel):
    tax_id: int
    tax_name: str
    hsn_sac_code: str | None = None
    cgst_percentage: Decimal
    sgst_percentage: Decimal
    igst_percentage: Decimal
    cess_percentage: Decimal