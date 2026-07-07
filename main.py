"""
MG Brush ERP API
"""

from fastapi import FastAPI

from api.auth_api import router as auth_router

app = FastAPI(

    title="MG Brush ERP",

    version="0.2.0"

)

app.include_router(

    auth_router,

    prefix="/api/auth",

    tags=["Authentication"]

)