from database.base_repository import BaseRepository


class MasterRepository(BaseRepository):

    def get_item_categories(self):

        sql = """
            SELECT
                category_id,
                category_code,
                category_name
            FROM mgbrush.item_category
            WHERE is_active = TRUE
            ORDER BY category_name
        """

        return self.fetch_all(sql)

    # ---------------------------------------------

    def get_units(self):

        sql = """
            SELECT
                unit_id,
                unit_code,
                unit_name
            FROM mgbrush.unit_master
            WHERE is_active = TRUE
            ORDER BY unit_name
        """

        return self.fetch_all(sql)

    # ---------------------------------------------

    def get_taxes(self):

        sql = """
            SELECT
                tax_id,
                tax_name,
                hsn_sac_code,
                cgst_percentage,
                sgst_percentage,
                igst_percentage,
                cess_percentage
            FROM mgbrush.tax_master
            WHERE is_active = TRUE
            ORDER BY tax_name
        """

        return self.fetch_all(sql)
    
    def get_brands(self):

        sql = """
                SELECT
                    brand_id,
                    brand_code,
                    brand_name
                FROM brand_master
                WHERE is_active = TRUE
                ORDER BY brand_name
            """

        return self.fetch_all(sql)


    def get_brush_sizes(self):

        sql = """
                SELECT
                    brush_size_id,
                    size_code,
                    size_name
                FROM brush_size_master
                WHERE is_active = TRUE
                ORDER BY size_mm
            """

        return self.fetch_all(sql)