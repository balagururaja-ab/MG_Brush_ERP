"""
Production API
"""

from fastapi import APIRouter, HTTPException

from services.production_service import ProductionService

router = APIRouter()

service = ProductionService()


# ---------------------------------------------------------
# List Productions
# ---------------------------------------------------------

@router.get("/")
def list_productions():

    return service.list_productions()


# ---------------------------------------------------------
# Get Production
# ---------------------------------------------------------

@router.get("/{production_id}")
def get_production(
    production_id: int
):

    try:

        return service.get_production(
            production_id
        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ---------------------------------------------------------
# Create Production
# ---------------------------------------------------------

@router.post("/")
def create_production(
    payload: dict
):

    try:

        production_id = service.create_production(

            payload["production"],

            payload["rm_items"],

            payload["fg_items"]

        )

        return {

            "production_id": production_id

        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


# ---------------------------------------------------------
# Update Production
# ---------------------------------------------------------

@router.put("/{production_id}")
def update_production(

    production_id: int,

    payload: dict

):

    try:

        service.update_production(

            production_id,

            payload["production"],

            payload["rm_items"],

            payload["fg_items"]

        )

        return {

            "message": "Production updated successfully."

        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


# ---------------------------------------------------------
# Delete Production
# ---------------------------------------------------------

@router.delete("/{production_id}")
def delete_production(
    production_id: int
):

    try:

        service.delete_production(
            production_id
        )

        return {

            "message": "Production deleted successfully."

        }

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )