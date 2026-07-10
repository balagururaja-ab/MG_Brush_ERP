from datetime import date
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


# ---------------------------------------------------------
# Purchase Item
# ---------------------------------------------------------

class PurchaseItem(BaseModel):

    item_id: int
    unit_id: int

    quantity: Decimal
    rate: Decimal

    discount_percent: Decimal = 0

    tax_id: Optional[int] = None

    discount_amount: Decimal = 0
    taxable_amount: Decimal = 0

    cgst_amount: Decimal = 0
    sgst_amount: Decimal = 0
    igst_amount: Decimal = 0

    total_amount: Decimal = 0


# ---------------------------------------------------------
# Purchase Header
# ---------------------------------------------------------

class PurchaseCreate(BaseModel):

    supplier_id: int

    purchase_date: date

    invoice_no: str

    invoice_date: Optional[date] = None

    payment_status: str = "PENDING"

    remarks: Optional[str] = None

    items: List[PurchaseItem]


# ---------------------------------------------------------
# Update Purchase
# ---------------------------------------------------------

class PurchaseUpdate(PurchaseCreate):
    pass


# ---------------------------------------------------------
# Response
# ---------------------------------------------------------

class PurchaseResponse(BaseModel):

    purchase_id: int
    purchase_no: str

    supplier_id: int

    purchase_date: date

    invoice_no: str

    grand_total: Decimal

    payment_status: str

    class Config:
        from_attributes = True