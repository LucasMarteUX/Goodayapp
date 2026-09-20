// Centralized imagery (Unsplash, non-expiring) + Gooday mock data.
// Community names & microcopy sourced from the product briefing.

const u = (id: string, w = 900, h?: number) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=${w}${
    h ? `&h=${h}` : ''
  }`

export const avatar = (id: string) => u(id, 160, 160)

/** Portrait pool for avatars. */
export const faces = {
  bruna: avatar('1494790108377-be9c29b29330'),
  marcos: avatar('1500648767791-00dcc994a43e'),
  jake: avatar('1580489944761-15a19d654956'),
  joseph: avatar('1507003211169-0a1dd7228f2d'),
  troy: avatar('1701096351544-7de3c7fa0272'),
  zoran: avatar('1651684215020-f7a5b6610f23'),
  jorik: avatar('1604072366595-e75dc92d6bdc'),
  studio: avatar('1589729132389-8f0e0b55b91e'),
}

export const photo = {
  saladBowl: u('1512621776951-a57141f2eefd'),
  saladClose: u('1540420773420-3366772f4999'),
  blueBowl: u('1623428187969-5da2dcea5ebf'),
  trailRun: u('1530143311094-34d807799e8f'),
  running: u('1498581444814-7e44d2fbe0e2'),
  runningEdge: u('1504025468847-0e438279542c'),
  hiking: u('1533240332313-0db49b459ad6'),
  cycling: u('1606224547099-b15c94ca5ef2'),
  cycling2: u('1615845522846-02f89af04c2e'),
  smoothie: u('1610970881699-44a5587cabec', 1080),
  shakes: u('1522924280870-56438a558308'),
  yoga: u('1544367567-0f2fcb009e0b'),
  cafeWoman: u('1533777857889-4be7c70b33f7', 1200, 1400),
  fruitsWoman: u('1511226616573-0937ad7da1d8', 1200, 1400),
  // Unsplash extras for story carousel
  wellnessWoman: 'https://images.unsplash.com/photo-1518708909080-704599b19972?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  stretchWoman: 'https://images.unsplash.com/photo-1567013514336-6de53c9e7e63?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  runnerWoman: 'https://images.unsplash.com/photo-1480179087180-d9f0ec044897?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  mealPrep: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  yogaMeditation: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  mountainSit: 'https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  sprintTrack: 'https://images.unsplash.com/photo-1744060204728-f68e434a3edf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  pinkTank: 'https://images.unsplash.com/photo-1759476530066-94bee6a30c40?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
  orangeSlice: 'https://images.unsplash.com/photo-1606858374191-c18040e98ad7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=700',
}

export const currentUser = {
  name: 'Marcos Vinícius',
  handle: '@marcos_v',
  avatar: faces.marcos,
}

export type Story = { name: string; avatar: string; cover: string; seen?: boolean }
export const stories: Story[] = [
  { name: 'Você', avatar: currentUser.avatar, cover: photo.saladBowl, seen: false },
  { name: 'bruna_carla', avatar: faces.bruna, cover: photo.wellnessWoman, seen: true },
  { name: 'lu_trails', avatar: faces.studio, cover: photo.mountainSit, seen: true },
  { name: 'pedro.run', avatar: faces.joseph, cover: photo.sprintTrack, seen: false },
  { name: 'ana_move', avatar: faces.troy, cover: photo.pinkTank, seen: false },
  { name: 'ciclo_urb', avatar: faces.zoran, cover: photo.cycling, seen: true },
  { name: 'joana.k', avatar: faces.jorik, cover: photo.runnerWoman, seen: false },
  { name: 'rafa_fit', avatar: faces.jake, cover: photo.stretchWoman, seen: true },
  { name: 'mind_zen', avatar: faces.bruna, cover: photo.yogaMeditation, seen: false },
  { name: 'verdevida', avatar: faces.studio, cover: photo.mealPrep, seen: false },
  { name: 'carol.fit', avatar: faces.troy, cover: photo.orangeSlice, seen: true },
  { name: 'bike_sp', avatar: faces.zoran, cover: photo.cycling2, seen: false },
  { name: 'hiking_br', avatar: faces.jake, cover: photo.hiking, seen: true },
  { name: 'natfit', avatar: faces.joseph, cover: photo.trailRun, seen: false },
]

export type Group = {
  id: string
  name: string
  cover: string
  groups: number
  members: string
  members_avatars: string[]
}
export const groups: Group[] = [
  {
    id: 'corrida',
    name: 'Corrida para Iniciantes',
    cover: photo.running,
    groups: 18,
    members: '512 membros',
    members_avatars: [faces.joseph, faces.troy, faces.jake],
  },
  {
    id: 'ciclismo',
    name: 'Ciclismo Urbano',
    cover: photo.cycling,
    groups: 43,
    members: '975 membros',
    members_avatars: [faces.zoran, faces.jorik, faces.marcos],
  },
  {
    id: 'nutricao',
    name: 'Nutrição Consciente',
    cover: photo.saladBowl,
    groups: 15,
    members: '396 membros',
    members_avatars: [faces.bruna, faces.studio, faces.troy],
  },
  {
    id: 'vida',
    name: 'Vida Natural',
    cover: photo.saladClose,
    groups: 11,
    members: '304 membros',
    members_avatars: [faces.jorik, faces.jake, faces.bruna],
  },
  {
    id: 'yoga',
    name: 'Yoga & Respiração',
    cover: photo.yoga,
    groups: 9,
    members: '221 membros',
    members_avatars: [faces.bruna, faces.troy],
  },
  {
    id: 'pedal',
    name: 'Pedal de Fim de Semana',
    cover: photo.cycling2,
    groups: 27,
    members: '640 membros',
    members_avatars: [faces.zoran, faces.joseph, faces.marcos],
  },
]

export type Contact = {
  id: string
  name: string
  handle: string
  avatar: string
  online?: boolean
  interests?: number
}

export const contacts: Contact[] = [
  { id: 'renata', name: 'Renata Silva', handle: '@renata_silva', avatar: '/assets/0b179.png', online: true, interests: 3 },
  { id: 'tiago', name: 'Tiago Souza', handle: '@tiago_souza', avatar: '/assets/4b35d.png', online: false, interests: 3 },
  { id: 'nicole', name: 'Nicole Bueno', handle: '@nicole_bueno', avatar: '/assets/7c77a.png', online: false, interests: 3 },
  { id: 'bruno', name: 'Bruno Mendes', handle: '@bruno_mendes', avatar: '/assets/2f96e.png', online: false, interests: 3 },
  { id: 'julia', name: 'Júlia Andrade', handle: '@julia_andrade', avatar: '/assets/a35b8.png', online: true, interests: 3 },
  { id: 'lidiane', name: 'Lidiane Costa', handle: '@lidiane_costa', avatar: '/assets/988ee.png', online: false, interests: 3 },
  { id: 'camila', name: 'Camila Ferreira', handle: '@camila_ferreira', avatar: avatar('1526080652727-5b77f74eacd2'), online: false, interests: 3 },
  { id: 'marina', name: 'Marina Rocha', handle: '@marina_rocha', avatar: avatar('1701096351544-7de3c7fa0272'), online: true, interests: 3 },
]

export type Conversation = {
  contactId: string
  lastMessage: string
  time: string
  unread?: number
  fromMe: boolean
}

export const conversations: Conversation[] = [
  { contactId: 'renata', lastMessage: 'Combinado então 💪', time: '08:16', unread: 2, fromMe: false },
  { contactId: 'tiago', lastMessage: 'Monstro! Bora domingo?', time: '07:02', fromMe: true },
  { contactId: 'nicole', lastMessage: 'Recebi, obrigada 🌱', time: 'ter', unread: 1, fromMe: true },
  { contactId: 'bruno', lastMessage: '7h no ponto de sempre', time: 'seg', fromMe: false },
  { contactId: 'julia', lastMessage: 'Vamos treinar junto essa semana?', time: '09:31', unread: 3, fromMe: false },
  { contactId: 'lidiane', lastMessage: 'Vou estar lá', time: 'dom', fromMe: true },
  { contactId: 'camila', lastMessage: 'Adorei seu post do suco', time: 'sex', fromMe: false },
  { contactId: 'marina', lastMessage: 'Bora! 17h?', time: '11:12', fromMe: false },
]

export type ChatMessage = { id: string; text: string; time: string; fromMe: boolean }

export const chatHistory: Record<string, ChatMessage[]> = {
  renata: [
    { id: '1', text: 'Bom dia! Vai correr hoje?', time: '08:12', fromMe: false },
    { id: '2', text: 'Vou sim, saio às 18h', time: '08:15', fromMe: true },
    { id: '3', text: 'Combinado então 💪', time: '08:16', fromMe: false },
  ],
  tiago: [
    { id: '1', text: 'Consegui bater o recorde hoje 🏃', time: '06:55', fromMe: false },
    { id: '2', text: 'Monstro! Bora domingo?', time: '07:02', fromMe: true },
  ],
  julia: [
    { id: '1', text: 'Oi! Tudo bem?', time: '09:28', fromMe: false },
    { id: '2', text: 'Tudo ótimo! 😊', time: '09:29', fromMe: true },
    { id: '3', text: 'Vamos treinar junto essa semana?', time: '09:31', fromMe: false },
  ],
  nicole: [
    { id: '1', text: 'Mandei o plano alimentar', time: 'ter 08:10', fromMe: false },
    { id: '2', text: 'Recebi, obrigada 🌱', time: 'ter 08:14', fromMe: true },
  ],
  lidiane: [
    { id: '1', text: 'A gente se encontra às 7h amanhã?', time: 'dom', fromMe: false },
    { id: '2', text: 'Vou estar lá', time: 'dom', fromMe: true },
  ],
}

export type Post = {
  author: string
  avatar: string
  time: string
  text: string
  mention?: string
  tags: string[]
  image: string
  reactions: { emoji: string; count: number }[]
  likes: number
  comments: number
}
export const posts: Post[] = [
  {
    author: '@bruna_carla',
    avatar: faces.bruna,
    time: '5 min',
    text: 'Hoje foi o dia daquela bebida natural',
    mention: '@naturalfit',
    tags: ['#natural', '#suconatural'],
    image: photo.smoothie,
    reactions: [
      { emoji: '💪', count: 6 },
      { emoji: '🌱', count: 4 },
    ],
    likes: 128,
    comments: 25,
  },
  {
    author: '@pedro.run',
    avatar: faces.joseph,
    time: '32 min',
    text: 'Fechei os 10K de manhã cedo. Respeite sua mente e trate seu corpo bem!',
    tags: ['#corrida', '#10k'],
    image: photo.trailRun,
    reactions: [
      { emoji: '🔥', count: 12 },
      { emoji: '🏃', count: 8 },
    ],
    likes: 342,
    comments: 41,
  },
]
