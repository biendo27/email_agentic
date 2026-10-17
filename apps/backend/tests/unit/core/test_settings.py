from pathlib import Path

import pytest
from pydantic import AnyHttpUrl, SecretStr, ValidationError
from pydantic_settings import SettingsConfigDict

from email_agentic.core.settings import Settings


def test_defaults_are_offline_and_missing_gateway() -> None:
    settings = Settings()
    assert settings.missing_gateway_fields() == ["LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL"]
    assert settings.llm_timeout_seconds == 30
    assert settings.embedding_api_key is None


def test_blank_configuration_is_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ["LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL", "NEO4J_PASSWORD"]:
        monkeypatch.setenv(name, "  ")
    settings = Settings()
    assert len(settings.missing_gateway_fields()) == 3
    assert settings.neo4j_password is None


@pytest.mark.parametrize("value", ["0", "-1", "301", "nan", "inf", "invalid"])
def test_timeout_is_positive_finite_and_bounded(
    monkeypatch: pytest.MonkeyPatch, value: str
) -> None:
    monkeypatch.setenv("LLM_TIMEOUT_SECONDS", value)
    with pytest.raises(ValidationError):
        Settings()


@pytest.mark.parametrize(
    "url",
    ["file:///private", "https://user:private@gateway.invalid/v1", "https://x.invalid?key=private"],
)
def test_gateway_rejects_unsupported_or_credential_bearing_url(url: str) -> None:
    with pytest.raises(ValidationError):
        Settings(llm_base_url=AnyHttpUrl(url))


def test_secret_values_are_redacted_from_representation() -> None:
    settings = Settings(
        llm_api_key=SecretStr("private-gateway-token"),
        embedding_api_key=SecretStr("private-embedding-token"),
        postgres_dsn=SecretStr("postgresql://user:private@host/db"),
        neo4j_password=SecretStr("private-graph-password"),
    )
    assert "private" not in repr(settings)


@pytest.mark.parametrize("field", ["llm_base_url", "embedding_base_url"])
@pytest.mark.parametrize(
    "url",
    ["http://gateway.invalid/v1", "http://192.168.1.2/v1", "http://localhost.evil.invalid/v1"],
)
def test_remote_provider_requires_encrypted_transport(field: str, url: str) -> None:
    with pytest.raises(ValidationError, match="Remote provider endpoints require HTTPS"):
        Settings.model_validate({field: url})


@pytest.mark.parametrize("field", ["llm_base_url", "embedding_base_url"])
@pytest.mark.parametrize(
    "url",
    [
        "https://gateway.invalid/v1",
        "http://localhost:8001/v1",
        "http://127.0.0.1:8001/v1",
        "http://[::1]:8001/v1",
    ],
)
def test_provider_accepts_https_and_loopback_development(field: str, url: str) -> None:
    assert str(getattr(Settings.model_validate({field: url}), field)) == url


def test_environment_takes_precedence_over_local_file(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    config_path = tmp_path / "local-config"
    config_path.write_text("LLM_MODEL=file-model\nUNRELATED=ignored\n", encoding="utf-8")
    monkeypatch.setenv("LLM_MODEL", "environment-model")

    class FileSettings(Settings):
        model_config = SettingsConfigDict(env_file=config_path)

    settings = FileSettings()
    assert settings.llm_model == "environment-model"
