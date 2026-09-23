from datetime import datetime, timezone
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException

from ..database import db
from ..models import CampaignInput
from ..security import ApiPrincipal, require_scope

router = APIRouter(prefix="/campaigns", tags=["Campanhas administrativas"])
BASE_PATHS = {"email": "/newsletters", "legal": "/legal", "changelog": "/updates", "knowledge": "/ajuda", "in_app": "/comunicados", "status": "/status", "blog": "/blog"}


def markdown_sections(body: str):
    sections = []
    for block in [value.strip() for value in body.split("\n\n") if value.strip()]:
        lines = [value.strip() for value in block.splitlines() if value.strip()]
        if lines and lines[0].startswith("#"):
            sections.append({"heading": lines[0].lstrip("# "), "paragraphs": [" ".join(lines[1:])] if len(lines) > 1 else []})
        elif sections:
            sections[-1]["paragraphs"].append(" ".join(lines))
        else:
            sections.append({"heading": "Documento", "paragraphs": [" ".join(lines)]})
    return sections or [{"heading": "Documento", "paragraphs": ["Conteúdo em atualização."]}]


@router.get("")
async def list_campaigns(_: Annotated[ApiPrincipal, Depends(require_scope("campaigns:read"))]):
    return await db.request("GET", "communication_campaigns", params={"select": "*,communication_items(*)", "order": "updated_at.desc", "limit": "100"})


@router.post("", status_code=201)
async def create_campaign(input: CampaignInput, _: Annotated[ApiPrincipal, Depends(require_scope("campaigns:write"))]):
    channels = list(dict.fromkeys(item.channel for item in input.items))
    campaign_id = str(uuid4())
    campaign = {"id": campaign_id, "internal_name": input.internal_name, "title": input.title, "summary": input.summary, "status": "draft", "selected_channels": channels, "audience_rules": input.audience_rules, "campaign_tags": input.tags, "scheduled_for": input.scheduled_for.isoformat() if input.scheduled_for else None, "timezone": input.timezone}
    await db.request("POST", "communication_campaigns", json=campaign)
    items = [{"campaign_id": campaign_id, "channel": item.channel, "title": item.title, "slug": item.slug, "public_path": f"{BASE_PATHS[item.channel]}/{item.slug}", "is_public": item.is_public, "payload": item.payload, "audience_rules": input.audience_rules, "scheduled_for": campaign["scheduled_for"]} for item in input.items]
    try:
        await db.request("POST", "communication_items", json=items)
    except Exception:
        await db.request("DELETE", "communication_campaigns", params={"id": f"eq.{campaign_id}"}, prefer="return=minimal")
        raise
    return {"id": campaign_id, "status": "draft", "items": len(items)}


@router.post("/{campaign_id}/publish")
async def publish_campaign(campaign_id: str, _: Annotated[ApiPrincipal, Depends(require_scope("campaigns:write"))]):
    now = datetime.now(timezone.utc).isoformat()
    campaigns = await db.request("PATCH", "communication_campaigns", params={"id": f"eq.{campaign_id}"}, json={"status": "published", "published_at": now})
    if not campaigns:
        raise HTTPException(status_code=404, detail="Campanha não encontrada.")
    await db.request("PATCH", "communication_items", params={"campaign_id": f"eq.{campaign_id}"}, json={"status": "published", "published_at": now})
    legal_items = await db.request("GET", "communication_items", params={"select": "title,slug,payload", "campaign_id": f"eq.{campaign_id}", "channel": "eq.legal"})
    for item in legal_items:
        payload = item.get("payload") or {}
        await db.request("POST", "legal_documents", json={"slug": item["slug"], "title": item["title"], "short_description": str(payload.get("tldr") or ""), "department": "Jurídico & Produto", "version": str(payload.get("version") or "1.0"), "sections": markdown_sections(str(payload.get("body") or "")), "related_features": [], "pdf_href": "", "is_published": True, "effective_at": str(payload.get("effective_date") or now[:10])}, prefer="resolution=merge-duplicates,return=representation")
    return {"id": campaign_id, "status": "published", "published_at": now}
