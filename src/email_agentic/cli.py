"""Secret-safe command line diagnostics and explicit gateway smoke test."""

import argparse
import sys
from collections.abc import Sequence

from pydantic import ValidationError

from email_agentic.gateway import GatewayError, smoke_gateway
from email_agentic.settings import Settings


def doctor(settings: Settings) -> int:
    missing = settings.missing_gateway_fields()
    print("Offline configuration report (presence only; no connectivity checks)")
    if missing:
        print("Gateway: missing " + ", ".join(missing))
    else:
        print("Gateway: configured")
    embedding_configured = settings.embedding_api_key is not None and settings.embedding_model
    print("Embeddings (optional): " + ("configured" if embedding_configured else "not configured"))
    print("PostgreSQL (optional): " + ("configured" if settings.postgres_dsn else "not configured"))
    neo4j_configured = settings.neo4j_uri and settings.neo4j_user and settings.neo4j_password
    print("Neo4j (optional): " + ("configured" if neo4j_configured else "not configured"))
    return 1 if missing else 0


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="email-agentic")
    parser.add_argument("command", choices=["doctor", "llm-smoke"])
    args = parser.parse_args(argv)
    try:
        settings = Settings()
    except ValidationError as error:
        fields = sorted({str(item["loc"][0]).upper() for item in error.errors() if item["loc"]})
        print("Invalid configuration: " + ", ".join(fields), file=sys.stderr)
        return 2
    if args.command == "doctor":
        return doctor(settings)
    try:
        smoke_gateway(settings)
    except GatewayError as error:
        print(str(error), file=sys.stderr)
        return 1
    print("Gateway smoke succeeded: received a non-empty chat completion (content withheld)")
    return 0
