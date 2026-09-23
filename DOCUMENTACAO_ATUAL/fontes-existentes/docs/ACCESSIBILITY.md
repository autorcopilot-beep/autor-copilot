# Preferências de acessibilidade

O Autor Copilot oferece um botão global de acessibilidade representado por um
ícone circular. Ele pode ser arrastado livremente, possui atração pelas bordas
laterais e pode ser ocultado. Ao ser ativado, abre um diálogo com as
preferências que afetam diretamente a experiência de leitura e escrita.

## Preferências disponíveis

| Preferência | Opções | Padrão |
| --- | --- | --- |
| Tema | Sistema, claro ou escuro | Sistema |
| Tamanho do texto | 16 a 24 px | 19 px |
| Entrelinha | 1,5; 1,65; 1,8 | 1,65 |
| Largura do texto | 60ch, 68ch ou 75ch | 68ch |
| Redução de movimento | Ativada ou desativada | Desativada |

A preferência do sistema por movimento reduzido continua sendo respeitada mesmo
quando a opção manual está desativada.

## Persistência e privacidade

As escolhas são armazenadas no `localStorage` sob a chave
`autor-copilot:accessibility`. Nenhuma preferência é enviada ao servidor. Uma
alteração feita em outra aba é aplicada automaticamente às abas abertas.

Um script pequeno, executado antes da hidratação da página, restaura as escolhas
antes da primeira pintura. Isso evita a troca visível de tema e de medidas do
manuscrito durante o carregamento.

## Contrato técnico

- `preferences.ts`: tipos, validação, leitura, gravação e aplicação no documento.
- `bootstrap.ts`: restauração antecipada das preferências.
- `accessibility-menu.tsx`: botão, diálogo e controles.
- `--editor-font-size`: tamanho do texto literário.
- `--editor-line-height`: entrelinha do texto literário.
- `--manuscript-width`: largura máxima da coluna de leitura.
- `data-theme`: preferência explícita de tema.
- `data-reduce-motion`: redução manual de transições e animações.

## Comportamento acessível

- O diálogo possui título e descrição anunciáveis.
- O foco fica contido no diálogo enquanto ele está aberto.
- `Escape` fecha o painel e devolve o foco ao botão.
- Todos os controles funcionam pelo teclado.
- As opções têm alvos de pelo menos 44 px.
- Valores não reconhecidos no armazenamento são descartados com segurança.
- O arraste do botão não substitui sua ativação normal por clique ou teclado.
- As viradas de página do cadastro e onboarding respeitam tanto
  `prefers-reduced-motion` quanto a preferência manual.
