"""
Test Purchase Service
"""

from database.purchase_repository import PurchaseRepository
from services.purchase_service import PurchaseService

service = PurchaseService()
repo = PurchaseRepository()


def get_supplier_id():

    supplier = repo.fetch_one(
        """
        SELECT supplier_id
        FROM mgbrush.suppliers
        ORDER BY supplier_id
        LIMIT 1
        """
    )

    return supplier["supplier_id"]


def get_user_id():

    user = repo.fetch_one(
        """
        SELECT user_id
        FROM mgbrush.users
        WHERE username='admin'
        """
    )

    return user["user_id"]


def get_item():

    item = repo.fetch_one(
        """
        SELECT *
        FROM mgbrush.items
        WHERE is_active=TRUE
        ORDER BY item_id
        LIMIT 1
        """
    )

    return item


def main():

    supplier_id = get_supplier_id()
    user_id = get_user_id()
    item = get_item()

    purchase = {

        "supplier_id": supplier_id,

        "invoice_no": "INV2001",

        "invoice_date": "2026-07-05",

        "payment_status": "PENDING",

        "remarks": "Purchase Service Test",

        "created_by": user_id

    }

    items = [

        {

            "item_id": item["item_id"],

            "unit_id": item["unit_id"],

            "tax_id": item["tax_id"],

            "quantity": 10,

            "rate": 100,

            "discount_percent": 5

        },

        {

            "item_id": item["item_id"],

            "unit_id": item["unit_id"],

            "tax_id": item["tax_id"],

            "quantity": 5,

            "rate": 200,

            "discount_percent": 0

        }

    ]

    print("=" * 60)
    print("GENERATE PURCHASE NUMBER")
    print("=" * 60)

    purchase_no = service.generate_purchase_no()

    print(purchase_no)

    assert purchase_no.startswith("PUR")

    print("=" * 60)
    print("VALIDATE SUPPLIER")
    print("=" * 60)

    service.validate_supplier(supplier_id)

    print("✓ Supplier Valid")

    print("=" * 60)
    print("VALIDATE ITEMS")
    print("=" * 60)

    service.validate_items(items)

    print("✓ Items Valid")

    print("=" * 60)
    print("CALCULATE TOTALS")
    print("=" * 60)

    totals = service.calculate_totals(items)

    print(totals)

    assert totals["grand_total"] > 0

    print("=" * 60)
    print("CREATE PURCHASE")
    print("=" * 60)

    purchase_id = service.create_purchase(
        purchase,
        items
    )

    print("Purchase ID :", purchase_id)

    purchase_row = repo.get_purchase_by_id(
        purchase_id
    )

    assert purchase_row is not None

    purchase_items = repo.get_purchase_items(
        purchase_id
    )

    assert len(purchase_items) == 2

    print("=" * 60)
    print("VERIFY LINE NUMBERS")
    print("=" * 60)

    for row in purchase_items:

        print(
            row["line_no"],
            row["item_name"]
        )

    assert purchase_items[0]["line_no"] == 1
    assert purchase_items[1]["line_no"] == 2

    print("=" * 60)
    print("ROLLBACK TEST")
    print("=" * 60)

    bad_items = [

        {

            "item_id": item["item_id"],

            "unit_id": item["unit_id"],

            "tax_id": item["tax_id"],

            "quantity": -5,

            "rate": 100,

            "discount_percent": 0

        }

    ]

    try:

        service.create_purchase(
            purchase.copy(),
            bad_items
        )

    except ValueError:

        print("✓ Rollback Validation Passed")

    print("=" * 60)
    print("DELETE TEST PURCHASE")
    print("=" * 60)

    repo.delete_purchase(
        purchase_id
    )

    print("Deleted")

    print("=" * 60)
    print("ALL PURCHASE SERVICE TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":

    main()