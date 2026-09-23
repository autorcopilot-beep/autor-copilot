from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from .database import db

api_key_header = APIKeyHeader(name="X-API-Key", description="Chave criada em Admin → APIs")


@dataclass
class ApiPrincipal:
    id: str
    name: str
    scopes: set[str]


async def current_api_key(api_key: Annotated[str, Depends(api_key_header)]) -> ApiPrincipal:
    digest = sha256(api_key.encode()).hexdigest()
    rows = await db.request("GET", "communication_api_keys", params={"select": "id,name,scopes,expires_at", "key_hash": f"eq.{digest}", "status": "eq.active", "limit": "1"})
    if not rows:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Chave de API inválida ou revogada.")
    row = rows[0]
    if row.get("expires_at") and datetime.fromisoformat(row["expires_at"].replace("Z", "+00:00")) <= datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Chave de API expirada.")
    await db.request("PATCH", "communication_api_keys", params={"id": f"eq.{row['id']}"}, json={"last_used_at": datetime.now(timezone.utc).isoformat()}, prefer="return=minimal")
    return ApiPrincipal(id=row["id"], name=row["name"], scopes=set(row["scopes"] or []))


def require_scope(scope: str):
    async def dependency(principal: Annotated[ApiPrincipal, Depends(current_api_key)]) -> ApiPrincipal:
        if scope not in principal.scopes:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"A chave não possui o escopo {scope}.")
        return principal
    return dependency
