"""
Database Constants
"""

from config import DB


class Schema:
    NAME = DB.schema


class Tables:

    PURCHASE_HEADER = f"{Schema.NAME}.purchase_header"
    PURCHASE_DETAIL = f"{Schema.NAME}.purchase_details"

    SUPPLIERS = f"{Schema.NAME}.suppliers"
    CUSTOMERS = f"{Schema.NAME}.customers"

    ITEMS = f"{Schema.NAME}.items"
    ITEM_CATEGORY = f"{Schema.NAME}.item_category"

    UNIT_MASTER = f"{Schema.NAME}.unit_master"
    TAX_MASTER = f"{Schema.NAME}.tax_master"

    USERS = f"{Schema.NAME}.users"
    ROLES = f"{Schema.NAME}.roles"

    COMPANY = f"{Schema.NAME}.company"

class StockTransactionType:
    PURCHASE = "PURCHASE"
    SALES = "SALES"
    PRODUCTION = "PRODUCTION"
    ADJUSTMENT = "ADJUSTMENT"
    OPENING = "OPENING"


class StockMovement:
    IN = "IN"
    OUT = "OUT"

class Tables:

    USERS = "mgbrush.users"

    SUPPLIERS = "mgbrush.suppliers"

    PURCHASE_HEADER = "mgbrush.purchase_header"

    PURCHASE_DETAIL = "mgbrush.purchase_details"

    ITEMS = "mgbrush.items"

    TAX_MASTER = "mgbrush.tax_master"

    UNIT_MASTER = "mgbrush.unit_master"

    STOCK_TRANSACTIONS = "mgbrush.stock_transactions"

    SALES_HEADER = "mgbrush.sales_header"

    SALES_DETAILS = "mgbrush.sales_details"

    CUSTOMERS = "mgbrush.customers"

    STOCK_LEDGER = "mgbrush.stock_ledger"

    STOCK_BALANCE = "mgbrush.stock_balance"

    ORDER_HEADER = "mgbrush.order_header"

    ORDER_DETAILS = "mgbrush.order_details"