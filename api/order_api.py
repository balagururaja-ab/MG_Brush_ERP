"""
Order API
"""

from fastapi import APIRouter, HTTPException

from services.order_service import OrderService

router = APIRouter()

service = OrderService()


# ---------------------------------------------------------
# List Orders
# ---------------------------------------------------------

@router.get("/")
def list_orders():

    return service.list_orders()


# ---------------------------------------------------------
# Get Order
# ---------------------------------------------------------

@router.get("/{order_id}")
def get_order(
    order_id: int
):

    try:

        return service.get_order(
            order_id
        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ---------------------------------------------------------
# Create Order
# ---------------------------------------------------------

@router.post("/")
def create_order(
    payload: dict
):

    try:

        return {

            "order_id": service.create_order(

                payload["order"],

                payload["items"]

            )

        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


# ---------------------------------------------------------
# Update Order
# ---------------------------------------------------------

@router.put("/{order_id}")
def update_order(

    order_id: int,

    payload: dict

):

    try:

        service.update_order(

            order_id,

            payload["order"],

            payload["items"]

        )

        return {

            "message": "Order updated successfully."

        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


# ---------------------------------------------------------
# Delete Order
# ---------------------------------------------------------

@router.delete("/{order_id}")
def delete_order(
    order_id: int
):

    try:

        service.delete_order(
            order_id
        )

        return {

            "message": "Order deleted successfully."

        }

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )