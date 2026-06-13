from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import connect_db, close_db
from app.api import products, recommend


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="SWP API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(products.router)
app.include_router(recommend.router)


@app.get("/health", status_code=200)
async def health_check():
    return {"status": "ok"}
