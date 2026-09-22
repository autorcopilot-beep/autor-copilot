# Guia de uso

## Imagem responsiva

```html
<img src="01_ilustracoes/romance.svg"
     alt="Cartas com laço verde e uma flor branca"
     width="1254" height="1254" loading="lazy"
     style="display:block;width:100%;height:auto;max-width:627px">
```

Se a ilustração repetir uma categoria já identificada por texto, use alt="". Titles e descriptions estão incorporados aos SVGs; o alt do img deve refletir o contexto de uso. Reserve espaço com width e height para evitar saltos de layout.

## Padrão de fundo

```css
.painel {
  background-color: #F7F5EC;
  background-image: url('../02_patterns/folhas-soltas.svg');
  background-repeat: repeat;
  background-size: 160px 160px;
}
```

As URLs CSS são relativas à folha de estilos. Os padrões têm tiles compatíveis nas bordas. Não altere a proporção. Use padrões e texturas longe de textos longos, ou adicione um painel sólido para preservar a leitura.

## Fundos e texturas

Fundos: background-size: cover; background-position: center. Algum corte é esperado em telas estreitas. Não há texto embutido. As texturas são sobreposições transparentes estáticas; use opacity: .25 a .6 conforme o fundo. Não são declaradas como texturas seamless.

## Edição

Os 22 vetores usam formas, curvas e gradientes SVG comuns, sem filtros pesados. Altere fills/strokes no arquivo para recolorir. Os oito híbridos devem ser editados como imagens; importadores que não aceitam imagens embutidas podem usar os PNGs originais. Não foi feita validação em todos os editores de design.

## Proveniência

Pinturas geradas com a ferramenta integrada de imagens, com direção de arte descrita em prompts.md. Vetores construídos em código para este kit. Não apresentam autoria humana nem exclusividade. A referência do usuário não é redistribuída no pacote. Não há fontes ou imagens de bancos externos incluídas.
