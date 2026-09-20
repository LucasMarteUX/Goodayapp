# Gooday — Catálogo completo de telas

Documento para o **Figma Make** replicar **exatamente** o app Gooday de hoje (`/`).

Escopo: **somente Gooday** (vida saudável).  
Foco: **estrutura da tela + funcionalidade + comportamento**.

---

## Como usar este documento

Cada tela tem:

1. **O que é**
2. **Como abrir**
3. **Layout / anatomia**
4. **Elementos e ações**
5. **Estados**
6. **Regras de comportamento**

### Tipos de superfície no app

| Tipo | Como aparece | Exemplos |
|------|----------------|----------|
| **Home** | Página base, scroll da window | Feed |
| **View** | Overlay fullscreen `z-60`, header Voltar, stack | Buscar, Perfil, Chat… |
| **Sheet** | Bottom sheet (mobile) / modal (desktop) `z-70` | Criar, Comentários… |
| **Overlay especial** | Camada própria | Story Viewer, Media Capture, Toast, Avatar Menu |

### Regra de largura (obrigatória)

O app ocupa **100% da largura do device** (até 1920px).  
Não é um card estreito no meio da tela.

- Mobile `< 800px`
- Desktop `≥ 800px` → grid 3 colunas (nav \| feed \| rail)

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

---

## A8. Desktop Nav

Sticky esquerda · itens:

**Início · Buscar · Mensagens · Criar · Grupos · Perfil**  
+ **Configurações**

Criar → sheet. Demais → views. Ativo = fundo brand.

---

## A9. Right Rail (desktop)

Sticky · altura = 1ª dobra · scroll interno · **fade top/bottom** dinâmicos

### Tabs
**Grupos | Pessoas**

### Grupos
- Busca (toggle lupa)
- Filtros chips (toggle filtro): Todos · Participando · Sugeridos · Corrida · Ciclismo · Nutrição · Yoga · Treino  
  → chips com **fade left/right**
- Grid de cards → Grupo
- Ver tudo → view **Meus grupos**

### Pessoas
- Lista + Seguir
- Ver tudo → view **Seguidores**

Wheel sobre a rail scrolla a lista interna primeiro.

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
- Modal largo split:
  - Esquerda 44%: imagem cover (ou texto se sem img)
  - Direita 56%: autor, texto, like/share/salvar, thread scroll, composer

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

# H. CHECKLIST Figma Make — fidelidade

## Layout
- [ ] App full-bleed 100% largura do device
- [ ] Breakpoint 800px mobile/desktop
- [ ] Desktop 3 colunas reais
- [ ] Bottom nav float + safe-area
- [ ] Headers sticky

## Home
- [ ] Stories scroll X + snap + rings visto/não visto
- [ ] Carousel comunidades só mobile
- [ ] Feed posts com todas as ações
- [ ] Double-tap like na imagem
- [ ] Rail desktop com fades dinâmicos

## Overlays
- [ ] Views fullscreen + Voltar + stack
- [ ] Sheets bottom mobile / center desktop
- [ ] Story 5s + tap zones 30/70
- [ ] Comments desktop split 44/56
- [ ] Create picker → post/story
- [ ] Media capture 3 steps
- [ ] Toast 2.6s

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
