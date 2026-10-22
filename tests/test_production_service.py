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

    service.stock_service.validate_stock.assert_not_called()
    service.stock_service.production_stock.assert_called_once_with(
        production_id=10,
        production_no="PROD-2026-000001",
        rm_items=[],
        fg_items=fg_items,
        consume_rm=False,
    )

    service.repo.commit.assert_called_once()


def test_create_production_defaults_to_completed_and_posts_finished_stock():
    service = ProductionService()

    service.repo = Mock()
    service.stock_service = Mock()
    service.repo.get_item.return_value = {
        "item_id": 2,
        "is_active": True,
        "item_name": "Selvi 2.5 inch",
        "category_id": 23,
    }
    service.repo.generate_next_production_no.return_value = "PROD-2026-000002"
    service.repo.create_production.return_value = 11

    production_id = service.create_production(
        {"remarks": "Production run"},
        [],
        [{"item_id": 2, "quantity": 12}],
    )

    assert production_id == 11
    service.repo.create_production.assert_called_once()
    assert service.repo.create_production.call_args.args[0]["status"] == "COMPLETED"
    service.stock_service.production_stock.assert_called_once_with(
        production_id=11,
        production_no="PROD-2026-000002",
        rm_items=[],
        fg_items=[{"item_id": 2, "quantity": 12.0}],
        consume_rm=False,
    )


def test_update_production_rejects_records_that_already_posted_stock():
    service = ProductionService()
    service.repo = Mock()
    service.stock_service = Mock()
    service.repo.get_production_by_id.return_value = {
        "production_id": 10,
        "production_no": "PROD-2026-000010",
        "status": "COMPLETED",
    }
    service.stock_service.repo.has_production_posting.return_value = True

    try:
        service.update_production(
            10,
            {"status": "COMPLETED"},
            [],
            [{"item_id": 2, "quantity": 12}],
        )
    except ValueError as error:
        assert "already affected stock" in str(error)
    else:
        raise AssertionError("Posted production records must not be edited.")

    service.repo.update_production.assert_not_called()
