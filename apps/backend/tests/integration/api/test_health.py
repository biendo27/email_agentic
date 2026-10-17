from fastapi.testclient import TestClient

from email_agentic.api.app import app


def test_liveness_without_integration_settings() -> None:
    with TestClient(app) as client:
        response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "alive"}
