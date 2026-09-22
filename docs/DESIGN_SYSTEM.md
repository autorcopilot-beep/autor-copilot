# Autor Copilot — design system

Esta documentação traduz a linguagem visual do produto em contratos de código.
A interface deve permanecer editorial, silenciosa e confortável em sessões
longas, com o conteúdo do escritor sempre em primeiro plano.

## Fundamentos

### Cores semânticas

Os componentes usam papéis, não valores hexadecimais diretamente:

| Papel | Classe Tailwind | Uso |
| --- | --- | --- |
| Fundo da aplicação | `bg-canvas` | Navegação e áreas externas |
| Fundo de leitura | `bg-editor` | Manuscrito e leitura longa |
| Superfície | `bg-surface` | Cartões, campos e menus |
| Texto principal | `text-ink` | Conteúdo e controles essenciais |
| Texto secundário | `text-muted` | Descrições e metadados |
| Ação principal | `bg-accent` | Confirmações e ações prioritárias |
| Seleção suave | `bg-accent-subtle` | Itens ativos e pequenos destaques |
| Foco | `ring-focus` | Indicação de teclado |

Os tokens ficam em `src/app/globals.css`. O tema claro é o padrão explícito e o
tema do sistema é respeitado quando não há uma preferência salva. Os atributos
`data-theme="light"` e `data-theme="dark"` são controlados pelo menu de
acessibilidade e persistidos apenas no navegador.

### Tipografia

- `font-sans`: Inter para interface, formulários e métricas.
- `font-serif`: Literata para manuscrito, leitura e títulos editoriais.
- `text-interface`: 15 px, entrelinha 1,5.
- `text-meta`: 13 px, entrelinha 1,45.
- `text-editor`: 19 px, entrelinha 1,65.
- `text-document-title`: 30 px, peso 600.
- `text-section-title`: 22 px, peso 600.
- `max-w-manuscript`: limite de 68 caracteres para leitura longa.

### Forma, espaço e movimento

- Controles usam `rounded-control` (8 px).
- Cartões usam `rounded-card` (12 px).
- Controles interativos têm alvo mínimo de 44 px.
- Transições de cor usam 150 ms.
- Sombras são discretas: `shadow-soft` e `shadow-floating`.
- A preferência `prefers-reduced-motion` reduz animações e transições globais.
- A preferência manual de movimento reduzido usa `data-reduce-motion="true"`.

## Componentes-base

Os componentes do shadcn/ui são copiados para `src/components/ui`, passam a
fazer parte do código do produto e são ajustados aos tokens editoriais. Eles
podem ser importados pelo índice:

```tsx
import { Button, Card, Input, Label } from '@/components/ui';
```

### Button

```tsx
<Button>Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Mais opções</Button>
<Button variant="danger">Excluir projeto</Button>
```

Para links com aparência de botão, use `buttonVariants`; não coloque um link
dentro de um botão nem um botão dentro de um link.

### Campo rotulado

```tsx
<div className="space-y-2">
  <Label htmlFor="email">E-mail</Label>
  <Input id="email" name="email" type="email" autoComplete="email" />
</div>
```

O placeholder nunca substitui o rótulo. Mensagens de erro devem ser associadas
ao campo com `aria-describedby` e não podem depender apenas de cor.

### Card

`Card` usa um elemento `section`. Forneça `aria-labelledby` quando o cartão
representar uma região identificável e associe-o ao título interno.

### Componentes compostos

A base atual também inclui Avatar, Badge, Breadcrumb, Checkbox, Collapsible,
Command, DataTable, Dialog, DropdownMenu, InputGroup, Menubar, Select, Table,
Textarea e StepFlow. O StepFlow concentra a navegação, o progresso e as animações dos
fluxos editoriais de cadastro e onboarding.

Cards devem ser usados quando a superfície ajuda a criar hierarquia. Nas
configurações da conta, prefira seções limpas separadas por borda para evitar
uma interface fragmentada.

## Regras de implementação

1. Não adicionar cores hexadecimais diretamente em componentes.
2. Não usar verde em parágrafos ou como única indicação de estado.
3. Preservar o foco visível; qualquer substituição precisa manter anel de 2 px.
4. Preferir texto a tooltips para explicar indisponibilidade importante.
5. Validar novos pares de cor em tema claro e escuro.
6. Testar zoom de 200%, teclado e larguras de 320, 600 e 960 px.

## Preferências de acessibilidade

O botão global é circular, pode ser arrastado e se aproxima das bordas laterais.
Ele abre um diálogo modal com gerenciamento de foco e fechamento por `Escape`.
As preferências controlam tema, tamanho do texto literário, entrelinha, largura
do manuscrito e redução de movimento. Consulte
[`ACCESSIBILITY.md`](ACCESSIBILITY.md) para o contrato de persistência.
