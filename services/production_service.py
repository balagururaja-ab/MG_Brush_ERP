"""
Production Service

Contains Production Business Logic
"""

from __future__ import annotations

from datetime import date
import re

from database.production_repository import ProductionRepository
from services.stock_service import StockService

from database.constants import FINISHED_GOOD_CATEGORIES


class StringHelper:

    @staticmethod
    def safe_lower(value) -> str:
        return str(value or "").strip().lower()


class ProductionService:
    

    def __init__(self):

        self.repo = ProductionRepository()
        self.stock_service = StockService()

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
            "DRAFT"
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
            return

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

        # Stock sufficiency is enforced only when completing production.
        # Draft/cancelled entries are allowed for planning or later completion.
        if production.get("status", "DRAFT") == "COMPLETED":

            for item in rm_items:

                self.stock_service.validate_stock(
                    item["item_id"],
                    float(item["quantity"])
                )

    # ---------------------------------------------------------
    # Sanitize Line Items
    # ---------------------------------------------------------

    def sanitize_line_items(
        self,
        items: list[dict]
    ) -> list[dict]:

        cleaned: list[dict] = []

        for item in items:

            if not item or not item.get("item_id"):
                continue

            quantity = item.get("quantity")
            if quantity in (None, ""):
                continue

            cleaned.append(item)

        return cleaned

    # ---------------------------------------------------------
    # Helpers: Auto Component Consumption
    # ---------------------------------------------------------

    def _normalize_size_text(self, size_text: str | None) -> str | None:

        text = StringHelper.safe_lower(size_text)
        match = re.search(r"(0\.5|0\.75|1(?:\.5)?|2(?:\.5)?|3|4)\s*inch", text)

        if not match:
            return None

        return f"{match.group(1)} inch"

    def _get_fg_size(self, fg_item: dict) -> str | None:

        brush_size_id = fg_item.get("brush_size_id")

        if brush_size_id:
            brush_size = self.repo.get_brush_size(int(brush_size_id))
            if brush_size:
                size_from_master = self._normalize_size_text(
                    brush_size.get("size_name")
                )
                if size_from_master:
                    return size_from_master

        return self._normalize_size_text(fg_item.get("item_name"))

    def _find_component_item(
        self,
        candidates: list[dict],
        size_text: str,
        must_have: list[str],
        must_not_have: list[str] | None = None
    ) -> dict | None:

        excludes = must_not_have or []

        for item in candidates:

            name = StringHelper.safe_lower(item.get("item_name"))

            if size_text not in name:
                continue

            if any(token not in name for token in must_have):
                continue

            if any(token in name for token in excludes):
                continue

            return item

        return None

    def _build_component_consumption(
        self,
        fg_items: list[dict]
    ) -> list[dict]:

        all_items = self.repo.get_active_items()

        component_candidates = [
            item for item in all_items
            if item.get("category_id") not in FINISHED_GOOD_CATEGORIES
        ]

        consumption: dict[int, float] = {}

        for fg in fg_items:

            fg_master = self.repo.get_item(int(fg["item_id"]))
            if not fg_master:
                continue

            fg_name = StringHelper.safe_lower(fg_master.get("item_name"))
            qty = float(fg.get("quantity", 0))

            if qty <= 0:
                continue

            size_text = self._get_fg_size(fg_master)
            if not size_text:
                continue

            rules: list[tuple[list[str], list[str] | None, str]] = []

            is_s44 = "s44" in fg_name
            is_selvi_spl = "selvi spl" in fg_name
            is_selvi = ("selvi" in fg_name) and (not is_selvi_spl) and (not is_s44)

            if is_s44 and size_text == "4 inch":
                # S44 4-inch uses dedicated ferrule + wooden handle.
                rules = [
                    (["ferrule", "s44"], None, "S44 ferrule"),
                    (["handle", "wood"], ["plastic"], "S44 wooden handle")
                ]

            elif is_selvi_spl:
                if size_text == "2 inch":
                    # 2-inch components are common for Selvi and Selvi Spl.
                    rules = [
                        (["ferrule"], ["s44"], "2-inch ferrule"),
                        (["handle", "plastic"], None, "2-inch plastic handle")
                    ]
                elif size_text == "4 inch":
                    rules = [
                        (["ferrule"], ["s44"], "4-inch ferrule"),
                        (["handle", "plastic"], None, "4-inch plastic handle")
                    ]

            elif is_selvi:
                if size_text in {"0.5 inch", "0.75 inch", "1 inch", "1.5 inch", "2 inch", "2.5 inch", "3 inch", "4 inch"}:
                    rules = [
                        (["ferrule"], ["s44"], f"{size_text} ferrule"),
                        (["handle", "plastic"], None, f"{size_text} plastic handle")
                    ]

            for must_have, must_not_have, label in rules:

                component = self._find_component_item(
                    candidates=component_candidates,
                    size_text=size_text,
                    must_have=must_have,
                    must_not_have=must_not_have
                )

                if component is None:
                    raise ValueError(
                        f"Component mapping not found for {label} for {fg_master['item_name']}."
                    )

                component_id = int(component["item_id"])

                consumption[component_id] = consumption.get(component_id, 0.0) + qty

        return [
            {
                "item_id": item_id,
                "quantity": quantity
            }
            for item_id, quantity in consumption.items()
        ]
    
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

        rm_items = self.sanitize_line_items(rm_items)
        fg_items = self.sanitize_line_items(fg_items)

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

            if production.get("status", "DRAFT") == "COMPLETED":

                linked_rm_items = self._build_component_consumption(fg_items)

                for linked_item in linked_rm_items:
                    self.stock_service.validate_stock(
                        linked_item["item_id"],
                        float(linked_item["quantity"])
                    )

                self.stock_service.production_stock(
                    production_id=production_id,
                    production_no=production["production_no"],
                    rm_items=linked_rm_items,
                    fg_items=fg_items,
                    consume_rm=True
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

        try:

            rm_items = self.sanitize_line_items(rm_items)
            fg_items = self.sanitize_line_items(fg_items)

            self.validate_production(
                production,
                rm_items,
                fg_items
            )

            previous_status = existing.get("status")
            new_status = production.get("status", previous_status)
            production_no = existing.get("production_no")

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

            should_post_stock = False

            if new_status == "COMPLETED":

                if previous_status != "COMPLETED":
                    should_post_stock = True
                else:
                    # Backfill missing stock entries for older completed records.
                    already_posted = self.stock_service.repo.has_production_posting(
                        production_id=production_id,
                        production_no=production_no
                    )
                    should_post_stock = not already_posted

            if should_post_stock:

                linked_rm_items = self._build_component_consumption(fg_items)

                for linked_item in linked_rm_items:
                    self.stock_service.validate_stock(
                        linked_item["item_id"],
                        float(linked_item["quantity"])
                    )

                self.stock_service.production_stock(
                    production_id=production_id,
                    production_no=production_no,
                    rm_items=linked_rm_items,
                    fg_items=fg_items,
                    consume_rm=True
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

    