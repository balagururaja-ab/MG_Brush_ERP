from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class PurchaseCreate(BaseModel):

    supplier_id: int

    purchase_date: date

    invoice_number: str

    total_amount: Decimal


class PurchaseResponse(PurchaseCreate):

    purchase_id: int

    class Config:
        from_attributes = True