import httpx
import pytest

from email_agentic.cli import main


def reject_network(*args: object, **kwargs: object) -> None:
    raise AssertionError("An offline command attempted network access")


def test_doctor_is_offline_and_reports_missing_configuration(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setattr(httpx.Client, "send", reject_network)
    assert main(["doctor"]) == 1
    output = capsys.readouterr().out
    assert "LLM_BASE_URL" in output
    assert "presence only" in output
    assert "Embeddings (optional): not configured" in output


def test_doctor_configured_does_not_disclose_values(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setattr(httpx.Client, "send", reject_network)
    monkeypatch.setenv("LLM_BASE_URL", "https://private-gateway.invalid/v1")
    monkeypatch.setenv("LLM_API_KEY", "private-secret")
    monkeypatch.setenv("LLM_MODEL", "private-model")
    assert main(["doctor"]) == 0
    output = capsys.readouterr().out
    assert "Gateway: configured" in output
    assert "private" not in output


def test_bad_settings_error_discloses_field_names_only(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setenv("LLM_BASE_URL", "https://user:private-secret@host.invalid/v1")
    assert main(["doctor"]) == 2
    output = capsys.readouterr().err
    assert "LLM_BASE_URL" in output
    assert "private-secret" not in output
    assert "host.invalid" not in output


def test_smoke_without_config_never_contacts_network(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setattr(httpx.Client, "send", reject_network)
    assert main(["llm-smoke"]) == 1
    assert "Missing required configuration" in capsys.readouterr().err
