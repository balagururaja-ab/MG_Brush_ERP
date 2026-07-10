from fastapi import APIRouter, HTTPException

from schemas.purchase_schema import (
    PurchaseCreate,
    PurchaseUpdate
)

from services.purchase_service import PurchaseService


router = APIRouter()

service = PurchaseService()


# ---------------------------------------------------------
# Get All Purchases
# ---------------------------------------------------------

@router.get("")
def get_all():

    return service.list_purchases()


# ---------------------------------------------------------
# Get Purchase By Id
# ---------------------------------------------------------

@router.get("/{purchase_id}")
def get_purchase(purchase_id: int):

    purchase = service.get_purchase(purchase_id)

    if purchase is None:

        raise HTTPException(
            status_code=404,
            detail="Purchase not found."
        )

    items = service.get_purchase_items(
        purchase_id
    )

    purchase["items"] = items

    return purchase


# ---------------------------------------------------------
# Create Purchase
# ---------------------------------------------------------

@router.post("")
def create_purchase(
    request: PurchaseCreate
):

    try:

        purchase = request.model_dump()

        items = purchase.pop("items")

        purchase_id = service.create_purchase(
            purchase,
            items
        )

        return {

            "message":
            "Purchase created successfully.",

            "purchase_id":
            purchase_id

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Update Purchase
# ---------------------------------------------------------

@router.put("/{purchase_id}")
def update_purchase(
    purchase_id: int,
    request: PurchaseUpdate
):

    try:

        purchase = request.model_dump()

        items = purchase.pop("items")

        service.update_purchase(
            purchase_id,
            purchase,
            items
        )

        return {

            "message":
            "Purchase updated successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Delete Purchase
# ---------------------------------------------------------

@router.delete("/{purchase_id}")
def delete_purchase(
    purchase_id: int
):

    try:

        service.delete_purchase(
            purchase_id
        )

        return {

            "message":
            "Purchase deleted successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )