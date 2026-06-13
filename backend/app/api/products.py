from fastapi import APIRouter
from app.core.database import get_database
from app.models.product import Product, doc_to_product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[Product])
async def list_products():
    db = get_database()
    cursor = db["products"].find(limit=100)
    return [doc_to_product(doc) async for doc in cursor]
