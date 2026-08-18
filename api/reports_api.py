from __future__ import annotations

from fastapi import APIRouter

from services.report_service import ReportService


router = APIRouter()
service = ReportService()


@router.get("/overview")
def get_overview():
    return service.get_overview()


@router.get("/customer-sales")
def get_customer_sales_history(
    customer_id: int | None = None,
    from_date: str | None = None,
    to_date: str | None = None
):
    return service.get_customer_sales_history(
        customer_id=customer_id,
        from_date=from_date,
        to_date=to_date
    )


@router.get("/supplier-purchases")
def get_supplier_purchase_history(
    supplier_id: int | None = None,
    from_date: str | None = None,
    to_date: str | None = None
):
    return service.get_supplier_purchase_history(
        supplier_id=supplier_id,
        from_date=from_date,
        to_date=to_date
    )


@router.get("/mandatory")
def get_mandatory_reports():
    return service.get_mandatory()
