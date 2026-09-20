import { useState, useRef, useEffect } from 'react'
import { Search as SearchIcon, X, Users } from 'lucide-react'

const searchPeople = [
  { id: 'bruna', name: 'Bruna Carla', handle: '@bruna_carla', avatar: '/assets/eec11.png', interests: 3 },
  { id: 'renata', name: 'Renata Silva', handle: '@renata_silva', avatar: '/assets/0b179.png', interests: 5 },
  { id: 'lucas', name: 'Lucas Marte', handle: '@lucas_marte', avatar: '/assets/1023c.png', interests: 2 },
  { id: 'nicole', name: 'Nicole Bueno', handle: '@nicole_bueno', avatar: '/assets/7c77a.png', interests: 4 },
  { id: 'bruno', name: 'Bruno Mendes', handle: '@bruno_mendes', avatar: '/assets/2f96e.png', interests: 3 },
  { id: 'lidiane', name: 'Lidiane Costa', handle: '@lidiane_costa', avatar: '/assets/988ee.png', interests: 6 },
  { id: 'tiago', name: 'Tiago Souza', handle: '@tiago_souza', avatar: '/assets/4b35d.png', interests: 2 },
  { id: 'julia', name: 'Júlia Andrade', handle: '@julia_andrade', avatar: '/assets/a35b8.png', interests: 4 },
]

const searchGroups = [
  { id: 'corrida', name: 'Corrida para Iniciantes', cover: '/assets/40f99.png', members: 512, privacy: 'Público' },
  { id: 'ciclismo', name: 'Ciclismo Urbano', cover: '/assets/48d71.png', members: 975, privacy: 'Público' },
  { id: 'nutricao', name: 'Nutrição Consciente', cover: '/assets/074f9.png', members: 396, privacy: 'Público' },
  { id: 'vida', name: 'Vida Natural', cover: '/assets/8aa91.png', members: 304, privacy: 'Privado' },
  { id: 'treino', name: 'Treino Funcional', cover: '/assets/89f86.png', members: 428, privacy: 'Privado' },
  { id: 'alimentacao', name: 'Alimentação Saudável', cover: '/assets/f71df.png', members: 267, privacy: 'Privado' },
]

const recentChips = ['corrida', 'nutrição', 'ciclismo urbano', 'yoga']

export default function Search({
  onBack,
  onOpenProfile,
  onOpenGroup,
}: {
  onBack: () => void
  onOpenProfile?: (personId: string) => void
  onOpenGroup?: (groupId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'pessoas' | 'grupos'>('pessoas')
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [joined, setJoined] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const q = query.toLowerCase().trim()

  const filteredPeople = q
    ? searchPeople.filter((p) => p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q))
    : searchPeople

  const filteredGroups = q
    ? searchGroups.filter((g) => g.name.toLowerCase().includes(q))
    : searchGroups

  const toggleFollow = (id: string) =>
    setFollowed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleJoin = (id: string) =>
    setJoined((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const isEmpty = tab === 'pessoas' ? filteredPeople.length === 0 : filteredGroups.length === 0

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas">
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white border-b border-neutral-200"
      >
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Search pill with inline tab switcher */}
        <div
          className="flex flex-1 items-center overflow-hidden rounded-full bg-neutral-100 border border-neutral-200"
        >
          {/* Search input area */}
          <div className="flex flex-1 items-center gap-2 px-3.5 py-2.5">
            <SearchIcon size={16} className="shrink-0 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                aria-label="Limpar"
                className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-neutral-300 text-neutral-600"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Vertical divider */}
          <div className="h-5 w-px bg-neutral-300 shrink-0" />

          {/* Inline tabs */}
          <div className="flex shrink-0 items-center">
            {(['pessoas', 'grupos'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2.5 text-[13px] font-semibold transition-colors ${tab === t ? 'text-secondary-500' : 'text-neutral-400'}`}
              >
                {t === 'pessoas' ? 'Pessoas' : 'Grupos'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[640px] px-4 pt-4 pb-8">

          {/* Recent chips — only when no query */}
          {!query && (
            <div className="mb-5 flex flex-wrap gap-2">
              {recentChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setQuery(chip); inputRef.current?.focus() }}
                  className="rounded-full border border-neutral-200 bg-surface px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {query && isEmpty && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <SearchIcon size={36} className="text-neutral-300" strokeWidth={1.5} />
              <p className="text-[16px] font-semibold text-ink">Nenhum resultado encontrado</p>
              <p className="max-w-[260px] text-[14px] leading-relaxed text-neutral-400">
                Tente pesquisar por outro nome, interesse ou comunidade.
              </p>
            </div>
          )}

          {/* PESSOAS tab */}
          {tab === 'pessoas' && filteredPeople.length > 0 && (
            <div
              className="overflow-hidden rounded-[18px] bg-surface border border-neutral-200"
            >
              {filteredPeople.map((person, i) => (
                <button
                  key={person.id}
                  onClick={() => onOpenProfile?.(person.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100 border-b border-neutral-200 last:border-b-0"
                >
                  <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full">
                    <img src={person.avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-ink">{person.name}</p>
                    <p className="truncate text-[13px] text-neutral-400">
                      {person.handle} · {person.interests} interesses em comum
                    </p>
                  </div>
                  <span
                    onClick={(e) => { e.stopPropagation(); toggleFollow(person.id) }}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${followed.has(person.id) ? 'bg-neutral-100 text-neutral-700' : 'bg-secondary-500 text-white'}`}
                  >
                    {followed.has(person.id) ? 'Seguindo' : 'Seguir'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* GRUPOS tab */}
          {tab === 'grupos' && filteredGroups.length > 0 && (
            <div
              className="overflow-hidden rounded-[18px] bg-surface border border-neutral-200"
            >
              {filteredGroups.map((group, i) => (
                <button
                  key={group.id}
                  onClick={() => onOpenGroup?.(group.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100 border-b border-neutral-200 last:border-b-0"
                >
                  <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[14px]">
                    <img src={group.cover} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-ink">{group.name}</p>
                    <p className="flex items-center gap-1 truncate text-[13px] text-neutral-400">
                      <Users size={12} className="shrink-0" />
                      {group.members.toLocaleString('pt-BR')} membros · {group.privacy}
                    </p>
                  </div>
                  <span
                    onClick={(e) => { e.stopPropagation(); toggleJoin(group.id) }}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${joined.has(group.id) ? 'bg-neutral-100 text-neutral-700' : 'bg-accent-500 text-white'}`}
                  >
                    {joined.has(group.id) ? 'Participando' : 'Entrar'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
