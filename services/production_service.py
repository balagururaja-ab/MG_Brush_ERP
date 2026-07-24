"""
Production Service

Contains Production Business Logic
"""

from __future__ import annotations

from datetime import date

from database.production_repository import ProductionRepository

from database.constants import FINISHED_GOOD_CATEGORIES


class ProductionService:
    

    def __init__(self):

        self.repo = ProductionRepository()

    # ---------------------------------------------------------
    # Generate Production Number
    # ---------------------------------------------------------

    def generate_production_no(self):

        return self.repo.generate_next_production_no()

    # ---------------------------------------------------------
    # Validate Header
    # ---------------------------------------------------------

    def validate_header(
        self,
        production: dict
    ):

        if not production.get("production_date"):

            production["production_date"] = date.today()

        status = production.get(
            "status",
            "COMPLETED"
        )

        allowed_status = [

            "DRAFT",

            "COMPLETED",

            "CANCELLED"

        ]

        if status not in allowed_status:

            raise ValueError(
                "Invalid Production Status."
            )

    # ---------------------------------------------------------
    # Validate Raw Materials
    # ---------------------------------------------------------

    def validate_rm_items(
        self,
        rm_items: list[dict]
    ):

        if len(rm_items) == 0:

            raise ValueError(
                "Please add at least one raw material."
            )

        item_ids = set()

        for item in rm_items:

            if not item.get("item_id"):

                raise ValueError(
                    "Raw Material is mandatory."
                )

            item["item_id"] = int(
                item["item_id"]
            )

            item["quantity"] = float(
                item["quantity"]
            )

            if item["quantity"] <= 0:

                raise ValueError(
                    "Raw material quantity should be greater than zero."
                )

            item_master = self.repo.get_item(
                item["item_id"]
            )

            if item_master is None:

                raise ValueError(

                    f"Item {item['item_id']} does not exist."

                )

            if not item_master["is_active"]:

                raise ValueError(

                    f"{item_master['item_name']} is inactive."

                )

            if item_master["category_id"] in FINISHED_GOOD_CATEGORIES:

                raise ValueError(

                    f"{item_master['item_name']} cannot be used as Raw Material."

                )

            if item["item_id"] in item_ids:

                raise ValueError(
                    "Duplicate Raw Material found."
                )

            item_ids.add(
                item["item_id"]
            )

    # ---------------------------------------------------------
    # Validate Finished Goods
    # ---------------------------------------------------------

    def validate_fg_items(
        self,
        fg_items: list[dict]
    ):

        if len(fg_items) == 0:

            raise ValueError(
                "Please add at least one finished product."
            )

        item_ids = set()

        for item in fg_items:

            if not item.get("item_id"):

                raise ValueError(
                    "Finished Product is mandatory."
                )

            item["item_id"] = int(
                item["item_id"]
            )

            item["quantity"] = float(
                item["quantity"]
            )

            if item["quantity"] <= 0:

                raise ValueError(
                    "Finished quantity should be greater than zero."
                )

            item_master = self.repo.get_item(
                item["item_id"]
            )

            if item_master is None:

                raise ValueError(

                    f"Item {item['item_id']} does not exist."

                )

            if not item_master["is_active"]:

                raise ValueError(

                    f"{item_master['item_name']} is inactive."

                )

            if item_master["category_id"] not in FINISHED_GOOD_CATEGORIES:

                raise ValueError(

                    f"{item_master['item_name']} is not a Finished Good."

                )

            if item["item_id"] in item_ids:

                raise ValueError(
                    "Duplicate Finished Product found."
                )

            item_ids.add(
                item["item_id"]
            )

    # ---------------------------------------------------------
    # Validate RM / FG Overlap
    # ---------------------------------------------------------

    def validate_rm_fg_overlap(
        self,
        rm_items: list[dict],
        fg_items: list[dict]
    ):

        rm_ids = {

            item["item_id"]

            for item in rm_items

        }

        fg_ids = {

            item["item_id"]

            for item in fg_items

        }

        duplicate = rm_ids.intersection(
            fg_ids
        )

        if duplicate:

            raise ValueError(

                "Same item cannot be both Raw Material and Finished Good."

            )
        
    # ---------------------------------------------------------
    # Validate Production
    # ---------------------------------------------------------

    def validate_production(
        self,
        production: dict,
        rm_items: list[dict],
        fg_items: list[dict]
    ):

        self.validate_header(
            production
        )

        self.validate_rm_items(
            rm_items
        )

        self.validate_fg_items(
            fg_items
        )

        self.validate_rm_fg_overlap(
            rm_items,
            fg_items
        )
    
    # ---------------------------------------------------------
    # Create Production
    # ---------------------------------------------------------

    def create_production(

        self,

        production: dict,

        rm_items: list[dict],

        fg_items: list[dict]

    ):

        # -----------------------------------------
        # Validations
        # -----------------------------------------

        self.validate_production(
            production,
            rm_items,
            fg_items
        )

        production["production_no"] = self.generate_production_no()

        production.setdefault(

            "production_date",

            date.today()

        )

        try:

            # -----------------------------------------
            # Create Production Header
            # -----------------------------------------

            production_id = self.repo.create_production(

                production

            )

            # -----------------------------------------
            # Save Raw Materials
            # -----------------------------------------

            for line_no, item in enumerate(

                rm_items,

                start=1

            ):

                rm_detail = {

                    "production_id": production_id,

                    "line_no": line_no,

                    "item_id": item["item_id"],

                    "quantity": item["quantity"],

                    "remarks": item.get(
                        "remarks"
                    )

                }

                self.repo.create_rm_item(

                    rm_detail

                )

            # -----------------------------------------
            # Save Finished Goods
            # -----------------------------------------

            for line_no, item in enumerate(

                fg_items,

                start=1

            ):

                fg_detail = {

                    "production_id": production_id,

                    "line_no": line_no,

                    "item_id": item["item_id"],

                    "quantity": item["quantity"],

                    "remarks": item.get(
                        "remarks"
                    )

                }

                self.repo.create_fg_item(

                    fg_detail

                )

            # -----------------------------------------
            # Commit
            # -----------------------------------------

            self.repo.commit()

            return production_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Update Production
    # ---------------------------------------------------------

    def update_production(

        self,

        production_id: int,

        production: dict,

        rm_items: list[dict],

        fg_items: list[dict]

    ):

        existing = self.repo.get_production_by_id(

            production_id

        )

        if existing is None:

            raise ValueError(

                "Production not found."

            )

        self.validate_production(

            production,

            rm_items,

            fg_items

        )

        try:

            # -----------------------------------------
            # Update Header
            # -----------------------------------------

            self.repo.update_production(

                production_id,

                production

            )

            # -----------------------------------------
            # Delete Existing RM
            # -----------------------------------------

            old_rm = self.repo.get_rm_items(

                production_id

            )

            for row in old_rm:

                self.repo.delete_rm_item(

                    row["production_rm_id"]

                )

            # -----------------------------------------
            # Delete Existing FG
            # -----------------------------------------

            old_fg = self.repo.get_fg_items(

                production_id

            )

            for row in old_fg:

                self.repo.delete_fg_item(

                    row["production_fg_id"]

                )

            # -----------------------------------------
            # Insert RM
            # -----------------------------------------

            for line_no, item in enumerate(

                rm_items,

                start=1

            ):

                rm_detail = {

                    "production_id": production_id,

                    "line_no": line_no,

                    "item_id": item["item_id"],

                    "quantity": item["quantity"],

                    "remarks": item.get(

                        "remarks"

                    )

                }

                self.repo.create_rm_item(

                    rm_detail

                )

            # -----------------------------------------
            # Insert FG
            # -----------------------------------------

            for line_no, item in enumerate(

                fg_items,

                start=1

            ):

                fg_detail = {

                    "production_id": production_id,

                    "line_no": line_no,

                    "item_id": item["item_id"],

                    "quantity": item["quantity"],

                    "remarks": item.get(

                        "remarks"

                    )

                }

                self.repo.create_fg_item(

                    fg_detail

                )

            self.repo.commit()

            return production_id

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # Delete Production
    # ---------------------------------------------------------

    def delete_production(

        self,

        production_id: int

    ):

        production = self.repo.get_production_by_id(

            production_id

        )

        if production is None:

            raise ValueError(

                "Production not found."

            )

        try:

            # -----------------------------------------
            # Delete RM Details
            # -----------------------------------------

            rm_items = self.repo.get_rm_items(

                production_id

            )

            for row in rm_items:

                self.repo.delete_rm_item(

                    row["production_rm_id"]

                )

            # -----------------------------------------
            # Delete FG Details
            # -----------------------------------------

            fg_items = self.repo.get_fg_items(

                production_id

            )

            for row in fg_items:

                self.repo.delete_fg_item(

                    row["production_fg_id"]

                )

            # -----------------------------------------
            # Delete Header
            # -----------------------------------------

            self.repo.delete_production(

                production_id

            )

            self.repo.commit()

        except Exception:

            self.repo.rollback()

            raise

    # ---------------------------------------------------------
    # List Productions
    # ---------------------------------------------------------

    def list_productions(self):

        return self.repo.list_productions()

    # ---------------------------------------------------------
    # Get Production
    # ---------------------------------------------------------

    def get_production(
        self,
        production_id: int
    ):

        production = self.repo.get_production_by_id(
            production_id
        )

        if production is None:

            raise ValueError(
                "Production not found."
            )

        production["rm_items"] = self.repo.get_rm_items(
            production_id
        )

        production["fg_items"] = self.repo.get_fg_items(
            production_id
        )

        return production

    