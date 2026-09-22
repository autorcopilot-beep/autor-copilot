# Editor de escrita

## Princípios

O editor do Autor Copilot é orientado a livros longos:

- o texto recebe prioridade visual;
- conteúdo e aparência de exportação permanecem separados;
- cada capítulo é um documento independente;
- o teclado acessa as ações essenciais;
- o trabalho é salvo sem depender de uma ação manual;
- o formato aberto será a saída padrão para evitar aprisionamento.

## Entrega funcional atual

O ambiente protegido usa URLs próprias para cada visão:

- `/write/editor` para o manuscrito;
- `/write/chapters` para capítulos;
- `/write/scenes` para cenas;
- `/write/notes` para notas;
- `/write/encyclopedia` para personagens, lugares e demais entidades da obra;
- `/write/editor?work=<uuid>` para abrir uma obra específica;
- `/write/editor?work=<uuid>&document=<uuid>` para abrir um documento específico.

`/write` continua válido e redireciona para o editor. O ambiente oferece:

- estrutura da obra à esquerda;
- manuscrito no centro;
- inspetor do capítulo à direita;
- criação e troca de páginas, capítulos, cenas, notas, pastas e rascunhos;
- ações de mover, categorizar e apagar na árvore do manuscrito;
- exclusão protegida pela criação de um instantâneo;
- visões funcionais de capítulos, cenas e notas;
- título da obra e do capítulo editáveis;
- sinopse, status e meta de palavras por capítulo;
- contador de palavras e caracteres;
- barra de progresso da meta;
- negrito, itálico, sublinhado, título de cena, citação e corpo;
- inserção de quebra de cena;
- desfazer e refazer;
- menu compacto de ações e toolbar contextual de formatação;
- Enciclopédia com personagens, locais, organizações, objetos, conceitos e eventos;
- referências contextuais no manuscrito com `@`, busca por nome ou alias e navegação pelo teclado;
- cartão de contexto no Inspetor ao selecionar uma referência vinculada;
- visualização das referências em modo destacado ou como texto comum;
- verificação de vínculos removidos, contagens por capítulo e distribuição por tipo;
- metadados da entidade selecionada, incluindo aliases, atualização e identificador;
- exportação do capítulo em Markdown;
- instantâneos locais limitados aos vinte mais recentes e cópias no Supabase;
- salvamento contínuo no dispositivo e sincronização automática com o Supabase;
- atalho para salvar;
- modo máquina de escrever;
- modo sem distrações;
- painéis recolhíveis e comportamento adaptado para telas pequenas;
- restauração do rascunho após recarregar a página;
- higienização do HTML restaurado antes de inseri-lo no editor.

Atalhos atuais:

| Ação | Atalho |
| --- | --- |
| Salvar agora | `Ctrl/Cmd + S` |
| Negrito | `Ctrl/Cmd + B` |
| Itálico | `Ctrl/Cmd + I` |
| Sublinhado | `Ctrl/Cmd + U` |
| Modo sem distrações | `Ctrl/Cmd + Shift + F` |
| Modo máquina de escrever | `Ctrl/Cmd + Alt + T` |

## Persistência e segurança

O editor mantém uma cópia local para resposta imediata e envia a obra para as
tabelas `works`, `writing_documents`, `writing_snapshots` e
`encyclopedia_entries`. O salvamento local
ocorre primeiro; a interface diferencia sincronização concluída, sincronização
em andamento, trabalho offline e erro de nuvem.

As tabelas usam RLS e vinculam cada registro ao usuário autenticado. As
políticas permitem que cada autor leia e altere somente as próprias obras. O
conteúdo de cada documento é limitado a 5 MB e os vínculos compostos impedem
associar um documento ou uma pasta a uma obra de outro usuário.

Rascunhos locais criados na versão anterior são normalizados e enviados para a
nuvem quando o editor autenticado é aberto. O servidor cria a primeira obra e
os documentos iniciais quando a conta ainda não possui conteúdo.

## Próximas etapas

1. Resolução explícita de conflitos entre dispositivos e modo offline durável.
2. Hierarquia visual completa de pastas e arraste para reordenação.
3. Quadro de cortiça e outline.
4. Comentários, notas inline e notas de rodapé.
5. Busca global e localizar/substituir com instantâneo automático.
6. Relações entre entidades e detecção de inconsistências de continuidade.
7. Comparação e restauração de versões.
8. Compilação em DOCX, PDF e EPUB.
9. Testes de escala com manuscritos extensos e processamento fora da thread de
    digitação.
