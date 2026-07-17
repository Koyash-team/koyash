"""Irritant warning (US-11 / PBI-505).

A deterministic patch-test heads-up for **sensitive-skin** users when a
recommended (suitable) product still carries a common irritant — fragrance,
drying alcohol, a retinoid, or a strong acid. It never excludes the product and
is not produced by the LLM.

The gap it fills is precisely the one the hard filters do *not* cover: declared
allergens and special conditions already exclude irritants, so the warning only
fires for a user whose skin type is sensitive (or who declared the sensitivity
concern) and who did not declare those.

The shared sample catalog (see conftest) has a low-segment Retinal serum
(`P-SE-LOW`, `main_actives_short=["Retinal"]`), which is a retinoid — a common
irritant — so it is the product a sensitive user gets warned about here.
"""

from app.api.recommend import _irritant_warning
from app.models.product import Product


def _warning_for(client, product_id, **payload):
    payload.setdefault("budget", "low")
    r = client.post("/recommend", json=payload)
    assert r.status_code == 200, r.text
    bag = r.json()["bag"]
    item = next((it for it in bag if it["product"]["id"] == product_id), None)
    assert item is not None, f"{product_id} not in the assembled bag"
    return item["justification"].get("irritant_warning")


# 2 concerns triggers the "up to 2 serums" branch so both low serums appear.
# End-to-end tests drive the sensitivity **concern** (not the skin type): the
# shared sample catalog tags no `skintype`, so requesting a specific skin type
# would filter every product out — the skin-type path is covered by the unit
# tests below, which call the rule directly.
_SENSITIVE = {"concerns": ["aging", "sensitivity"]}
_AGING = {"concerns": ["aging", "pigmentation"]}


# --------------------------------------------------------------------------
# End-to-end through /recommend (via the sensitivity concern)
# --------------------------------------------------------------------------

def test_sensitivity_user_is_warned_about_the_retinoid(client):
    warning = _warning_for(client, "P-SE-LOW", **_SENSITIVE)
    assert warning is not None
    assert "ретиноид" in warning.lower()
    assert "патч-тест" in warning.lower()


def test_non_sensitive_user_gets_no_warning(client):
    warning = _warning_for(client, "P-SE-LOW", **_AGING)
    assert warning is None


def test_a_warned_product_is_still_recommended(client):
    # The heads-up must not remove the product — it is still a suitable pick.
    r = client.post("/recommend", json={"budget": "low", **_SENSITIVE})
    ids = [it["product"]["id"] for it in r.json()["bag"]]
    assert "P-SE-LOW" in ids


def test_clean_product_carries_no_warning_for_sensitive_user(client):
    # The low cleanser (P-CL-LOW) has no irritant token, so no warning even for
    # a sensitivity-concern user.
    warning = _warning_for(client, "P-CL-LOW", **_SENSITIVE)
    assert warning is None


# --------------------------------------------------------------------------
# Unit: the rule itself, per irritant category
# --------------------------------------------------------------------------

def _product(**kw):
    base = dict(id="x", name="n", brand="b", price_rub=1.0, segment="low",
                vegan=False, cruelty_free="no", routine_step="serum", tier="core")
    base.update(kw)
    return Product(**base)


def test_each_irritant_category_is_detected_for_sensitive_skin():
    cases = {
        "отдушка": _product(allergens_norm=["fragrance"]),
        "спирт": _product(allergens_norm=["Alcohol Denat."]),
        "ретиноиды": _product(main_actives_short=["Retinol"]),
        "кислоты (AHA/BHA)": _product(main_actives_short=["Salicylic Acid"]),
    }
    for label, product in cases.items():
        warning = _irritant_warning(product, set(), "sensitive")
        assert warning is not None and label in warning, label


def test_no_signal_no_warning():
    retinoid = _product(main_actives_short=["Retinol"])
    # Neither sensitive skin type nor the sensitivity concern.
    assert _irritant_warning(retinoid, {"aging"}, "dry") is None


def test_no_irritant_no_warning_even_when_sensitive():
    clean = _product(main_actives_short=["Niacinamide"], allergens_norm=["silicone"])
    assert _irritant_warning(clean, {"sensitivity"}, "sensitive") is None
