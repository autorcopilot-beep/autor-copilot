import re

from fastapi import APIRouter, HTTPException, Query

from ..database import db

router = APIRouter(tags=["Catálogos por canal"])


async def list_channel(channel: str, limit: int, offset: int):
    return await db.request("GET", "communication_items", params={"select": "id,channel,title,slug,public_path,payload,seo,published_at", "channel": f"eq.{channel}", "status": "eq.published", "is_public": "eq.true", "order": "published_at.desc", "limit": str(limit), "offset": str(offset)})


async def get_channel_item(channel: str, slug: str):
    if not re.fullmatch(r"[a-z0-9-]{1,180}", slug):
        raise HTTPException(status_code=404, detail="Publicação não encontrada.")
    rows = await db.request("GET", "communication_items", params={"select": "id,channel,title,slug,public_path,payload,seo,published_at", "channel": f"eq.{channel}", "slug": f"eq.{slug}", "status": "eq.published", "is_public": "eq.true", "limit": "1"})
    if not rows:
        raise HTTPException(status_code=404, detail="Publicação não encontrada.")
    return rows[0]


@router.get("/newsletters")
async def newsletters(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("email", limit, offset)
@router.get("/newsletters/{slug}")
async def newsletter(slug: str): return await get_channel_item("email", slug)

@router.get("/legal")
async def legal_documents(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("legal", limit, offset)
@router.get("/legal/{slug}")
async def legal_document(slug: str): return await get_channel_item("legal", slug)

@router.get("/updates")
async def updates(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("changelog", limit, offset)
@router.get("/updates/{slug}")
async def update(slug: str): return await get_channel_item("changelog", slug)

@router.get("/knowledge")
async def knowledge(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("knowledge", limit, offset)
@router.get("/knowledge/{slug}")
async def knowledge_article(slug: str): return await get_channel_item("knowledge", slug)

@router.get("/announcements")
async def announcements(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("in_app", limit, offset)
@router.get("/announcements/{slug}")
async def announcement(slug: str): return await get_channel_item("in_app", slug)

@router.get("/status")
async def status_updates(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("status", limit, offset)
@router.get("/status/{slug}")
async def status_update(slug: str): return await get_channel_item("status", slug)

@router.get("/blog")
async def blog_posts(limit: int = Query(24, ge=1, le=100), offset: int = Query(0, ge=0)): return await list_channel("blog", limit, offset)
@router.get("/blog/{slug}")
async def blog_post(slug: str): return await get_channel_item("blog", slug)
