# Autor Copilot Publishing API

API FastAPI do OmniPublish. Os catálogos e publicações publicadas são públicos; campanhas, publicação e recibos exigem uma chave criada em **Admin → APIs** no cabeçalho `X-API-Key`.

```bash
cd api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py
```

Configure `.env` a partir de `.env.example`. Swagger fica em `/docs`, ReDoc em `/redoc` e a especificação OpenAPI em `/openapi.json`.

O serviço possui Dockerfile próprio porque o site Next.js continua publicado no Netlify, enquanto a API ASGI deve rodar em um host de containers.
