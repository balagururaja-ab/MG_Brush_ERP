"""
Test Purchase Repository
"""

from datetime import datetime

from database.purchase_repository import PurchaseRepository

repo = PurchaseRepository()


def get_supplier_id():

    supplier = repo.fetch_one(
        "SELECT supplier_id FROM mgbrush.suppliers WHERE supplier_code=%s",
        ("SUP001",)
    )

    if supplier is None:
        raise Exception("Supplier SUP001 not found.")

    return supplier["supplier_id"]


def get_user_id():

    user = repo.fetch_one(
        "SELECT user_id FROM mgbrush.users WHERE username=%s",
        ("admin",)
    )

    if user is None:
        raise Exception("Admin user not found.")

    return user["user_id"]


def get_item():

    item = repo.fetch_one(
        """
        SELECT item_id
        FROM mgbrush.items
        WHERE is_active = TRUE
        ORDER BY item_id
        LIMIT 1
        """
    )

    if item is None:
        raise Exception("No Item found.")

    return repo.get_item(item["item_id"])

def get_tax_id(item):

    tax = repo.get_tax(item["tax_id"])

    if tax is None:
        raise Exception("Tax not found.")

    return tax["tax_id"]


def main():

    supplier_id = get_supplier_id()
    user_id = get_user_id()
    item = get_item()
    tax_id = get_tax_id(item)

    purchase = {

        "supplier_id": supplier_id,

        "invoice_no": "INV1001",

        "invoice_date": "2026-07-03",

        "purchase_date": "2026-07-03",

        "subtotal": 1000,

        "discount_amount": 0,

        "taxable_amount": 1000,

        "cgst_amount": 90,

        "sgst_amount": 90,

        "igst_amount": 0,

        "cess_amount": 0,

        "freight_amount": 50,

        "other_charges": 0,

        "round_off": 0,

        "grand_total": 1230,

        "payment_status": "PENDING",

        "remarks": "Repository Test",

        "created_by": user_id

    }

    print("=" * 60)
    print("CREATE PURCHASE")
    print("=" * 60)

    purchase_id = repo.create_purchase(purchase)

    assert purchase_id > 0, "Purchase creation failed"

    print("Purchase ID :", purchase_id)

    detail = {

        "purchase_id": purchase_id,

        "item_id": item["item_id"],

        "unit_id": item["unit_id"],

        "quantity": 10,

        "rate": 100,

        "discount_percent": 0,

        "discount_amount": 0,

        "taxable_amount": 1000,

        "tax_id": tax_id,

        "cgst_amount": 90,

        "sgst_amount": 90,

        "igst_amount": 0,

        "total_amount": 1180,
        "line_no": 1

    }

    print("=" * 60)
    print("CREATE PURCHASE ITEM")
    print("=" * 60)

    purchase_detail_id = repo.create_purchase_item(detail)

    assert purchase_detail_id > 0, "Purchase detail creation failed"

    print("Purchase Detail :", purchase_detail_id)

    print("=" * 60)
    print("GET PURCHASE")
    print("=" * 60)

    purchase_data = repo.get_purchase_by_id(purchase_id)
    
    assert purchase_data is not None, "Purchase not found"

    print(purchase_data)

    print("=" * 60)
    print("LIST PURCHASES")
    print("=" * 60)

    purchases = repo.list_purchases()

    assert len(purchases) > 0, "Purchase list is empty"

    print(f"Total Purchases : {len(purchases)}")

    print("=" * 60)
    print("GET PURCHASE ITEMS")
    print("=" * 60)

    print(repo.get_purchase_items(purchase_id))

    print("=" * 60)
    print("GET SUPPLIER")
    print("=" * 60)

    supplier = repo.get_supplier(supplier_id)

    print(supplier)

    print("=" * 60)
    print("GET ITEM")
    print("=" * 60)

    item_data = repo.get_item(item["item_id"])

    print(item_data)

    print("=" * 60)
    print("GET TAX")
    print("=" * 60)

    tax = repo.get_tax(tax_id)

    print(tax)

    print("=" * 60)
    print("PURCHASE NUMBER EXISTS")
    print("=" * 60)

    exists = repo.exists_purchase_no(
        purchase["purchase_no"]
    )

    print("Exists :", exists)

    print("=" * 60)
    print("BASE REPOSITORY - FIND BY ID")
    print("=" * 60)

    purchase_row = repo.find_by_id(
        "mgbrush.purchase_header",
        "purchase_id",
        purchase_id
    )

    print(purchase_row)

    print("=" * 60)
    print("BASE REPOSITORY - EXISTS")
    print("=" * 60)

    exists = repo.exists(
        "mgbrush.purchase_header",
        {
            "purchase_id": purchase_id
        }
    )

    print("Exists :", exists)

    print("=" * 60)
    print("BASE REPOSITORY - COUNT")
    print("=" * 60)

    total = repo.count(
        "mgbrush.purchase_header"
    )

    print("Total Purchases :", total)

    print("=" * 60)
    print("BASE REPOSITORY - FIND ALL")
    print("=" * 60)

    purchases = repo.find_all(
        "mgbrush.purchase_header",
        order_by="purchase_id DESC"
    )

    print("Rows :", len(purchases))

    print("=" * 60)
    print("BASE REPOSITORY - UPSERT")
    print("=" * 60)

    supplier_data = {

        "supplier_code": "SUP999",
        "supplier_name": "Unit Test Supplier",
        "mobile": "9999999999",
        "is_active": True

    }

    repo.upsert(
        "mgbrush.suppliers",
        supplier_data,
        ["supplier_code"]
    )

    print("Upsert Completed")

    supplier_data["supplier_name"] = "Unit Test Supplier Updated"

    repo.upsert(
        "mgbrush.suppliers",
        supplier_data,
        ["supplier_code"]
    )

    print("Upsert Update Completed")

    print("=" * 60)
    print("UPDATE PURCHASE")
    print("=" * 60)

    purchase["remarks"] = "Purchase Updated"

    purchase["grand_total"] = 1500

    rows = repo.update_purchase(
        purchase_id,
        purchase
    )

    assert rows == 1, "Purchase update failed"
    
    print("Rows Updated :", rows)

    purchase_data = repo.get_purchase_by_id(purchase_id)
    
    assert purchase_data is not None, "Purchase not found"

    print(purchase_data)

    print("=" * 60)
    print("UPDATE PURCHASE ITEM")
    print("=" * 60)

    detail["purchase_detail_id"] = purchase_detail_id

    detail["quantity"] = 25
    detail["rate"] = 120
    detail["discount_percent"] = 5
    detail["discount_amount"] = 150
    detail["taxable_amount"] = 2850
    detail["tax_id"] = tax_id
    detail["cgst_amount"] = 256.50
    detail["sgst_amount"] = 256.50
    detail["igst_amount"] = 0
    detail["total_amount"] = 3363

    rows = repo.update_purchase_item(detail)

    print("Rows Updated :", rows)

    print(repo.get_purchase_items(purchase_id))

    print("=" * 60)
    print("DELETE PURCHASE ITEM")
    print("=" * 60)

    rows = repo.delete_purchase_item(
        purchase_detail_id
    )

    print("Rows Deleted :", rows)

    print(repo.get_purchase_items(purchase_id))

    print("=" * 60)
    print("DELETE PURCHASE")
    print("=" * 60)

    rows = repo.delete_purchase(
        purchase_id
    )

    print("Rows Deleted :", rows)

    print(repo.get_purchase_by_id(purchase_id))

    print("=" * 60)
    print("ALL PURCHASE REPOSITORY TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":

    main()