from fastapi import APIRouter, HTTPException

from schemas.item_schema import (
    ItemCreate,
    ItemUpdate
)

from services.item_service import ItemService

router = APIRouter()

service = ItemService()


@router.get("/items")
def get_all():

    return service.get_all()


@router.get("/items/{item_id}")
def get_item(item_id: int):

    try:

        return service.get_by_id(item_id)

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


@router.post("/items")
def create_item(request: ItemCreate):

    try:

        return service.create(
            request.model_dump()
        )

    except ValueError as ex:

        raise HTTPException(
            status_code=409,
            detail=str(ex)
        )


@router.put("/items/{item_id}")
def update_item(
    item_id: int,
    request: ItemUpdate
):

    try:

        return service.update(
            item_id,
            request.model_dump()
        )

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


@router.delete("/items/{item_id}")
def delete_item(item_id: int):

    try:

        service.delete(item_id)

        return {

            "message":
            "Item deleted successfully."

        }

    except ValueError as ex:

        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )