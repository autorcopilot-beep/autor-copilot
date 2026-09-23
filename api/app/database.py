from typing import Any

import httpx

from .config import get_settings


class SupabaseRest:
    def __init__(self) -> None:
        settings = get_settings()
        self.base_url = f"{str(settings.supabase_url).rstrip('/')}/rest/v1"
        self.headers = {
            "apikey": settings.supabase_secret_key,
            "Authorization": f"Bearer {settings.supabase_secret_key}",
            "Content-Type": "application/json",
        }

    async def request(self, method: str, table: str, *, params: dict[str, str] | None = None, json: Any = None, prefer: str = "return=representation") -> Any:
        headers = {**self.headers, "Prefer": prefer}
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.request(method, f"{self.base_url}/{table}", params=params, json=json, headers=headers)
        response.raise_for_status()
        return response.json() if response.content else None


db = SupabaseRest()
