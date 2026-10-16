#!/bin/sh
# Syntax/interpolation validation only; no containers or credential files are opened.
set -eu
POSTGRES_PASSWORD=validation-only-not-for-runtime \
NEO4J_PASSWORD=validation-only-not-for-runtime \
GRAFANA_ADMIN_PASSWORD=validation-only-not-for-runtime \
COMPOSE_POSTGRES_DSN=postgresql://validation:validation@postgres:5432/email_agentic \
docker compose --env-file /dev/null --profile app --profile observability config --quiet
