from typing import Optional
from pydantic import BaseModel


class SupplierBase(BaseModel):

    supplier_name: str
    contact_person: Optional[str] = None

    mobile: Optional[str] = None
    email: Optional[str] = None

    gst_number: Optional[str] = None

    address: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(SupplierBase):
    pass


class SupplierResponse(SupplierBase):

    supplier_id: int
    is_active: bool

    class Config:
        from_attributes = True