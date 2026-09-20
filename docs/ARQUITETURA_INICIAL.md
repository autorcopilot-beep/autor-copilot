# Autor Copilot — arquitetura inicial

- `src/app`: rotas Next.js; grupos `(site)`, `(auth)` e `(workspace)` preparados para páginas futuras. A página `/` é uma apresentação inicial.
- `src/components`: componentes reutilizáveis de layout, interface e editor.
- `src/features`: código organizado por domínio (conta, projetos, manuscrito, personagens, cronologia e análise).
- `src/lib`, `src/hooks`, `src/types`, `src/styles`: utilitários, hooks, tipos e estilos adicionais.
- `images`: arquivos originais informados pelo autor; `public/images`: cópia acessível pela aplicação, com favicon e logos.
- Cores e tipografia: `DESIGN.md`; Tailwind 3.4.1 em `tailwind.config.ts` e `src/app/globals.css`.

Ainda não há autenticação, banco de dados, editor persistente nem pagamentos; os diretórios representam os limites iniciais dos módulos.
