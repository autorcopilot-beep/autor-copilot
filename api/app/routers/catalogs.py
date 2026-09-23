from fastapi import APIRouter, HTTPException

from ..database import db

router = APIRouter(prefix="/catalogs", tags=["Catálogos públicos"])


@router.get("")
async def list_catalogs():
    return await db.request("GET", "communication_catalogs", params={"select": "*", "is_public": "eq.true", "order": "display_order.asc"})


@router.get("/{channel}")
async def get_catalog(channel: str):
    rows = await db.request("GET", "communication_catalogs", params={"select": "*", "channel": f"eq.{channel}", "is_public": "eq.true", "limit": "1"})
    if not rows:
        raise HTTPException(status_code=404, detail="Catálogo não encontrado.")
    return rows[0]
