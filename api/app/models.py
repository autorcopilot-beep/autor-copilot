from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, Field

Channel = Literal["email", "legal", "changelog", "knowledge", "in_app", "status", "blog"]


class CampaignItemInput(BaseModel):
    channel: Channel
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=180)
    payload: dict[str, Any] = Field(default_factory=dict)
    is_public: bool = True


class CampaignInput(BaseModel):
    internal_name: str = Field(min_length=2, max_length=160)
    title: str = Field(min_length=2, max_length=180)
    summary: str = Field(default="", max_length=2000)
    tags: list[str] = Field(default_factory=list, max_length=20)
    scheduled_for: datetime | None = None
    timezone: str = "America/Sao_Paulo"
    audience_rules: dict[str, Any] = Field(default_factory=lambda: {"operator": "and", "rules": []})
    items: list[CampaignItemInput] = Field(min_length=1)


class ReceiptInput(BaseModel):
    user_id: UUID
    receipt_type: Literal["delivered", "opened", "clicked", "dismissed", "accepted"]
    metadata: dict[str, Any] = Field(default_factory=dict)
