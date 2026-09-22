# Status do projeto — Autor Copilot

Atualizado em **20 de setembro de 2026**.

Este é o documento de referência para o estado atual do produto. Ele separa o
que já está funcional, o que está apenas preparado na interface e o que ainda
faz parte do planejamento.

## Resumo executivo

| Área | Situação |
| --- | --- |
| Fundação Next.js, TypeScript e Tailwind | Concluída |
| Design system e shadcn/ui | Concluídos e em expansão |
| Cadastro, login e recuperação de conta | Funcionais |
| Cadastro e onboarding editoriais em etapas | Funcionais |
| Dashboard autenticada | Funcional e redesenhada |
| Biblioteca e catálogos | Funcionais com persistência no Supabase |
| Visão geral, atividade e metas | Funcionais por obra |
| Ambiente “Escrever” e editor | Funcional com salvamento local e no Supabase |
| Central de configurações da conta | Estrutura completa; perfil e e-mail funcionais |
| Foto de perfil e nome de usuário único | Funcionais |
| God Mode — The Vault | Steps 1 e 2 concluídos |
| God Mode — módulos operacionais | Steps 3 a 7 planejados |

## Fundação técnica

- Next.js 16 com App Router, React 19 e TypeScript estrito.
- Tailwind CSS com tokens semânticos para cores, tipografia, superfícies,
  foco, sombras, formas e movimento.
- Supabase separado entre cliente de navegador e cliente de servidor.
- Server Components e Server Actions para leitura e escrita protegidas.
- Proxy do Next.js responsável por renovar a sessão nas rotas necessárias.
- Zod para validação dos dados recebidos no servidor.
- shadcn/ui instalado como base local: os componentes ficam dentro do projeto
  e podem ser modificados sem dependência visual externa.
- Aliases de importação e organização por domínio em `src/features`.

## Autenticação e criação de conta

Estão funcionais:

- cadastro com nome completo, idade, apelido, e-mail e senha;
- confirmação de senha e validação das regras em tempo real;
- aceite de termos, privacidade e comunicações;
- revisão dos dados antes da criação da conta;
- validação integral no servidor;
- confirmação de e-mail;
- login com e-mail e senha;
- logout;
- recuperação de senha;
- atualização de senha;
- revogação das sessões anteriores depois da troca de senha;
- callback PKCE com destinos internos permitidos;
- respostas neutras nos fluxos sensíveis para reduzir enumeração de contas;
- proteção de `/onboarding`, `/dashboard` e `/account`.

Depois do login, o perfil define o destino:

- onboarding incompleto leva para `/onboarding`;
- onboarding concluído leva para `/dashboard`.

## Livro de cadastro e onboarding

O cadastro e o onboarding usam uma experiência editorial em etapas:

- componente reutilizável de fluxo por páginas;
- animações diferentes para avançar e voltar;
- entrada e saída coordenadas durante a troca de etapa;
- perspectiva, origem de transformação e verso oculto para dar profundidade à
  virada de página;
- redução ou remoção do movimento quando essa preferência está ativa;
- progresso com semântica acessível;
- anúncio da nova etapa para tecnologias assistivas.

O cadastro possui cinco etapas:

1. nome completo, idade e apelido;
2. e-mail;
3. senha e confirmação;
4. termos, privacidade e comunicações;
5. revisão e criação da conta.

O onboarding coleta:

- tipo de escrita;
- experiência;
- nome literário opcional.

Uma versão experimental com livro fechado e capa foi revertida a pedido. A
versão atual mantém o fluxo de páginas que foi aprovado.

## Dashboard do escritor

A dashboard autenticada foi refeita com uma direção mais editorial. Ela inclui:

- saudação personalizada e data;
- chamada principal para iniciar a primeira obra;
- atalho para completar ou revisar o perfil;
- resumo de obras, palavras e situação do perfil;
- estado vazio da biblioteca;
- atalhos de criação e organização preparados para futuras funções;
- jornada do autor;
- nota de escrita;
- ilustração em aquarela integrada ao fundo com máscara gradual e mesclagem;
- tratamento específico para o tema escuro, sem halo ou borrão indesejado;
- textura e tipografia editoriais.

### Navegação da dashboard

- header responsivo com controles em cápsulas;
- sidebar completa com módulos e subitens futuros;
- itens indisponíveis identificados por cadeado e tooltip “Em breve”;
- etiquetas ocultas quando a sidebar está recolhida;
- recolhimento e expansão no desktop;
- drawer no celular;
- sidebar fixa na área visível durante a rolagem da página;
- rolagem interna para listas extensas;
- scrollbar fina, verde e personalizada;
- largura e espaçamentos corrigidos no estado recolhido.

## Central de configurações da conta

A rota `/account` usa um layout próprio, sem a sidebar principal da dashboard.
O objetivo é manter as configurações concentradas e fáceis de percorrer.

O layout oferece:

- header opaco, sem efeito translúcido;
- breadcrumb com “Início” levando de volta à dashboard;
- navegação interna fixa no desktop;
- seletor de seção no celular;
- ilustração de configurações também visível no celular;
- aquarela integrada ao fundo e tratada para o tema escuro;
- seções limpas, separadas por bordas, sem excesso de cartões;
- valores ausentes apresentados como “Não informado”.

### Perfil — funcional

Em `/account/profile` já é possível:

- editar cada seção com o ícone de lápis;
- salvar ou descartar alterações localmente por seção;
- alterar identidade, preferências de escrita e região;
- persistir as alterações e recarregar os dados exibidos;
- usar listas suspensas e checkboxes reutilizáveis e personalizados;
- definir um nome de usuário público único no formato `@usuario_10`;
- validar nomes de usuário com letras minúsculas, números e sublinhado;
- detectar colisões e mostrar uma mensagem amigável.

### Foto de perfil — funcional

O editor de avatar permite:

- escolher JPG, PNG ou WebP;
- arrastar e reposicionar a imagem;
- ajustar o zoom;
- recortar em formato quadrado;
- gerar um WebP de 512 × 512 pixels;
- substituir ou remover a foto;
- limitar o arquivo final a 2 MB;
- exibir a foto na conta, no header e nos pontos de identidade do produto.

Os arquivos ficam em um bucket privado do Supabase Storage. A aplicação grava
somente o caminho no perfil e cria URLs assinadas no servidor para exibição.

### Login e e-mail — funcional

Em `/account/login` já existem:

- exibição do e-mail atual;
- situação da confirmação;
- provedor de acesso;
- data do último login e da confirmação;
- edição pelo ícone de lápis;
- ações de salvar e descartar;
- atualização pelo Supabase Auth;
- confirmação do novo endereço pelo callback PKCE;
- retorno seguro para `/account/login`;
- tratamento de links inválidos ou expirados.

Enquanto a troca não é confirmada, o endereço atual continua ativo.

### Seções preparadas

As seguintes áreas já aparecem na navegação e continuam bloqueadas com indicação
“Em breve” até a implementação:

- segurança e senha;
- sessões e dispositivos;
- preferências de escrita;
- aparência e acessibilidade da conta;
- notificações;
- comunicações;
- privacidade e dados;
- inteligência artificial;
- uso e créditos;
- armazenamento;
- integrações;
- colaboração;
- equipe;
- área de risco e encerramento de conta.

## Ambiente de escrita e editor

As rotas protegidas `/write/editor`, `/write/chapters`, `/write/scenes` e
`/write/notes` formam o núcleo de escrita do produto:

- estrutura de capítulos recolhível;
- página central de manuscrito;
- inspetor de sinopse, status e meta;
- deep links para cada visão e para o documento aberto;
- criação e alternância entre páginas, capítulos, cenas, notas, pastas e
  rascunhos;
- menu contextual para mover, categorizar e apagar itens do manuscrito;
- visões funcionais e filtradas de capítulos, cenas e notas;
- formatação textual essencial;
- menu do shadcn/ui com menus, atalhos e submenu;
- quebra de cena;
- contador de palavras e caracteres;
- progresso da meta;
- salvamento contínuo no dispositivo e no Supabase;
- estado visível de sincronização, modo offline e falha de nuvem;
- restauração após recarregar;
- instantâneos locais e remotos;
- exportação do capítulo em Markdown;
- modo sem distrações;
- modo máquina de escrever;
- interface adaptada ao celular;
- entrada liberada na sidebar e na dashboard.

Resolução explícita de conflitos entre dispositivos, cortiça, outline,
comentários, busca global e compilação continuam planejados. O escopo detalhado está em
[EDITOR.md](EDITOR.md).

## Biblioteca editorial

A Biblioteca está disponível por deep links e integrada ao editor:

- `/library/all` reúne todas as obras ativas;
- `/library/recent` mostra os projetos atualizados por último;
- `/library/favorites` mantém a seleção do autor;
- `/library/archived` guarda projetos retirados da estante;
- `/library/catalogs` reúne coleções personalizadas;
- `/library/catalogs/<id>` abre uma coleção específica;
- `/write/editor?work=<id>` abre diretamente o manuscrito escolhido.

O módulo permite criar obras e catálogos, pesquisar, ordenar, favoritar,
arquivar, restaurar, mudar o estágio editorial e associar uma obra a várias
coleções. As capas usam tons editoriais e exibem contagem de documentos,
palavras e progresso da meta. A dashboard apresenta os números e projetos
recentes reais da Biblioteca.

As tabelas `library_catalogs` e `library_catalog_works` usam RLS por autor. Os
metadados editoriais, favoritos e arquivamento ficam na tabela `works`.

## Visão geral da obra

O módulo `/overview` usa dados reais do manuscrito e mantém a obra selecionada
nos deep links:

- `/overview/dashboard` apresenta palavras, capítulos, cenas, notas, documentos
  finalizados, progresso geral e documentos recentes;
- `/overview/activity` organiza as últimas alterações dos documentos em uma
  linha do tempo;
- `/overview/goals` permite criar, concluir, reabrir e apagar metas de palavras,
  capítulos ou prazo editorial;
- o parâmetro `?work=<id>` abre diretamente o painel de uma obra.

As metas são persistidas em `writing_goals`, com RLS por autor e vínculo à obra.

## Acessibilidade e preferências de leitura

- botão global representado por um ícone circular;
- movimentação livre por arraste;
- atração para as bordas laterais;
- opção de mostrar ou ocultar;
- tema claro, escuro ou sistema;
- tamanho do texto;
- entrelinha;
- largura do conteúdo;
- redução de movimento;
- persistência local das escolhas;
- sincronização das preferências entre abas;
- foco contido e retorno de foco no diálogo;
- suporte a teclado e tecla Escape.

## Componentes reutilizáveis

A base em `src/components/ui` inclui componentes locais como:

- Button, Input, Label, Textarea e InputGroup;
- Card, Badge e Avatar;
- Breadcrumb;
- Checkbox e Select personalizados;
- Dialog, DropdownMenu, Collapsible e Command;
- Table e DataTable;
- StepFlow para fluxos editoriais por etapas.
- Menubar para os comandos persistentes do editor.

Novos componentes do shadcn/ui devem ser trazidos para essa mesma pasta e
ajustados aos tokens e à linguagem editorial do Autor Copilot.

## God Mode — Admin Center

### Step 1 — Fundação, RBAC e segurança: concluído

- rotas públicas de cadastro administrativo bloqueadas;
- login e logout exclusivos do Admin Center;
- criação idempotente do primeiro Master por script isolado;
- página exclusiva do Master para convidar novos administradores;
- papéis `master`, `engineering`, `customer_experience`, `director`,
  `finance` e `product`;
- permissões granulares aplicadas no servidor;
- trilha de auditoria append-only desde a primeira operação;
- registro de ator, ação, alvo, data, IP, user-agent e estados anterior e novo;
- RLS nas tabelas administrativas;
- proteção das rotas administrativas conforme sessão, estado e papel.

Comando disponível:

```bash
npm run admin:create-master
```

### Step 2 — UI, navegação e tabelas: concluído

- identificação visual do ambiente:
  - produção em vermelho;
  - staging em azul;
  - local em verde;
- Command Palette por `Cmd+K` ou `Ctrl+K`;
- comandos filtrados pelas permissões do administrador;
- DataTable de alta densidade;
- ordenação;
- busca fuzzy;
- paginação;
- carregamento incremental;
- estados vazios e adaptação para telas menores;
- telas de administradores e auditoria construídas sobre esses componentes.

### Próximos passos do God Mode

**Step 3 — User & Tenant Hub**

- visão 360º do usuário;
- suspensão, bloqueio e exclusão;
- reset forçado de credenciais;
- gestão e revogação de sessões;
- shadowing com auditoria e ocultação de dados sensíveis.

**Step 4 — Feature Flags & Tags**

- motor de flags;
- kill switches e banners;
- rollout por percentual, plano, tag ou localização;
- tags operacionais como “Novo”, “Em breve” e “Beta”.

**Step 5 — Engine Room**

- gestão de cache;
- logs e reenvio de webhooks;
- configurações operacionais não sensíveis.

**Step 6 — Panopticon**

- painel de filas;
- indicadores de negócio;
- indicadores de erro e latência.

**Step 7 — Hardening**

- interface visual para MFA, com ativação funcional posterior;
- suporte futuro a TOTP e chave física;
- whitelist de IP por CIDR;
- revisão e testes de permissão por papel.

## Banco de dados e Supabase

### Perfil

- tabela `profiles` ligada ao usuário do Auth;
- criação automática do perfil após o cadastro;
- RLS limitando cada pessoa ao próprio perfil;
- campos de cadastro, onboarding, preferências e região;
- coluna `username` com índice único;
- preenchimento seguro dos usuários antigos;
- geração automática para novas contas;
- coluna `avatar_path` para o caminho privado da foto.

### Storage

- bucket privado `profile-avatars`;
- limite de 2 MB;
- formatos JPG, PNG e WebP;
- políticas separadas de leitura, inserção e exclusão;
- acesso limitado à pasta do próprio usuário.

### Migrations versionadas

1. `20260920005423_create_profiles.sql`
2. `20260920030255_add_registration_profile_fields.sql`
3. `20260920152224_create_admin_vault.sql`
4. `20260920170720_add_account_profile_fields.sql`
5. `20260920180328_add_profile_username_and_avatar_storage.sql`
6. `20260920191906_create_writing_core.sql`
7. `20260920203000_stabilize_writing_bootstrap.sql`
8. `20260920204000_ensure_initial_writing_documents.sql`
9. `20260920210000_create_library_hub.sql`
10. `20260920220000_create_writing_goals.sql`

Todas foram aplicadas ao projeto remoto. A estrutura do editor inclui `works`,
`writing_documents` e `writing_snapshots`, com RLS por autor, árvore ordenada,
categorias de documento e limites de conteúdo. A estrutura, o bucket, as
políticas, a unicidade dos nomes e uma atualização autenticada sob RLS foram
verificados nos ciclos correspondentes.

## Rotas principais

| Rota | Estado |
| --- | --- |
| `/register` | Cadastro funcional |
| `/login` | Login funcional |
| `/forgot-password` | Recuperação funcional |
| `/update-password` | Troca de senha funcional |
| `/auth/callback` | Callback PKCE funcional |
| `/onboarding` | Onboarding funcional |
| `/dashboard` | Dashboard autenticada funcional |
| `/library/all` | Acervo completo e funcional |
| `/library/recent` | Obras recentes |
| `/library/favorites` | Obras favoritas |
| `/library/archived` | Arquivo de obras |
| `/library/catalogs` | Catálogos editoriais |
| `/library/catalogs/[id]` | Conteúdo de um catálogo |
| `/overview/dashboard` | Painel de métricas da obra |
| `/overview/activity` | Atividade recente do manuscrito |
| `/overview/goals` | Metas editoriais funcionais |
| `/write` | Redireciona para `/write/editor` |
| `/write/editor` | Editor com persistência local e no Supabase |
| `/write/chapters` | Lista funcional de capítulos |
| `/write/scenes` | Lista funcional de cenas |
| `/write/notes` | Lista funcional de notas |
| `/account` | Central da conta funcional |
| `/account/profile` | Perfil, username e avatar funcionais |
| `/account/login` | E-mail e dados de acesso funcionais |
| `/admin/login` | Login administrativo funcional |
| `/admin` | Área administrativa protegida |
| `/admin/admins/new` | Criação de administradores pelo Master |

## Verificações realizadas

As entregas atuais passaram por:

- ESLint;
- verificação de tipos TypeScript;
- build de produção do Next.js;
- aplicação e inspeção das migrations remotas;
- verificação de RLS do perfil e do avatar;
- verificação de unicidade dos nomes de usuário;
- `npm audit` sem vulnerabilidades detectadas no último ciclo registrado.

## Pendências conhecidas

- implementar as seções da conta que ainda estão marcadas como “Em breve”;
- desenvolver os Steps 3 a 7 do God Mode;
- definir os fornecedores de Redis/CDN, filas, faturamento, suporte e APM antes
  dos módulos que dependem deles;
- ativar proteção contra senhas vazadas no Supabase Auth;
- revisar índices administrativos ainda sem uso quando houver volume real;
- executar testes manuais completos em aparelhos e leitores de tela antes da
  liberação pública.

## Documentação relacionada

- [Arquitetura](ARQUITETURA_INICIAL.md)
- [Autenticação](AUTH.md)
- [Design system](DESIGN_SYSTEM.md)
- [Acessibilidade](ACCESSIBILITY.md)
- [Admin Center — The Vault](admin-vault.md)
- [Editor de escrita](EDITOR.md)
