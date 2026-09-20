# Editor de escrita

## Princípios

O editor do Autor Copilot é orientado a livros longos:

- o texto recebe prioridade visual;
- conteúdo e aparência de exportação permanecem separados;
- cada capítulo é um documento independente;
- o teclado acessa as ações essenciais;
- o trabalho é salvo sem depender de uma ação manual;
- o formato aberto será a saída padrão para evitar aprisionamento.

## Primeira entrega funcional

A rota protegida `/write` oferece:

- estrutura da obra à esquerda;
- manuscrito no centro;
- inspetor do capítulo à direita;
- criação e troca de capítulos;
- título da obra e do capítulo editáveis;
- sinopse, status e meta de palavras por capítulo;
- contador de palavras e caracteres;
- barra de progresso da meta;
- negrito, itálico, sublinhado, título de cena, citação e corpo;
- inserção de quebra de cena;
- desfazer e refazer;
- menu persistente baseado no Menubar do shadcn/ui, inclusive com submenu;
- exportação do capítulo em Markdown;
- instantâneos locais limitados aos vinte mais recentes;
- salvamento contínuo no dispositivo, isolado pela identidade do usuário;
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

## Limite atual de persistência

Esta primeira entrega é local-first no navegador e ainda não envia o manuscrito
para o Supabase. O status “Salvo neste dispositivo” descreve exatamente essa
garantia. A sincronização em nuvem só deve ser apresentada como concluída depois
da criação das tabelas, RLS, fila de sincronização, resolução de conflitos e
teste de restauração.

## Próximas etapas

1. Persistência de obras e documentos no Supabase com RLS.
2. Sincronização local/nuvem e tratamento de conflito.
3. Pastas, cenas, reordenação e exclusão protegida por snapshot.
4. Quadro de cortiça e outline.
5. Comentários, notas inline e notas de rodapé.
6. Busca global e localizar/substituir com instantâneo automático.
7. Entidades vinculadas por `@`.
8. Comparação e restauração de versões.
9. Compilação em DOCX, PDF e EPUB.
10. Testes de escala com manuscritos extensos e processamento fora da thread de
    digitação.
