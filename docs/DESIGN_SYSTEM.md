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
`data-theme="light"` e `data-theme="dark"` já estão preparados para o controle
que será implementado na fase de acessibilidade.

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

## Componentes-base

Os componentes estão em `src/components/ui` e podem ser importados pelo índice:

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

## Regras de implementação

1. Não adicionar cores hexadecimais diretamente em componentes.
2. Não usar verde em parágrafos ou como única indicação de estado.
3. Preservar o foco visível; qualquer substituição precisa manter anel de 2 px.
4. Preferir texto a tooltips para explicar indisponibilidade importante.
5. Validar novos pares de cor em tema claro e escuro.
6. Testar zoom de 200%, teclado e larguras de 320, 600 e 960 px.
