import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  Users,
  Lock,
  Globe,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
} from 'lucide-react'
import { fetchGroupDetail, type GroupDetail } from '../lib/api'
import { supabase } from '../lib/supabase'

export default function GroupProfile({
  groupId,
  onBack,
}: {
  groupId: string
  onBack: () => void
}) {
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  const [likes, setLikes] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchGroupDetail(groupId)
        if (cancelled) return
        if (!data) {
          setError('Grupo não encontrado')
          setGroup(null)
          return
        }
        setGroup(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar grupo')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [groupId])

  const toggleLike = (id: string) =>
    setLikes((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleJoin = async () => {
    if (!group) return
    const { data: row } = await supabase
      .from('groups')
      .select('id')
      .eq('slug', group.id)
      .maybeSingle()
    if (row?.id) {
      await supabase.rpc('join_group', { p_group_id: row.id })
    }
    setJoined(true)
  }

  const joinLabel = group?.privacy === 'Privado' ? 'Solicitar entrada' : 'Participar'
  const joinedLabel = group?.privacy === 'Privado' ? 'Solicitado' : 'Participando'

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-surface px-4 py-3">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Grupo</span>
        <button
          aria-label="Compartilhar"
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <Share2 size={18} />
        </button>
        <button
          aria-label="Mais opções"
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <MoreHorizontal size={18} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pb-10 pt-5">
        {loading && <p className="py-10 text-center text-[14px] text-neutral-500">Carregando grupo…</p>}
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>}

        {group && (
          <>
            <div className="h-[160px] w-full overflow-hidden rounded-[18px]">
              <img src={group.cover} alt="" className="h-full w-full object-cover" />
            </div>

            <h1 className="mt-4 text-[22px] font-bold leading-tight text-ink">{group.name}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-neutral-500">
              {group.privacy === 'Privado' ? (
                <Lock size={13} className="shrink-0" />
              ) : (
                <Globe size={13} className="shrink-0" />
              )}
              {group.privacy} · {group.subgroups} subgrupos ·{' '}
              {group.members.toLocaleString('pt-BR')} membros
            </p>

            <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">{group.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-[13px] font-medium text-neutral-700">
                {group.category}
              </span>
            </div>

            <div className="mt-5 flex gap-8">
              {[
                { label: 'membros', value: group.members.toLocaleString('pt-BR') },
                { label: 'subgrupos', value: group.subgroups.toString() },
                { label: 'publicações', value: group.postsCount.toLocaleString('pt-BR') },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  className="flex flex-col items-start gap-0.5 transition-opacity hover:opacity-70"
                >
                  <span className="text-[20px] font-bold leading-none text-ink">{value}</span>
                  <span className="text-[12px] text-neutral-500">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center">
                {group.memberAvatars.slice(0, 4).map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-canvas"
                    style={{
                      marginLeft: i === 0 ? 0 : -10,
                      zIndex: group.memberAvatars.length - i,
                    }}
                  />
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-[13px] font-semibold text-secondary-500 transition-colors hover:text-secondary-600">
                <Users size={13} />
                Ver todos os membros
              </button>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleJoin}
                className={`flex-1 rounded-[14px] py-3.5 text-[15px] font-semibold transition-colors ${
                  joined
                    ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    : 'bg-secondary-500 text-white hover:bg-secondary-600'
                }`}
              >
                {joined ? joinedLabel : joinLabel}
              </button>
              <button className="flex-1 rounded-[14px] bg-neutral-100 py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200">
                Compartilhar
              </button>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
                Feed do Grupo
              </p>
              <div className="space-y-3">
                {group.posts.length === 0 && (
                  <p className="py-8 text-center text-[14px] text-neutral-500">
                    Nenhuma publicação neste grupo ainda.
                  </p>
                )}
                {group.posts.map((post) => (
                  <div
                    key={post.id}
                    className="overflow-hidden rounded-[18px] border border-neutral-200 bg-surface"
                  >
                    <div className="flex items-center gap-3 px-4 pb-2 pt-4">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <img src={post.avatar} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold leading-none text-ink">{post.name}</p>
                        <p className="mt-0.5 text-[12px] text-neutral-500">
                          {post.handle} · {post.time}
                        </p>
                      </div>
                      <button className="text-neutral-400 transition-colors hover:text-ink">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <p className="px-4 pb-3 text-[14px] leading-relaxed text-neutral-700">{post.text}</p>

                    {post.image && (
                      <div className="mx-4 mb-3 aspect-[4/3] overflow-hidden rounded-[12px]">
                        <img src={post.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-5 border-t border-neutral-200 px-4 py-2.5">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                          likes.has(post.id)
                            ? 'text-accent-500'
                            : 'text-neutral-500 hover:text-accent-500'
                        }`}
                      >
                        <Heart size={16} fill={likes.has(post.id) ? 'currentColor' : 'none'} />
                        {likes.has(post.id) ? post.likes + 1 : post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-ink">
                        <MessageSquare size={16} />
                        {post.comments}
                      </button>
                      <button className="ml-auto text-neutral-400 transition-colors hover:text-ink">
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
