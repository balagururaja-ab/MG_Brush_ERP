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
    service.repo.get_item_for_order_item.return_value = matched_item
    service.create_sales = Mock(return_value=12)
    service.generate_invoice = Mock(return_value="INV-2026-000012")

    sales_id = service.create_sales_from_order(7, {"is_gst": True, "gst_percent": 18})

    assert sales_id == 12
    service.create_sales.assert_called_once()
    sales_header, sales_items = service.create_sales.call_args.args
    assert sales_header["customer_id"] == 3
    assert sales_items[0]["item_id"] == 55
    assert sales_items[0]["quantity"] == 5.0
    assert sales_items[0]["rate"] == 100.0
    service.generate_invoice.assert_called_once_with(12, {"is_gst": True, "gst_percent": 18})
    service.order_repo.update_order.assert_called_once_with(7, {"status": "INVOICED"})
