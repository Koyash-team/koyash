from typing import Optional

from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.core.database import get_database
from app.models.product import (
    BagItem,
    Product,
    ProductOut,
    RecommendMeta,
    RecommendRequest,
    RecommendResponse,
    doc_to_product,
)

router = APIRouter(tags=["recommend"])

# Budget = target range for the total basket price (lo inclusive, hi inclusive).
# hi=inf means no upper limit (high budget: floor only).
BUDGET_TARGETS: dict[str, tuple[float, float]] = {
    "low": (0.0, 3000.0),
    "mid": (0.0, 7000.0),
    "high": (7000.0, float("inf")),
}

CORE_STEPS = ["cleanse", "tone", "serum", "moisturize", "spf"]
OCCASIONAL_STEPS = ["exfoliant", "mask"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _concern_match(product: Product, concerns: set[str]) -> int:
    return len(set(product.concerns_addressed) & concerns)


def _to_out(p: Product) -> ProductOut:
    return ProductOut(
        id=p.id,
        name=p.name,
        brand=p.brand,
        price_rub=p.price_rub,
        link=p.link,
        routine_step=p.routine_step,
        tier=p.tier,
        order_index=p.order_index,
        concerns_addressed=p.concerns_addressed,
        main_actives_short=p.main_actives_short,
    )


# ---------------------------------------------------------------------------
# Base selection (§7)
# ---------------------------------------------------------------------------


def _base_select(
    pool: list[Product], concerns: set[str], minimalism: bool
) -> tuple[list[Product], list[str]]:
    basket: list[Product] = []
    missing: list[str] = []

    for step in CORE_STEPS:
        candidates = [p for p in pool if p.routine_step == step and p.tier == "core"]
        if not candidates:
            missing.append(step)
            continue

        # Rank: most concern matches first, then cheapest on tie
        candidates.sort(key=lambda p: (-_concern_match(p, concerns), p.price_rub))

        # Serum top-2 when user has ≥2 concerns and enough candidates exist
        if step == "serum" and len(concerns) >= 2 and len(candidates) >= 2:
            basket.extend(candidates[:2])
        else:
            basket.append(candidates[0])

    if not minimalism:
        for step in OCCASIONAL_STEPS:
            candidates = [p for p in pool if p.routine_step == step and p.tier == "occasional"]
            if not candidates:
                continue
            candidates.sort(key=lambda p: (-_concern_match(p, concerns), p.price_rub))
            basket.append(candidates[0])

    return basket, missing


# ---------------------------------------------------------------------------
# Downgrade pass — ceiling (low/mid)
# ---------------------------------------------------------------------------


def _best_downgrade(
    basket: list[Product], pool: list[Product], concerns: set[str]
) -> Optional[tuple[int, Product]]:
    basket_ids = {p.id for p in basket}
    best: Optional[tuple[int, Product]] = None
    best_savings = 0.0

    for i, product in enumerate(basket):
        candidates = [
            p for p in pool
            if p.routine_step == product.routine_step
            and p.tier == product.tier
            and p.price_rub < product.price_rub
            and p.id not in basket_ids
        ]
        if not candidates:
            continue

        # Among cheaper candidates: pick the one with the best concern match,
        # then cheapest on tie (preserves relevance while maximising savings).
        max_match = max(_concern_match(p, concerns) for p in candidates)
        top = [p for p in candidates if _concern_match(p, concerns) == max_match]
        candidate = min(top, key=lambda p: p.price_rub)
        savings = product.price_rub - candidate.price_rub

        if savings > best_savings:
            best_savings = savings
            best = (i, candidate)

    return best


def _downgrade_pass(
    basket: list[Product], pool: list[Product], concerns: set[str], hi: float
) -> tuple[list[Product], float, Optional[str]]:
    basket = list(basket)
    total = sum(p.price_rub for p in basket)
    note: Optional[str] = None

    while total > hi:
        swap = _best_downgrade(basket, pool, concerns)
        if swap is None:
            break
        i, replacement = swap
        basket[i] = replacement
        total = sum(p.price_rub for p in basket)

    if total > hi:
        # Fallback §8: absolute cheapest per step + note
        basket, total = _fallback_min_price(basket, pool)
        note = "Не удалось уложиться в бюджет — показаны минимально доступные товары"

    return basket, total, note


def _fallback_min_price(
    basket: list[Product], pool: list[Product]
) -> tuple[list[Product], float]:
    new_basket: list[Product] = []
    for p in basket:
        candidates = [c for c in pool if c.routine_step == p.routine_step and c.tier == p.tier]
        if candidates:
            new_basket.append(min(candidates, key=lambda c: c.price_rub))
    return new_basket, sum(p.price_rub for p in new_basket)


# ---------------------------------------------------------------------------
# Upgrade pass — floor (high)
# ---------------------------------------------------------------------------


def _best_upgrade(
    basket: list[Product], pool: list[Product], concerns: set[str]
) -> Optional[tuple[int, Product]]:
    basket_ids = {p.id for p in basket}
    best: Optional[tuple[int, Product]] = None
    best_gain = 0.0

    for i, product in enumerate(basket):
        current_match = _concern_match(product, concerns)
        candidates = [
            p for p in pool
            if p.routine_step == product.routine_step
            and p.tier == product.tier
            and p.price_rub > product.price_rub
            and p.id not in basket_ids
        ]
        if not candidates:
            continue

        # Prefer candidates that maintain or improve concern match
        matching = [p for p in candidates if _concern_match(p, concerns) >= current_match]
        working = matching if matching else candidates

        # Among those: prefer high-segment, then most expensive (max gain)
        high_seg = [p for p in working if p.segment == "high"]
        final = high_seg if high_seg else working
        candidate = max(final, key=lambda p: p.price_rub)
        gain = candidate.price_rub - product.price_rub

        if gain > best_gain:
            best_gain = gain
            best = (i, candidate)

    return best


def _upgrade_pass(
    basket: list[Product], pool: list[Product], concerns: set[str], lo: float
) -> tuple[list[Product], float]:
    basket = list(basket)
    total = sum(p.price_rub for p in basket)

    while total < lo:
        swap = _best_upgrade(basket, pool, concerns)
        if swap is None:
            break
        i, replacement = swap
        basket[i] = replacement
        total = sum(p.price_rub for p in basket)

    return basket, total


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------


@router.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    db = get_database()

    # Hard filters: vegan and cruelty-free only — NO segment filter
    query: dict = {}
    if request.vegan:
        query["vegan"] = True
    if request.cruelty_free:
        query["cruelty_free"] = "yes"  # "unknown" intentionally excluded per spec §4.3

    cursor = db["products"].find(query)
    all_products = [doc_to_product(doc) async for doc in cursor]

    # Allergen filter in Python for case-insensitive matching
    if request.allergens:
        allergens_lower = {a.lower() for a in request.allergens}
        pool = [
            p for p in all_products
            if not any(tok.lower() in allergens_lower for tok in p.allergens_norm)
        ]
    else:
        pool = all_products

    lo, hi = BUDGET_TARGETS[request.budget]

    # Guard: high budget requires enough premium inventory (§6)
    if request.budget == "high":
        high_count = sum(1 for p in pool if p.segment == "high")
        if high_count < settings.MIN_HIGH_PRODUCTS:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": {
                        "code": "INSUFFICIENT_HIGH_SEGMENT_DATA",
                        "message": (
                            "Недостаточно товаров премиум-сегмента, чтобы собрать "
                            "косметичку под этот бюджет. Попробуйте средний бюджет."
                        ),
                    }
                },
            )

    concerns_set = set(request.concerns)
    basket, missing_steps = _base_select(pool, concerns_set, request.minimalism)

    if not basket:
        raise HTTPException(
            status_code=422,
            detail={
                "error": {
                    "code": "NO_PRODUCTS_AVAILABLE",
                    "message": "После применения фильтров не осталось товаров для формирования косметички.",
                }
            },
        )

    total = sum(p.price_rub for p in basket)
    notes: list[str] = []

    if missing_steps:
        notes.append(f"Нет товаров для шагов: {', '.join(missing_steps)}")

    if total > hi:  # ceiling — low/mid
        basket, total, budget_note = _downgrade_pass(basket, pool, concerns_set, hi)
        if budget_note:
            notes.append(budget_note)

    elif total < lo:  # floor — high
        basket, total = _upgrade_pass(basket, pool, concerns_set, lo)
        if total < lo:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": {
                        "code": "INSUFFICIENT_HIGH_SEGMENT_DATA",
                        "message": (
                            "Недостаточно товаров премиум-сегмента, чтобы собрать "
                            "косметичку под этот бюджет. Попробуйте средний бюджет."
                        ),
                    }
                },
            )

    # Build ordered bag: core steps by order_index, then occasional
    bag: list[BagItem] = [
        BagItem(
            product=_to_out(p),
            routine_step=p.routine_step,
            order_index=p.order_index,
            concern_match=_concern_match(p, concerns_set),
        )
        for p in basket
    ]
    bag.sort(key=lambda item: (item.order_index is None, item.order_index or 0))

    budget_range_hi: Optional[float] = None if hi == float("inf") else hi

    return RecommendResponse(
        bag=bag,
        meta=RecommendMeta(
            total_price_rub=round(total, 2),
            budget_range=[lo, budget_range_hi],
            budget=request.budget,
            note="; ".join(notes) if notes else None,
        ),
    )
