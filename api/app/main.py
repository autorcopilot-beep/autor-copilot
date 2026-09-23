from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import campaigns, catalogs, channel_catalogs, publications, receipts

settings = get_settings()
app = FastAPI(
    title="Autor Copilot Publishing API",
    summary="Catálogos, publicações, campanhas e consentimentos do OmniPublish.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=False, allow_methods=["GET", "POST", "PATCH"], allow_headers=["Content-Type", "X-API-Key"])
app.include_router(catalogs.router, prefix="/v1")
app.include_router(channel_catalogs.router, prefix="/v1")
app.include_router(publications.router, prefix="/v1")
app.include_router(campaigns.router, prefix="/v1")
app.include_router(receipts.router, prefix="/v1")


@app.get("/health", tags=["Operação"])
async def health():
    return {"status": "ok", "service": "autor-copilot-publishing-api", "version": app.version}
