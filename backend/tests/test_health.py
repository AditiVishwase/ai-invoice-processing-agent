from app.api.health import get_health


def test_health_returns_service_status() -> None:
    response = get_health()

    assert response.model_dump() == {
        "status": "ok",
        "service": "AI Invoice Processing Agent",
        "environment": "development",
    }
