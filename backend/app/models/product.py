from typing import Optional, Literal
from pydantic import BaseModel, Field


class Product(BaseModel):
    id: str
    name: str
    brand: str
    price_rub: float
    segment: str  # low/mid/high — used internally for budget guard/upgrade, not in API output
    vegan: bool
    cruelty_free: str
    routine_step: str
    tier: str
    order_index: Optional[int] = None
    concerns_addressed: list[str] = []
    allergens_norm: list[str] = []
    link: Optional[str] = None
    main_actives_short: list[str] = []


class ProductOut(BaseModel):
    """Public-facing product: no segment, no allergen list, no internal fields."""
    id: str
    name: str
    brand: str
    price_rub: float
    link: Optional[str] = None
    routine_step: str
    tier: str
    order_index: Optional[int] = None
    concerns_addressed: list[str] = []
    main_actives_short: list[str] = []


class RecommendRequest(BaseModel):
    budget: Literal["low", "mid", "high"]
    concerns: list[str] = Field(default_factory=list)
    vegan: bool = False
    cruelty_free: bool = False
    minimalism: bool = False
    allergens: list[str] = Field(default_factory=list)


class BagItem(BaseModel):
    product: ProductOut
    routine_step: str
    order_index: Optional[int] = None
    concern_match: int


class RecommendMeta(BaseModel):
    total_price_rub: float
    budget_range: list[Optional[float]]  # [lo, hi] — hi=null means no upper limit (high budget)
    budget: str
    note: Optional[str] = None


class RecommendResponse(BaseModel):
    bag: list[BagItem]
    meta: RecommendMeta


def doc_to_product(doc: dict) -> Product:
    doc["id"] = str(doc.pop("_id"))
    return Product(**doc)
