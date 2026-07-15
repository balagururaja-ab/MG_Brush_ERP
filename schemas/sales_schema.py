from datetime import date
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


# ---------------------------------------------------------
# Sales Item
# ---------------------------------------------------------

class SalesItem(BaseModel):

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
# Sales Header
# ---------------------------------------------------------

class SalesCreate(BaseModel):

    customer_id: int

    sales_date: date

    invoice_no: str

    invoice_date: Optional[date] = None

    payment_status: str = "PENDING"

    remarks: Optional[str] = None

    items: List[SalesItem]


# ---------------------------------------------------------
# Update Sales
# ---------------------------------------------------------

class SalesUpdate(SalesCreate):
    pass


# ---------------------------------------------------------
# Response
# ---------------------------------------------------------

class SalesResponse(BaseModel):

    sales_id: int

    sales_no: str

    customer_id: int

    sales_date: date

    invoice_no: str

    grand_total: Decimal

    payment_status: str

    class Config:
        from_attributes = True