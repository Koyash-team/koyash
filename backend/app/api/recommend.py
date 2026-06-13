from fastapi import APIRouter
from app.core.database import get_database
from app.models.product import Product, RecommendRequest, doc_to_product

router = APIRouter(tags=["recommend"])


@router.post("/recommend", response_model=list[Product])
async def recommend_products(request: RecommendRequest):
    db = get_database()

    query: dict = {}

    if request.segment is not None:
        query["segment"] = request.segment
    if request.vegan is not None:
        query["vegan"] = request.vegan
    if request.cruelty_free is not None:
        query["cruelty_free"] = request.cruelty_free
    # Exclude products whose allergens_norm array intersects with the provided allergens list
    if request.allergens:
        query["allergens_norm"] = {"$nin": request.allergens}

    cursor = db["products"].find(query, limit=100)
    return [doc_to_product(doc) async for doc in cursor]
