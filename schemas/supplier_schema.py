from typing import Optional

from pydantic import BaseModel


class SupplierBase(BaseModel):

    supplier_code: str
    supplier_name: str

    contact_person: Optional[str] = None

    gstin: Optional[str] = None
    pan_number: Optional[str] = None

    phone: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None

    address1: Optional[str] = None
    address2: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = "India"

    payment_terms: Optional[str] = None
    credit_days: int = 0

    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None

    remarks: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(SupplierBase):
    pass


class SupplierResponse(SupplierBase):

    supplier_id: int
    is_active: bool

    class Config:
        from_attributes = True