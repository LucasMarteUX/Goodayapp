# Gooday — `design.md`

> **Documento de implementação visual e regras de frontend**
>
> Este arquivo é a referência operacional para qualquer pessoa ou agente que criar, editar ou revisar interfaces do Gooday.
>
> **Regra principal:** as imagens de referência do MVP anexadas ao projeto são a fonte visual primária. O código deve preservar a mesma linguagem, hierarquia, densidade, proporções, ritmo, comportamento responsivo e percepção de marca, sem reinterpretar o produto como um template genérico.

---

# 0. Ordem de prioridade

Quando existir dúvida ou conflito entre decisões de interface, seguir esta ordem:

1. **Design MVP das imagens de referência**
2. **Tokens semânticos deste documento**
3. **Regras de composição, responsividade e componentes deste documento**
4. **Padrões existentes no código do produto**
5. **Defaults da biblioteca/framework**

Nunca substituir uma decisão clara do MVP por um padrão genérico de framework.

## Regra de fidelidade

Ao implementar uma tela presente nas referências:

- preservar a composição geral;
- preservar a hierarquia visual;
- preservar a proporção dos elementos;
- preservar a densidade;
- preservar a relação entre background e surfaces;
- preservar o protagonismo da fotografia;
- preservar a linguagem de radius;
- preservar o uso do rosa e do verde;
- preservar a sensação leve, social e contemporânea;
- adaptar responsivamente sem simplesmente reduzir a versão desktop.

O objetivo não é copiar pixels cegamente. O objetivo é reconstruir **o sistema visual que gera aqueles pixels**.

---

# 1. Direção visual

O Gooday possui uma linguagem **social, lifestyle, wellness, humana e photo-driven**.

A interface deve parecer:

- leve;
- clara;
- moderna;
- social;
- amigável;
- ativa;
- organizada;
- visualmente silenciosa ao redor do conteúdo.

A personalidade vem principalmente de:

```text
fotografia
+
espaçamento
+
tipografia
+
superfícies claras
+
geometria arredondada
+
rosa de destaque
+
verde de seleção
```

## Evitar

Não introduzir sem justificativa:

- glassmorphism;
- gradients decorativos;
- glow;
- blur ornamental;
- sombras pesadas;
- bordas fortes;
- excesso de cards;
- excesso de pills;
- efeitos 3D;
- skeuomorphism;
- fundos com textura;
- elementos neon;
- animações chamativas;
- layouts de dashboard corporativo;
- visual excessivamente tech;
- componentes com estética diferente entre páginas.

---

# 2. Design tokens

## 2.1 Primitive colors

### Accent / Pink

```text
accent-50   #FFF3F8
accent-100  #FFE0EE
accent-200  #FFC4DF
accent-300  #FEA5CF
accent-400  #FE82BD
accent-500  #FE63AC
accent-600  #E05797
accent-700  #C14B83
accent-800  #9D3D6B
accent-900  #7A3053
```

Base:

```text
Accent = #FE63AC
```

### Secondary / Deep Teal

```text
secondary-50   #EBF1F0
secondary-100  #CCDCDA
secondary-200  #9EBCB8
secondary-300  #6B9893
secondary-400  #337169
secondary-500  #004E44
secondary-600  #00453C
secondary-700  #003B34
secondary-800  #00302A
secondary-900  #002521
```

Base:

```text
Secondary = #004E44
```

### Neutral

```text
neutral-0    #FFFFFF
neutral-50   #F7F8FB
neutral-100  #ECEDF5
neutral-200  #DDE0E9
neutral-300  #C9CDD8
neutral-400  #A7ACB9
neutral-500  #828896
neutral-600  #626876
neutral-700  #454A56
neutral-800  #2D3038
neutral-900  #1A1C22
neutral-950  #0D0F13
```

Bases principais:

```text
BG      = #ECEDF5
Surface = #FFFFFF
```

### Functional

```text
success-500  #2FA878
warning-500  #EFA33A
error-500    #DC5252
info-500     #4D7BE8
```

---

# 3. Semantic colors

Componentes devem consumir **tokens semânticos**.

Não usar HEX diretamente em componentes, salvo exceções documentadas.

## Background

```text
bg-canvas            = neutral-100
bg-surface           = neutral-0
bg-surface-subtle    = neutral-50
bg-surface-hover     = neutral-50
bg-surface-pressed   = neutral-200
bg-disabled          = neutral-200
bg-overlay           = neutral-950 / 48%
```

## Text

```text
text-primary         = neutral-900
text-secondary       = neutral-600
text-tertiary        = neutral-500
text-placeholder     = neutral-500
text-disabled        = neutral-400
text-inverse         = neutral-0
text-accent          = accent-700
text-brand-secondary = secondary-500
```

## Brand

```text
brand-primary          = accent-500
brand-primary-hover    = accent-600
brand-primary-pressed  = accent-700
brand-primary-subtle   = accent-50

brand-secondary          = secondary-500
brand-secondary-hover    = secondary-600
brand-secondary-pressed  = secondary-700
brand-secondary-subtle   = secondary-50
```

## Borders

```text
border-subtle   = neutral-200
border-default  = neutral-300
border-strong   = neutral-400
border-accent   = accent-400
border-focus    = accent-500
border-error    = error-500
```

## Navigation

```text
nav-default-bg        = transparent
nav-default-content   = neutral-900

nav-hover-bg          = neutral-50

nav-active-bg         = secondary-500
nav-active-content    = neutral-0
```

## Actions

### Primary

```text
action-primary-bg       = accent-500
action-primary-hover    = accent-600
action-primary-pressed  = accent-700
action-primary-content  = neutral-950
```

### Secondary

```text
action-secondary-bg       = secondary-500
action-secondary-hover    = secondary-600
action-secondary-pressed  = secondary-700
action-secondary-content  = neutral-0
```

## Status

```text
state-success       = success-500
state-success-bg    = #EDF9F4

state-warning       = warning-500
state-warning-bg    = #FFF7E8

state-error         = error-500
state-error-bg      = #FFF0F0

state-info          = info-500
state-info-bg       = #EFF3FF
```

---

# 4. Regra de uso da cor

## Rosa

O rosa é a cor de **energia e atenção**.

Usar para:

- CTA de maior destaque;
- links relevantes;
- hashtags;
- badges;
- indicadores;
- detalhes de descoberta;
- progresso;
- estados de interação específicos;
- elementos de branding.

Não usar o rosa em grandes áreas da interface, exceto quando a referência do MVP exigir.

## Verde

O verde é a cor de **estabilidade e seleção**.

Usar para:

- navegação ativa;
- item selecionado;
- botão secundário forte;
- estado de contexto ativo;
- ações confiáveis;
- elementos persistentes de navegação.

## Background + Surface

A relação visual fundamental é:

```text
#ECEDF5 canvas
→
#FFFFFF surface
```

Não transformar todo o app em branco.

O canvas frio é parte importante da identidade e cria separação entre surfaces sem depender de sombras.

---

# 5. Tipografia

## Font family

```css
font-family:
  Inter,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

A família principal é **Inter**.

Não misturar famílias de fontes na interface.

O logotipo pode possuir lettering próprio.

## Escala tipográfica

| Token | Size | Line-height | Weight | Tracking |
|---|---:|---:|---:|---:|
| `display-lg` | 40px | 48px | 700 | -1px |
| `heading-1` | 32px | 40px | 700 | -0.6px |
| `heading-2` | 24px | 32px | 700 | -0.3px |
| `heading-3` | 20px | 28px | 600 | -0.2px |
| `heading-4` | 18px | 26px | 600 | 0 |
| `body-lg` | 16px | 24px | 400 | 0 |
| `body-md` | 14px | 22px | 400 | 0 |
| `body-sm` | 13px | 20px | 400 | 0 |
| `label-lg` | 15px | 20px | 600 | 0 |
| `label-md` | 14px | 20px | 500 | 0 |
| `caption` | 12px | 16px | 400 | 0 |
| `overline` | 11px | 16px | 600 | 0.2px |

## Pesos permitidos

```text
400 → conteúdo
500 → metadata e labels
600 → controles e subtítulos
700 → títulos
```

Evitar `800` e `900`.

## Regra de hierarquia

Cada viewport deve apresentar uma hierarquia clara:

```text
1 elemento dominante
→
1 nível secundário
→
conteúdo
→
metadata
```

Não criar múltiplos títulos competindo pela mesma atenção.

## Mobile

No mobile:

```text
display-lg → 32px
heading-1  → 28px
heading-2  → 22px
```

Nunca reduzir body principal abaixo de `14px`.

---

# 6. Spacing system

## Base

O sistema utiliza base de `4px`, com ritmo predominante de `8px`.

```text
space-0   0
space-1   4px
space-2   8px
space-3   12px
space-4   16px
space-5   20px
space-6   24px
space-8   32px
space-10  40px
space-12  48px
space-16  64px
space-20  80px
space-24  96px
```

## Regra de uso

### Dentro de componentes

```text
8–16px
```

### Entre elementos relacionados

```text
8–12px
```

### Entre grupos

```text
16–24px
```

### Entre seções

```text
32–48px
```

### Grandes separações

```text
64–96px
```

Não criar valores arbitrários como `13px`, `19px`, `27px`, `37px` se a mesma intenção puder ser atendida pela escala.

---

# 7. Gaps e sobreposições

## Gaps positivos

Preferir `gap` no container em vez de margens independentes nos filhos.

```css
display: flex;
gap: var(--space-4);
```

ou:

```css
display: grid;
gap: var(--space-4);
```

Isso reduz inconsistência e facilita responsividade.

## Gaps negativos / overlap

Sobreposição é permitida quando já faz parte da linguagem do MVP, principalmente:

- avatares sobre imagens;
- grupos de avatares;
- elementos flutuantes sobre mídia;
- badge contextual sobre thumbnail.

Exemplo:

```text
avatar-stack overlap: -6px a -10px
avatar-over-image: 8px a 12px de sobreposição
```

Não usar negative margin para corrigir layout quebrado.

Negative spacing deve representar uma **decisão visual intencional**, não compensar medidas incorretas.

---

# 8. Radius

```text
radius-xs    6px
radius-sm    8px
radius-md    12px
radius-lg    16px
radius-xl    20px
radius-2xl   24px
radius-3xl   32px
radius-full  999px
```

## Mapeamento

```text
chips             → radius-full
avatars           → 50%
icon buttons      → radius-full
inputs            → radius-lg
cards compactos   → radius-lg
feed cards        → radius-xl
media interna     → radius-lg
painéis grandes   → radius-xl / radius-2xl
login shell       → radius-2xl / radius-3xl
```

Evitar radius diferente em componentes equivalentes.

---

# 9. Surfaces

Existem poucos níveis de superfície.

## Level 0 — Canvas

```text
background: bg-canvas
```

## Level 1 — Surface

```text
background: bg-surface
```

Usado para:

- cards;
- navegação;
- formulários;
- sidebars;
- bottom navigation;
- painéis.

## Level 2 — Subtle

```text
background: bg-surface-subtle
```

Usado para:

- hover;
- agrupamentos discretos;
- input backgrounds;
- skeletons;
- áreas internas secundárias.

## Regra

Não embrulhar cada grupo em um card.

Um card só deve existir quando ele representa:

- uma unidade de conteúdo;
- uma ação agrupada;
- uma região visual independente;
- uma separação estrutural necessária.

**Whitespace primeiro. Card depois.**

---

# 10. Borders e shadows

## Border

Padrão:

```text
1px
```

Apenas quando necessário.

Borders devem ser sutis.

## Shadows

```css
--shadow-xs: 0 1px 2px rgba(13, 15, 19, 0.04);
--shadow-sm: 0 4px 12px rgba(13, 15, 19, 0.06);
--shadow-md: 0 12px 32px rgba(13, 15, 19, 0.10);
```

Uso:

```text
card normal       → none / shadow-xs
dropdown          → shadow-sm
floating layer    → shadow-sm
modal             → shadow-md
navigation        → none
```

A prioridade de separação é:

```text
spacing
→ surface
→ radius
→ border
→ shadow
```

Nunca o contrário.

---

# 11. Iconografia

Ícones devem possuir linguagem:

```text
outline
minimal
rounded
stroke 1.5–2px
```

Tamanhos:

```text
16px → metadata
20px → controle
24px → navegação
28px → ações principais mobile
```

Não misturar na mesma hierarquia:

- outline;
- filled;
- duotone;
- icon sets com diferentes proporções.

Ícone ativo pode receber mudança de cor ou preenchimento quando isso estiver definido como estado do componente.

---

# 12. Mobile first — regra obrigatória

Toda interface deve ser desenvolvida **mobile first**.

A versão mobile não é uma versão encolhida do desktop.

Ela é a experiência principal.

## Ordem de implementação

1. estruturar conteúdo mobile;
2. definir hierarquia mobile;
3. validar touch targets;
4. validar scroll;
5. validar componentes em largura estreita;
6. adicionar tablet;
7. expandir para desktop;
8. adicionar colunas secundárias;
9. nunca inverter esse processo.

## CSS

Começar pelo menor viewport.

```css
.component {
  /* mobile */
}

@media (min-width: 768px) {
  /* tablet */
}

@media (min-width: 1024px) {
  /* desktop */
}
```

Evitar escrever desktop primeiro e sobrescrever dezenas de propriedades no mobile.

---

# 13. Breakpoints

Os breakpoints representam mudanças de comportamento, não modelos específicos de aparelho.

Referência:

```text
xs   < 480px
sm   ≥ 480px
md   ≥ 768px
lg   ≥ 1024px
xl   ≥ 1280px
2xl  ≥ 1536px
```

Não adicionar breakpoint novo porque um componente ficou 8px desalinhado.

Adicionar breakpoint apenas quando a **estrutura** exigir mudança.

---

# 14. Grid responsivo

## Mobile

```text
4 columns
16px outer margin
12–16px gutter
```

Em telas muito pequenas:

```text
minimum horizontal padding = 16px
```

Não reduzir para 8px apenas para “fazer caber”.

## Tablet

```text
8 columns
24px outer margin
16–24px gutter
```

## Desktop

```text
12 columns
32px outer margin mínimo
24–32px gutter
```

Em telas grandes:

```text
max content width ≈ 1440–1600px
```

O app não deve continuar expandindo indefinidamente.

---

# 15. Estrutura desktop

A Home desktop do MVP trabalha visualmente com três zonas:

```text
Navigation
Main Content
Context / Discovery
```

Faixas recomendadas:

```text
Navigation       220–280px
Main content     520–680px
Context rail     280–360px
```

## Regra de prioridade

O conteúdo principal recebe prioridade.

Ao perder espaço:

1. reduzir gutters;
2. reduzir largura dos rails;
3. esconder/reorganizar conteúdo secundário;
4. manter o conteúdo principal legível.

Nunca comprimir tudo igualmente.

---

# 16. Estrutura mobile

No mobile:

- uma coluna principal;
- header simplificado;
- navegação principal inferior quando aplicável;
- módulos horizontais podem virar carrossel;
- sidebars desktop devem desaparecer ou virar tela/drawer dedicado;
- conteúdo secundário deve ser reordenado por importância;
- imagens podem ganhar maior protagonismo;
- cards devem utilizar quase toda a largura disponível;
- ações primárias devem permanecer acessíveis ao polegar.

## Safe area

Elementos fixos devem respeitar:

```css
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);
```

Especialmente:

- bottom navigation;
- sheets;
- full-screen views;
- sticky headers.

---

# 17. Navegação mobile

A navegação inferior do MVP é parte importante da experiência.

Regras:

- fixa ou sticky quando apropriado;
- surface branca;
- visualmente separada do canvas;
- touch targets de pelo menos `44×44px`;
- item ativo claramente identificável;
- não usar labels desnecessárias se o MVP usar navegação iconográfica;
- não permitir que conteúdo fique escondido atrás dela.

Adicionar `padding-bottom` ao conteúdo equivalente à altura real da navegação.

---

# 18. Carrosséis horizontais

No mobile, coleções horizontais podem continuar além do viewport.

Regras:

- primeiro item alinhado ao padding da página;
- último item possui end padding;
- mostrar parte do próximo item para comunicar scroll;
- usar `overflow-x: auto`;
- evitar scrollbar visual quando não necessária;
- usar `scroll-snap` apenas se melhorar a interação;
- nunca bloquear scroll vertical;
- cards não devem ficar estreitos demais.

Exemplo:

```css
.carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(104px, 28vw);
  gap: 12px;
  overflow-x: auto;
  padding-inline: 16px;
}
```

Não fixar uma quantidade de cards por viewport.

---

# 19. Imagens e mídia

A fotografia é parte central do produto.

## Direção

Priorizar:

- pessoas reais;
- atividades;
- esporte;
- alimentação;
- natureza;
- lifestyle;
- cenas espontâneas;
- iluminação natural.

## Tratamento

```text
contraste natural
saturação média
skin tones naturais
sem filtros pesados
sem tint rosa/verde global
```

## Implementação

Sempre definir:

- `width`;
- `height` ou `aspect-ratio`;
- `object-fit: cover`;
- radius correto;
- fallback/skeleton;
- lazy loading quando fora da primeira viewport.

Evitar layout shift.

```css
.media {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

Não distorcer imagem para preencher container.

---

# 20. Aspect ratios

Preferir proporções consistentes por tipo de conteúdo.

Sugestão:

```text
story / discovery card     → 3:4 ou próximo
group thumbnail            → 16:10 / 4:3
feed landscape             → variável controlado / ~4:3
avatar                     → 1:1
auth hero                  → composição responsiva
```

Não introduzir múltiplas proporções aleatórias na mesma lista.

---

# 21. Component architecture

## Regra principal

Se dois elementos possuem a mesma:

- estrutura;
- comportamento;
- hierarquia;
- estados;
- função visual;

eles devem ser o **mesmo componente com variantes**, não componentes duplicados.

Exemplo:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="ghost" />
```

em vez de:

```text
PinkButton
GreenButton
HeaderButton
ModalButton
```

## Reutilização

Antes de criar um novo componente:

1. procurar componente existente;
2. verificar se pode receber variante;
3. verificar se pode ser composto;
4. somente criar novo componente se houver mudança real de responsabilidade.

## Componentes base esperados

```text
Button
IconButton
Avatar
AvatarGroup
Input
Textarea
Checkbox
Chip
Badge
Card
MediaCard
PostCard
GroupCard
StoryCard
TopBar
BottomNavigation
SidebarNavigation
Tabs
Modal
Drawer / Sheet
Dropdown
Tooltip
Skeleton
EmptyState
ErrorState
LoadingState
```

---

# 22. Componentes não devem saber onde estão

Um componente reutilizável não deve possuir margem externa fixa para “encaixar” em uma página.

Errado:

```css
.card {
  margin-top: 32px;
  margin-left: 24px;
}
```

Correto:

```css
.card {
  /* visual interno */
}

.section {
  display: grid;
  gap: var(--space-6);
}
```

**Layout pertence ao pai. Aparência pertence ao componente.**

---

# 23. Variants em vez de duplicação

Estados e tamanhos devem ser modelados como variantes.

Exemplo conceitual:

```text
Button
├── variant
│   ├── primary
│   ├── secondary
│   ├── ghost
│   └── destructive
├── size
│   ├── sm
│   ├── md
│   └── lg
└── state
    ├── default
    ├── hover
    ├── active
    ├── focus
    ├── loading
    └── disabled
```

Evitar conditionals de estilo espalhados pelas páginas.

---

# 24. Layout fluido

Não usar largura fixa quando a intenção for responsiva.

Preferir:

```css
width: 100%;
max-width: ...;
min-width: 0;
```

Usar:

```css
grid-template-columns:
  repeat(auto-fit, minmax(...));
```

quando fizer sentido.

Preferir:

```css
clamp()
min()
max()
minmax()
```

para valores fluidos.

Exemplo:

```css
.page {
  padding-inline: clamp(16px, 3vw, 32px);
}
```

---

# 25. Evitar hardcode visual

Evitar:

```text
left: 347px
top: 183px
width: 613px
```

para construir layouts normais.

Absolute positioning deve ser usado para:

- overlays;
- badges;
- ícones internos;
- decoração;
- media overlays;
- elementos realmente sobrepostos.

Não usar `position: absolute` para reconstruir a página como se fosse uma imagem.

---

# 26. Hierarquia visual

Toda tela deve responder rapidamente:

1. onde estou?
2. qual conteúdo é principal?
3. qual ação é possível?
4. o que é secundário?
5. onde continuo?

## Mecanismos de hierarquia

Usar nesta ordem:

```text
posição
→
tamanho
→
espaço
→
peso tipográfico
→
contraste
→
cor
→
efeito
```

Não depender de sombra ou cor intensa para criar hierarquia.

---

# 27. Densidade

A densidade do Gooday é **balanced**.

O produto pode apresentar muito conteúdo, mas deve continuar respirando.

Regras:

- metadata deve ser compacta;
- conteúdo principal deve ter espaço;
- cards de descoberta podem ser mais densos;
- feed principal pode ser mais espaçoso;
- desktop não deve virar uma grade excessivamente apertada;
- mobile não deve empilhar informação irrelevante.

---

# 28. Conteúdo e truncation

Não presumir comprimento fixo.

Toda interface deve sobreviver a:

- nome curto;
- nome longo;
- texto longo;
- contadores grandes;
- imagens ausentes;
- múltiplas tags;
- localization futura.

Usar:

```css
min-width: 0;
overflow-wrap: anywhere;
```

Quando truncar:

```text
nome de usuário         → 1 linha quando necessário
metadata                → 1 linha
título de card          → até 2 linhas
descrição curta         → até 2–3 linhas
post completo           → não truncar arbitrariamente
```

---

# 29. Buttons

## Large CTA

```text
height        52–56px
radius        full
weight        600
horizontal px 20–24px
```

## Standard

```text
height 44–48px
radius 12–16px
```

## Icon button

```text
visual size 40–44px
touch area ≥ 44×44px
radius full
```

## Regras

- um CTA principal por contexto;
- não colocar vários botões com a mesma ênfase lado a lado;
- loading não deve alterar largura do botão;
- disabled precisa continuar legível;
- ícone deve ter `aria-label` quando não houver texto.

---

# 30. Inputs

```text
height     52–56px
radius     16px
background neutral-100
border     transparent
```

Focus:

```text
background neutral-50
border     accent-500
ring       accent-200
```

Regras:

- label visível quando necessário;
- placeholder não substitui label em formulários importantes;
- error message próximo ao campo;
- manter valor digitado em erro;
- não limpar campo automaticamente;
- autocomplete correto;
- teclado mobile adequado ao tipo de dado.

---

# 31. Chips, tags e badges

```text
height    28–32px
radius    full
padding-x 12px
```

Accent chip:

```text
background accent-50
border     accent-400
content    accent-700
```

Não transformar todos os filtros, labels e metadata em pills.

Pill deve comunicar:

- tag;
- filtro;
- status;
- ação compacta;
- escolha.

---

# 32. Avatars

Tamanhos:

```text
24
32
40
48
64
```

Sempre:

```text
aspect-ratio: 1
border-radius: 50%
object-fit: cover
```

Avatar group:

- overlap consistente;
- ordem visual preservada;
- borda clara para separação;
- não sobrepor a ponto de esconder identidade.

---

# 33. Feed cards

O feed é uma unidade de conteúdo primária.

Estrutura preferencial:

```text
header do post
→
texto
→
tags quando existirem
→
media
→
reactions / metadata
→
actions
```

Regras:

- surface branca;
- radius ~20px;
- padding `16–20px`;
- mídia possui radius interno;
- não usar shadow pesado;
- separar cards principalmente pelo canvas;
- preservar hierarquia entre autor e metadata.

---

# 34. Group cards

Cards de grupo devem priorizar:

1. imagem;
2. nome;
3. pessoas/contexto;
4. metadata;
5. ação secundária.

Não transformar a metadata em protagonista.

Em mobile:

- largura suficiente para visualizar imagem;
- scroll horizontal quando em coleção;
- evitar miniaturização excessiva.

---

# 35. Auth / Login

A tela de autenticação do MVP estabelece uma direção específica:

- hero fotográfico de forte presença em desktop;
- formulário em surface branca;
- layout limpo;
- bastante whitespace;
- CTA rosa;
- campos neutros;
- radius generoso;
- branding centralizado;
- layout assimétrico, porém equilibrado.

## Mobile auth

No mobile:

- formulário é prioridade;
- hero pode reduzir, mover ou desaparecer;
- nunca obrigar scroll excessivo apenas para manter a mesma composição desktop;
- campos ocupam largura útil;
- CTA deve ser fácil de alcançar;
- safe area respeitada.

---

# 36. Responsive component behavior

Cada componente deve definir explicitamente:

```text
minimum width
preferred width
maximum width
wrapping behavior
overflow behavior
image behavior
text truncation
touch behavior
desktop enhancement
```

Não considerar um componente “responsivo” apenas porque possui `width: 100%`.

---

# 37. Reflow, não shrink

Ao reduzir viewport:

**reorganizar antes de encolher**.

Prioridade:

```text
reflow
→
wrap
→
collapse
→
hide secondary content
→
reduce size
```

Não:

```text
scale everything down
```

Exemplo:

Desktop:

```text
sidebar | feed | discovery
```

Mobile:

```text
top bar
feed
bottom nav
```

Não:

```text
sidebar minúscula | feed estreito | discovery minúsculo
```

---

# 38. Progressive disclosure

No mobile, conteúdo secundário pode ir para:

- drawer;
- sheet;
- modal;
- tela dedicada;
- accordion;
- “ver mais”.

Isso é preferível a comprimir a interface.

---

# 39. Sticky e fixed

Usar apenas para elementos realmente importantes.

Permitidos:

- bottom navigation;
- top navigation;
- action bar contextual;
- composer quando fizer sentido.

Regras:

- não ocupar área excessiva;
- respeitar safe area;
- preservar acesso ao conteúdo;
- adicionar offset correspondente;
- evitar múltiplas layers sticky competindo entre si.

---

# 40. Scroll

A página deve possuir preferencialmente **um eixo principal de scroll vertical**.

Nested vertical scroll deve ser evitado.

Scroll horizontal só deve existir em componentes claramente horizontais:

- stories;
- discovery cards;
- chips;
- carrosséis.

Nunca criar scroll horizontal acidental na página.

Durante desenvolvimento, testar:

```css
* {
  min-width: 0;
}
```

onde aplicável para detectar overflow por flex/grid.

---

# 41. Estados obrigatórios

Todo componente assíncrono ou dependente de dados deve considerar:

```text
loading
success
empty
error
offline / retry quando relevante
```

Não implementar apenas o happy path.

---

# 42. Skeletons

Skeleton deve respeitar a geometria real do componente.

Não usar retângulos genéricos que mudem completamente quando o conteúdo carregar.

O skeleton deve preservar:

- proporção;
- spacing;
- media ratio;
- linhas aproximadas;
- radius.

---

# 43. Empty states

Empty states devem ser simples.

Estrutura:

```text
ícone/visual opcional
título curto
explicação curta
ação quando necessária
```

Não criar ilustrações complexas se a linguagem geral não possui ilustrações.

---

# 44. Error states

Error deve informar:

- o que aconteceu;
- o que o usuário pode fazer.

Não expor erro técnico cru.

Preservar os dados digitados sempre que possível.

---

# 45. Motion

Motion é funcional, não decorativa.

## Fast

```text
120–150ms
```

Hover, icon e microstate.

## Standard

```text
180–220ms
```

Cards, menus e controles.

## Slow

```text
280–360ms
```

Modal, sheet, drawer.

Easing:

```css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Evitar:

- bounce excessivo;
- elastic animations;
- scale exagerado;
- parallax desnecessário.

---

# 46. Hover, focus e active

Desktop não pode depender somente de hover.

Estados:

```text
default
hover
focus-visible
active
disabled
loading
```

Touch devices precisam funcionar sem hover.

Focus deve ser visível.

```text
2px ring
accent-300 / accent-500
2px offset
```

Não remover outline sem substituição adequada.

---

# 47. Touch targets

Mínimo:

```text
44 × 44px
```

Ideal:

```text
48 × 48px
```

O ícone pode ser visualmente menor, mas a área clicável deve cumprir o mínimo.

Separar ações próximas para reduzir toques acidentais.

---

# 48. Accessibility

Objetivo mínimo:

```text
WCAG AA
```

## Accent

`#FE63AC` com branco possui contraste insuficiente para texto normal.

Padrão recomendado:

```text
background #FE63AC
text       #0D0F13
```

Quando texto branco for obrigatório, utilizar tonalidade de rosa mais escura com contraste adequado.

## Secondary

```text
#004E44
+
#FFFFFF
```

possui excelente contraste.

## Nunca comunicar apenas por cor

Estados como:

- erro;
- sucesso;
- selecionado;
- disabled;

precisam de sinal complementar:

- ícone;
- label;
- forma;
- stroke;
- texto.

---

# 49. HTML semântico

Preferir elementos nativos:

```text
button
a
nav
main
header
footer
section
article
form
label
input
ul
li
```

Não criar botão clicável com `<div>`.

A semântica deve existir antes de ARIA.

---

# 50. Responsive typography

Não criar dezenas de tamanhos específicos por breakpoint.

Quando necessário, usar `clamp`.

Exemplo:

```css
.page-title {
  font-size: clamp(28px, 2.5vw, 40px);
  line-height: 1.2;
}
```

Mas componentes do Design System devem continuar mapeando para tokens definidos.

---

# 51. CSS e tokens

Preferir tokens:

```css
color: var(--text-primary);
background: var(--bg-surface);
gap: var(--space-4);
border-radius: var(--radius-xl);
```

Evitar:

```css
color: #1A1C22;
background: #FFFFFF;
gap: 17px;
border-radius: 19px;
```

Se um valor se repete ou representa decisão visual, ele deve virar token.

---

# 52. Component composition

Preferir componentes pequenos e composáveis.

Exemplo:

```text
PostCard
├── PostHeader
│   ├── Avatar
│   └── UserMeta
├── PostContent
├── Media
├── ReactionSummary
└── PostActions
```

Não dividir cada `<span>` em componente.

Criar abstração quando há:

- repetição;
- responsabilidade;
- estado;
- comportamento;
- necessidade de consistência.

---

# 53. Não abstrair cedo demais

Duplicação pequena durante descoberta pode ser aceitável.

Abstrair quando o padrão estiver claro.

Evitar componentes genéricos gigantes como:

```text
UniversalCard
UniversalSection
MegaContainer
GenericWidget
```

com dezenas de props.

---

# 54. Props e variantes

Props devem representar decisões de produto, não hacks visuais.

Bom:

```text
variant="compact"
size="sm"
selected
loading
```

Ruim:

```text
paddingLeft={13}
borderRadius={19}
makePink
moveDown={7}
```

---

# 55. Consistência sobre novidade

Antes de criar uma nova solução visual:

1. procurar padrão existente;
2. reutilizar;
3. adaptar por variante;
4. somente criar algo novo se a função exigir.

Nenhuma página deve parecer pertencer a outro produto.

---

# 56. Regras de frontend visual

## Não gerar “UI de IA genérica”

Evitar padrões que não existem no MVP apenas porque são comuns em interfaces geradas automaticamente:

- headline gigante sem necessidade;
- gradiente roxo/azul;
- cards flutuando com glow;
- badges decorativos em excesso;
- glass panels;
- cada bloco dentro de um card;
- ícones aleatórios;
- excesso de border radius;
- dashboard SaaS genérico.

A referência é o **Gooday MVP**, não tendências genéricas.

## Usar composição, não decoração

Quando uma tela parecer “sem graça”, primeiro revisar:

- proporção;
- alinhamento;
- escala;
- fotografia;
- hierarchy;
- whitespace;
- contraste.

Não adicionar gradient ou shadow como correção.

## Evitar uniformidade mecânica

Consistência não significa tornar tudo idêntico.

Conteúdo principal pode ter escala maior.

Conteúdo contextual pode ser mais compacto.

A hierarquia precisa ser percebida.

---

# 57. Visual rhythm

Ao revisar uma tela, observar blocos verticais.

O ritmo deve alternar naturalmente:

```text
compact
→
medium
→
spacious
```

Evitar:

```text
24px entre absolutamente tudo
```

Relações diferentes exigem espaços diferentes.

---

# 58. Alignment

Elementos que pertencem ao mesmo eixo devem alinhar.

Especialmente:

- headers;
- avatars;
- titles;
- card edges;
- inputs;
- buttons;
- section titles.

Evitar pequenos desalinhamentos de 2–5px entre módulos equivalentes.

Alinhamento gera mais sensação de refinamento do que decoração.

---

# 59. Container ownership

Cada nível de layout possui responsabilidade.

```text
Page
→ largura, margins, macro-grid

Section
→ spacing entre grupos

List/Grid
→ gap entre itens

Component
→ padding interno

Element
→ spacing local mínimo
```

Não distribuir essas responsabilidades aleatoriamente.

---

# 60. Z-index

Usar escala pequena e documentada.

```text
z-base       0
z-sticky     10
z-dropdown   20
z-overlay    30
z-modal      40
z-toast      50
```

Não usar:

```text
z-index: 999999
```

---

# 61. Performance visual

Interfaces photo-driven precisam preservar performance.

Regras:

- lazy load abaixo da dobra;
- reservar espaço de imagem;
- servir tamanho adequado;
- utilizar formatos modernos quando suportados;
- evitar baixar imagens desktop enormes no mobile;
- priorizar mídia above-the-fold;
- evitar filtros CSS pesados em grandes imagens.

Performance faz parte da qualidade de UX.

---

# 62. Responsive images

Usar `srcset`, `sizes` ou componente equivalente do framework.

O navegador deve receber mídia adequada ao viewport.

Não servir a mesma imagem de 2500px para um card mobile de 120px.

---

# 63. Loading layout stability

A interface não deve “pular” durante carregamento.

Definir previamente:

- media aspect ratio;
- avatar size;
- input height;
- button height;
- navigation height.

Objetivo:

```text
CLS mínimo
```

---

# 64. Form responsivity

Em mobile:

- campos em coluna;
- largura 100%;
- CTA 100% quando adequado;
- labels legíveis;
- teclado não pode esconder ação crítica;
- utilizar `scroll-margin` para campos;
- evitar dois campos estreitos lado a lado se prejudicar entrada.

Desktop pode agrupar campos apenas se a leitura continuar clara.

---

# 65. Modals, drawers e sheets

## Mobile

Preferir:

```text
bottom sheet
fullscreen dialog
drawer
```

conforme complexidade.

## Desktop

Modal central ou painel lateral pode ser apropriado.

Não usar modal estreito em mobile com margens minúsculas.

---

# 66. Tabs

Tabs devem ser usadas apenas quando conteúdos pertencem ao mesmo nível.

Estado ativo:

- tipografia/contraste;
- indicador rosa quando compatível com MVP;
- área clicável adequada.

Não criar tabs para esconder navegação estrutural.

---

# 67. Tooltips

Tooltip é comportamento desktop complementar.

Informações essenciais não podem existir somente em tooltip.

Mobile deve possuir alternativa acessível.

---

# 68. Desktop enhancement

Desktop pode acrescentar:

- sidebar;
- discovery rail;
- informação contextual;
- hover;
- tooltips;
- múltiplas colunas.

Mas não deve alterar a essência do fluxo mobile.

O produto precisa permanecer reconhecível entre plataformas.

---

# 69. Checklist de responsividade

Antes de concluir qualquer tela, validar pelo menos:

```text
320px
360px
390px
430px
768px
1024px
1280px
1440px
```

Checar:

- overflow horizontal;
- text wrapping;
- truncation;
- image crop;
- sticky/fixed;
- keyboard;
- safe area;
- touch target;
- bottom nav;
- modals;
- carousels;
- content order;
- empty/loading/error.

---

# 70. Checklist visual

Antes de considerar uma implementação pronta:

- [ ] A tela parece pertencer ao Gooday MVP?
- [ ] O canvas é `#ECEDF5` onde aplicável?
- [ ] As surfaces principais são brancas?
- [ ] O rosa está sendo usado como destaque e não como preenchimento excessivo?
- [ ] O verde comunica seleção/navegação?
- [ ] A Inter é a família principal?
- [ ] A escala tipográfica segue os tokens?
- [ ] O ritmo de spacing segue 4/8px?
- [ ] Os radius são consistentes?
- [ ] Há poucas sombras?
- [ ] A fotografia tem protagonismo?
- [ ] Os componentes foram reutilizados?
- [ ] Não existem valores arbitrários repetidos?
- [ ] A versão mobile foi tratada como experiência principal?
- [ ] Não há layout desktop apenas encolhido?
- [ ] Touch targets têm pelo menos 44px?
- [ ] Não existe overflow horizontal acidental?
- [ ] Loading, empty e error foram considerados?
- [ ] Focus keyboard está visível?
- [ ] A interface funciona sem hover?
- [ ] A hierarquia visual é clara sem decoração extra?

---

# 71. Checklist de componente

Antes de criar um novo componente:

- [ ] Já existe algo equivalente?
- [ ] Uma variante resolve?
- [ ] A API representa intenção e não hacks de CSS?
- [ ] O componente funciona em largura pequena?
- [ ] O componente suporta texto longo?
- [ ] O componente suporta loading?
- [ ] O componente suporta disabled quando aplicável?
- [ ] O componente possui focus?
- [ ] O componente possui touch target adequado?
- [ ] O componente usa tokens semânticos?
- [ ] O layout externo é controlado pelo pai?
- [ ] A mídia possui aspect ratio definido?

---

# 72. Checklist de página

Uma página deve possuir:

```text
1. propósito claro
2. conteúdo primário
3. ação ou fluxo principal
4. conteúdo secundário
5. estados de sistema
6. comportamento mobile
7. comportamento desktop
```

Se uma página não deixa claro o que é principal, revisar a composição antes de adicionar elementos.

---

# 73. Source of truth para implementação

A arquitetura visual deve seguir:

```text
MVP reference images
        ↓
Design principles
        ↓
Primitive tokens
        ↓
Semantic tokens
        ↓
Component tokens / variants
        ↓
Responsive components
        ↓
Pages
```

Nunca:

```text
Page
↓
hex aleatório
↓
margin aleatória
↓
componente duplicado
```

---

# 74. CSS token reference

```css
:root {
  /* PRIMITIVES — ACCENT */
  --color-accent-50: #FFF3F8;
  --color-accent-100: #FFE0EE;
  --color-accent-200: #FFC4DF;
  --color-accent-300: #FEA5CF;
  --color-accent-400: #FE82BD;
  --color-accent-500: #FE63AC;
  --color-accent-600: #E05797;
  --color-accent-700: #C14B83;
  --color-accent-800: #9D3D6B;
  --color-accent-900: #7A3053;

  /* PRIMITIVES — SECONDARY */
  --color-secondary-50: #EBF1F0;
  --color-secondary-100: #CCDCDA;
  --color-secondary-200: #9EBCB8;
  --color-secondary-300: #6B9893;
  --color-secondary-400: #337169;
  --color-secondary-500: #004E44;
  --color-secondary-600: #00453C;
  --color-secondary-700: #003B34;
  --color-secondary-800: #00302A;
  --color-secondary-900: #002521;

  /* PRIMITIVES — NEUTRAL */
  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #F7F8FB;
  --color-neutral-100: #ECEDF5;
  --color-neutral-200: #DDE0E9;
  --color-neutral-300: #C9CDD8;
  --color-neutral-400: #A7ACB9;
  --color-neutral-500: #828896;
  --color-neutral-600: #626876;
  --color-neutral-700: #454A56;
  --color-neutral-800: #2D3038;
  --color-neutral-900: #1A1C22;
  --color-neutral-950: #0D0F13;

  /* SEMANTIC — BACKGROUND */
  --bg-canvas: var(--color-neutral-100);
  --bg-surface: var(--color-neutral-0);
  --bg-surface-subtle: var(--color-neutral-50);
  --bg-surface-hover: var(--color-neutral-50);
  --bg-surface-pressed: var(--color-neutral-200);

  /* SEMANTIC — TEXT */
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --text-tertiary: var(--color-neutral-500);
  --text-placeholder: var(--color-neutral-500);
  --text-disabled: var(--color-neutral-400);
  --text-inverse: var(--color-neutral-0);
  --text-accent: var(--color-accent-700);

  /* SEMANTIC — BRAND */
  --brand-primary: var(--color-accent-500);
  --brand-primary-hover: var(--color-accent-600);
  --brand-primary-pressed: var(--color-accent-700);
  --brand-primary-subtle: var(--color-accent-50);

  --brand-secondary: var(--color-secondary-500);
  --brand-secondary-hover: var(--color-secondary-600);
  --brand-secondary-pressed: var(--color-secondary-700);
  --brand-secondary-subtle: var(--color-secondary-50);

  /* SEMANTIC — BORDER */
  --border-subtle: var(--color-neutral-200);
  --border-default: var(--color-neutral-300);
  --border-strong: var(--color-neutral-400);
  --border-focus: var(--color-accent-500);

  /* SPACING */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* RADIUS */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-3xl: 32px;
  --radius-full: 999px;

  /* SHADOW */
  --shadow-xs: 0 1px 2px rgba(13, 15, 19, 0.04);
  --shadow-sm: 0 4px 12px rgba(13, 15, 19, 0.06);
  --shadow-md: 0 12px 32px rgba(13, 15, 19, 0.10);

  /* MOTION */
  --duration-fast: 140ms;
  --duration-standard: 200ms;
  --duration-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);

  /* Z-INDEX */
  --z-base: 0;
  --z-sticky: 10;
  --z-dropdown: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;
}
```

---

# 75. Regra final para agentes e desenvolvedores

Ao receber uma solicitação de criação ou alteração de interface no Gooday:

1. **olhar primeiro para as referências do MVP;**
2. identificar o padrão existente;
3. reutilizar tokens;
4. reutilizar componentes;
5. trabalhar mobile first;
6. construir layout fluido;
7. expandir progressivamente para desktop;
8. manter a fotografia como parte da hierarquia;
9. preservar surfaces claras e canvas frio;
10. utilizar rosa e verde de forma funcional;
11. evitar decoração não presente no MVP;
12. validar todos os breakpoints;
13. validar acessibilidade;
14. revisar consistência antes de considerar concluído.

## Princípio central

> **Conteúdo vibrante dentro de uma interface silenciosa.**

A identidade visual do Gooday depende da relação:

```text
canvas frio
→
surfaces brancas
→
fotografia
→
tipografia escura
→
verde para seleção
→
rosa para destaque
```

Toda decisão de frontend deve preservar essa ordem.

---

# 76. Definição de pronto

Uma implementação só está pronta quando:

```text
fidelidade visual
+
responsividade
+
reutilização
+
acessibilidade
+
performance
+
consistência
```

estiverem resolvidas ao mesmo tempo.

**Funcionar não é suficiente. Precisa parecer e se comportar como Gooday.**
