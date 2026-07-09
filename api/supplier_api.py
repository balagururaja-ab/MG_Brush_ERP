from fastapi import APIRouter, HTTPException

from schemas.supplier_schema import (
    SupplierCreate,
    SupplierUpdate
)

from services.supplier_service import SupplierService

router = APIRouter()

service = SupplierService()


@router.get("")
def get_all():

    return service.get_all()


@router.get("/{supplier_id}")
def get_supplier(supplier_id: int):

    try:

        return service.get_by_id(supplier_id)

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


@router.post("")
def create_supplier(request: SupplierCreate):

    try:

        return service.create(
            request.model_dump()
        )

    except ValueError as ex:

        raise HTTPException(
            status_code=409,
            detail=str(ex)
        )


@router.put("/{supplier_id}")
def update_supplier(
    supplier_id: int,
    request: SupplierUpdate
):

    try:

        return service.update(
            supplier_id,
            request.model_dump()
        )

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int):

    try:

        service.delete(supplier_id)

        return {
            "message": "Supplier deleted successfully."
        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )