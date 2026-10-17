"""HTTP liveness only; integrations are not contacted during startup."""

from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])


class Liveness(BaseModel):
    status: Literal["alive"] = "alive"


@router.get("/healthz", response_model=Liveness)
def healthz() -> Liveness:
    """Confirm this HTTP process is serving, without asserting dependency readiness."""
    return Liveness()
