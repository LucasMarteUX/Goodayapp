import { useState, useRef, useCallback, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Avatar, AvatarStack, Chip, IconButton } from './ui'
import {
  BellIcon,
  BookmarkIcon,
  CommentIcon,
  GroupsIcon,
  HeartIcon,
  HomeIcon,
  InfinityMark,
  Logo,
  MessageIcon,
  MoreIcon,
  PlusIcon,
  PlusCircleIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  SmileIcon,
  ConnectIcon,
  FilterIcon,
} from './icons'
import { contacts } from '../lib/media'
import type { Group, Post, Story } from '../lib/media'

/* ------------------------------- Stories carousel ----------------------
   Horizontally scrollable row. Seen stories appear desaturated with a
   faded overlay. Clicking marks a story as seen and opens a lightbox
   overlay that advances automatically. Arrow buttons and keyboard nav
   let the user step through the sequence.  */

function StoryViewer({
  stories,
  startIndex,
  seenSet,
  onSee,
  onClose,
}: {
  stories: Story[]
  startIndex: number
  seenSet: Set<number>
  onSee: (i: number) => void
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = current + dir
      if (next >= 0 && next < stories.length) {
        setCurrent(next)
        onSee(next)
      } else if (next >= stories.length) {
        onClose()
      }
    },
    [current, stories.length, onSee, onClose],
  )

  const s = stories[current]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90svh] max-h-[700px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* progress bar row */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
          {stories.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: seenSet.has(i) || i < current ? '100%' : i === current ? '50%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* cover */}
        <img src={s.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* header */}
        <div className="relative z-10 mt-8 flex items-center gap-2.5 px-4 py-2">
          <Avatar src={s.avatar} size={36} ring="accent" />
          <div>
            <p className="text-[13px] font-semibold text-white">{s.name}</p>
            <p className="text-[11px] text-white/70">agora</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full text-white/80 hover:text-white"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* tap zones */}
        <div className="absolute inset-0 flex">
          <button className="flex-1" onClick={() => go(-1)} aria-label="Anterior" />
          <button className="flex-1" onClick={() => go(1)} aria-label="Próximo" />
        </div>

        {/* bottom name */}
        <div className="relative z-10 mt-auto px-4 pb-6">
          <p className="text-[15px] font-semibold text-white">{s.name}</p>
        </div>
      </div>
    </div>
  )
}

export function StoriesRow({ stories }: { stories: Story[] }) {
  const [seenSet, setSeenSet] = useState<Set<number>>(
    () => new Set(stories.map((s, i) => (s.seen ? i : -1)).filter((i) => i >= 0)),
  )
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollX: 0, moved: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      drag.current = { active: true, startX: e.clientX, scrollX: el.scrollLeft, moved: false }
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'
    }
    const onMove = (e: MouseEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.startX
      if (Math.abs(dx) > 8) drag.current.moved = true
      el.scrollLeft = drag.current.scrollX - dx
    }
    const onUp = () => {
      drag.current.active = false
      el.style.cursor = ''
      el.style.userSelect = ''
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const markSeen = useCallback((i: number) => {
    setSeenSet((prev) => {
      if (prev.has(i)) return prev
      const next = new Set(prev)
      next.add(i)
      return next
    })
  }, [])

  const openStory = (i: number) => {
    if (drag.current.moved) return
    markSeen(i)
    setViewerIndex(i)
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto pb-1 [scroll-snap-type:x_mandatory] [WebkitOverflowScrolling:touch] cursor-grab select-none"
      >
        {/* Left spacer: provides initial gap from edge; scrolls away naturally when dragging */}
        <div className="w-5 shrink-0" aria-hidden />
        {stories.map((s, i) => {
          const seen = seenSet.has(i)
          const isYou = i === 0
          return (
            <button
              key={i}
              onClick={() => openStory(i)}
              aria-label={`Ver story de ${s.name}`}
              className="group relative w-[112px] h-[152px] shrink-0 overflow-hidden rounded-[20px] focus:outline-none [scroll-snap-align:start]"
            >
              {/* cover */}
              <img
                src={s.cover}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${seen ? 'grayscale brightness-75' : 'group-hover:scale-105'}`}
              />
              {/* gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${seen ? 'from-black/40 via-transparent to-transparent' : 'from-black/55 via-transparent to-transparent'}`} />

              {/* avatar ring — 12px from edges for breathing room */}
              <span className="absolute bottom-3 left-3">
                <Avatar src={s.avatar} size={30} ring={seen ? 'surface' : 'accent'} />
              </span>

              {/* "+" add story on your own card */}
              {isYou && (
                <span className="absolute bottom-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-accent text-white shadow">
                  <PlusIcon width={12} height={12} />
                </span>
              )}
            </button>
          )
        })}
        {/* Right spacer: ensures last card has breathing room at right edge */}
        <div className="w-5 shrink-0" aria-hidden />
      </div>

      {viewerIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIndex}
          seenSet={seenSet}
          onSee={markSeen}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}

/* ------------------------------ Group card ----------------------------- */
export function GroupCard({ group, onOpenGroup }: { group: Group; onOpenGroup?: (id: string) => void }) {
  return (
    <article
      className="overflow-hidden rounded-lg bg-surface cursor-pointer"
      onClick={() => onOpenGroup?.(group.id)}
    >
      <div className="relative h-24">
        <img src={group.cover} alt="" className="h-full w-full object-cover" />
        <button
          aria-label="Compartilhar grupo"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-surface/85 text-neutral-600 backdrop-blur-sm transition-colors hover:bg-surface"
        >
          <ShareIcon width={16} height={16} />
        </button>
        <span className="absolute -bottom-3 left-3">
          <AvatarStack srcs={group.members_avatars} size={28} />
        </span>
      </div>
      <div className="px-3 pb-3 pt-5">
        <h3 className="truncate text-[15px] font-semibold text-ink">{group.name}</h3>
        <div className="mt-2 space-y-1.5 text-[13px] text-neutral-500">
          <p className="flex items-center gap-2">
            <GroupsIcon width={15} height={15} className="text-neutral-400" />
            {group.groups} grupos
          </p>
          <p className="flex items-center gap-2">
            <ProfileIcon width={15} height={15} className="text-neutral-400" />
            {group.members}
          </p>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------- Post ----------------------------------
   Feed card: flat surface, 20px radius, media at 16px. */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-xl bg-surface p-4 sm:p-5">
      <header className="flex items-center gap-3">
        <Avatar src={post.avatar} size={44} />
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-ink">{post.author}</p>
          <p className="flex items-center gap-1.5 text-[13px] text-neutral-400">
            <InfinityMark className="h-2.5 w-4 text-neutral-400" />
            {post.time}
          </p>
        </div>
        <IconButton aria-label="Mais opções">
          <MoreIcon width={20} height={20} />
        </IconButton>
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
        {post.text}{' '}
        {post.mention && <span className="font-medium text-accent-600">{post.mention}</span>} 😋
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-lg">
        <img src={post.image} alt="" className="max-h-[520px] w-full object-cover" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          {post.reactions.map((r) => (
            <span
              key={r.emoji}
              className="flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[13px] font-medium text-ink backdrop-blur-sm"
            >
              {r.emoji} {r.count}
            </span>
          ))}
        </div>
      </div>

      <footer className="mt-4 flex items-center justify-between text-neutral-500">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-[14px] transition-colors hover:text-accent-600">
            <HeartIcon width={21} height={21} /> {post.likes}
          </button>
          <button className="flex items-center gap-1.5 text-[14px] transition-colors hover:text-ink">
            <CommentIcon width={21} height={21} /> {post.comments}
          </button>
          <button className="hidden items-center transition-colors hover:text-ink sm:flex">
            <SmileIcon width={21} height={21} />
          </button>
          <button className="flex items-center transition-colors hover:text-ink">
            <ShareIcon width={21} height={21} />
          </button>
        </div>
        <button className="transition-colors hover:text-ink">
          <BookmarkIcon width={21} height={21} />
        </button>
      </footer>
    </article>
  )
}

/* --------------------------- Desktop sidebar ---------------------------
   Flat panel; nav items use a 12px radius (not fully-rounded). Settings
   sits in its own group separated by generous spacing + a hair-line rule. */
const navItems: { icon: LucideIcon; label: string; key: string }[] = [
  { icon: HomeIcon, label: 'Início', key: 'home' },
  { icon: SearchIcon, label: 'Buscar', key: 'search' },
  { icon: MessageIcon, label: 'Mensagens', key: 'messages' },
  { icon: PlusCircleIcon, label: 'Criar', key: 'create' },
  { icon: GroupsIcon, label: 'Grupos', key: 'grupos' },
  { icon: ProfileIcon, label: 'Perfil', key: 'profile' },
]

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-[15px] transition-colors ${
        active
          ? 'bg-secondary-500 font-semibold text-white'
          : 'font-medium text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <Icon width={20} height={20} />
      {label}
    </button>
  )
}

export function SidebarNav({
  activeKey,
  onNavigate,
}: {
  activeKey?: string
  onNavigate?: (key: string) => void
}) {
  return (
    <nav className="rounded-2xl bg-surface p-3">
      <ul className="space-y-1">
        {navItems.map(({ icon: Icon, label, key }) => (
          <li key={label}>
            <NavItem
              icon={Icon}
              label={label}
              active={activeKey === key}
              onClick={() => onNavigate?.(key)}
            />
          </li>
        ))}
      </ul>
      <div className="mx-4 my-2 h-px bg-neutral-100" />
      <NavItem icon={SettingsIcon} label="Configurações" active={activeKey === 'settings'} onClick={() => onNavigate?.('settings')} />
    </nav>
  )
}

/* ---------------------------- Context rail ----------------------------- */
const railFilters = ['Todos', 'Participando', 'Sugeridos', 'Corrida', 'Ciclismo', 'Nutrição', 'Yoga', 'Treino']

export function ContextRail({ groups, onOpenGroup }: { groups: Group[]; onOpenGroup?: (id: string) => void }) {
  const [tab, setTab] = useState<'grupos' | 'pessoas'>('grupos')
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  const filteredGroups = query
    ? groups.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
    : groups

  const toggleFollow = (id: string) =>
    setFollowed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div>
      {/* Tabs + icons */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {(['grupos', 'pessoas'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-1 text-[15px] capitalize transition-colors ${tab === t ? 'border-b-2 border-accent-500 font-semibold text-ink' : 'font-medium text-neutral-400 hover:text-ink'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-neutral-500">
          <IconButton aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
            <SearchIcon width={18} height={18} />
          </IconButton>
          {tab === 'grupos' && (
            <IconButton aria-label="Filtrar" onClick={() => setFiltersOpen((v) => !v)}>
              <FilterIcon width={18} height={18} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Search field */}
      {searchOpen && (
        <div className="mb-3 flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-2">
          <SearchIcon width={16} height={16} className="shrink-0 text-neutral-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'grupos' ? 'Buscar grupos…' : 'Buscar pessoas…'}
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-neutral-400"
          />
        </div>
      )}

      {/* Filter chips */}
      {tab === 'grupos' && filtersOpen && (
        <div className="no-scrollbar mb-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          {railFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-secondary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Grupos grid — auto-fill, always fills width */}
      {tab === 'grupos' && (
        <>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(190px,1fr))]">
            {filteredGroups.map((g) => (
              <GroupCard key={g.name} group={g} onOpenGroup={onOpenGroup} />
            ))}
          </div>
          {filteredGroups.length === 0 && (
            <p className="py-8 text-center text-[14px] text-neutral-400">Nenhum grupo encontrado.</p>
          )}
          <button className="mt-4 w-full rounded-xl py-2.5 text-[14px] font-medium text-neutral-500 hover:bg-neutral-100 transition-colors">
            Ver tudo →
          </button>
        </>
      )}

      {/* Pessoas list */}
      {tab === 'pessoas' && (
        <>
          <ul className="space-y-1">
            {contacts
              .filter((c) =>
                query ? c.name.toLowerCase().includes(query.toLowerCase()) || c.handle.includes(query) : true,
              )
              .map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-neutral-50 transition-colors">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img src={c.avatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{c.name}</p>
                    <p className="truncate text-[12px] text-neutral-400">{c.handle}</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(c.id)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      followed.has(c.id)
                        ? 'bg-neutral-100 text-neutral-700'
                        : 'bg-secondary-500 text-white'
                    }`}
                  >
                    {followed.has(c.id) ? 'Seguindo' : 'Seguir'}
                  </button>
                </li>
              ))}
          </ul>
          <button className="mt-4 w-full rounded-xl py-2.5 text-[14px] font-medium text-neutral-500 hover:bg-neutral-100 transition-colors">
            Ver tudo →
          </button>
        </>
      )}
    </div>
  )
}

/* ------------------------------ Top bar --------------------------------
   Flat search field (no elevation); magnifier trails on the right. */
export function TopBar({ user, onNavigate, onNotifications }: { user: { avatar: string }; onNavigate?: (key: string) => void; onNotifications?: () => void }) {
  return (
    <header className="sticky top-0 z-40 hidden w-full items-center gap-6 bg-canvas px-5 py-4 border-b border-neutral-200 min-[800px]:flex min-[1800px]:px-8">
      <Logo className="text-[26px]" />
      <div className="relative max-w-[560px] flex-1">
        <input
          placeholder="O que deseja fazer de bom hoje?"
          onFocus={() => onNavigate?.('search')}
          className="h-12 w-full cursor-pointer rounded-full bg-surface pl-5 pr-12 text-[15px] text-ink outline-none placeholder:text-neutral-400 focus:ring-4 focus:ring-accent-200/40"
        />
        <SearchIcon
          width={20}
          height={20}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
      </div>
      <p className="ml-auto hidden text-[14px] font-medium text-neutral-500 lg:block">
        Respeite sua mente e trate seu corpo bem!
      </p>
      <div className="flex items-center gap-2">
        <IconButton aria-label="Notificações" onClick={onNotifications}>
          <BellIcon width={22} height={22} />
        </IconButton>
        <button onClick={() => onNavigate?.('profile')} className="rounded-full transition-opacity hover:opacity-80">
          <Avatar src={user.avatar} size={40} ring="accent" />
        </button>
      </div>
    </header>
  )
}

/* --------------------------- Mobile chrome ----------------------------- */
export function MobileHeader({ user, onNotifications, onNavigate }: { user: { avatar: string }; onNotifications?: () => void; onNavigate?: (key: string) => void }) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-surface px-4 py-3 border-b border-neutral-200 min-[800px]:hidden">
      <InfinityMark className="h-6 w-12 text-ink" />
      <div className="flex items-center gap-1">
        <IconButton aria-label="Notificações" onClick={onNotifications}>
          <BellIcon width={22} height={22} />
        </IconButton>
        <button onClick={() => onNavigate?.('profile')} className="ml-1 rounded-full transition-opacity hover:opacity-80">
          <Avatar src={user.avatar} size={36} ring="accent" />
        </button>
      </div>
    </header>
  )
}

const mobileNavItems: { icon: LucideIcon; key: string; center?: boolean }[] = [
  { icon: HomeIcon, key: 'home' },
  { icon: SearchIcon, key: 'search' },
  { icon: PlusIcon, key: 'create', center: true },
  { icon: MessageIcon, key: 'messages' },
  { icon: ProfileIcon, key: 'profile' },
]

export function BottomNav({
  activeKey,
  onNavigate,
}: {
  activeKey?: string
  onNavigate?: (key: string) => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[45] flex justify-center pb-3 pb-[calc(12px+env(safe-area-inset-bottom))] min-[800px]:hidden">
      <div className="flex w-full max-w-[420px] items-center justify-around rounded-full bg-surface px-4 py-2.5 shadow-[0_4px_24px_rgba(18,22,28,0.14)]">
      {mobileNavItems.map(({ icon: Icon, key, center }) =>
        center ? (
          <button
            key={key}
            onClick={() => onNavigate?.(key)}
            aria-label="Criar"
            className="grid h-12 w-12 place-items-center rounded-full bg-accent-500 text-white transition-transform active:scale-95"
          >
            <Icon width={22} height={22} />
          </button>
        ) : (
          <button
            key={key}
            onClick={() => onNavigate?.(key)}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
              activeKey === key ? 'bg-secondary-500 text-white' : 'text-neutral-500'
            }`}
          >
            <Icon width={22} height={22} />
          </button>
        ),
      )}
      </div>
    </nav>
  )
}
