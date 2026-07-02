# ADR-003: Budget as discrete segments with nearest-segment fallback

**Status:** Accepted

**Quality requirements addressed:**
[QR-002](../../quality-requirements.md#qr-002-robust-recommendation-across-the-valid-input-space)

## Context

Users choose a budget tier. Internally each product has a `segment` of `low`,
`mid`, or `high`.
The catalog is small and uneven — some routine steps have no product in a given
segment (for example, the high segment has very few products). An earlier design
that forced the basket total into a hard price band made `budget=high` fail
outright when a segment could not be filled, and the customer's intent (per the
project brief) is that budget should act as a soft preference with a graceful
fallback, not a hard gate — catalog prices also drift over time, so exact price
bands are not a durable constraint.

## Decision

Treat budget as **discrete segments with nearest-segment fallback**, not as
free-form price optimization. For each routine step the engine searches the
user's own segment first, then the nearest neighbour(s) on the `low < mid < high`
scale (the explicit `SEGMENT_PRIORITY` table in `recommend.py`). A step is left
empty only when no segment has a candidate. When a product is taken from a
segment other than the requested one, the response notes the substitution. Price
bands are informational labels, not load-bearing constraints on the assembled
total.

## Consequences and tradeoffs

- **Positive
  ([QR-002](../../quality-requirements.md#qr-002-robust-recommendation-across-the-valid-input-space)):**
  the engine degrades gracefully across the whole valid input space instead of
  failing on sparse combinations — `budget=high` now falls back per step rather
  than returning a blanket error, and a genuinely empty result surfaces as a
  structured `422 NO_PRODUCTS_AVAILABLE`.
- **Positive:** the fallback only relaxes the *segment*; it never relaxes the
  hard filters (vegan, cruelty-free, allergens), which are applied before
  selection.
- **Tradeoff (resolved at the presentation layer via PBI-302):** because price
  bands are not enforced, the assembled total does not land inside a fixed ₽
  range — with ~6 items per bag, the sum overshoots a per-item tier. **PBI-302**
  measured this against the real catalog and decided to keep this engine
  unchanged and fix the mismatch in presentation: the questionnaire now frames
  budget as a tier with an approximate per-product price and an approximate
  total, and the results show the real computed total with an "approximate
  price" note, instead of promising an exact basket range. This ADR is therefore
  **retained, not superseded**. A true total-budget model would only make sense
  with reliable price data and would need a new ADR superseding this one.
