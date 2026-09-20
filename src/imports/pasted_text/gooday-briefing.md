ADICIONE AS IMAGENS + DESIGN.MD + BRIEFING  e use o prompt abaixo no chat da iA.


Eu preciso que você crie a interface responsiva do meu aplicativo Buddy, seguindo exatamente como está no design.md anexo, e principalmente que você use como referência principal as imagens em anexo da minha rede social.
Nós temos o login, só para exemplificar. Tem muitas informações no design.md, mas a imagem do login está do lado esquerdo, com corner radius. As informações estão do lado direito, com corner radius ali também, e as informações de login estão ali também.
A tela de cadastro segue o mesmo design. Nós vamos agora priorizar principalmente a tela de login e a tela de cadastro, e depois a tela da home, que é a home principal.
Eu quero detalhar para você alguns comportamentos importantes da minha interface.
A gente tem uma rede social, e ali, nos nossos destacs, tem toda a navegação dos stores. Você não precisa desenvolver agora. Focem apenas na home. Vai ter toda a navegação dos stores. Nós vamos ter os grupos também. Você pode construir os cards dos grupos, e nós vamos ter a timeline. Todo o nosso sistema vai carregar todas essas informações.
Eu vou anexar também o nosso documento principal aqui, que vai te guiar durante todo esse desenvolvimento.
Estou colocando o briefing aqui embaixo e toda a informação que você vir. No briefing, gera dúvidas quanto ao design. O design.md é a regra, é o documento oficial. Siga o design.md e as referências visuais.
Gooday — Briefing do Projeto
Visão Geral
Gooday é uma rede social mobile-first de vida saudável e hábitos — corrida, nutrição, treino, yoga, ciclismo e rotina — onde pessoas se conectam por comunidades e compartilham o dia a dia sem filtro de “perfil fitness perfeito”.
O produto precisa parecer rede social de verdade (feed, stories, grupos, mensagens, perfil), com identidade clara de bem-estar: fotografia realista, tipografia limpa, brand lima e tom humano.
• App social — home com stories, feed, comunidades, DMs, busca e perfil.
• Comunidades por interesse — corrida, nutrição, treino, yoga, ciclismo, hábitos.
• Criação de conteúdo — posts e stories com mídia (câmera/galeria).
• Conta do usuário — perfil, edição, configurações e logout.
Assinatura:
Respeite sua mente e trate seu corpo bem.
Princípio:
Não construa um app de treino. Construa uma rede social de pessoas tentando viver um dia melhor — juntas.
──────────────────────────────────────────────────────────────
Posicionamento
O que o Gooday é
• Rede social de bem-estar e hábitos
• Espaço para rotina, conquistas pequenas, receitas, treinos e encontros
• Comunidades para quem corre, pedala, come melhor, treina ou pratica yoga
• Produto mobile-first com experiência desktop completa
O que o Gooday não é
• App de academia com fichas técnicas e planos pagos (não é o foco)
• Contador de calorias / wearable tracker como produto principal
• Marketplace de suplementos
• Rede genérica sem tema (o conteúdo e as comunidades são wellness)
──────────────────────────────────────────────────────────────
Público
• Pessoas que querem melhorar rotina sem radicalismo
• Iniciantes em corrida, nutrição ou treino
• Quem já treina e busca comunidade / motivação social
• Tutores de hábitos (hidratação, meal prep, sono, movimento)
──────────────────────────────────────────────────────────────
Identidade Visual
Direção
Light · limpo · energético · humano · social · fotográfico
• Brand lima como sinal de vida e energia
• Superfícies claras, cards brancos, tipografia sóbria
• Fotografia de pessoas reais em movimento, comida de verdade, treinos e rotina
• Sensação de app social contemporâneo — não de brochure de clínica
Tokens (base)
background #ECEDF5
card / surface #FFFFFF / #F7F8FC
elevated #E8EAF2
border #D5D8E4
text primary #12161C
text secondary #2A313C
text muted #5C6675
brand (lima) #E7FE8E
brand soft #6F8A12
on-brand #12161C
success #1FA868
danger #E04552
Radii
card 22px
media 16px
control 12px
story 20px
Story ring
Gradiente lima (#E7FE8E → #C8E85A → #9FC41A).
Tipografia
• UI sans moderna (Inter no app atual)
• Hierarquia clara: nome/handle, body 14–16px, labels 11–13px
• Evitar tipografia “spa / wellness clichê” ou serif excessiva
Fotografia
Proporção ideal:
pessoas + movimento + comida + rotina
Exemplos: corrida ao amanhecer, meal prep, pedal, yoga, sucos, treino em grupo, hábitos do dia a dia.
──────────────────────────────────────────────────────────────
Arquitetura de navegação
Mobile (bottom nav)
Início · Buscar · Criar · Mensagens · Perfil
No protótipo atual o tab “Salvos” no mobile abre Mensagens — no produto final, alinhar labels e destinos (Mensagens vs Salvos dedicados).
Desktop
Início · Buscar · Mensagens · Criar · Grupos · Perfil · Configurações
• Header com logo, busca e notificações
• Painel direito: Grupos | Pessoas
Header
• Mobile: logo Gooday, criar, notificações, avatar
• Desktop: logo, busca (“O que deseja fazer de bom hoje?”), frase de contexto, notificações, avatar
──────────────────────────────────────────────────────────────
Componentes do Sistema (todas as telas)
1. Home / Feed
Objetivo
Abrir o app e imediatamente sentir rede social de vida saudável.
Características
• Stories no topo
• Carrossel de comunidades recomendadas (mobile)
• Feed de publicações (foto + texto + tags + grupo)
• Ações sociais: curtir, comentar, reagir, compartilhar, salvar, menu
• Double-tap na imagem para curtir
• Preview de comentários no card
• Empty / loading states do feed
• Toast de feedback para ações
Tipos de publicação no feed (conteúdo esperado):
• Experiência / rotina (corrida 5h30, meal prep)
• Conquista (60 km, dia 21 de hidratação)
• Receita / alimento
• Treino
• Pergunta à comunidade
• Convite a hábito / desafio social (copy, não necessariamente produto de tracking)
──────────────────────────────────────────────────────────────
2. Stories
Objetivo
Camada efêmera e visual da rotina.
Características
• Fila horizontal com “meu story” + stories de pessoas
• Ring de não visto (gradiente lima)
• Viewer fullscreen com barras de progresso, prev/next, pause
• Reply no story + emoji picker
• Reações rápidas (❤️ 👏 🔥 😍)
• Criação de story 9:16 com foto obrigatória e legenda opcional
──────────────────────────────────────────────────────────────
3. Criar (Create)
Objetivo
Publicar post ou story com o mínimo de fricção.
Fluxo
1. Abrir picker → Publicação ou Story
2. Capturar/selecionar mídia (câmera ou galeria) → review
3. Composer:
• Legenda (hashtags viram tags)
• Marcar pessoas (mock / futuro real)
• Local
• Audiência (Todos / Seguidores / Amigos próximos)
• Grupo associado (ciclo nas comunidades)
4. Publicar → aparece no feed / stories + toast
Mídia
• Processamento e validação no client
• Upload remoto opcional (ex.: Storage) quando ambiente autenticado existir
• Fallback: preview local
──────────────────────────────────────────────────────────────
4. Post (detalhe)
Objetivo
Abrir a publicação em tela própria sem perder contexto social.
Características
• Conteúdo completo do post
• Curtir / comentar
• Voltar para o feed (stack de navegação)
──────────────────────────────────────────────────────────────
5. Comentários (sheet)
Objetivo
Conversar em torno de um post.
Características
• Thread de comentários
• Composer com @mentions e emoji
• Enviar (Enter / botão)
• No desktop: layout split (mídia + comentários) quando aplicável
──────────────────────────────────────────────────────────────
6. Reações (sheet)
Objetivo
Reagir além do like.
Características
• Grid de emojis (ex.: ❤️ 👏 💪 🔥 🌱 😊 😍 🙌 ✨ 💯)
• Contadores no post
──────────────────────────────────────────────────────────────
7. Compartilhar (sheet)
Objetivo
Distribuir o post.
Características
• Enviar para pessoas (DM)
• Copiar link
• Compartilhar em grupo
• Compartilhar fora do app
• Feedback via toast (no protótipo)
──────────────────────────────────────────────────────────────
8. Menu do post (sheet)
Objetivo
Controles de conteúdo e moderação leve.
Características
• Salvar
• Não tenho interesse
• Deixar de seguir
• Copiar link
• Denunciar
──────────────────────────────────────────────────────────────
9. Buscar
Objetivo
Encontrar pessoas e grupos.
Características
• Campo de busca
• Chips / recentes (corrida, nutrição, yoga…)
• Seções: Pessoas · Grupos
• Resultados filtráveis
• Estado vazio
Evolução necessária
• busca por hashtags, interesses e conteúdo de posts; unificar sheet stub vs tela real.
──────────────────────────────────────────────────────────────
10. Grupos / Comunidades
Objetivo
Organizar o pertencimento por hábito.
Categorias
Corrida · Ciclismo · Nutrição · Yoga · Treino · Hábitos
Filtros
Todos · Participando · Sugeridos · Corrida · Ciclismo · Nutrição · Yoga · Treino
Tela de listagem
• Busca
• Filtros
• Grid/lista de cards (capa, nome, membros, avatares, público/privado)
• Participar / solicitar (privados)
Tela do grupo
• Cover, nome, descrição
• Público / privado
• Contagem de membros
• CTA Participar
• Feed filtrado do grupo
• Atalho para membros
Membros
• Lista com roles (Criador, Admin, Moderadora, Membro)
Comunidades de referência (já projetadas)
• Corrida para Iniciantes
• Corrida 5K
• Ciclismo Urbano
• Pedal de Fim de Semana
• Nutrição Consciente
• Alimentação Saudável
• Sucos Naturais
• Treino Funcional
• Yoga
• Vida Natural
• Hábitos que Transformam
Evolução necessária
• Criar / editar comunidade
• Regras, convites, aprovação de entrada
• Chat/anúncios do grupo
• Eventos do grupo
──────────────────────────────────────────────────────────────
11. Pessoas
Objetivo
Descobrir e seguir quem vive o mesmo ritmo.
Características
• Sugestões no painel direito (desktop) e em busca
• Card / lista com avatar, nome, handle, CTA seguir
• Abrir perfil de outra pessoa
──────────────────────────────────────────────────────────────
12. Perfil (meu / outro)
Objetivo
Identidade wellness da pessoa.
Características
• Cover + avatar
• Nome, @handle, bio, localização
• Stats: seguidores / seguindo
• Interesses (chips)
• CTAs: Seguir / Mensagem (perfil de outro) · Editar / Meus grupos (meu perfil)
• Tabs: Publicações · Salvos · Grupos · Sobre
• Grid de posts
• Lista de seguidores / seguindo
Usuário de referência (mock):
Marcos Vinícius · @marcos_v
São Paulo, SP
Corrida, comida de verdade e rotina leve.
──────────────────────────────────────────────────────────────
13. Editar perfil
Objetivo
Atualizar identidade básica.
Campos
• Foto (alterar)
• Nome
• Usuário (@)
• Bio
• Localização
• Salvar
──────────────────────────────────────────────────────────────
14. Mensagens
Objetivo
Conversa 1:1.
Lista
• Avatar, nome, preview, unread, online
Chat
• Thread
• Composer
• Enviar
• Voltar para lista
Evolução necessária
• chat de grupo, mídia no chat, push, realtime.
──────────────────────────────────────────────────────────────
15. Notificações
Objetivo
Manter o usuário no loop social.
Características
• Sheet / painel de notificações
• Agrupamento Hoje / Esta semana
• Tipos: curtida, comentário, follow, menção, convite a grupo
• Marcar como lidas
• CTA contextual (seguir de volta, ver post, aceitar)
──────────────────────────────────────────────────────────────
16. Configurações
Objetivo
Conta e segurança básica.
Características
• Card da conta
• Alterar e-mail
• Alterar senha (atual / nova / confirmar)
• Sair (confirmação)
• Ajuda / suporte (tela dedicada no produto final)
──────────────────────────────────────────────────────────────
17. Menu da conta (avatar)
Objetivo
Atalhos da conta.
Características
• Ver perfil
• Editar perfil
• Configurações
• Ajuda
• Sair
──────────────────────────────────────────────────────────────
18. Captura de mídia (overlay)
Objetivo
Fonte única de foto para post/story/perfil.
Fluxo
Escolher origem → Câmera ou Galeria → Review → Confirmar
──────────────────────────────────────────────────────────────
19. Feedback global
• Toast — sucesso / erro / confirmações
• Loading states — feed, upload, envio de comentário
• Empty states — busca sem resultado, salvos vazios, mensagens vazias
• Hover / pressed — desktop e mobile
──────────────────────────────────────────────────────────────
Modelo de conteúdo
Pilares temáticos
Corrida
Ciclismo
Nutrição
Treino
Yoga
Hábitos
Anatomia de um post
Autor (avatar, nome, handle)
Tempo relativo
Grupo (opcional)
Texto
Tags / hashtags
Mídia (opcional)
Reações + likes
Comentários
Salvo / não salvo
Anatomia de uma comunidade
Nome
Capa
Descrição
Categoria
Público / privado
Membros + avatares
Feed associado
Roles de membros
──────────────────────────────────────────────────────────────
Microcopy (referência)
• Busca: O que deseja fazer de bom hoje?
• Contexto header: Respeite sua mente e trate seu corpo bem.
• Criar: Nova publicação / Novo story
• Grupos: Participando · Sugeridos
• Logout: Deseja sair?
• Empty busca: Nenhum resultado
Tom: próximo, motivador sem coach agressivo, PT-BR.
──────────────────────────────────────────────────────────────
Fluxos principais (end-to-end)
A. Abrir o app → consumir feed
Home → stories → scroll feed → abrir post / comentar / curtir
B. Publicar rotina
Criar → Publicação → mídia → legenda + grupo → publicar → aparece no feed
C. Entrar em comunidade
Home / Grupos → card → Participar → feed do grupo
D. Seguir pessoa
Buscar ou rail Pessoas → perfil → Seguir → (opcional) Mensagem
E. Conversar
Mensagens → conversa → enviar
F. Conta
Avatar → Configurações → e-mail/senha → Sair
──────────────────────────────────────────────────────────────
Telas a contemplar no produto completo
Checklist de superfície — já projetadas no protótipo e necessárias para fechar o produto.
• [ ] Home / Feed
• [ ] Stories + Story Viewer
• [ ] Criar (picker, post, story) + captura de mídia
• [ ] Detalhe do post
• [ ] Comentários / Reações / Share / Menu do post
• [ ] Buscar (pessoas e grupos)
• [ ] Listagem de grupos + filtros
• [ ] Página do grupo + membros
• [ ] Pessoas / seguir
• [ ] Perfil (meu e de outro) + follows
• [ ] Editar perfil
• [ ] Mensagens + chat 1:1
• [ ] Notificações
• [ ] Configurações (e-mail, senha, logout)
• [ ] Menu da conta / confirmação de saída
• [ ] Toast / estados de interação
Necessárias para fechar o produto
• [ ] Onboarding / Auth — cadastro, login, recuperação de senha, escolha de interesses, sugestão de grupos
• [ ] Salvos dedicados — tela/coleções coerente com a tab (posts, receitas, treinos)
• [ ] Criar e gerenciar comunidade — regras, privacidade, convites, moderação
• [ ] Eventos & encontros — corrida, pedal, yoga (data, local, RSVP)
• [ ] Desafios / hábitos em grupo — hidratação, 7 dias, streaks sociais (leve, sem virar tracker pesado)
• [ ] Tipos de post ricos — receita, treino, check-in de hábito (além de foto+texto)
• [ ] Ajuda / FAQ / Privacidade / Termos
• [ ] Bloquear / denunciar com fluxo completo
• [ ] Preferências de notificação (+ push)
• [ ] Chat de grupo / avisos da comunidade
• [ ] Perfil enriquecido — conquistas, grupos em destaque, “Sobre” estruturado
• [ ] Busca avançada — hashtags, posts, interesses
──────────────────────────────────────────────────────────────
Requisitos Resumidos
Funcionais
• [ ] Home social responsiva (mobile + desktop)
• [ ] Stories (ver e criar)
• [ ] Feed com like, comment, react, share, save, menu
• [ ] Create post/story com mídia
• [ ] Comunidades com filtros, join, página e membros
• [ ] Busca de pessoas e grupos
• [ ] Perfil, edição, followers/following
• [ ] Mensagens 1:1
• [ ] Notificações
• [ ] Configurações de conta + logout
• [ ] Auth / onboarding
• [ ] Salvos dedicados
• [ ] Eventos e (opcional) desafios leves
• [ ] Moderação e denúncia com fluxo real
Técnicos
• [ ] React 19 + TypeScript
• [ ] Next.js (App Router) ou equivalente
• [ ] Tailwind CSS v4
• [ ] Design System com tokens semânticos (--gd-*)
• [ ] Mobile-first + breakpoint desktop (~800px)
• [ ] Estado de navegação por views/sheets (stack + back)
• [ ] Performance (imagens, lazy load, code splitting)
• [ ] Acessibilidade (WCAG AA: contraste, foco, labels)
• [ ] Persistência real (auth, feed, mídia) na evolução do protótipo
UI/UX
• [ ] Interface light com brand lima
• [ ] Fotografia como protagonista do feed/stories
• [ ] Feedback visual em todas as ações
• [ ] Loading / empty / error states
• [ ] Validação em formulários (perfil, auth, create)
• [ ] Animações sutis (like, story progress, sheets)
• [ ] Contraste adequado do lima sobre texto escuro (on-brand)
Performance
• [ ] Carregamento inicial < 3s em conexão média
• [ ] Otimização de imagens do feed/stories
• [ ] Lazy loading de mídia offscreen
• [ ] Sheets e overlays sob demanda
──────────────────────────────────────────────────────────────
Stack Tecnológica (referência do protótipo atual)
Frontend: Next.js 16 · React 19 · TypeScript
Styling: Tailwind CSS v4 + tokens CSS
Estado: React Hooks + ViewModel da home
Mídia: captura browser + processamento client; Storage opcional
Dados (hoje): mocks tipados em TypeScript
Lint / Build: ESLint · next build
O briefing de produto é independente do backend final. O protótipo atual valida a experiência; a evolução exige auth, API e persistência.
──────────────────────────────────────────────────────────────
Mapa de telas (resumo visual)
HOME
├─ Stories → Story Viewer
├─ Comunidades (carousel / rail)
├─ Feed → Post → Comentários / Reações / Share / Menu
│
├─ CRIAR → Picker → Post | Story → Captura de mídia
│
├─ BUSCAR → Pessoas | Grupos
│
├─ GRUPOS → Lista → Grupo → Membros
│ → (futuro) Criar grupo · Eventos · Chat do grupo
│
├─ MENSAGENS → Lista → Chat
│
├─ NOTIFICAÇÕES
│
└─ PERFIL → Tabs (Posts · Salvos · Grupos · Sobre)
→ Editar perfil
→ Seguidores / Seguindo
→ Configurações → E-mail · Senha · Sair
→ (futuro) Onboarding / Auth / Ajuda
──────────────────────────────────────────────────────────────
Critérios de sucesso
Alguém abre o Gooday e pensa:
Aqui eu encontro pessoas que estão no mesmo ritmo que eu — correr, comer melhor, treinar, manter o hábito.
A Home deve parecer rede social imediatamente.
As comunidades devem organizar o pertencimento.
Criar e interagir deve ser simples.
O visual lima + foto real deve ser inconfundível.
──────────────────────────────────────────────────────────────
Princípio final
Não construa um dashboard de saúde. Construa uma rede social onde viver bem vira conversa, comunidade e constância.

