# Gooday — Catálogo completo de telas + comportamento

Documento único para o **Figma Make** (e implementação) replicar **exatamente** o app Gooday de hoje (`/`).

Escopo: **somente Gooday** (vida saudável).

Este arquivo inclui:

1. **Todas as telas** (anatomia, ações, estados)
2. **Todo o comportamento global** que também está em `COMPORTAMENTO.md` (layout full-bleed, scroll, máscaras/fades, z-index, timings, body lock, Escape, sheets, etc.)

> Se houver divergência pontual, priorize este `TELAS.md` como spec consolidada.  
> `COMPORTAMENTO.md` permanece como referência espelhada.

---

## Como usar este documento

1. Ler a seção **0. Comportamento global** (obrigatório antes de desenhar qualquer tela)
2. Depois abrir a tela específica (A…I)

Cada tela tem:

1. **O que é**
2. **Como abrir**
3. **Layout / anatomia**
4. **Elementos e ações**
5. **Estados**
6. **Regras de comportamento** (da tela + regras globais da §0)

### Tipos de superfície no app

| Tipo | Como aparece | Exemplos |
|------|----------------|----------|
| **Home** | Página base, scroll da window | Feed |
| **View** | Overlay fullscreen `z-60`, header Voltar, stack | Buscar, Perfil, Chat… |
| **Sheet** | Bottom sheet (mobile) / modal (desktop) `z-70` | Criar, Comentários… |
| **Overlay especial** | Camada própria | Story Viewer, Media Capture, Toast, Avatar Menu |

---

# 0. Comportamento global (obrigatório)

Tudo abaixo **precisa constar** em qualquer replicação (Figma Make / React). Não pular.

---

## 0.1 Full-bleed — ocupar a tela inteira do device

O Gooday **não** é um frame estreito centralizado tipo “mock de celular dentro da página”.

| Regra | Comportamento |
|-------|----------------|
| Largura | `width: 100%` do viewport (até `max-width: 1920px` no body) |
| Altura | `min-height: 100dvh` |
| Mobile | Edge-to-edge: stories, feed e nav usam a largura do device |
| Desktop | Grid de 3 colunas **dentro** da largura total da janela, com padding lateral — não um card flutuante no centro |
| Erro comum (Figma Make) | App numa coluna estreita com laterais vazias enormes → **incorreto** |

### Breakpoint principal: `800px`

| Viewport | Layout |
|----------|--------|
| `< 800px` | Mobile: header + stories + feed (max 640px centrado) + carrossel comunidades + bottom nav |
| `≥ 800px` | Desktop: header sticky + stories full-width + **grid 3 colunas** (nav \| feed \| rail) |
| `≥ 1200px` | Gap do grid aumenta |
| `≥ 1800px` | Padding lateral e gap maiores |

### Escala desktop

Em `≥ 800px`, HTML usa zoom ≈ `1.08`. Sidebars compensam altura com `100dvh / 1.08`.

### Safe areas

Respeitar `env(safe-area-inset-top|bottom|left|right)` em:

- Header mobile (topo)
- Bottom nav (embaixo)
- Sheets / composers (embaixo)
- Toast (embaixo)
- Overlay screens (topo e bottom)

---

## 0.2 Camadas (z-index) e shell

```text
[ z-40 ] Header mobile / desktop (sticky)
[      ] Stories row (scroll horizontal na página)
[      ] Grid: DesktopNav | Main (comunidades mobile + Feed) | RightRail
[ z-45 ] MobileNav (fixed bottom) — só mobile
[ z-60 ] OverlayScreens (views full-screen)
[ z-70 ] SheetModal (bottom sheet / modal)
[ z-75 ] AvatarMenu (desktop dropdown)
[ z-80 ] StoryViewer
[ z-90 ] MediaCaptureOverlay + Toast
```

### Body lock

Quando aberto **view**, **sheet**, **story viewer** ou **media capture**:

- `body` → `position: fixed`
- Ao fechar, restaura `scrollY` da página

### Tecla Escape (prioridade)

1. Fecha emoji picker de comentário (se aberto)
2. Fecha emoji picker do story
3. Fecha story viewer
4. Fecha sheet
5. `back()` na view (stack)

---

## 0.3 Layout desktop — grid full-width

Quando `≥ 800px`, abaixo das stories:

```text
| DesktopNav (hug) | Main feed (280–560px flex) | RightRail (1fr, min 240px) |
```

| Spec | Valor |
|------|--------|
| Container | `width: 100%` · `display: grid` |
| Colunas | `max-content \| minmax(280px, 560px) \| minmax(240px, 1fr)` |
| Gap | `32px` (≥1200: `40px`; ≥1800: `48px`) |
| Padding X | `20px` (≥1800: `32px`) |
| Main desktop | `max-width: none` (ocupa coluna do meio) |
| Main mobile | `max-width: 640px`, centralizado |

### Sticky sidebars

- `position: sticky; top: 80px; align-self: start`
- Nav esquerda: altura hug, sempre sticky
- Rail direita **preenche a 1ª dobra**:
  - Altura = `visualViewport.height - top - margem(48) - paddingTop`
  - Mínimo `280px`
  - Scroll interno independente do feed

---

## 0.4 Scroll — regras gerais

| Região | Tipo de scroll |
|--------|----------------|
| Home / Feed | Scroll **da página** (window/body) |
| Overlay view | `fixed inset-0` + `overflow-y-auto` próprio |
| Stories row | Horizontal, na página |
| Communities carousel (mobile) | Horizontal, na página |
| Right rail | Vertical **interno** + máscaras |
| Filtros de chips | Horizontal + máscaras laterais |
| Story viewer | Sem scroll de mídia; body locked |
| Sheets | Panel `max-height ~90dvh` + scroll interno se precisar |

- Listas horizontais e sidebars: **scrollbar oculto**
- Sidebars/overlays: `overscroll-behavior: contain`

---

## 0.5 Máscaras / fades de opacidade (crítico)

### Fade vertical (rail / listas sticky)

Usado em: RightRail (Grupos/Pessoas).

| Item | Spec |
|------|------|
| Posição | Absolute no topo e no fundo do container scroll |
| Altura | `40px` |
| Interação | `pointer-events: none` |
| Gradiente topo | `fadeColor → transparent` (cima → baixo) |
| Gradiente fundo | `fadeColor → transparent` (baixo → cima) |
| Cor padrão | `--gd-bg` |
| Opacidade | `0` ou `1`, transição **200ms** |
| Fade topo ON | `scrollTop > 2` |
| Fade fundo ON | ainda há conteúdo abaixo (`> 2px` do fim) |

**Wheel capture:** mouse sobre a rail → roda scrolla a lista interna até topo/fundo; só então move a página.

### Fade horizontal (chips / filtros)

| Item | Spec |
|------|------|
| Largura | `24px` cada lado |
| Gradiente esq. | `fadeColor → transparent` (esq → dir) |
| Gradiente dir. | `fadeColor → transparent` (dir → esq) |
| Fade esq ON | `scrollLeft > 2` |
| Fade dir ON | ainda há conteúdo à direita |

### Não fazer

- Máscara estática sempre ligada
- Sombra pesada no lugar do fade
- Fade que não some quando não há overflow

---

## 0.6 Drag-to-scroll (desktop) — Stories

| Regra | Valor |
|-------|--------|
| Pointer | Só não-touch (touch = pan nativo) |
| Botão | Esquerdo |
| Threshold | **8px** antes de virar drag |
| Cursor | `grab` → `grabbing` |
| Após drag | Bloqueia o próximo `click` |
| Snap | `scroll-snap-type: x mandatory`; cards `align: start` |

Communities carousel mobile: snap + no-scrollbar, **sem** drag custom.

---

## 0.7 Sheets — geometria e motion (global)

| Viewport | Comportamento |
|----------|----------------|
| Mobile | Bottom sheet, radius topo 22, handle 10×4, max-height ~90dvh |
| Desktop | Modal central (comentários: até ~980px / 80vh) |

| Peça | Timing |
|------|--------|
| Overlay fade | **180ms** |
| Sheet mobile (slide up) | **320ms** |
| Sheet desktop (fade+scale) | **240ms** |
| Overlay fundo | preto ~68% + blur 4px |

Fechar: backdrop · X · Escape · (algumas ações fecham após toast).

Views fullscreen: slide-in **240ms**, conteúdo tipicamente `max-width: 640px`.

### Stack de views

- `go(view, param?)` → push stack, abre view, fecha sheet, scroll top
- `back()` → pop; se vazio → Home
- Tab Início zera a stack

---

## 0.8 Create — fluxos completos (global)

### Publicação

```text
Criar (picker) → Publicação → Sheet create
  → (opcional) Media Capture
  → Legenda (+ hashtags → tags)
  → Marcar / Local / Audiência / Grupo (ciclam)
  → Publicar → post no topo do feed + toast + scroll top + fecha sheet
```

- Exige **foto ou texto**
- Contador `N/2.200`
- Preview mídia **1:1** no composer de post

### Story

```text
Criar → Story  OU  botão + do card story
  → Media Capture (story): source → camera|gallery → review → confirm
  → Sheet story (9:16) → Publicar → entra na lista + toast
```

- Story **exige foto**; legenda opcional
- Cancelar captura sem mídia → não abre composer

### Media Capture (z-90)

| Step | UI |
|------|-----|
| `source` | Câmera / Galeria (bottom mobile / modal desktop) |
| `camera` | Preview live + capturar / erro permissão |
| `review` | Confirmar / Refazer |
| `busy` | Bloqueia Esc/close |

---

## 0.9 AvatarMenu, Toast, EmojiPicker, estados

### AvatarMenu (desktop)

- Dropdown no avatar · z-75 · fade **160ms**
- Mesmas ações do sheet “Sua conta”
- Fecha: fora / Esc / após ação

### Toast

| Spec | Valor |
|------|--------|
| z-index | 90 |
| Mobile | `bottom: 68px + safe-area`, centrado |
| Desktop | `bottom: 100px` |
| Entrada | up **240ms** |
| Duração | **2600ms** |
| Max width | ~420px |

### EmojiPicker

- Categorias + grid scrollable
- Usado em: comentários, reply do story
- Abrir **pausa** o timer do story

### Estados globais de UI

| Estado | Comportamento |
|--------|----------------|
| Loading publish/upload | Botão busy / capture busy |
| Empty busca | “Nenhum resultado encontrado” + subtítulo |
| Empty grupos | “Nenhum grupo encontrado.” |
| Unread | Dot no sino; badge msgs; tint notifs |
| Active nav | Fundo brand |
| Pressed | Scale ~0.97 (120ms) |
| Hover desktop | Fundo hover (180ms) |
| `prefers-reduced-motion` | Animações ≈ 0 |

---

## 0.10 Timings — cheat sheet

```text
Story duração .............. 5000ms
Story tick .................. 60ms
Toast ....................... 2600ms
Like pop .................... 240ms (clear ~300ms)
Story reaction float ........ 1450ms
Sheet overlay fade .......... 180ms
Sheet mobile up ............. 320ms
Sheet desktop in ............ 240ms
View slide .................. 240ms
Fade mask opacity ........... 200ms
Avatar menu fade ............ 160ms
Drag threshold .............. 8px
Sticky top .................. 80px
Breakpoint .................. 800px
Desktop zoom ................ ~1.08
```

### Story Viewer (resumo de comportamento)

| Regra | Valor |
|-------|--------|
| Duração | 5s / story |
| Tap esquerda ~30% | Anterior |
| Tap direita ~70% | Próximo |
| Pause | Focus reply OU emoji aberto |
| Último story no fim | Fecha viewer |
| Swipe / setas teclado | Não existem |

### FeedPost (resumo)

| Gesto | Resultado |
|-------|-----------|
| Double-tap na foto | Like **forçado** (não descurte) |
| Like botão | Toggle + pop 240ms |

---

## 0.11 Princípio

> Comporte-se como app **full-bleed** de rede social.  
> A página é o device. Fades e sidebars servem scroll/hierarquia — não para encolher o produto.

Quando em dúvida:

1. Ocupa a largura toda?
2. O scroll certo está no container certo?
3. A máscara só aparece com overflow?
4. O gesto abre sheet vs view vs overlay corretos?

---

# A. HOME (tela base)

## A1. Home / Feed

### O que é
Tela inicial do Gooday. Rede social de vida saudável.

### Como abrir
- Abrir o app (`/`)
- Tab **Início** / nav **Início** (limpa stack de views)

### Layout

**Mobile**

```text
┌────────────────────────────┐
│ HeaderMobile               │ sticky
├────────────────────────────┤
│ Stories (scroll X)         │ full width
├────────────────────────────┤
│ Comunidades (carousel X)   │ só mobile
├────────────────────────────┤
│ Feed posts…                │ max 640px centro
│                            │
│                            │
├────────────────────────────┤
│ MobileNav (pill float)     │ fixed bottom
└────────────────────────────┘
```

**Desktop ≥800**

```text
┌──────────────────────────────────────────────────┐
│ HeaderDesktop (full width, sticky)               │
├──────────────────────────────────────────────────┤
│ Stories (full width, scroll X)                   │
├──────────┬─────────────────────┬─────────────────┤
│ Desktop  │ Feed (coluna meio)  │ RightRail       │
│ Nav      │                     │ Grupos|Pessoas  │
│ sticky   │ scroll = página     │ sticky+scroll   │
│          │                     │ interno + fades │
└──────────┴─────────────────────┴─────────────────┘
```

### Comportamento

- Scroll vertical = **página** (não um container interno no feed)
- Padding bottom mobile ≈ `100px + safe-area` (não ficar atrás da nav)
- Carrossel de comunidades **some** no desktop
- Body **não** fica locked na home (só com overlays)

---

## A2. Header Mobile

**Visível:** `< 800px` · sticky · z-40 · **100% largura**

| Elemento | Ação |
|----------|------|
| Logo Gooday | Marca (sem navegação) |
| Botão + (criar) | Abre sheet **Criar** (`createPicker`) |
| Sino | Abre sheet **Notificações**; dot se houver unread |
| Avatar | Abre sheet **Sua conta** (`avatar`) |

Safe-area no topo.

---

## A3. Header Desktop

**Visível:** `≥ 800px` · sticky · blur · **100% largura**

| Elemento | Ação |
|----------|------|
| Logo | Marca |
| Campo busca (readonly) | Click/focus → view **Buscar** |
| Botão lupa | view **Buscar** |
| Placeholder | “O que deseja fazer de bom hoje?” |
| Frase contexto | “Respeite sua mente e trate seu corpo bem.” |
| Sino | Sheet **Notificações** + dot unread |
| Avatar | **AvatarMenu** dropdown (não sheet) |

Busca: altura ~40px, max-width ~480px no bloco flexível.

---

## A4. Stories Row

### Layout
- Full width
- Cards 112×152 (mobile) / 118×158 (desktop)
- Scroll X + snap + scrollbar oculto
- Desktop: drag-to-scroll (threshold 8px; após drag não dispara click)

### Card “Seu story”
- Capa = avatar ou última story do user
- Tap na imagem: se tem story → **Story Viewer**; senão → captura de story
- Botão `+`: **sempre** inicia criar story (captura)

### Cards de outros
- Ring gradient se não visto; visto = grayscale + brightness reduzido
- Tap → abre **Story Viewer** e marca visto

---

## A5. Communities Carousel (mobile)

- Só `< 800px`
- Cards ~216px, imagem ~120px
- Scroll X + snap
- Tap card → view **Grupo**
- Ícone share → sheet **Compartilhar**

---

## A6. Feed Post (componente da Home)

### Anatomia
1. Avatar (ring brand) + handle
2. Tempo · grupo (ícone pessoas)
3. Menu `⋯`
4. Texto
5. Tags chips (se houver)
6. Imagem 4:3 cover (se houver)
7. Reações (emoji + count) se houver
8. Footer: Like · Comentar · Reagir · Compartilhar · Salvar
9. Preview commenters + “N comentários”

### Ações

| Gesto | Resultado |
|-------|-----------|
| Avatar / handle | View **Perfil** da pessoa |
| Tempo / grupo | View **Publicação** |
| `⋯` | Sheet **Opções** |
| Double-tap na foto | Like forçado (não descurte) |
| Like | Toggle + animação pop 240ms |
| Comentar / preview | Sheet **Comentários** |
| Reagir | Sheet **Reagir** |
| Compartilhar | Sheet **Compartilhar** |
| Salvar | Toggle + toast |

Imagem mobile: full-bleed no card. Desktop: radius 16px.

---

## A7. Mobile Nav

**Fixed bottom** · pill · max 420px · centrada · z-45

| Label | Ação |
|-------|------|
| Início | Home (limpa views) |
| Buscar | View Buscar |
| Criar | Sheet Criar (não muda tab de página) |
| Salvos* | No app atual abre **Mensagens** |
| Perfil | View Meu perfil |

\*No Figma Make: pode rotular **Mensagens** para bater com o comportamento real, ou manter Salvos se for a intenção futura — o código hoje navega para mensagens.

Ativo: círculo brand atrás do ícone.  
Criar: tratamento visual especial, mas **não** seleciona “página”.

---

## A8. Desktop Nav (sidebar esquerda)

**Visível:** `≥ 800px` · sticky · hug no grid · bloco interno ~168px

```text
Início · Buscar · Mensagens · Criar · Grupos · Perfil
────────────────────────────────
Configurações
```

| Item | Ação |
|------|------|
| Início | Home (limpa stack) |
| Buscar | View `search` |
| Mensagens | View `messages` |
| Criar | Sheet `createPicker` |
| Grupos | View `groups` |
| Perfil | View `profile` |
| Configurações | View `settings` |

Ativo: fundo brand + texto on-brand.

---

## A9. Right Rail (desktop)

**Visível:** `≥ 800px` · sticky · preenche a 1ª dobra · scroll interno + fades verticais (§0.5) · wheel capture

### Header da rail
- Tabs: **Grupos | Pessoas** (underline brand no ativo)
- Lupa: abre/fecha campo de busca local
- Filtro (só em Grupos): abre/fecha chips de filtro

### Tab Grupos
- Grid de community cards (`minmax(190px, 1fr)`)
- Imagem aspect ~16/10
- Tap card → view `group`
- Share → sheet `share`
- Busca filtra nome/descrição
- Filtros: Todos · Participando · Sugeridos · Corrida · Ciclismo · Nutrição · Yoga · Treino  
  → chips em row com **fades laterais** (§0.5)
- Botão **Ver tudo** → view `groups`
- Empty: “Nenhum grupo encontrado.”

### Tab Pessoas
- Lista: avatar + nome/handle + Seguir
- Seguir: toggle local + feedback
- **Ver tudo** → view `follows`

---

# B. STORY VIEWER (overlay)

## B1. Story Viewer

**z-80** · fullscreen · body lock · fade 180ms

### Abrir
- Tap em qualquer story da row

### Fechar
- Tap no backdrop
- Escape
- Fim do último story (auto)

### Frame
- 9:16, max ~420px
- Barras de progresso no topo (1 por story)
- Header: avatar, nome, tempo
- Reply bar embaixo

### Comportamento

| Regra | Valor |
|-------|--------|
| Duração | 5s por story |
| Tick | 60ms |
| Tap esquerda 30% | Anterior |
| Tap direita 70% | Próximo |
| Pause | Focus no reply OU emoji picker aberto |
| Reply Enter | Toast + float |
| Quick ❤️👏🔥😍 | Toast + float 1.45s |
| Swipe | Não existe |
| Setas teclado | Não existem |

Mobile: setas flutuantes mid. Desktop: setas laterais fora do frame.

---

# C. VIEWS (fullscreen overlay)

Padrão comum a **todas** as views:

- `fixed inset-0` · fundo page · z-60 · slide 240ms
- Header sticky: **← Voltar** + título
- Conteúdo `max-width: 640px` centrado
- Scroll interno do overlay
- Body lock enquanto aberta
- `back()` volta na stack; se vazia → Home

---

## C1. Buscar

**Título:** Buscar  
**Abrir:** tab/nav Buscar, header desktop busca

### Anatomia
1. Campo pill: ícone lupa + input “Pessoas, grupos e interesses” + × limpar (se tem query)
2. Empty state (se query sem resultado):
   - “Nenhum resultado encontrado”
   - “Tente pesquisar por outro nome, interesse ou comunidade.”
3. Chips recentes: `corrida` · `nutrição` · `ciclismo urbano` · `yoga` (tap preenche/busca)
4. Seção **PESSOAS** — lista avatar + nome + handle · contexto → abre Perfil
5. Seção **GRUPOS** — thumb 52px + nome + meta → abre Grupo

### Comportamento
- Filtro **live** enquanto digita
- Match em nome/handle de pessoas e nome de comunidades

---

## C2. Perfil (outra pessoa)

**Título:** Perfil  
**Abrir:** avatar/handle no feed, busca, members, follows, chat header

### Anatomia
1. Cover 120px radius 18
2. Avatar 88px sobreposto (−mt), borda page
3. Nome · handle · localização
4. Bio
5. Chips de interesses (border brand)
6. Stats clicáveis: seguidores · seguindo · publicações
7. Botões: **Seguir/Seguindo** | **Mensagem**
8. Título **PUBLICAÇÕES**
9. Grid 3 colunas de fotos **ou** empty “Nada publicado…”

### Ações
| Elemento | Ação |
|----------|------|
| Seguir | Toggle; label/bg mudam |
| Mensagem | Abre **Chat** com essa pessoa |
| Seguidores/seguindo | View **Seguidores** |
| Foto do grid | View **Publicação** |

---

## C3. Grupo

**Título:** Grupo  
**Abrir:** card comunidade (carousel/rail/busca/grupos)

### Anatomia
1. Cover 160px
2. Nome do grupo
3. Status (Público/Privado) · groups · members
4. Descrição
5. Avatars empilhados + “Ver membros”
6. Botão full-width: **Participar** / **Participando** / **Solicitar entrada**
7. **FEED DO GRUPO** — cards simplificados (avatar, texto, img 4:3, curtidas/comentários)

### Ações
| Elemento | Ação |
|----------|------|
| Ver membros | View **Membros** |
| Participar | Toggle join + toast (solicitar/cancelar) |
| Botão join estado | Brand se não entrou; elevated se já participa |

Feed do grupo: posts cujo `group` = nome do grupo (somente leitura nesta tela).

---

## C4. Publicação (detalhe)

**Título:** Publicação  
**Abrir:** tempo do post / grid do perfil

### Anatomia
1. Card: avatar, handle, tempo, texto, imagem 4:3 (se houver)
2. Like (cor muda) + “N comentários”
3. Thread de comentários (avatar, nome, texto, “tempo · Curtir · Responder”)
4. Botão **Escrever comentário** → sheet Comentários

---

## C5. Mensagens (lista)

**Título:** Mensagens  
**Abrir:** nav Mensagens / tab mobile correspondente

### Anatomia (por linha)
- Avatar 52px + dot online (verde) / offline
- Nome + preview truncado
- Tempo + badge unread (brand pill)

### Ação
Tap linha → **Chat** (zera unread da conversa)

---

## C6. Chat

**Título no header:** vazio; à direita fica avatar+nome+status  
**Abrir:** Mensagens · botão Mensagem no perfil

### Anatomia
1. Header especial: tap no bloco da pessoa → Perfil
2. Status: “online agora” ou “visto há 2 h”
3. Bolhas:
   - Eu: align end, bg brand, texto on-brand
   - Outro: align start, bg elevated
   - Timestamp pequeno dentro da bolha
4. Composer **fixed** no fundo (blur):
   - Input “Escreva uma mensagem…”
   - Botão enviar (círculo brand)

### Comportamento
- Enter ou botão → envia (texto “agora”)
- Padding bottom da lista para não ficar atrás do composer

---

## C7. Meu perfil

**Título:** Meu perfil  
**Abrir:** tab Perfil · menu conta

### Anatomia
Igual perfil de outro, porém:
- Botões: **Editar perfil** | **Meus grupos**
- Tabs: **Publicações · Salvos · Grupos · Sobre**
  - Ativa: cor texto + underline brand
- Grid 3 cols conforme tab:
  - Publicações → posts do me com imagem → abre post
  - Salvos → posts saved com imagem → post
  - Grupos → capas dos joined → grupo
  - Sobre → texto bio · loc (sem grid)

Stats → Seguidores.

---

## C8. Editar perfil

**Título:** Editar perfil

### Anatomia
1. Avatar 72px + botão **Alterar foto** (UI; sem upload real no mock)
2. Campos:
   - Nome
   - Nome de usuário
   - Bio (textarea)
   - Localização
3. **Salvar alterações** → back + toast

---

## C9. Membros

**Título:** Membros  
**Abrir:** “Ver membros” no grupo

### Anatomia (linha)
Avatar · nome · handle · role (Criador/Admin/Moderadora/Membro)

### Ação
Tap linha → Perfil da pessoa  
Role não-membro usa cor brand-soft.

---

## C10. Seguidores

**Título:** Seguidores  
**Abrir:** stats de perfil

### Anatomia (linha)
- Tap identidade → Perfil
- Botão **Seguir / Seguindo** (toggle bg brand/elevated)

---

## C11. Meus grupos

**Título:** Meus grupos  
**Abrir:** nav Grupos · botão Meus grupos no perfil

### Anatomia
1. Texto: “Comunidades que você participa e acompanha.”
2. Campo busca “Buscar grupos e comunidades...”
3. Chips filtro (ScrollFadeRow) — mesmos da rail
4. Grid cards:
   - Capa 104px
   - Avatars empilhados
   - Nome · meta
   - Badge Participando / Sugerido / etc.
5. Empty: “Nenhum grupo encontrado.”

### Ação
Tap card → Grupo  
Busca filtra nome/descrição + filtro ativo.

---

## C12. Configurações

**Título:** Configurações  
**Abrir:** nav Configurações · menu conta

### Anatomia
1. Card conta: avatar + nome + @
2. Seção:
   - Alterar e-mail (hint = email atual) → Change Email
   - Alterar senha (hint ••••••••) → Change Password
3. Seção:
   - **Sair da conta** (danger) → sheet Logout

---

## C13. Alterar e-mail

**Título:** Alterar e-mail

- Texto explicativo
- Input “Novo e-mail”
- **Salvar e-mail**
- Validação regex; toast erro ou sucesso + back

---

## C14. Alterar senha

**Título:** Alterar senha

- Texto (≥8 caracteres)
- Senha atual · Nova · Confirmar
- **Salvar senha**
- Valida match e tamanho; toast + back

---

# D. SHEETS (modais)

### Comportamento comum
- Overlay escuro 68% + blur · z-70
- Mobile: bottom sheet, handle, max-height ~90dvh, anima up 320ms
- Desktop: center, maxW 500 (comentários 980 / 80vh), anima in 240ms
- Fechar: backdrop, X, Escape
- Título no header do sheet + X

---

## D1. Criar (`createPicker`)

**Título:** Criar  
**Abrir:** + header, tab/nav Criar

### Conteúdo
Dois botões grandes:

1. **Publicação** — “Compartilhe fotos ou texto no feed” → sheet Nova publicação
2. **Story** — “Desaparece em 24 horas” → fecha sheet + abre **Media Capture** (story)

---

## D2. Nova publicação (`create`)

**Título:** Nova publicação

### Anatomia
1. Área mídia **1:1** — “Tirar foto ou galeria” / preview + ✕ remover
2. Avatar + textarea “Escreva uma legenda...”
3. Toolbar lista:
   - Marcar pessoas → toast + label “N pessoa(s)”
   - Adicionar local → “São Paulo, SP”
   - Público → ciclo Todos → Seguidores → Amigos próximos
   - Grupo → ciclo comunidades / Nenhum
4. Contador `N/2.200` + botão **Compartilhar**

### Regras
- Publicar precisa de **texto ou foto**
- Publishing: botão “Publicando…” disabled
- Sucesso: fecha, post no topo do feed, toast, scroll top smooth

---

## D3. Novo story (`story`)

**Título:** Novo story  
**Abrir:** após confirmar captura de story

### Anatomia
- Preview **9:16** max 280px
- Tap troca foto; ✕ remove
- Legenda overlay na base (texto branco)
- Contador + **Compartilhar no story**
- Exige foto

---

## D4. Comentários (`comments`)

**Título:** Comentários

### Mobile
- Lista de comentários (ou empty)
- Composer: avatar + input “use @ para marcar” + 😊 + Enviar
- @abre sugestões (até 5)
- Enter envia

### Desktop
- Modal largo (~980px / ~80vh) split:
  - Esquerda 44%: imagem cover (ou texto se sem img)
  - Direita 56%: autor, texto, like/share/salvar, thread scroll, composer
- @mention autocomplete + emoji picker (igual mobile)
- Comentário novo aparece na thread (estado local)

---

## D5. Reagir (`reactions`)

**Título:** Reagir

- Grid de emojis (~60×60)
- Tap → incrementa no post + fecha sheet

---

## D6. Compartilhar (`share`)

**Título:** Compartilhar

1. Row horizontal de pessoas (DM) → toast “Enviado para X”
2. Lista:
   - Copiar link → “Link copiado”
   - Compartilhar em um grupo
   - Enviar por mensagem
   - Compartilhar fora do Gooday

Fecha após ação.

---

## D7. Opções da publicação (`menu`)

**Título:** Opções da publicação

- Salvar publicação
- Não tenho interesse
- Deixar de seguir
- Copiar link
- **Denunciar** (vermelho, separado)

Cada um → toast + fecha.

---

## D8. Notificações (`notifications`)

**Título:** Notificações

- Link “Marcar todas como lidas”
- Grupos **HOJE** / **ESTA SEMANA**
- Item: avatar · “**Nome** texto” · tempo · CTA opcional · dot unread
- Unread: fundo tint notif

---

## D9. Sua conta (`avatar`) — mobile

**Título:** Sua conta

1. Header: avatar + “Marcos Vinícius” + @ · seguidores
2. Meu perfil → view
3. Editar perfil → view
4. Configurações → view
5. Ajuda → toast “Ajuda — próxima tela”
6. (switches de outros segmentos no código multi-marca — **ignorar no Gooday puro**)
7. **Sair** (vermelho) → sheet Logout

Desktop: mesmo conteúdo no **AvatarMenu** dropdown.

---

## D10. Deseja sair? (`logout`)

**Título:** Deseja sair?

- Texto: “Você poderá retornar à experiência a qualquer momento.”
- **Cancelar** | **Sair** (vermelho)
- Sair → toast “Sessão encerrada (mock)”

---

## D11. Busca sheet (`search`) — legado

Stub no código (“próxima tela”). **A busca real é a view `search` (C1).** Não replicar como sheet no Figma Make.

---

# E. MEDIA CAPTURE (overlay)

## E1. MediaCaptureOverlay

**z-90** · body lock

### Steps

| Step | UI | Ações |
|------|-----|--------|
| `source` | Câmera / Galeria | Escolher origem |
| `camera` | Preview live | Capturar / erro permissão |
| `review` | Preview processado | Confirmar / Refazer |
| busy | — | Bloqueia fechar |

Mobile source = bottom sheet. Desktop = modal center.  
Confirm → aplica mídia no composer (post ou story).

---

# F. TOAST

- z-90
- Mobile: acima da bottom nav (`68px + safe`)
- Desktop: `bottom 100px`
- Auto-dismiss **2.6s**
- Anima up 240ms

Usado em: publicar, salvar, share, follow join, settings, logout, story reply, etc.

---

# G. MAPA DE NAVEGAÇÃO (todas as telas)

```text
HOME
├── Story Viewer
├── Sheet: Criar
│   ├── Sheet: Nova publicação → MediaCapture
│   └── MediaCapture → Sheet: Novo story
├── Sheet: Comentários / Reagir / Compartilhar / Menu
├── Sheet: Notificações
├── Sheet/Menu: Conta → Logout
│
├── View: Buscar → Perfil | Grupo
├── View: Perfil (pessoa) → Chat | Seguidores | Publicação
├── View: Grupo → Membros | (join)
├── View: Publicação → Comentários
├── View: Mensagens → Chat → Perfil
├── View: Meu perfil
│   ├── Editar perfil
│   ├── Meus grupos → Grupo
│   ├── Seguidores
│   └── tabs Publicações/Salvos/Grupos/Sobre
├── View: Meus grupos → Grupo
└── View: Configurações
    ├── Alterar e-mail
    ├── Alterar senha
    └── Logout
```

---

# H. CHECKLIST Figma Make — fidelidade (telas + comportamento)

## Layout / comportamento global (§0)
- [ ] App full-bleed 100% largura do device (não card central estreito)
- [ ] `min-height: 100dvh` · body até 1920px
- [ ] Breakpoint 800px mobile/desktop
- [ ] Desktop: 3 colunas dentro da janela (`max-content | 280–560 | 1fr`)
- [ ] Gaps/paddings ≥1200 / ≥1800
- [ ] Zoom desktop ~1.08 (se aplicável)
- [ ] Safe-areas em header, nav, sheets, toast, views
- [ ] Z-index na ordem: 40 → 45 → 60 → 70 → 75 → 80 → 90
- [ ] Body lock com view/sheet/story/media
- [ ] Escape na prioridade documentada
- [ ] Stack go/back nas views

## Scroll / máscaras
- [ ] Feed = scroll da página; views = scroll próprio
- [ ] Stories + communities: scroll X + snap + scrollbar oculto
- [ ] Stories desktop: drag-to-scroll threshold 8px (sem click acidental)
- [ ] Rail: scroll interno + **fade top/bottom dinâmico** (40px, 200ms)
- [ ] Wheel capture na rail
- [ ] Chips: fade left/right dinâmico (24px)
- [ ] Overscroll contain em sidebars/overlays

## Home
- [ ] Stories rings visto/não visto + grayscale quando visto
- [ ] Carousel comunidades só mobile
- [ ] Feed posts com todas as ações
- [ ] Double-tap like na imagem (forçado)
- [ ] Like pop 240ms
- [ ] Bottom nav float + safe-area + padding do conteúdo
- [ ] Criar na nav abre picker (não “página Criar”)

## Overlays / sheets
- [ ] Story: 5s, tick 60ms, tap 30/70, pause no reply/emoji
- [ ] Sheets: bottom mobile / center desktop + timings 180/320/240
- [ ] Comments desktop split ~44/56 · max ~980px / 80vh
- [ ] Create picker → post/story + fluxos Media Capture
- [ ] Toast 2.6s · posições mobile/desktop
- [ ] Avatar menu desktop fade 160ms
- [ ] EmojiPicker pausa story

## Telas obrigatórias (inventário)

### Home / chrome
- [ ] Home Feed
- [ ] Header Mobile
- [ ] Header Desktop
- [ ] Stories Row
- [ ] Communities Carousel
- [ ] Mobile Nav
- [ ] Desktop Nav
- [ ] Right Rail

### Overlays especiais
- [ ] Story Viewer
- [ ] Media Capture
- [ ] Toast
- [ ] Avatar Menu (desktop)

### Views
- [ ] Buscar
- [ ] Perfil (pessoa)
- [ ] Grupo
- [ ] Publicação
- [ ] Mensagens
- [ ] Chat
- [ ] Meu perfil
- [ ] Editar perfil
- [ ] Membros
- [ ] Seguidores
- [ ] Meus grupos
- [ ] Configurações
- [ ] Alterar e-mail
- [ ] Alterar senha

### Sheets
- [ ] Criar (picker)
- [ ] Nova publicação
- [ ] Novo story
- [ ] Comentários
- [ ] Reagir
- [ ] Compartilhar
- [ ] Opções da publicação
- [ ] Notificações
- [ ] Sua conta
- [ ] Deseja sair?

---

# I. Princípio

> Cada tela acima existe no app de hoje.  
> Replique **estrutura, ações e estados** — não só o visual.  
> Se uma interação não estiver neste documento, não invente: volte na Home e percorra o fluxo real.

**Gooday = rede social full-bleed de vida saudável.**  
Feed, stories, grupos, mensagens e conta — com o mesmo comportamento documentado aqui.
