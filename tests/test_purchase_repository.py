from database.purchase_repository import PurchaseRepository

repo = PurchaseRepository()


def get_supplier_id():
    supplier = repo.fetch_one(
        "SELECT supplier_id FROM suppliers WHERE supplier_code=%s",
        ("SUP001",)
    )
    return supplier["supplier_id"]


def get_user_id():
    user = repo.fetch_one(
        "SELECT user_id FROM users WHERE username=%s",
        ("admin",)
    )
    return user["user_id"]


def get_item():
    item = repo.fetch_one("""
        SELECT item_id, unit_id
        FROM items
        LIMIT 1
    """)
    return item

supplier_id = get_supplier_id()
user_id = get_user_id()

purchase = {

    "purchase_no": "PUR000001",

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

purchase_id = repo.create_purchase(purchase)

print(f"Purchase Created : {purchase_id}")

item = get_item()

detail = {

    "purchase_id": purchase_id,

    "line_no": 1,

    "item_id": item["item_id"],

    "unit_id": item["unit_id"],

    "quantity": 10,

    "rate": 100,

    "discount_percent": 0,

    "discount_amount": 0,

    "taxable_amount": 1000,

    "cgst_percent": 9,

    "cgst_amount": 90,

    "sgst_percent": 9,

    "sgst_amount": 90,

    "igst_percent": 0,

    "igst_amount": 0,

    "total_amount": 1180

}

detail_id = repo.create_purchase_item(detail)

print(f"Detail Created : {detail_id}")

items = repo.get_purchase_items(purchase_id)

print(items)