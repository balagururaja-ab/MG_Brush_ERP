from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth_api import router as auth_router
from api.items_api import router as items_router
from api.supplier_api import router as supplier_router
from api.purchase_api import router as purchase_router
from api.customer_api import router as customer_router
from api.sales_api import router as sales_router

app = FastAPI(title="MG Brush ERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    items_router,
    prefix="/api/items",
    tags=["Items"]
)

app.include_router(
    supplier_router,
    prefix="/api/suppliers",
    tags=["Suppliers"]
)

app.include_router(

    purchase_router,

    prefix="/api/purchases",

    tags=["Purchases"]

)

app.include_router(
    customer_router,
    prefix="/api/customers",
    tags=["Customers"]
)

app.include_router(
    sales_router,
    prefix="/api/sales",
    tags=["Sales"]
)