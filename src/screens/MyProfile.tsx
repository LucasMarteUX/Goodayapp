import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ChevronLeft, Settings, Grid3x3, Heart, Camera, Edit3, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchProfileByKey, type ProfileView } from '../lib/api'
import { supabase } from '../lib/supabase'
import { uploadOwnProfileImage } from '../lib/profileMedia'

type Tab = 'posts' | 'curtidas'

export default function MyProfile({
  onBack,
  onSettings,
}: {
  onBack: () => void
  onSettings: () => void
}) {
  const { profile: authProfile, refreshProfile } = useAuth()
  const [data, setData] = useState<ProfileView | null>(null)
  const [tab, setTab] = useState<Tab>('posts')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [draftBio, setDraftBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!authProfile?.handle) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const view = await fetchProfileByKey(authProfile.handle)
        if (cancelled) return
        setData(view)
        setBio(view?.bio || authProfile.bio || '')
        setDraftBio(view?.bio || authProfile.bio || '')
        setAvatarUrl(view?.avatar || authProfile.avatar_url || '/assets/eec11.png')
        setCoverUrl(view?.cover || authProfile.cover_url || '/assets/40f99.png')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authProfile?.handle, authProfile?.bio, authProfile?.avatar_url, authProfile?.cover_url])

  const saveBio = async () => {
    if (!authProfile?.id) return
    const { error } = await supabase.from('users').update({ bio: draftBio }).eq('id', authProfile.id)
    if (!error) {
      setBio(draftBio)
      setEditing(false)
      await refreshProfile()
    }
  }

  const onPickMedia = async (kind: 'avatar' | 'cover', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !authProfile?.id) return

    setMediaError(null)
    setUploading(kind)
    try {
      const { publicUrl } = await uploadOwnProfileImage(authProfile.id, file, kind)
      if (kind === 'avatar') setAvatarUrl(publicUrl)
      else setCoverUrl(publicUrl)
      await refreshProfile()
      const view = await fetchProfileByKey(authProfile.handle)
      if (view) setData(view)
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Falha ao enviar a imagem')
    } finally {
      setUploading(null)
    }
  }

  const name = data?.name ?? authProfile?.name ?? 'Usuário'
  const handle = data?.handle ?? authProfile?.handle ?? '@user'
  const location = data?.location ?? authProfile?.location ?? ''
  const interests = data?.interests ?? []
  const posts = data?.posts ?? []
  const followers = data?.followers ?? 0
  const following = data?.following ?? 0

  return (
    <div className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-canvas">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPickMedia('avatar', e)}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPickMedia('cover', e)}
      />

      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-surface px-4 py-3">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-50"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Meu Perfil</span>
        <button
          onClick={onSettings}
          aria-label="Configurações"
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-50"
        >
          <Settings size={20} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pb-10 pt-5">
        {loading ? (
          <p className="py-10 text-center text-[14px] text-neutral-500">Carregando perfil…</p>
        ) : (
          <>
            <div className="relative h-[160px] w-full overflow-hidden rounded-[18px]">
              <img src={coverUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Alterar capa"
                disabled={uploading !== null}
                onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 disabled:opacity-60"
              >
                {uploading === 'cover' ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
                Alterar capa
              </button>
            </div>

            <div className="-mt-10 mb-4 ml-4 flex items-end justify-between">
              <div className="relative">
                <div className="h-[88px] w-[88px] overflow-hidden rounded-full ring-[3px] ring-canvas">
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  aria-label="Alterar foto"
                  disabled={uploading !== null}
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-secondary-500 text-white ring-2 ring-canvas transition-colors hover:bg-secondary-600 disabled:opacity-60"
                >
                  {uploading === 'avatar' ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Camera size={13} />
                  )}
                </button>
              </div>
            </div>

            {mediaError && (
              <p role="alert" className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-600">
                {mediaError}
              </p>
            )}

            <h1 className="text-[22px] font-bold leading-tight text-ink">{name}</h1>
            <p className="mt-0.5 text-[14px] text-neutral-500">
              {handle}
              {location ? ` · ${location}` : ''}
            </p>

            {editing ? (
              <div className="mt-3">
                <textarea
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-[12px] border border-neutral-200 bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-ink outline-none focus:border-secondary-500"
                  autoFocus
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={saveBio}
                    className="rounded-full bg-secondary-500 px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-secondary-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setDraftBio(bio)
                      setEditing(false)
                    }}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="mt-3 cursor-text text-[14px] leading-relaxed text-neutral-700"
                onClick={() => {
                  setDraftBio(bio)
                  setEditing(true)
                }}
              >
                {bio || 'Toque para adicionar uma bio.'}
              </p>
            )}

            {interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-accent-100 px-3.5 py-1 text-[13px] font-medium text-accent-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 overflow-hidden rounded-[16px] border border-neutral-200/80 bg-white">
              <div className="grid grid-cols-3 divide-x divide-neutral-200">
                {[
                  { label: 'seguidores', value: followers.toLocaleString('pt-BR') },
                  { label: 'seguindo', value: following.toLocaleString('pt-BR') },
                  { label: 'publicações', value: posts.length.toString() },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-1 px-3 py-3.5 text-center transition-colors hover:bg-neutral-50"
                  >
                    <span className="text-[20px] font-bold leading-none text-ink">{value}</span>
                    <span className="text-[12px] text-neutral-500">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setDraftBio(bio)
                  setEditing(true)
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-secondary-500 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-secondary-600"
              >
                <Edit3 size={16} />
                Editar perfil
              </button>
              <button
                onClick={onSettings}
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-neutral-200 bg-white py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <Settings size={16} />
                Configurações
              </button>
            </div>

            <div className="mt-7 flex border-b border-neutral-200">
              {(
                [
                  { key: 'posts', label: 'Publicações', icon: Grid3x3 },
                  { key: 'curtidas', label: 'Curtidas', icon: Heart },
                ] as { key: Tab; label: string; icon: typeof Grid3x3 }[]
              ).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 items-center justify-center gap-2 pb-3 text-[14px] font-semibold transition-colors ${
                    tab === key
                      ? 'border-b-2 border-secondary-500 text-secondary-500'
                      : 'text-neutral-400 hover:text-ink'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {tab === 'posts' &&
              (posts.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white">
                    <Grid3x3 size={24} className="text-neutral-400" />
                  </div>
                  <p className="text-[15px] font-semibold text-ink">Nada publicado ainda</p>
                  <p className="text-[13px] text-neutral-500">Compartilhe seu primeiro momento.</p>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
                  {posts.map((src, i) => (
                    <div key={`${src}-${i}`} className="aspect-square overflow-hidden">
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ))}

            {tab === 'curtidas' && (
              <div className="flex flex-col items-center gap-3 py-16">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white">
                  <Heart size={24} className="text-neutral-400" />
                </div>
                <p className="text-[15px] font-semibold text-ink">Nenhuma curtida ainda</p>
                <p className="text-[13px] text-neutral-500">Os posts que você curtir aparecem aqui.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
