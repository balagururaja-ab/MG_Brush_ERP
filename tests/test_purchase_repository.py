from database.purchase_repository import PurchaseRepository

repo = PurchaseRepository()

purchase = {

    "purchase_no": "PUR-2026-000001",

    "supplier_id": 1,

    "invoice_no": "INV1001",

    "invoice_date": "2026-07-02",

    "purchase_date": "2026-07-02",

    "subtotal": 5000,

    "discount_amount": 0,

    "taxable_amount": 5000,

    "cgst_amount": 450,

    "sgst_amount": 450,

    "igst_amount": 0,

    "cess_amount": 0,

    "freight_amount": 100,

    "other_charges": 0,

    "round_off": 0,

    "grand_total": 6000,

    "payment_status": "PENDING",

    "remarks": "First Purchase",

    "created_by": 1

}

purchase_id = repo.create_purchase(purchase)

print(purchase_id)