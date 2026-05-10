def interaction_payload(**overrides):
    payload = {
        "hcp_name": "Dr. Ananya Rao",
        "specialty": "Cardiology",
        "organization": "Apollo Heart Institute",
        "interaction_type": "Clinic Visit",
        "interaction_date": "2026-05-10",
        "products_discussed": ["Cardiostat XR"],
        "notes": "Positive discussion. Requested outcomes data and follow-up next week.",
        "ai_summary": "Positive cardiology discussion focused on Cardiostat XR outcomes data.",
        "sentiment": "Positive",
        "follow_up_required": True,
        "follow_up_date": "2026-05-17",
        "action_items": ["Share approved outcomes data."],
        "next_best_action": "Send clinical data and confirm a follow-up slot.",
    }
    payload.update(overrides)
    return payload


def test_create_list_update_delete_interaction(client):
    created = client.post("/api/interactions", json=interaction_payload())
    assert created.status_code == 201
    interaction = created.json()
    assert interaction["id"]
    assert interaction["products_discussed"] == ["Cardiostat XR"]

    listed = client.get("/api/interactions")
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    stats = client.get("/api/interactions/stats")
    assert stats.status_code == 200
    assert stats.json()["positive_interactions"] == 1

    updated = client.put(f"/api/interactions/{interaction['id']}", json={"sentiment": "Neutral"})
    assert updated.status_code == 200
    assert updated.json()["sentiment"] == "Neutral"

    deleted = client.delete(f"/api/interactions/{interaction['id']}")
    assert deleted.status_code == 204

    missing = client.get(f"/api/interactions/{interaction['id']}")
    assert missing.status_code == 404


def test_validation_errors_are_explicit(client):
    response = client.post("/api/interactions", json=interaction_payload(hcp_name="A", notes="tiny"))
    assert response.status_code == 422
    messages = [error["msg"] for error in response.json()["detail"]]
    assert any("at least 2 characters" in message for message in messages)
    assert any("at least 5 characters" in message for message in messages)
