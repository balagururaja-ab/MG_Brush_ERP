from unittest.mock import Mock

from services.sales_service import SalesService


def test_create_sales_from_order_maps_order_items_and_marks_order_invoiced():
    service = SalesService()

    service.order_repo = Mock()
    service.repo = Mock()
    service.stock_service = Mock()

    order = {
        "order_id": 7,
        "order_no": "ORD-2026-000007",
        "customer_id": 3,
        "order_date": "2026-07-29",
        "status": "CONFIRMED"
    }
    order_items = [
        {
            "item_id": 55,
            "brand_id": 10,
            "brand_name": "Selvi",
            "brush_size_id": 20,
            "quantity": 5,
            "rate": 100
        }
    ]
    matched_item = {"item_id": 55}

    service.order_repo.get_order_by_id.return_value = order
    service.order_repo.get_order_items.return_value = order_items
    service.repo.get_item.return_value = matched_item
    service.create_sales = Mock(return_value=12)
    sales_id = service.create_sales_from_order(7)

    assert sales_id == 12
    service.create_sales.assert_called_once()
    sales_header, sales_items = service.create_sales.call_args.args
    assert sales_header["order_id"] == 7
    assert sales_header["customer_id"] == 3
    assert sales_items[0]["item_id"] == 55
    assert sales_items[0]["quantity"] == 5.0
    assert sales_items[0]["rate"] == 100.0
    service.order_repo.update_order.assert_called_once_with(7, {"status": "INVOICED"})


def test_record_payment_saves_history_and_updates_header():
    service = SalesService()
    service.repo = Mock()

    service.repo.get_sales_by_id.return_value = {
        "sales_id": 15,
        "grand_total": 5000,
        "paid_amount": 2000,
        "pending_amount": 3000,
    }
    service.repo.apply_payment.return_value = {
        "payment_id": 9,
        "receipt_no": "RCPT-2026-000009"
    }

    result = service.record_payment(
        15,
        {
            "payment_date": "2026-07-30",
            "amount": 1000,
            "payment_mode": "CASH",
            "reference_no": "REC-1",
            "remarks": "Balance payment"
        }
    )

    service.repo.apply_payment.assert_called_once()
    assert result["paid_amount"] == 3000.0
    assert result["pending_amount"] == 2000.0
    assert result["payment_status"] == "PARTIAL"
    assert result["payment_id"] == 9
    assert result["receipt_no"] == "RCPT-2026-000009"


def test_generate_invoice_allows_partial_payment():
    service = SalesService()
    service.repo = Mock()

    service.repo.get_sales_by_id.return_value = {
        "sales_id": 15,
        "pending_amount": 100,
        "invoice_no": None,
    }
    service.repo.generate_invoice_number.return_value = "INV-2026-000015"

    invoice_no = service.generate_invoice(
        15,
        {"is_gst": False, "gst_percent": 0}
    )

    assert invoice_no == "INV-2026-000015"
    service.repo.update_sales_payment.assert_called_once()


def test_update_sales_backfills_unit_id_from_item_master():
    service = SalesService()
    service.repo = Mock()
    service.stock_service = Mock()

    service.repo.get_customer.return_value = {"customer_id": 3}
    service.repo.get_sales_by_id.return_value = {
        "sales_id": 15,
        "paid_amount": 0,
        "invoice_generated": False,
        "is_gst": False,
        "gst_percent": 0,
        "invoice_no": None,
    }
    service.repo.get_item.return_value = {
        "item_id": 55,
        "unit_id": 1,
        "tax_id": None,
    }

    sales_header = {
        "customer_id": 3,
        "sales_date": "2026-07-30",
        "payment_status": "PENDING",
        "paid_amount": 0,
        "pending_amount": 0,
        "remarks": "test"
    }
    items = [
        {
            "item_id": 55,
            "unit_id": None,
            "quantity": 10,
            "rate": 160,
            "discount_percent": 5,
            "discount_amount": 0,
            "cgst_amount": 0,
            "sgst_amount": 0,
            "igst_amount": 0,
            "taxable_amount": 0,
            "total_amount": 0
        }
    ]

    service.update_sales(15, sales_header, items)

    created_item = service.repo.create_sales_item.call_args.args[0]
    assert created_item["unit_id"] == 1
