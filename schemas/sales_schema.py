from datetime import date
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


# ---------------------------------------------------------
# Sales Item
# ---------------------------------------------------------

class SalesItem(BaseModel):

    item_id: int

    quantity: Decimal

    rate: Decimal

    discount_percent: Decimal = 0

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

    invoice_no: Optional[str] = None

    invoice_date: Optional[date] = None

    gross_amount: Decimal = 0

    discount_amount: Decimal = 0

    taxable_amount: Decimal = 0

    cgst_amount: Decimal = 0

    sgst_amount: Decimal = 0

    igst_amount: Decimal = 0

    grand_total: Decimal = 0

    payment_status: str = "PENDING"

    paid_amount: Decimal = 0

    pending_amount: Decimal = 0

    invoice_generated: bool = False

    is_gst: bool = False

    gst_percent: Decimal = 0

    remarks: Optional[str] = None

    items: List[SalesItem]


# ---------------------------------------------------------
# Update Sales
# ---------------------------------------------------------

class SalesUpdate(SalesCreate):
    pass


# ---------------------------------------------------------
# Invoice Generation
# ---------------------------------------------------------

class SalesInvoiceGenerate(BaseModel):

    invoice_date: Optional[date] = None

    is_gst: bool = False

    gst_percent: Decimal = 0


# ---------------------------------------------------------
# Payment
# ---------------------------------------------------------

class SalesPayment(BaseModel):

    payment_date: date

    amount: Decimal

    payment_mode: Optional[str] = None

    reference_no: Optional[str] = None

    remarks: Optional[str] = None


# ---------------------------------------------------------
# Response
# ---------------------------------------------------------

class SalesResponse(BaseModel):

    sales_id: int

    sales_no: Optional[str] = None

    customer_id: int

    customer_name: Optional[str] = None

    sales_date: date

    invoice_no: Optional[str] = None

    invoice_date: Optional[date] = None

    invoice_generated: bool = False

    is_gst: bool = False

    gst_percent: Decimal = 0

    gross_amount: Decimal = 0

    discount_amount: Decimal = 0

    taxable_amount: Decimal = 0

    cgst_amount: Decimal = 0

    sgst_amount: Decimal = 0

    igst_amount: Decimal = 0

    grand_total: Decimal = 0

    payment_status: str

    paid_amount: Decimal = 0

    pending_amount: Decimal = 0

    remarks: Optional[str] = None

    items: Optional[List[SalesItem]] = None

    class Config:
        from_attributes = True