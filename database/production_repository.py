"""
Production Repository

Handles Production CRUD Operations
"""

from database.base_repository import BaseRepository
from database.constants import Tables


class ProductionRepository(BaseRepository):

    # ---------------------------------------------------------
    # Raw Material Item
    # ---------------------------------------------------------

    def get_item(self, item_id: int):

        sql = f"""
        SELECT
            i.*,
            c.category_name
        FROM {Tables.ITEMS} i
        JOIN {Tables.ITEM_CATEGORY} c
        ON i.category_id = c.category_id
        WHERE i.item_id=%s
        """

        return self.fetch_one(sql, [item_id])

    # ---------------------------------------------------------
    # Brand
    # ---------------------------------------------------------

    def get_brand(
        self,
        brand_id: int
    ):

        return self.find_one(

            Tables.BRAND_MASTER,

            {
                "brand_id": brand_id
            }

        )

    # ---------------------------------------------------------
    # Brush Size
    # ---------------------------------------------------------

    def get_brush_size(
        self,
        brush_size_id: int
    ):

        return self.find_one(

            Tables.BRUSH_SIZE_MASTER,

            {
                "brush_size_id": brush_size_id
            }

        )

    # ---------------------------------------------------------
    # Create Production Header
    # ---------------------------------------------------------

    def create_production(
        self,
        production: dict
    ) -> int:

        return self.insert(

            Tables.PRODUCTION_HEADER,

            production,

            "production_id"

        )

    # ---------------------------------------------------------
    # Create Raw Material Detail
    # ---------------------------------------------------------

    def create_rm_item(
        self,
        item: dict
    ):

        return self.insert(

            Tables.PRODUCTION_RM_DETAILS,

            item,

            "production_rm_id"

        )

    # ---------------------------------------------------------
    # Create Finished Goods Detail
    # ---------------------------------------------------------

    def create_fg_item(
        self,
        item: dict
    ):

        return self.insert(

            Tables.PRODUCTION_FG_DETAILS,

            item,

            "production_fg_id"

        )

    # ---------------------------------------------------------
    # Update Production Header
    # ---------------------------------------------------------

    def update_production(
        self,
        production_id: int,
        production: dict
    ):

        return self.update(

            Tables.PRODUCTION_HEADER,

            production,

            {
                "production_id": production_id
            }

        )

    # ---------------------------------------------------------
    # Delete Production Header
    # ---------------------------------------------------------

    def delete_production(
        self,
        production_id: int
    ):

        return self.delete(

            Tables.PRODUCTION_HEADER,

            {
                "production_id": production_id
            }

        )

    # ---------------------------------------------------------
    # Delete RM Detail
    # ---------------------------------------------------------

    def delete_rm_item(
        self,
        production_rm_id: int
    ):

        return self.delete(

            Tables.PRODUCTION_RM_DETAILS,

            {
                "production_rm_id": production_rm_id
            }

        )

    # ---------------------------------------------------------
    # Delete FG Detail
    # ---------------------------------------------------------

    def delete_fg_item(
        self,
        production_fg_id: int
    ):

        return self.delete(

            Tables.PRODUCTION_FG_DETAILS,

            {
                "production_fg_id": production_fg_id
            }

        )

    # ---------------------------------------------------------
    # Get Production Header
    # ---------------------------------------------------------

    def get_production_by_id(
        self,
        production_id: int
    ):

        return self.find_one(

            Tables.PRODUCTION_HEADER,

            {
                "production_id": production_id
            }

        )

    # ---------------------------------------------------------
    # Get Raw Material Details
    # ---------------------------------------------------------

    def get_rm_items(
        self,
        production_id: int
    ):

        sql = f"""
            SELECT

                d.production_rm_id,
                d.production_id,
                d.line_no,

                d.item_id,
                i.item_code,
                i.item_name,

                d.quantity,
                d.remarks

            FROM {Tables.PRODUCTION_RM_DETAILS} d

            INNER JOIN {Tables.ITEMS} i
                    ON d.item_id = i.item_id

            WHERE d.production_id = %s

            ORDER BY d.line_no
        """

        return self.fetch_all(

            sql,

            [production_id]

        )

    # ---------------------------------------------------------
    # Get Finished Goods Details
    # ---------------------------------------------------------

    def get_fg_items(
        self,
        production_id: int
    ):

        sql = f"""
            SELECT

                d.production_fg_id,
                d.production_id,
                d.line_no,

                d.item_id,
                i.item_code,
                i.item_name,

                d.brush_size_id,
                s.size_name,

                d.quantity,
                d.remarks

            FROM {Tables.PRODUCTION_FG_DETAILS} d

            INNER JOIN {Tables.BRAND_MASTER} b
                    ON d.brand_id = b.brand_id

            INNER JOIN {Tables.BRUSH_SIZE_MASTER} s
                    ON d.brush_size_id = s.brush_size_id

            WHERE d.production_id = %s

            ORDER BY d.line_no
        """

        return self.fetch_all(

            sql,

            [production_id]

        )

    # ---------------------------------------------------------
    # List Productions
    # ---------------------------------------------------------

    def list_productions(self):

        sql = f"""
            SELECT

                production_id,

                production_no,

                production_date,

                status,

                remarks

            FROM {Tables.PRODUCTION_HEADER}

            ORDER BY production_id DESC
        """

        return self.fetch_all(sql)

    # ---------------------------------------------------------
    # Generate Production Number
    # ---------------------------------------------------------

    def generate_next_production_no(self):

        return self.generate_next_number(

            table=Tables.PRODUCTION_HEADER,

            id_column="production_id",

            number_column="production_no",

            prefix="PROD"

        )