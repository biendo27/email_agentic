import json

import httpx
import pytest
from pydantic import AnyHttpUrl, SecretStr

from email_agentic.gateway import GatewayError, smoke_gateway
from email_agentic.settings import Settings


def configured_settings() -> Settings:
    return Settings(
        llm_base_url=AnyHttpUrl("https://gateway.invalid/v1/"),
        llm_api_key=SecretStr("private-token"),
        llm_model="selected-model",
        llm_timeout_seconds=7,
    )


def test_smoke_sends_one_request_with_configured_contract() -> None:
    requests: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        assert str(request.url) == "https://gateway.invalid/v1/chat/completions"
        assert request.headers["Authorization"] == "Bearer private-token"
        payload = json.loads(request.content)
        assert payload["model"] == "selected-model"
        assert payload["stream"] is False
        assert payload["max_tokens"] == 16
        assert request.extensions["timeout"] == {"connect": 7, "read": 7, "write": 7, "pool": 7}
        return httpx.Response(200, json={"choices": [{"message": {"content": "OK"}}]})

    smoke_gateway(configured_settings(), transport=httpx.MockTransport(handle))
    assert len(requests) == 1


@pytest.mark.parametrize("status", [301, 401, 429, 500])
def test_provider_errors_and_redirects_are_safe_and_not_retried(status: int) -> None:
    requests: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        return httpx.Response(
            status,
            text="private-token provider internals",
            headers={"Location": "https://other.invalid"},
        )

    with pytest.raises(GatewayError) as error:
        smoke_gateway(configured_settings(), transport=httpx.MockTransport(handle))
    assert str(status) in str(error.value)
    assert "private" not in str(error.value)
    assert len(requests) == 1


@pytest.mark.parametrize("failure", [httpx.ConnectError, httpx.ReadTimeout])
def test_transport_errors_never_echo_exception_content(failure: type[httpx.RequestError]) -> None:
    def handle(request: httpx.Request) -> httpx.Response:
        raise failure("private-token secret URL", request=request)

    with pytest.raises(GatewayError) as error:
        smoke_gateway(configured_settings(), transport=httpx.MockTransport(handle))
    assert "private" not in str(error.value)


@pytest.mark.parametrize(
    "body",
    [
        b"not json private-token",
        b"{}",
        b'{"choices":[]}',
        b'{"choices":[{"message":{"content":null}}]}',
    ],
)
def test_invalid_completion_is_rejected_without_body_leak(body: bytes) -> None:
    def handle(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, content=body)

    with pytest.raises(GatewayError) as error:
        smoke_gateway(configured_settings(), transport=httpx.MockTransport(handle))
    assert "private" not in str(error.value)
