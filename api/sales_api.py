from fastapi import APIRouter, HTTPException

from schemas.sales_schema import (
    SalesCreate,
    SalesUpdate
)

from services.sales_service import SalesService

router = APIRouter()

service = SalesService()


# ---------------------------------------------------------
# Get All Sales
# ---------------------------------------------------------

@router.get("")
def get_all():

    return service.repo.list_sales()


# ---------------------------------------------------------
# Get Sales By Id
# ---------------------------------------------------------

@router.get("/{sales_id}")
def get_sales(sales_id: int):

    sales = service.repo.get_sales_by_id(sales_id)

    if sales is None:

        raise HTTPException(
            status_code=404,
            detail="Sales entry not found."
        )

    items = service.repo.get_sales_items(sales_id)

    sales["items"] = items

    return sales


# ---------------------------------------------------------
# Create Sales
# ---------------------------------------------------------

@router.post("")
def create_sales(request: SalesCreate):

    try:

        sales_header = request.model_dump()

        items = sales_header.pop("items")

        sales_id = service.create_sales(
            sales_header,
            items
        )

        return {

            "message": "Sales created successfully.",

            "sales_id": sales_id

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Update Sales
# ---------------------------------------------------------

@router.put("/{sales_id}")
def update_sales(sales_id: int, request: SalesUpdate):

    try:

        sales_header = request.model_dump()

        items = sales_header.pop("items")

        service.update_sales(
            sales_id,
            sales_header,
            items
        )

        return {

            "message": "Sales updated successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Delete Sales
# ---------------------------------------------------------

@router.delete("/{sales_id}")
def delete_sales(sales_id: int):

    try:

        service.delete_sales(sales_id)

        return {

            "message": "Sales deleted successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )