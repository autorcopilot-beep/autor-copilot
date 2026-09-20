# Linguagem visual — aplicativo de escrita

> Guia de identidade e interface para um espaço de criação literária, planejamento de histórias e escrita de longa duração. O nome do produto permanece em aberto; este documento define a direção visual sem depender dele.

## 1. Identidade e atmosfera

A experiência deve lembrar uma página bem composta: silenciosa, organizada e confortável. O texto do escritor ocupa o primeiro plano; controles aparecem quando ajudam a escrever, revisar ou navegar pela obra. Preto e branco suavizados formam a base, cinzas organizam a hierarquia e um verde profundo identifica a marca e as ações importantes.

O produto deve parecer contemporâneo e editorial, sem copiar a aparência de um processador de textos corporativo. A tela inicial pode exibir projetos e progresso; o editor reduz a presença visual de ferramentas. Evitar grandes blocos verdes, efeitos decorativos, gradientes, painéis saturados e animações que disputem a atenção com a escrita.

**Princípios:** legibilidade antes de densidade; foco antes de ornamentação; continuidade entre desktop e celular; controle do usuário sobre sua experiência de leitura.

---

## 2. Paleta de cores e papéis

### Tema claro — padrão

| Papel | Token | Cor | Aplicação |
| --- | --- | --- | --- |
| Fundo do editor | `--color-editor` | `#FAFAF7` | Página de escrita e leitura longa |
| Fundo da interface | `--color-canvas` | `#F1F2EF` | Áreas externas à página e barras laterais |
| Superfície elevada | `--color-surface` | `#FFFFFF` | Menus, diálogos, cartões e campos |
| Texto principal | `--color-text` | `#292B29` | Manuscrito, títulos e controles essenciais |
| Texto secundário | `--color-text-secondary` | `#666B66` | Metadados, descrições e navegação auxiliar |
| Divisória | `--color-border` | `#E2E5E0` | Separação discreta de superfícies |
| Marca e ação | `--color-accent` | `#356B55` | Botão principal, links, seleção e estado ativo |
| Verde suave | `--color-accent-subtle` | `#E5EFE8` | Item selecionado, etiqueta e realce leve |
| Texto sobre verde | `--color-on-accent` | `#FFFFFF` | Botão principal |

O texto `#292B29` sobre `#FAFAF7` tem contraste aproximado de **13,64:1**. O texto secundário `#666B66` sobre o fundo do editor tem **5,20:1**; sobre `#F1F2EF`, **4,84:1**. O branco sobre o verde principal tem **6,20:1**. Esses pares atendem à referência WCAG AA de 4,5:1 para texto comum; novas combinações precisam ser verificadas antes de entrar no produto.

### Tema escuro — opção do escritor

| Papel | Token | Cor | Aplicação |
| --- | --- | --- | --- |
| Fundo do editor | `--color-editor` | `#1B1D1B` | Página de escrita |
| Fundo da interface | `--color-canvas` | `#171917` | Área externa e barras laterais |
| Superfície elevada | `--color-surface` | `#242724` | Menus e diálogos |
| Texto principal | `--color-text` | `#E7EAE5` | Manuscrito e títulos |
| Texto secundário | `--color-text-secondary` | `#AEB8B0` | Metadados e controles auxiliares |
| Divisória | `--color-border` | `#343A35` | Separadores |
| Marca e ação | `--color-accent` | `#9BC8AA` | Links, seleção e foco |
| Verde suave | `--color-accent-subtle` | `#263A2D` | Seleções discretas |
| Texto sobre verde | `--color-on-accent` | `#1B1D1B` | Botão principal |

No modo escuro, o verde muda de intensidade para continuar legível. Não reutilizar `#356B55` como texto pequeno sobre superfícies escuras. Manter as preferências de tema por usuário e oferecer **claro**, **escuro** e **acompanhar o sistema**.

### Regras de uso

- O verde identifica ações, links e estados selecionados; não deve colorir parágrafos inteiros.
- Texto longo usa sempre a cor principal. Cinza secundário serve para metadados, nunca para o manuscrito.
- Erros e avisos podem ter cores semânticas próprias quando necessários, sempre com rótulo ou ícone além da cor. Esses estados não integram a identidade principal.
- Seleção de texto e destaque de citações devem permanecer suaves. Verificar contraste tanto no tema claro quanto no escuro.

---

## 3. Tipografia

### Famílias

| Contexto | Fonte | Alternativas |
| --- | --- | --- |
| Editor, leitura e trechos literários | **Literata** | Georgia, serif |
| Interface, navegação, formulários e métricas | **Inter** | system-ui, sans-serif |

Literata dá caráter editorial ao manuscrito; Inter oferece leitura clara em controles de interface. O usuário pode escolher uma fonte alternativa para o editor sem alterar a identidade dos menus. Usar os arquivos das fontes com suporte completo a acentos e caracteres necessários ao português.

### Escala inicial

| Elemento | Fonte | Tamanho | Peso | Entrelinha | Largura de uso |
| --- | --- | --- | --- | --- | --- |
| Texto do editor | Literata | 19 px | 400 | 1,65 | 65–75 caracteres por linha |
| Título do documento | Literata | 30 px | 600 | 1,25 | Alinhado à coluna de texto |
| Título de seção | Inter | 22 px | 600 | 1,3 | Painéis e páginas de projeto |
| Texto da interface | Inter | 15 px | 400 | 1,5 | Navegação e descrições |
| Botões e campos | Inter | 14–16 px | 500 | 1,4 | Rótulos de ações |
| Metadados | Inter | 13–14 px | 400 | 1,45 | Contagem, data, estado |

O editor inicia em 19 px, mas oferece ajuste de **16 a 24 px**, entrelinha e largura da coluna. Não aplicar espaçamento negativo aos parágrafos. Itálico e negrito fazem parte dos recursos de escrita; preservar a distinção dessas formatações no manuscrito.

---

## 4. Componentes e estados

### Botões

| Variante | Padrão | Hover | Foco de teclado | Uso |
| --- | --- | --- | --- | --- |
| Principal | Fundo verde, texto contrastante | Verde ligeiramente mais escuro no claro; mais claro no escuro | Anel externo visível | Criar projeto, confirmar ação |
| Secundário | Superfície neutra, texto principal | Fundo cinza suave | Anel externo visível | Organizar, exportar |
| Discreto | Sem preenchimento | Fundo neutro suave | Anel externo visível | Barra do editor, ações frequentes |

Estados desabilitados precisam continuar reconhecíveis e exibir uma explicação quando a indisponibilidade não for óbvia. Alvos clicáveis ou tocáveis devem ser confortáveis; usar pelo menos **40 × 40 px** nos controles frequentes e **44 × 44 px** como referência no celular.

### Campos, links e seleção

- **Campos:** superfície branca no tema claro; borda `--color-border`; texto principal; borda ou anel verde no foco. Placeholder não substitui o rótulo.
- **Links:** verde principal; sublinhado no conteúdo textual para diferenciá-los do texto comum. Mostrar estado de hover e foco.
- **Item ativo:** combinar fundo verde suave, texto legível e um marcador adicional quando necessário. Evitar depender apenas da cor.
- **Foco de teclado:** anel externo de 2 px, com afastamento de 2 px. No claro, `#356B55`; no escuro, `#9BC8AA`. Não ocultar o foco nativo sem oferecer substituto igualmente visível.
- **Salvamento:** estado discreto com texto (“Salvando…”, “Salvo”, “Sem conexão”), sem alertas repetitivos enquanto a pessoa escreve.

### Editor

A página de escrita usa `--color-editor` e tem o manuscrito centralizado. A barra de ferramentas pode permanecer compacta e expandir por comando ou seleção. Painéis de personagens, capítulos, anotações e linha do tempo devem poder ser recolhidos sem alterar a largura escolhida para o texto de forma inesperada.

Menções com `@` a personagens, locais ou eventos podem usar verde de maneira sutil; durante a edição, devem permanecer legíveis como parte da frase. Relações e análises aparecem em painéis próprios, sem sobrepor o manuscrito.

---

## 5. Layout e espaçamento

Usar escala de 4 px: **4, 8, 12, 16, 24, 32, 48 e 64 px**. A coluna de escrita é definida preferencialmente por caracteres (`ch`), com limite inicial de **68ch**, largura fluida e margens generosas. Não esticar o manuscrito para preencher monitores grandes.

| Área | Orientação |
| --- | --- |
| Editor desktop | Coluna de até `68ch`, centralizada; margem lateral adaptável |
| Editor no celular | Ocupa a largura disponível com 16–20 px de respiro lateral |
| Barra lateral | Navegação por projetos, capítulos e referências; recolhível |
| Painel de contexto | Personagens, notas e análise; aberto sob demanda |
| Topo | Título, estado de salvamento e poucas ações de maior frequência |

No **modo foco**, ocultar painéis secundários e reduzir controles persistentes. O título do documento e o estado de salvamento continuam acessíveis. Modos de leitura e revisão podem oferecer densidades próprias, mas devem respeitar tamanho de fonte e tema definidos pela pessoa.

---

## 6. Bordas, profundidade e movimento

Preferir superfícies distintas, espaço e divisórias de 1 px a sombras fortes. Usar bordas reais ou sombras de contorno conforme a necessidade técnica; não impor uma técnica única a todos os componentes.

| Elemento | Tratamento |
| --- | --- |
| Campos e botões | Raio de 8 px; borda discreta quando necessária |
| Cartões | Raio de 12 px; borda `--color-border` |
| Menus e diálogos | Raio de 12 px; sombra leve e superfície elevada |
| Página do editor | Sem contorno obrigatório; separação pelo espaço e pela superfície |

Transições simples de cor e abertura entre **120 e 200 ms** são suficientes. Evitar movimento do texto, efeitos de escala na página, animações automáticas e mudanças de layout durante a digitação. Respeitar a preferência do sistema por movimento reduzido.

---

## 7. Boas práticas e restrições

### Fazer

1. Dar prioridade visual ao conteúdo escrito e manter controles identificáveis.
2. Usar texto principal com contraste alto sobre a superfície do editor.
3. Aplicar o verde com propósito e verificar contraste em cada tema.
4. Permitir ajuste de fonte, entrelinha, largura da coluna e tema.
5. Exibir estados de salvamento e foco de teclado de forma clara.
6. Validar o editor com textos reais: diálogos, capítulos longos, itálicos, notas e menções.

### Evitar

1. Manuscrito em cinza claro ou verde.
2. Excesso de ferramentas à vista durante a escrita.
3. Linhas com largura total da tela em monitores grandes.
4. Verde ou outras cores como única indicação de estado.
5. Animações que deslocam o cursor ou o texto enquanto a pessoa digita.
6. Tamanhos fixos que impedem zoom do navegador e preferências do usuário.

---

## 8. Comportamento responsivo

As mudanças devem ocorrer quando o conteúdo deixa de caber bem, em vez de seguir uma lista extensa de aparelhos específicos.

| Faixa inicial | Comportamento |
| --- | --- |
| Até 599 px | Editor ocupa a tela; navegação e contexto abrem em painéis temporários; ações essenciais no topo |
| 600–959 px | Editor central; um painel lateral aberto por vez quando houver espaço |
| A partir de 960 px | Editor central e painéis laterais opcionais, sem alargar o texto além da largura escolhida |

Essas faixas são pontos de partida de implementação, não limites rígidos. Testar teclado virtual, seleção de texto, zoom de 200% e abertura de painéis em telas estreitas.

---

## 9. Guia rápido para implementação e criação de telas

```text
Produto: aplicativo minimalista para escritores.
Atmosfera: editorial, silenciosa, confortável para sessões longas.
Tema claro: editor #FAFAF7; interface #F1F2EF; superfície #FFFFFF.
Texto: principal #292B29; secundário #666B66; borda #E2E5E0.
Identidade: verde #356B55; verde suave #E5EFE8.
Tema escuro: editor #1B1D1B; texto #E7EAE5; verde #9BC8AA.
Fontes: Literata no manuscrito; Inter na interface.
Editor: 19 px, entrelinha 1,65, até 68ch, largura e fonte ajustáveis.
Espaçamento: escala de 4 px; raios de 8 e 12 px.
Interação: foco visível, autosave discreto, painéis recolhíveis.
Evitar: gradientes, ruído visual, texto longo em cinza claro e animações na digitação.
```

**Exemplo — tela de escrita:** página `#FAFAF7`, texto Literata 19 px em `#292B29`, coluna central de até `68ch`, entrelinha 1,65. Barra superior em Inter com título e estado de salvamento. Navegação por capítulos recolhível. Ferramentas adicionais aparecem sob demanda.

**Exemplo — biblioteca de projetos:** fundo `#F1F2EF`, cartões brancos com borda `#E2E5E0`, títulos em Inter 600 e descrições em `#666B66`. Botão “Novo projeto” em `#356B55` com texto branco. O verde aparece novamente apenas em estados ativos e pequenos destaques.

**Exemplo — painel de personagens:** superfície branca, campos claros, menções destacadas em verde suave, relações e frequência de aparição apresentadas com rótulos textuais e boa hierarquia. O painel se fecha sem interromper a posição do cursor no editor.

---

## 10. Referências de tipografia e acessibilidade

- [Literata — Google Fonts](https://fonts.google.com/specimen/Literata)
- [Inter — Google Fonts](https://fonts.google.com/specimen/Inter)
- [WCAG 2.2: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

*Versão 1.0 — identidade visual conceitual. Os exemplos de medidas e componentes são parâmetros iniciais para prototipação e validação com usuários.*
