from typing import Optional
from pydantic import BaseModel, Field


class Product(BaseModel):
    id: str
    name: str
    brand: str
    price_rub: float
    segment: str
    vegan: bool
    cruelty_free: str
    routine_step: str
    tier: str
    order_index: Optional[int] = None
    concerns_addressed: list[str]
    allergens_norm: list[str]
    link: Optional[str] = None


class RecommendRequest(BaseModel):
    segment: Optional[str] = Field(default=None, examples=["skincare"])
    vegan: Optional[bool] = Field(default=None, examples=[True])
    cruelty_free: Optional[str] = Field(default=None, examples=["yes"])
    allergens: Optional[list[str]] = Field(
        default=None,
        description="Allergens to exclude. Products containing any of these are filtered out.",
        examples=[["fragrance", "alcohol"]],
    )


def doc_to_product(doc: dict) -> Product:
    doc["id"] = str(doc.pop("_id"))
    return Product(**doc)
