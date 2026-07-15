from fastapi import APIRouter, HTTPException

from schemas.customer_schema import (
    CustomerCreate,
    CustomerUpdate
)

from services.customer_service import CustomerService


router = APIRouter()

service = CustomerService()


# ---------------------------------------------------------
# Get All Customers
# ---------------------------------------------------------

@router.get("")
def get_all():

    return service.get_all()


# ---------------------------------------------------------
# Get Customer By Id
# ---------------------------------------------------------

@router.get("/{customer_id}")
def get_customer(customer_id: int):

    try:

        return service.get_by_id(customer_id)

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Create Customer
# ---------------------------------------------------------

@router.post("")
def create_customer(request: CustomerCreate):

    try:

        customer_id = service.create(
            request.model_dump()
        )

        return {

            "message":
            "Customer created successfully.",

            "customer_id":
            customer_id

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=409,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Update Customer
# ---------------------------------------------------------

@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    request: CustomerUpdate
):

    try:

        service.update(
            customer_id,
            request.model_dump()
        )

        return {

            "message":
            "Customer updated successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Delete Customer
# ---------------------------------------------------------

@router.delete("/{customer_id}")
def delete_customer(customer_id: int):

    try:

        service.delete(customer_id)

        return {

            "message":
            "Customer deleted successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )