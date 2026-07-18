from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Boolean,
    Text,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from database.base import Base


class Item(Base):
    __tablename__ = "items"
    __table_args__ = {"schema": "mgbrush"}

    item_id = Column(Integer, primary_key=True, index=True)

    item_code = Column(String(30), unique=True, nullable=False)
    item_name = Column(String(200), nullable=False)

    category_id = Column(
        Integer,
        ForeignKey("mgbrush.item_category.category_id"),
        nullable=False
    )

    unit_id = Column(
        Integer,
        ForeignKey("mgbrush.unit_master.unit_id"),
        nullable=False
    )

    tax_id = Column(
        Integer,
        ForeignKey("mgbrush.tax_master.tax_id")
    )

    
    brush_size = Column(String(20))
    bristle_type = Column(String(100))
    handle_type = Column(String(100))
    ferrule_type = Column(String(100))
    color = Column(String(50))

    purchase_rate = Column(Numeric(18,2), default=0)
    selling_rate = Column(Numeric(18,2), default=0)

    opening_stock = Column(Numeric(18,3), default=0)
    minimum_stock = Column(Numeric(18,3), default=0)
    maximum_stock = Column(Numeric(18,3), default=0)
    reorder_level = Column(Numeric(18,3), default=0)

    weight_per_piece = Column(Numeric(18,3))

    barcode = Column(String(100))
    hsn_code = Column(String(20))

    description = Column(Text)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )