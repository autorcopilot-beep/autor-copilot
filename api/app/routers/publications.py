import re

from fastapi import APIRouter, HTTPException, Query

from ..database import db

router = APIRouter(prefix="/publications", tags=["Publicações"])


@router.get("")
async def list_publications(channel: str | None = None, limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)):
    params = {"select": "id,campaign_id,channel,title,slug,public_path,payload,seo,published_at", "status": "eq.published", "is_public": "eq.true", "order": "published_at.desc", "limit": str(limit), "offset": str(offset)}
    if channel:
        params["channel"] = f"eq.{channel}"
    return await db.request("GET", "communication_items", params=params)


@router.get("/{slug_or_id}")
async def get_publication(slug_or_id: str, channel: str | None = None):
    if not re.fullmatch(r"[a-zA-Z0-9-]{1,180}", slug_or_id):
        raise HTTPException(status_code=404, detail="Publicação não encontrada.")
    params = {"select": "id,campaign_id,channel,title,slug,public_path,payload,seo,published_at", "status": "eq.published", "is_public": "eq.true", "limit": "1"}
    params["id" if re.fullmatch(r"[0-9a-fA-F-]{36}", slug_or_id) else "slug"] = f"eq.{slug_or_id}"
    if channel:
        params["channel"] = f"eq.{channel}"
    rows = await db.request("GET", "communication_items", params=params)
    if not rows:
        raise HTTPException(status_code=404, detail="Publicação não encontrada.")
    return rows[0]
