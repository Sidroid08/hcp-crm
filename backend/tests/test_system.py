def test_root_and_health(client):
    root = client.get("/")
    assert root.status_code == 200
    assert root.json()["status"] == "ok"

    health = client.get("/health")
    assert health.status_code == 200
    body = health.json()
    assert body["service"] == "AI-First CRM HCP Module"
    assert "llm_provider" in body
