import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { fetchProfileByKey, type ProfileView } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function Profile({
  personId,
  onBack,
  onMessage,
}: {
  personId: string
  onBack: () => void
  onMessage: (personId: string) => void
}) {
  const { authUser } = useAuth()
  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProfileByKey(personId)
        if (cancelled) return
        if (!data) {
          setError('Perfil não encontrado')
          setProfile(null)
          return
        }
        setProfile(data)
        setFollowerCount(data.followers)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [personId])

  const handleFollow = async () => {
    if (!profile || !authUser) {
      setFollowing((f) => {
        setFollowerCount((c) => (f ? c - 1 : c + 1))
        return !f
      })
      return
    }
    // Optimistic UI; RPC resolve by looking up user id from handle in a follow-up
    setFollowing((f) => {
      setFollowerCount((c) => (f ? c - 1 : c + 1))
      return !f
    })
  }

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
        <span className="text-[17px] font-semibold text-ink">Perfil</span>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">
        {loading && <p className="py-10 text-center text-[14px] text-neutral-500">Carregando perfil…</p>}
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>}

        {profile && (
          <>
            <div className="h-[160px] w-full overflow-hidden rounded-[18px]">
              <img src={profile.cover} alt="" className="h-full w-full object-cover" />
            </div>

            <div className="-mt-10 ml-4 mb-4">
              <div className="h-[88px] w-[88px] overflow-hidden rounded-full ring-[3px] ring-canvas">
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              </div>
            </div>

            <h1 className="text-[22px] font-bold text-ink leading-tight">{profile.name}</h1>
            <p className="mt-0.5 text-[14px] text-neutral-500">
              {profile.handle}
              {profile.location ? ` · ${profile.location}` : ''}
            </p>

            {profile.bio && (
              <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">{profile.bio}</p>
            )}

            {profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full px-3.5 py-1 text-[13px] font-medium text-ink"
                    style={{ background: '#e7fe8e' }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-8">
              {[
                { label: 'seguidores', value: followerCount.toLocaleString('pt-BR') },
                { label: 'seguindo', value: profile.following.toLocaleString('pt-BR') },
                { label: 'publicações', value: profile.posts.length.toString() },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  className="flex flex-col items-start gap-0.5 transition-opacity hover:opacity-70"
                >
                  <span className="text-[20px] font-bold text-ink leading-none">{value}</span>
                  <span className="text-[12px] text-neutral-500">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleFollow}
                className={`flex-1 rounded-[14px] py-3.5 text-[15px] font-semibold transition-colors ${
                  following ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200' : 'text-ink'
                }`}
                style={!following ? { background: '#d4f535' } : undefined}
              >
                {following ? 'Seguindo' : 'Seguir'}
              </button>
              <button
                onClick={() => onMessage(profile.id)}
                className="flex-1 rounded-[14px] bg-neutral-100 py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                Mensagem
              </button>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
                Publicações
              </p>
              {profile.posts.length === 0 ? (
                <p className="py-8 text-center text-[14px] text-neutral-500">Nada publicado…</p>
              ) : (
                <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
                  {profile.posts.map((src, i) => (
                    <div key={`${src}-${i}`} className="aspect-square overflow-hidden">
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
