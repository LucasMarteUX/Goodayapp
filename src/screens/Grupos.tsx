import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Search as SearchIcon, X, Share2, Lock, Globe, Users, Plus } from 'lucide-react'
import { fetchGruposList, type GrupoListItem } from '../lib/api'
import { useAuth } from '../lib/auth'

const filters = ['Todos', 'Participando', 'Sugeridos', 'Corrida', 'Ciclismo', 'Nutrição', 'Yoga', 'Treino']

export default function Grupos({
  onBack,
  onOpenGroup,
}: {
  onBack: () => void
  onOpenGroup: (groupId: string) => void
}) {
  const { authUser } = useAuth()
  const [gruposData, setGruposData] = useState<GrupoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const rows = await fetchGruposList(authUser?.id)
        if (!cancelled) setGruposData(rows)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authUser?.id])

  const filtered = gruposData.filter((g) => {
    const matchesQuery =
      !query ||
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.description.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Participando' && g.status === 'Participando') ||
      (activeFilter === 'Sugeridos' && g.status !== 'Participando') ||
      g.name.toLowerCase().includes(activeFilter.toLowerCase())
    return matchesQuery && matchesFilter
  })

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Meus grupos</span>
        <button
          aria-label="Criar grupo"
          className="grid h-9 w-9 place-items-center rounded-full bg-secondary-500 text-white transition-colors hover:bg-secondary-600"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[900px] px-4 pt-5 pb-10">
        <div className="mb-4 flex items-center gap-2.5 rounded-[14px] border border-neutral-200 bg-surface px-4 py-3">
          <SearchIcon size={16} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar grupos e comunidades..."
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="text-neutral-400 hover:text-ink"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-secondary-500 text-white'
                  : 'border border-neutral-200 bg-surface text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-16 text-center text-[14px] text-neutral-500">Carregando grupos…</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
              <Users size={24} className="text-neutral-400" />
            </div>
            <p className="text-[15px] font-semibold text-ink">Nenhum grupo encontrado</p>
            <p className="text-[13px] text-neutral-500">Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[700px]:grid-cols-3">
            {filtered.map((grupo) => (
              <button
                key={grupo.id}
                onClick={() => onOpenGroup(grupo.id)}
                className="group overflow-hidden rounded-[20px] border border-neutral-200 bg-surface text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative overflow-hidden" style={{ height: 130 }}>
                  <img
                    src={grupo.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Compartilhar"
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-neutral-700 backdrop-blur transition-colors hover:bg-white"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                    {grupo.status === 'Privado' ? (
                      <Lock size={10} className="text-white/90" />
                    ) : (
                      <Globe size={10} className="text-white/90" />
                    )}
                    <span className="text-[11px] font-medium text-white/90">
                      {grupo.status === 'Privado' ? 'Privado' : 'Público'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 flex items-center">
                    {grupo.memberAvatars.slice(0, 3).map((src, i) => (
                      <img
                        key={`${src}-${i}`}
                        src={src}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover ring-[1.5px] ring-white"
                        style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 3 - i }}
                      />
                    ))}
                    {grupo.members > 3 && (
                      <span
                        className="flex h-6 items-center rounded-full bg-black/50 px-1.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                        style={{ marginLeft: -6, zIndex: 0 }}
                      >
                        +{(grupo.members - 3).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                  {grupo.status === 'Participando' && (
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-secondary-500 px-2 py-0.5 text-[11px] font-bold text-white">
                      Participando
                    </span>
                  )}
                </div>
                <div className="px-3.5 pb-3.5 pt-3">
                  <p className="mb-0.5 line-clamp-1 text-[14px] font-semibold leading-snug text-ink">
                    {grupo.name}
                  </p>
                  <p className="mb-2.5 line-clamp-1 text-[12px] leading-relaxed text-neutral-500">
                    {grupo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-[12px] text-neutral-500">
                      <Users size={11} className="shrink-0" />
                      {grupo.members.toLocaleString('pt-BR')} membros
                    </p>
                    <span className="text-[12px] text-neutral-400">{grupo.posts} posts</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
