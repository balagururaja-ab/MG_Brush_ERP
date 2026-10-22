from unittest.mock import Mock

from services.order_service import OrderService


def test_update_order_filters_out_non_header_fields_before_persisting():
    service = OrderService()
    service.repo = Mock()

    service.repo.get_customer.return_value = {"customer_id": 3}
    service.repo.get_brand.return_value = {"brand_id": 10}
    service.repo.get_brush_size.return_value = {"brush_size_id": 20}
    service.repo.get_items_for_brand_and_size.return_value = [
        {
            "item_id": 55,
            "selling_rate": 50,
            "brand_id": 10,
            "brush_size_id": 20,
        }
    ]
    service.repo.get_order_by_id.return_value = {"order_id": 6}
    service.repo.get_order_items.return_value = []

    payload = {
        "customer_id": 3,
        "customer_name": "Acme",
        "order_date": "2026-07-30",
        "status": "DRAFT",
        "remarks": "Updated"
    }
    items = [
        {
            "brand_id": 10,
            "brush_size_id": 20,
            "quantity": 2,
            "rate": 50,
        }
    ]

    service.update_order(6, payload, items)

    service.repo.update_order.assert_called_once()
    _, order_header = service.repo.update_order.call_args.args
    assert order_header == {
        "customer_id": 3,
        "order_date": "2026-07-30",
        "status": "DRAFT",
        "remarks": "Updated"
    }


def test_confirm_order_transitions_draft_order_to_confirmed():
    service = OrderService()
    service.repo = Mock()
    service.repo.get_order_by_id.return_value = {
        "order_id": 6,
        "status": "DRAFT",
    }

    service.confirm_order(6)

    service.repo.update_order.assert_called_once_with(
        6,
        {"status": "CONFIRMED"},
    )
    service.repo.commit.assert_called_once()


def test_confirm_order_rejects_cancelled_order():
    service = OrderService()
    service.repo = Mock()
    service.repo.get_order_by_id.return_value = {
        "order_id": 6,
        "status": "CANCELLED",
    }

    try:
        service.confirm_order(6)
    except ValueError as error:
        assert "Only draft orders can be confirmed" in str(error)
    else:
        raise AssertionError("Cancelled orders must not be confirmed.")

    service.repo.update_order.assert_not_called()
