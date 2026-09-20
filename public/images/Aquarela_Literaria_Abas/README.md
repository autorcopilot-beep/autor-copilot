# Aquarela Literária — Ilustrações para abas

Extensão da primeira coleção, com sete ilustrações sem texto, letras ou números dentro da imagem: dashboard, configurações, chat com IA, biblioteca, personagens, linha do tempo e notificações.

## Pastas

- `01_svg/`: SVGs autocontidos com pintura PNG incorporada.
- `02_png/`: as mesmas sete pinturas em PNG original.
- `03_documentacao/`: manifesto JSON e descrições de direção de arte.
- `PREVIA.jpg`: visão geral das artes.
- `GALERIA.html`: prévia local em layout responsivo.

Os SVGs têm dimensões 1254 × 1254 px e fundo claro opaco. Embora o contêiner seja SVG, cada aquarela interna é raster e não ganha detalhes novos quando ampliada. Use em cards de até ~627 px CSS para nitidez em telas 2×. O PNG pode reduzir a sobrecarga de base64 em produção. Use `<img src="01_svg/chat-ia.svg" alt="" width="1254" height="1254" loading="lazy">` em uma aba já nomeada por texto; o alt vazio evita repetir o nome da aba. Para imagem independente, forneça alt contextual.

Todas as ilustrações foram inspecionadas visualmente, os SVGs foram validados como XML e renderizados para conferir compatibilidade básica. O ZIP passou pela checagem CRC. Nenhum recurso externo é necessário.
