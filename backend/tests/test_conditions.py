"""Special-condition safety filter (US-20 / PBI-312): a product whose ingredients
are contraindicated for a declared condition is hard-excluded, deterministically."""


def _serum_ids(client, **extra):
    # 2 concerns triggers the "up to 2 serums" branch so both low serums appear.
    payload = {"budget": "low", "concerns": ["aging", "pigmentation"]}
    payload.update(extra)
    r = client.post("/recommend", json=payload)
    assert r.status_code == 200, r.text
    return [item["product"]["id"] for item in r.json()["bag"]]


def test_retinoid_present_without_condition(client):
    # Retinal serum (P-SE-LOW, main_actives_short=["Retinal"]) is allowed normally.
    assert "P-SE-LOW" in _serum_ids(client)


def test_pregnancy_excludes_retinoid_product(client):
    ids = _serum_ids(client, conditions=["pregnancy"])
    assert "P-SE-LOW" not in ids  # retinoid contraindicated in pregnancy
    # the rest of the bag is still assembled (other serum remains)
    assert "P-SE-LOW2" in ids


def test_condition_none_is_noop(client):
    # Empty conditions must not change behaviour.
    assert "P-SE-LOW" in _serum_ids(client, conditions=[])


def test_condition_case_insensitive(client):
    assert "P-SE-LOW" not in _serum_ids(client, conditions=["PREGNANCY"])
