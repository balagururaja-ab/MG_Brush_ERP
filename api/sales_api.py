from fastapi import APIRouter, HTTPException

from schemas.sales_schema import (
    SalesCreate,
    SalesUpdate,
    SalesInvoiceGenerate,
    SalesPayment
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
# Customer Pending Summary
# ---------------------------------------------------------

@router.get("/pending-summary")
def get_pending_summary():
    return service.repo.get_customer_pending_summary()


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
    sales["payments"] = service.repo.get_sales_payment_history(sales_id)
    return sales


# ---------------------------------------------------------
# Get Sales By Order Id
# ---------------------------------------------------------

@router.get("/by-order/{order_id}")
def get_sales_by_order(order_id: int):
    sales = service.repo.get_sales_by_order_id(order_id)
    if sales is None:
        raise HTTPException(
            status_code=404,
            detail="Sales entry not found for this order."
        )

    return {
        "order_id": order_id,
        "sales_id": sales["sales_id"]
    }


# ---------------------------------------------------------
# Create Sales
# ---------------------------------------------------------

@router.post("")
def create_sales(request: SalesCreate):
    raise HTTPException(
        status_code=400,
        detail="Manual sales creation is disabled. Create sales only from an existing order using /sales/from-order/{order_id}."
    )


# ---------------------------------------------------------
# Create Sales From Order
# ---------------------------------------------------------

@router.post("/from-order/{order_id}")
def create_sales_from_order(order_id: int):
    try:
        sales_id = service.create_sales_from_order(
            order_id
        )

        return {
            "message": "Sales created successfully from order.",
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
# Generate Invoice
# ---------------------------------------------------------

@router.post("/{sales_id}/invoice")
def generate_invoice(sales_id: int, request: SalesInvoiceGenerate):
    try:
        invoice_no = service.generate_invoice(
            sales_id,
            request.model_dump()
        )

        return {
            "message": "Invoice generated successfully.",
            "invoice_no": invoice_no
        }

    except ValueError as ex:
        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Record Payment
# ---------------------------------------------------------

@router.post("/{sales_id}/payment")
def record_payment(sales_id: int, request: SalesPayment):
    try:
        payment_data = service.record_payment(
            sales_id,
            request.model_dump()
        )

        return {
            "message": "Payment recorded successfully.",
            "payment_summary": payment_data
        }

    except ValueError as ex:
        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Get Payment Receipt
# ---------------------------------------------------------

@router.get("/{sales_id}/payment/{payment_id}")
def get_payment_receipt(sales_id: int, payment_id: int):
    try:
        return service.get_sales_payment_receipt(sales_id, payment_id)

    except ValueError as ex:
        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


# ---------------------------------------------------------
# Customer Outstanding Balance
# ---------------------------------------------------------

@router.get("/customer/{customer_id}/outstanding")
def get_customer_outstanding_balance(customer_id: int):
    balance = service.repo.get_customer_outstanding_balance(customer_id)
    return {
        "customer_id": customer_id,
        "outstanding_balance": round(balance, 2)
    }

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