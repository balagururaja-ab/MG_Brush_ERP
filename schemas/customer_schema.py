from typing import Optional

from pydantic import BaseModel, EmailStr


# ---------------------------------------------------------
# Create Customer
# ---------------------------------------------------------

class CustomerCreate(BaseModel):

    customer_code: str
    customer_name: str

    contact_person: Optional[str] = None

    gstin: Optional[str] = None
    pan_number: Optional[str] = None

    phone: Optional[str] = None
    mobile: Optional[str] = None

    email: Optional[EmailStr] = None

    address1: Optional[str] = None
    address2: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    country: str = "India"

    credit_limit: float = 0

    credit_days: int = 0

    remarks: Optional[str] = None

    is_active: bool = True


# ---------------------------------------------------------
# Update Customer
# ---------------------------------------------------------

class CustomerUpdate(CustomerCreate):
    pass


# ---------------------------------------------------------
# Response
# ---------------------------------------------------------

class CustomerResponse(CustomerCreate):

    customer_id: int

    class Config:

        from_attributes = True