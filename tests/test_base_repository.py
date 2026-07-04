"""
Test Base Repository
"""

from database.base_repository import BaseRepository
from database.constants import Tables

repo = BaseRepository()


def main():

    print("=" * 60)
    print("BASE REPOSITORY TESTS")
    print("=" * 60)

    # ---------------------------------------------------------
    # FIND BY ID
    # ---------------------------------------------------------

    print("Testing find_by_id()...")

    supplier = repo.find_by_id(
        Tables.SUPPLIERS,
        "supplier_id",
        1
    )

    assert supplier is not None, "find_by_id() failed"

    print("✓ find_by_id Passed")

    # ---------------------------------------------------------
    # EXISTS
    # ---------------------------------------------------------

    print("Testing exists()...")

    exists = repo.exists(
        Tables.SUPPLIERS,
        {
            "supplier_id": 1
        }
    )

    assert exists is True, "exists() failed"

    print("✓ exists Passed")

    # ---------------------------------------------------------
    # COUNT
    # ---------------------------------------------------------

    print("Testing count()...")

    total = repo.count(
        Tables.SUPPLIERS
    )

    assert total > 0, "count() failed"

    print("✓ count Passed")

    # ---------------------------------------------------------
    # FIND ALL
    # ---------------------------------------------------------

    print("Testing find_all()...")

    suppliers = repo.find_all(
        Tables.SUPPLIERS,
        order_by="supplier_name"
    )

    assert len(suppliers) > 0, "find_all() failed"

    print("✓ find_all Passed")

    # ---------------------------------------------------------
    # UPSERT INSERT
    # ---------------------------------------------------------

    print("Testing upsert() Insert...")

    supplier = {

        "supplier_code": "SUP999",

        "supplier_name": "Repository Test Supplier",

        "contact_person": "Test User",

        "mobile": "9999999999",

        "is_active": True

    }

    repo.upsert(
        Tables.SUPPLIERS,
        supplier,
        ["supplier_code"]
    )

    supplier = repo.find_one(
        Tables.SUPPLIERS,
        {
            "supplier_code": "SUP999"
        }
    )

    assert supplier is not None

    print("✓ upsert Insert Passed")

    # ---------------------------------------------------------
    # UPSERT UPDATE
    # ---------------------------------------------------------

    print("Testing upsert() Update...")

    supplier["supplier_name"] = "Repository Test Updated"

    repo.upsert(
        Tables.SUPPLIERS,
        supplier,
        ["supplier_code"]
    )

    updated = repo.find_one(
        Tables.SUPPLIERS,
        {
            "supplier_code": "SUP999"
        }
    )

    assert updated["supplier_name"] == "Repository Test Updated"

    print("✓ upsert Update Passed")

    print("=" * 60)
    print("ALL BASE REPOSITORY TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":

    main()