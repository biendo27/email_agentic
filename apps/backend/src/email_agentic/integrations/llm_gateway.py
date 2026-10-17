"""One explicit, bounded OpenAI-compatible chat completion request."""

import httpx

from email_agentic.core.settings import Settings


class GatewayError(Exception):
    """A safe CLI message; never includes provider content."""


def smoke_gateway(settings: Settings, *, transport: httpx.BaseTransport | None = None) -> None:
    missing = settings.missing_gateway_fields()
    if missing:
        raise GatewayError("Missing required configuration: " + ", ".join(missing))
    base_url = settings.llm_base_url
    api_key = settings.llm_api_key
    model = settings.llm_model
    assert base_url is not None and api_key is not None and model is not None
    endpoint = str(base_url).rstrip("/") + "/chat/completions"
    try:
        with httpx.Client(
            timeout=settings.llm_timeout_seconds,
            follow_redirects=False,
            transport=transport,
        ) as client:
            response = client.post(
                endpoint,
                headers={"Authorization": "Bearer " + api_key.get_secret_value()},
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": "Reply with OK."}],
                    "max_tokens": 16,
                    "stream": False,
                },
            )
    except httpx.TimeoutException:
        raise GatewayError("Gateway request timed out; check connectivity and timeout") from None
    except httpx.HTTPError:
        raise GatewayError("Gateway connection failed; check endpoint and connectivity") from None
    if not response.is_success:
        raise GatewayError(f"Gateway returned HTTP {response.status_code}; check access and model")
    try:
        content = response.json()["choices"][0]["message"]["content"]
    except (ValueError, KeyError, IndexError, TypeError):
        raise GatewayError("Gateway returned an unexpected chat completion response") from None
    if not isinstance(content, str) or not content.strip():
        raise GatewayError("Gateway returned no text; check model compatibility")
