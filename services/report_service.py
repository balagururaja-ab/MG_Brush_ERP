from __future__ import annotations

from database.report_repository import ReportRepository
from database.sales_repository import SalesRepository
from database.stock_repository import StockRepository


class ReportService:

    def __init__(self):
        self.repo = ReportRepository()
        self.sales_repo = SalesRepository()
        self.stock_repo = StockRepository()

    def get_customer_sales_history(
        self,
        customer_id: int | None = None,
        from_date: str | None = None,
        to_date: str | None = None
    ) -> list[dict]:

        return self.repo.get_customer_sales_history(
            customer_id=customer_id,
            from_date=from_date,
            to_date=to_date
        )

    def get_supplier_purchase_history(
        self,
        supplier_id: int | None = None,
        from_date: str | None = None,
        to_date: str | None = None
    ) -> list[dict]:

        return self.repo.get_supplier_purchase_history(
            supplier_id=supplier_id,
            from_date=from_date,
            to_date=to_date
        )

    def get_overview(self) -> dict:

        return self.repo.get_report_overview()

    def get_mandatory(self) -> dict:

        return {
            "pending_customers": self.sales_repo.get_customer_pending_summary(),
            "low_stock": self.stock_repo.get_low_stock()
        }
