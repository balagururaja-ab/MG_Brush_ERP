"""
Stock API
"""

from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

from services.stock_service import StockService

router = APIRouter()

service = StockService()


class OpeningStockRequest(BaseModel):

    item_id: int

    quantity: float

    rate: float

# ---------------------------------------------------------
# Stock Summary
# ---------------------------------------------------------

@router.get("/summary")
def get_stock_summary():

    return service.get_stock_summary()


# ---------------------------------------------------------
# Complete Stock Ledger
# ---------------------------------------------------------

@router.get("/ledger")
def get_stock_ledger():

    return service.get_stock_ledger()


# ---------------------------------------------------------
# Item Ledger
# ---------------------------------------------------------

@router.get("/items/{item_id}")
def get_item_stock_ledger(
    item_id: int
):

    return service.get_item_stock_ledger(
        item_id
    )


# ---------------------------------------------------------
# Current Stock
# ---------------------------------------------------------

@router.get("/balance/{item_id}")
def get_current_stock(
    item_id: int
):

    stock = service.get_current_stock(
        item_id
    )

    if stock is None:

        raise HTTPException(
            status_code=404,
            detail="Item not found."
        )

    return stock

@router.get("/low-stock")
def get_low_stock():

    return service.get_low_stock()

# ---------------------------------------------------------
# Opening Stock
# ---------------------------------------------------------

@router.post("/opening")
def opening_stock(
    request: OpeningStockRequest
):

    service.opening_stock(

        item_id=request.item_id,

        quantity=request.quantity,

        rate=request.rate

    )

    return {

        "message": "Opening stock saved successfully."

    }


