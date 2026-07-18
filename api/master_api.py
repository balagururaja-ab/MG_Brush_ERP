from fastapi import APIRouter

from services.master_service import MasterService

router = APIRouter()

service = MasterService()


@router.get("/item-categories")
def get_item_categories():
    return service.get_item_categories()


@router.get("/units")
def get_units():
    return service.get_units()


@router.get("/taxes")
def get_taxes():
    return service.get_taxes()

@router.get("/brands")
def get_brands():
    return service.get_brands()


@router.get("/brush-sizes")
def get_brush_sizes():
    return service.get_brush_sizes()