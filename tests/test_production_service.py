from unittest.mock import Mock

from services.production_service import ProductionService


def test_create_production_consumes_rm_and_adds_fg_stock():
    service = ProductionService()

    service.repo = Mock()
    service.stock_service = Mock()

    service.repo.get_item.side_effect = [
        {
            "item_id": 1,
            "is_active": True,
            "item_name": "Bristles",
            "category_id": 1,
        },
        {
            "item_id": 2,
            "is_active": True,
            "item_name": "Selvi 1 inch",
            "category_id": 23,
        },
    ]
    service.repo.generate_next_production_no.return_value = "PROD-2026-000001"
    service.repo.create_production.return_value = 10

    production = {
        "status": "COMPLETED",
        "remarks": "Batch test",
    }
    rm_items = [
        {
            "item_id": 1,
            "quantity": 20,
        }
    ]
    fg_items = [
        {
            "item_id": 2,
            "quantity": 10,
        }
    ]

    production_id = service.create_production(production, rm_items, fg_items)

    assert production_id == 10

    service.stock_service.validate_stock.assert_called_once_with(1, 20.0)
    service.stock_service.production_stock.assert_called_once_with(
        production_id=10,
        production_no="PROD-2026-000001",
        rm_items=rm_items,
        fg_items=fg_items,
    )

    service.repo.commit.assert_called_once()
