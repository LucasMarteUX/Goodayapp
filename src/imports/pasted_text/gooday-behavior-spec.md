# Gooday — Especificação de Comportamento

Documento para reconstrução no **Figma Make** (e qualquer protótipo interativo).

Foco: **comportamento, layout, scroll, máscaras, fluxos e regras de cada componente** — não identidade visual detalhada.

Produto: **Gooday** (rede social de vida saudável) · rota `/`

---

## 0. Regras absolutas de layout (ler primeiro)

### 0.1 Ocupar a tela inteira do device

O Gooday **não** é um frame estreito centralizado tipo “mock de celular dentro da página”.

| Regra | Comportamento |
|-------|----------------|
| Largura | `width: 100%` do viewport (até `max-width: 1920px` no body) |
| Altura | `min-height: 100dvh` — preenche a altura da tela |
| Mobile | Edge-to-edge: stories, feed e nav usam a largura do device |
| Desktop | Grid de 3 colunas **dentro** da largura total da janela, com padding lateral — não um card flutuante no centro |
| Erro comum (Figma Make) | Deixar o app numa coluna estreita com laterais vazias enormes → **incorreto** |

### 0.2 Breakpoint principal: `800px`

| Viewport | Layout |
|----------|--------|
| `< 800px` | Mobile: header + stories + feed (max 640px centrado) + carrossel de comunidades + bottom nav |
| `≥ 800px` | Desktop: header sticky + stories full-width + **grid 3 colunas** (nav \| feed \| rail) |
| `≥ 1200px` | Gap do grid aumenta |
| `≥ 1800px` | Padding lateral e gap maiores |

### 0.3 Escala desktop

Em `≥ 800px`, o HTML usa zoom ≈ `1.08` (escala visual levemente maior). Sidebars compensam altura com `100dvh / 1.08`.

### 0.4 Safe areas

Respeitar `env(safe-area-inset-top|bottom|left|right)` em:

- Header mobile (topo)
- Bottom nav (embaixo)
- Sheets / composers (embaixo)
- Toast (embaixo)
- Overlay screens (topo e bottom)

---

## 1. Arquitetura da Home (shell)

### Estrutura de camadas (de baixo para cima)

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

Quando qualquer um destes está aberto: **view**, **sheet**, **story viewer** ou **media capture**:

- `body` fica `position: fixed`
- Scroll da página é restaurado ao fechar (mantém `scrollY`)

### Tecla Escape (prioridade)

1. Fecha emoji picker de comentário (se aberto)
2. Fecha emoji picker do story
3. Fecha story viewer
4. Fecha sheet
5. `back()` na view (stack)

---

## 2. Layout Desktop — grid full-width

Quando `≥ 800px`, o conteúdo abaixo das stories vira:

```text
| DesktopNav (hug) | Main feed (280–560px flex) | RightRail (1fr, min 240px) |
```

Regras:

- Container: `width: 100%`
- `display: grid`
- Colunas: `max-content | minmax(280px, 560px) | minmax(240px, 1fr)`
- Gap: `32px` (≥1200: `40px`; ≥1800: `48px`)
- Padding horizontal: `20px` (≥1800: `32px`)
- Nav e Rail usam `display: contents` nos wrappers para entrarem no mesmo grid
- **Main** no desktop: `max-width: none` — ocupa a coluna do meio
- **Main** no mobile: `max-width: 640px`, centralizado

### Sticky sidebars

- Classe sticky: `position: sticky; top: 80px; align-self: start`
- Nav esquerda: altura “hug”, sempre sticky ativa
- Rail direita: **preenche a 1ª dobra** (`fillFirstFold`):
  - Altura = `visualViewport.height - top - margemInferior(48) - paddingTop`
  - Mínimo `280px`
  - Scroll interno independente do feed

---

## 3. Scroll — regras gerais

| Região | Tipo de scroll |
|--------|----------------|
| Home / Feed | Scroll **da página** (window/body) |
| Overlay view | Container `fixed inset-0` com `overflow-y-auto` próprio |
| Stories row | Horizontal, página |
| Communities carousel (mobile) | Horizontal, página |
| Right rail (grupos/pessoas) | Vertical **interno** + máscaras |
| Filtros de chips | Horizontal + máscaras laterais |
| Story viewer | Sem scroll de mídia; body locked |
| Sheets | Panel com `max-height ~90dvh` e scroll interno se precisar |

### Scrollbar

Listas horizontais e sidebars usam **scrollbar oculto** (`.no-scrollbar`).

### Overscroll

Sidebars e overlays: `overscroll-behavior: contain` (não “vaza” scroll para a página quando possível).

---

## 4. Máscaras / fades de opacidade (comportamento crítico)

### 4.1 Fade vertical (rail / listas sticky)

Usado em: RightRail (grupos e pessoas), listas longas em sidebar.

| Item | Spec |
|------|------|
| Posição | Absolute, topo e fundo do container scroll |
| Altura | `40px` (`h-10`) |
| Interação | `pointer-events: none` |
| Gradiente topo | `fadeColor → transparent` (de cima para baixo) |
| Gradiente fundo | `fadeColor → transparent` (de baixo para cima) |
| Cor padrão | fundo da página (`--gd-bg`) |
| Opacidade | `0` ou `1`, transição `200ms` |
| Fade topo aparece quando | `scrollTop > 2` |
| Fade fundo aparece quando | ainda há conteúdo abaixo (`> 2px` do fim) |

**Wheel capture:** com o mouse sobre a rail, o scroll da roda alimenta a lista interna enquanto não está no topo/fundo; só então o scroll sobe/desce a página.

### 4.2 Fade horizontal (chips / filtros)

Usado em: filtros de grupos, rows de chips.

| Item | Spec |
|------|------|
| Largura | `24px` (`w-6`) cada lado |
| Gradiente esq. | `fadeColor → transparent` (esquerda → direita) |
| Gradiente dir. | `fadeColor → transparent` (direita → esquerda) |
| Aparece esq. | `scrollLeft > 2` |
| Aparece dir. | ainda há conteúdo à direita |

### 4.3 O que NÃO fazer no Figma Make

- Não cortar a rail com uma máscara estática sempre ligada
- Não usar sombra pesada no lugar do fade
- Fades devem **aparecer/desaparecer** conforme posição do scroll

---

## 5. Drag-to-scroll (desktop) — Stories

Componente: stories row.

| Regra | Valor |
|-------|--------|
| Só pointer não-touch | Touch usa pan nativo |
| Botão | Esquerdo |
| Threshold | `8px` antes de virar “drag” |
| Cursor | `grab` → `grabbing` |
| Após drag | Bloqueia o próximo `click` (não abre story por acidente) |
| Snap | `scroll-snap-type: x mandatory`; cards `scroll-snap-align: start` |

Communities carousel mobile: snap + scrollbar oculto, **sem** drag-scroll custom.

---

## 6. Header Mobile

**Visível:** `< 800px` · sticky · z-40

### Comportamento

- Ocupa **100% da largura**
- Padding top respeita safe-area
- Borda inferior hairline
- Fundo sólido (header mobile)

### Elementos (esquerda → direita)

1. **Logo Gooday** (não navega; marca)
2. **Criar** → abre sheet `createPicker`
3. **Notificações** → abre sheet `notifications`  
   - Dot vermelho/verde de unread se houver não lidas
4. **Avatar** → sheet `avatar` (mobile) / menu dropdown (desktop)

---

## 7. Header Desktop

**Visível:** `≥ 800px` · sticky · z-40 · `backdrop-blur`

### Layout (100% largura)

```text
[ Logo ] [ Busca …………………… ] [ Ícone + frase de contexto ] [ Sino ] [ Avatar ]
```

### Comportamentos

| Elemento | Ação |
|----------|------|
| Campo busca (readonly) | Focus/click → `go('search')` |
| Botão lupa | `go('search')` |
| Placeholder | “O que deseja fazer de bom hoje?” |
| Frase contexto | Estática: “Respeite sua mente e trate seu corpo bem.” |
| Sino | Sheet notificações + dot unread |
| Avatar | Abre AvatarMenu (dropdown, não sheet) |

Busca: altura ~40px, max-width ~480px no bloco flexível.

---

## 8. Stories Row

### Layout

- Full width da página
- Padding horizontal: mobile `16px`; desktop `24px`
- Gap entre cards: `10px`
- Scroll horizontal + snap + no-scrollbar
- Touch: `touch-pan-x`
- Select de texto desabilitado na row

### Card “Meu story” (criar)

| Spec | Mobile | Desktop |
|------|--------|---------|
| Tamanho | 112 × 152 | 118 × 158 |
| Radius | 20px | 20px |

**Comportamentos:**

- Capa: se o user já tem story → imagem do story; senão → avatar
- Tap na área da imagem:
  - Se tem story → abre **Story Viewer** nesse índice
  - Se não → inicia fluxo de criar story (captura)
- Botão `+` (canto): **sempre** inicia criar story (captura)
- Se já tem story, o `+` pode usar ring/brand diferenciado

### Cards de outras pessoas

- Mesmo tamanho do card criar
- **Não visto:** ring em gradiente (lima)
- **Visto:** ring transparente; imagem com `grayscale(1)` + `brightness(0.75)`
- Avatar pequeno sobreposto com ring
- Tap → abre Story Viewer **e marca como visto**

---

## 9. Story Viewer

**Camada:** z-80 · fullscreen · body lock

### Abertura / fechamento

- Overlay: preto ~85% + blur leve; fade-in **180ms**
- Tap no backdrop (fora do frame) → fecha
- Escape → fecha (se não houver picker aberto)
- Ao fechar: libera body scroll

### Frame

- Aspecto **9:16**
- Largura máxima ~420px (ajustada ao viewport)
- Cantos arredondados (18 mobile / 24 desktop)
- Conteúdo: imagem cover + header (avatar, nome, tempo) + reply bar

### Barras de progresso

- Uma barra por story na lista
- Anteriores: 100%
- Atual: percentual animado
- Próximas: 0%
- Altura ~2.5px

### Auto-advance

| Spec | Valor |
|------|--------|
| Duração por story | **5000ms** |
| Tick | **60ms** |
| Incremento | `(60/5000)*100` % por tick |
| Ao chegar 100% | vai para o próximo |
| No último | **fecha** o viewer |

### Pause

Pausa o timer quando:

- Input de reply está focado, **ou**
- Emoji picker do story está aberto

### Navegação

| Input | Ação |
|-------|------|
| Tap zona esquerda (~30%) | Story anterior |
| Tap zona direita (~70%) | Próximo story |
| Setas mobile (meio) | Prev / next se existirem |
| Setas desktop (fora do frame) | Prev / next |
| Swipe | **Não implementado** |
| Teclado setas | **Não implementado** |

### Reply / reações

- Campo reply + enviar (Enter) → toast “Resposta enviada” + float 💬
- Quick reactions: ❤️ 👏 🔥 😍 → toast + emoji flutuante **1.45s**
- Emoji picker completo disponível no composer do story

---

## 10. Communities Carousel (somente mobile)

**Visível:** `< 800px` e quando há comunidades para mostrar  
**Oculto:** desktop (substituído pela RightRail)

### Comportamento

- Scroll horizontal, snap, no-scrollbar
- Cards compactos ~**216px** de largura
- Imagem de capa ~120px de altura
- Tap no card → view `group`
- Ícone share no card → sheet `share` (contexto comunidade)

---

## 11. Feed / FeedPost

### Container

- Mobile: padding horizontal do main (~16px); cards com radius 22px
- Desktop: coluna do meio; posts com separação por borda inferior (menos “card solto”)
- Scroll: página

### Anatomia do post

1. Avatar + handle + tempo · grupo
2. Menu `⋯`
3. Texto
4. Tags (chips) se houver
5. Imagem (opcional) aspect **4:3**, `object-cover`
6. Contadores de reações (se houver)
7. Footer: Like · Comentar · Reagir · Compartilhar · Salvar
8. Preview de commenters + “N comentários” (se houver)

### Imagem

| Viewport | Comportamento |
|----------|----------------|
| Mobile | Full-bleed relativo ao card (`-mx` para encostar nas bordas do card) |
| Desktop | Largura do card + radius de mídia 16px |
| Double-tap | **Like forçado** (se já liked, permanece liked — não unlike) |

### Interações

| Ação | Resultado |
|------|-----------|
| Tap avatar / handle | View `person` |
| Tap tempo / área de meta | View `post` |
| Tap `⋯` | Sheet `menu` |
| Like | Toggle like + animação pop **240ms** (scale até ~1.28) |
| Comentar | Sheet `comments` |
| Reagir | Sheet `reactions` |
| Compartilhar | Sheet `share` |
| Salvar | Toggle saved + toast (“salva” / “removida”) |
| Preview comentários | Abre `comments` |
| Tags | Visuais; sem navegação própria no protótipo |

---

## 12. Mobile Nav (bottom)

**Visível:** `< 800px` · fixed · z-45 · **centralizado**, max-width 420px

### Layout

- Pill flutuante com sombra
- `margin-bottom: 12px + safe-area`
- O conteúdo da home tem `padding-bottom: ~100px + safe-area` para não ficar atrás da nav

### Tabs (Gooday)

| Label UI | Ícone | Ação real |
|----------|-------|-----------|
| Início | home | Limpa view + stack → home |
| Buscar | search | `go('search')` |
| Criar | create | **Abre `createPicker`** (não muda de tela) |
| Salvos* | pin | No código atual → `go('messages')` |
| Perfil | heart | `go('profile')` |

\*Alinhar no Figma Make: idealmente **Mensagens** aqui, ou Salvos reais — documentar a intenção do produto: tab de mensagens + salvos no perfil.

### Estado ativo

- Fundo brand em círculo (~44px) no item ativo
- Criar: tratamento visual especial (ícone create), mas **não** seleciona “página”

---

## 13. Desktop Nav (sidebar esquerda)

**Visível:** `≥ 800px` · sticky

### Itens

```text
Início · Buscar · Mensagens · Criar · Grupos · Perfil
────────────────────────────────
Configurações
```

### Comportamentos

| Item | Ação |
|------|------|
| Início | Home (limpa stack) |
| Buscar | View search |
| Mensagens | View messages |
| Criar | Sheet createPicker |
| Grupos | View groups |
| Perfil | View profile |
| Configurações | View settings |

Ativo: fundo brand + texto on-brand.

Largura do bloco interno ~168px (hug no grid).

---

## 14. Right Rail (desktop)

**Visível:** `≥ 800px` · sticky · preenche 1ª dobra · scroll interno + fades

### Header da rail

- Tabs: **Grupos | Pessoas** (underline brand no ativo)
- Lupa: abre/fecha campo de busca local
- Filtro (só em Grupos): abre/fecha chips de filtro

### Tab Grupos

- Grid de community cards (`minmax(190px, 1fr)`)
- Imagem aspect ~16/10
- Tap → `group`
- Share → sheet share
- Busca filtra nome/descrição
- Filtros: Todos · Participando · Sugeridos · Corrida · Ciclismo · Nutrição · Yoga · Treino  
  → chips em **ScrollFadeRow** (fades laterais)
- Botão **Ver tudo** → view `groups`
- Empty: “Nenhum grupo encontrado.”

### Tab Pessoas

- Lista avatar + nome/handle + Seguir
- Seguir: toggle local + feedback
- **Ver tudo** → view `follows`

---

## 15. Sheets (SheetModal)

### Geometria

| Viewport | Comportamento |
|----------|----------------|
| Mobile | Bottom sheet, sobe do rodapé, radius topo 22, handle 10×4, max-height ~90dvh |
| Desktop | Modal central (exceto comments, que pode ser largo) |

### Motion

| Peça | Timing |
|------|--------|
| Overlay fade | 180ms |
| Sheet mobile (slide up) | 320ms |
| Sheet desktop (fade+scale) | 240ms |
| Overlay fundo | preto ~68% + blur 4px |

### Fechar

- Tap backdrop
- Botão X (quando houver)
- Escape
- Algumas ações fecham automaticamente após toast

### Catálogo de sheets

#### `createPicker` — Criar

- Opção **Publicação** → sheet `create`
- Opção **Story** → fecha sheet e abre **MediaCapture** mode story

#### `create` — Nova publicação

- Composer de post (ver §17)

#### `story` — Novo story

- Composer 9:16 (abre após captura confirmada)

#### `comments` — Comentários

- Mobile: lista + composer
- Desktop: modal largo (~980px, ~80vh) split mídia | thread quando houver imagem
- @mention autocomplete
- Emoji picker
- Enter / botão Enviar
- Comentário novo aparece na thread (estado local)

#### `reactions` — Reagir

- Grid de ~10 emojis
- Escolher → incrementa contador no post → fecha

#### `share` — Compartilhar

- Row horizontal de pessoas (DM)
- Ações: Copiar link · Grupo · Mensagem · Fora
- Cada ação → toast + fecha

#### `menu` — Opções da publicação

- Salvar
- Não tenho interesse
- Deixar de seguir
- Copiar link
- Denunciar  
→ toasts conforme ação

#### `notifications` — Notificações

- Grupos: Hoje / Esta semana
- Itens unread com tint
- CTA opcional no item
- Marcar todas como lidas

#### `avatar` — Conta (mobile)

- Ver perfil · Editar · Settings · Ajuda · Sair  
- (No desktop vira AvatarMenu)

#### `logout` — Confirmar saída

- Cancelar / Sair → toast mock “Sessão encerrada”

#### `search` (sheet)

- Stub legado (“próxima tela”); **busca real é a view `search`**

---

## 16. Overlay Screens (views full-screen)

**Camada:** z-60 · `fixed inset-0` · slide-in **240ms** · scroll interno · header sticky com **Voltar**

Conteúdo tipicamente `max-width: 640px` centrado.

### Stack de navegação

- `go(view, param?)` empurra a tela atual na stack, abre a nova, fecha sheet, scroll top
- `back()`: pop; se vazio → home (`view = null`)
- Tab Início zera a stack

### Views

#### `search` — Buscar

- Input com filtro live
- Chips de recentes (corrida, nutrição…)
- Seções Pessoas e Grupos
- Tap pessoa → `person`
- Tap grupo → `group`
- Empty state

#### `person` — Perfil de alguém

- Cover, avatar, bio, interesses
- Seguir (toggle)
- Mensagem → `chat`
- Stats → `follows`
- Grid de posts → `post`

#### `group` — Página do grupo

- Cover, nome, descrição, público/privado
- Participar / Solicitar (privado) → toast
- Ver membros → `members`
- Feed do grupo (posts daquele grupo)

#### `post` — Detalhe

- Post completo
- Like
- Abrir comments sheet

#### `messages` — Lista

- Conversas: avatar, preview, unread, online
- Tap → `chat` (zera unread)

#### `chat` — Conversa

- Header com nome (tap → person)
- Bolhas enviadas/recebidas
- Composer sticky no fundo
- Enter envia → mensagem “agora”

#### `profile` — Meu perfil

- Cover, stats, Editar, Meus grupos
- Tabs: **Publicações · Salvos · Grupos · Sobre**
- Grid 3 colunas de posts
- Stats → follows

#### `editProfile`

- Foto, nome, @, bio, loc
- Salvar → back + toast

#### `members`

- Lista com roles (Criador / Admin / Moderadora / Membro)

#### `follows`

- Seguidores / seguindo
- Toggle seguir por linha

#### `groups` — Meus / explorar grupos

- Busca
- Filtros (ScrollFadeRow)
- Grid de cards → `group`

#### `settings`

- Conta, alterar e-mail, alterar senha, Sair

#### `changeEmail` / `changePassword`

- Validação (e-mail regex; senha ≥8 + confirm)
- Salvar → toast + back

---

## 17. Create — fluxos completos

### 17.1 Publicação

```text
Criar (picker)
  → Publicação
    → Sheet create (composer)
      → (opcional) Captura/galeria de mídia
      → Legenda (+ hashtags viram tags)
      → Marcar pessoas / Local / Audiência / Grupo (ciclam mocks)
      → Publicar
        → Post no topo do feed
        → Toast
        → Scroll smooth para o topo
        → Fecha sheet
```

Regras:

- Publicar exige **foto ou texto**
- Contador de caracteres (limite ~2200 no UI)
- Preview de mídia em aspect square no composer de post

### 17.2 Story

```text
Criar (picker) → Story
  OU botão + no card de story
    → MediaCaptureOverlay (mode story)
      → source → camera|gallery → review → confirm
        → Sheet story (composer 9:16)
          → Publicar
            → Story entra na lista
            → Toast “Story publicado”
```

Regras:

- Story **exige foto**
- Legenda opcional
- Cancelar captura sem mídia não abre composer

### 17.3 MediaCaptureOverlay (z-90)

| Step | UI |
|------|-----|
| `source` | Escolher Câmera ou Galeria (bottom sheet mobile / modal desktop) |
| `camera` | Preview live + capturar / erro de permissão |
| `review` | Preview + Confirmar / Refazer |
| busy | Bloqueia Esc / close |

Escape fecha se não estiver processando.

---

## 18. AvatarMenu (desktop)

- Dropdown ancorado no avatar · z-75 · fade 160ms
- Mesmas ações do sheet avatar
- Fecha ao clicar fora / Esc / após ação

---

## 19. Toast

| Spec | Valor |
|------|--------|
| z-index | 90 |
| Mobile posição | `bottom: 68px + safe-area`, centrado |
| Desktop posição | `bottom: 100px` |
| Entrada | `gd-up` 240ms |
| Duração | **2600ms** auto-dismiss |
| Max width | ~420px |

---

## 20. EmojiPicker

- Painel com categorias + grid scrollable
- Tabs/categorias com scroll horizontal
- Usado em: comments, story reply
- Abrir pausa story timer

---

## 21. Estados globais de UI

| Estado | Comportamento esperado |
|--------|------------------------|
| Loading (upload/publish) | Botão busy / overlay capture busy |
| Empty busca | Mensagem + sem resultados |
| Empty grupos filtrados | “Nenhum grupo encontrado.” |
| Unread | Dot no sino; badge nas mensagens; tint nas notifs |
| Active nav | Brand fill |
| Pressed button | Scale ~0.97 (120ms) |
| Hover (desktop) | Fundo hover sutil (180ms) |
| `prefers-reduced-motion` | Animações ≈ 0 |

---

## 22. Mapa de fluxos (resumo)

### Consumir

```text
Home → Story Viewer
Home → Post → Comments / Reactions / Share / Menu
Home → Community card → Group → Members
Home → Person → Follow / Chat / Post
```

### Criar

```text
Header+/Nav Criar → Picker → Post | Story → (Media) → Publish → Home
```

### Conta

```text
Avatar → Profile | Edit | Settings | Logout
Sino → Notifications
```

### Busca / Grupos / Mensagens

```text
Nav → Search | Groups | Messages → Chat
```

---

## 23. Checklist Figma Make (anti-erros)

- [ ] Frame do app = **100% da largura do device** (não card central estreito)
- [ ] Desktop: 3 colunas dentro da janela full-width
- [ ] Stories: scroll horizontal + snap + drag desktop
- [ ] Rail: scroll interno + **fade top/bottom dinâmico**
- [ ] Chips: fade left/right dinâmico
- [ ] Bottom nav: float + safe-area + padding do conteúdo
- [ ] Sheets: bottom no mobile / center no desktop
- [ ] Views: fullscreen overlay + back stack
- [ ] Story: 5s auto-advance, tap 30/70, pause no reply
- [ ] Double-tap na foto do post = like
- [ ] Criar na nav abre picker (não “página Criar”)
- [ ] Body scroll lock com overlays
- [ ] Z-index na ordem documentada
- [ ] Scrollbars ocultos nas rows horizontais

---

## 24. Timings — cheat sheet

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
Drag threshold .............. 8px
Sticky top .................. 80px
Breakpoint .................. 800px
```

---

## 25. Princípio para o Figma Make

> **Comporte-se como um app full-bleed de rede social.**  
> A página é o device. Sidebars e fades existem para hierarquia e scroll — não para encolher o produto no centro da tela.

Quando em dúvida:

1. Ocupa a largura toda?
2. O scroll certo está no container certo?
3. A máscara só aparece quando há overflow?
4. O gesto abre o fluxo documentado (sheet vs view vs overlay)?

Se as quatro respostas forem sim, o comportamento está alinhado ao Gooday.
