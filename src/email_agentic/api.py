"""HTTP liveness only; integrations are not contacted during startup."""

from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Email Agentic", version="0.1.0")


class Liveness(BaseModel):
    status: Literal["alive"] = "alive"


@app.get("/healthz", response_model=Liveness)
def healthz() -> Liveness:
    """Confirm this HTTP process is serving, without asserting dependency readiness."""
    return Liveness()
