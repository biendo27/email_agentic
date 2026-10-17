"""Typed local configuration. Loading settings never contacts an integration."""

from typing import Any

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
        hide_input_in_errors=True,
    )

    llm_base_url: AnyHttpUrl | None = None
    llm_api_key: SecretStr | None = None
    llm_model: str | None = None
    llm_timeout_seconds: float = Field(default=30, gt=0, le=300, allow_inf_nan=False)
    embedding_base_url: AnyHttpUrl = AnyHttpUrl("https://openrouter.ai/api/v1")
    embedding_api_key: SecretStr | None = None
    embedding_model: str | None = None
    postgres_dsn: SecretStr | None = None
    neo4j_uri: str | None = None
    neo4j_user: str | None = None
    neo4j_password: SecretStr | None = None

    @field_validator(
        "llm_base_url",
        "llm_api_key",
        "llm_model",
        "embedding_api_key",
        "embedding_model",
        "postgres_dsn",
        "neo4j_uri",
        "neo4j_user",
        "neo4j_password",
        mode="before",
    )
    @classmethod
    def empty_is_missing(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
        return value

    @field_validator("llm_base_url", "embedding_base_url")
    @classmethod
    def url_has_no_credentials(cls, value: AnyHttpUrl | None) -> AnyHttpUrl | None:
        if value is not None:
            if value.username or value.password or value.query or value.fragment:
                raise ValueError("Use a plain endpoint URL; configure credentials separately")
        return value

    def missing_gateway_fields(self) -> list[str]:
        missing: list[str] = []
        if self.llm_base_url is None:
            missing.append("LLM_BASE_URL")
        if self.llm_api_key is None:
            missing.append("LLM_API_KEY")
        if self.llm_model is None:
            missing.append("LLM_MODEL")
        return missing
