import { useState, useRef, type ChangeEvent } from 'react'
import {
  X, Camera, CirclePlus, User, MapPin, Globe, LayoutGrid,
  ChevronRight, Image, Check, Search as SearchIcon, Smile,
  ChevronDown, Lock, Users,
} from 'lucide-react'
import { contacts, groups, currentUser } from '../lib/media'

type CreateMode = 'pick' | 'post' | 'story'
type Privacy = 'Público' | 'Amigos' | 'Privado'

const EMOJI_LIST = ['😊','🌿','💪','🥗','🏃','❤️','🔥','✨','🧘','🚴','🥤','🌱','👏','😍','🙌','💚']

export default function Create({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<CreateMode>('pick')
  const [photo, setPhoto] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [taggedIds, setTaggedIds] = useState<string[]>([])
  const [showTagging, setShowTagging] = useState(false)
  const [tagQuery, setTagQuery] = useState('')
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  // New functional states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [location, setLocation] = useState('')
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [privacy, setPrivacy] = useState<Privacy>('Público')
  const [showPrivacyPicker, setShowPrivacyPicker] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showGroupPicker, setShowGroupPicker] = useState(false)

  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhoto(url)
    setShowMediaPicker(false)
  }

  const toggleTag = (id: string) => {
    setTaggedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    setTagQuery('')
  }

  const tagSuggestions = tagQuery.trim()
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(tagQuery.replace('@', '').toLowerCase()) ||
          c.handle.toLowerCase().includes(tagQuery.replace('@', '').toLowerCase()),
      )
    : []

  const canShare = !!photo || caption.trim().length > 0

  const privacyOptions: Privacy[] = ['Público', 'Amigos', 'Privado']
  const privacyIcons: Record<Privacy, typeof Globe> = { Público: Globe, Amigos: Users, Privado: Lock }
  const PrivacyIcon = privacyIcons[privacy]

  /* ---- Pick modal ---- */
  if (mode === 'pick') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[540px] rounded-t-[22px] sm:rounded-[22px] bg-[#f6f7fb] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#0d0f13]">Criar</h2>
            <button onClick={onClose} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#eceef4] transition-colors hover:bg-[#dfe1ee]">
              <X size={17} color="#0d0f13" />
            </button>
          </div>
          <div className="space-y-3 pb-2 sm:pb-0">
            <button
              onClick={() => setMode('post')}
              className="flex w-full items-center gap-4 rounded-[16px] border border-[#eceef4] bg-white p-4 text-left transition-colors hover:bg-neutral-50"
            >
              <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[12px] bg-[#f3fbd4]">
                <Camera size={22} color="#7fb200" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#0d0f13]">Publicação</p>
                <p className="text-[13px] text-[#6c7186]">Compartilhe fotos ou texto no feed</p>
              </div>
            </button>
            <button
              onClick={() => setMode('story')}
              className="flex w-full items-center gap-4 rounded-[16px] border border-[#eceef4] bg-white p-4 text-left transition-colors hover:bg-neutral-50"
            >
              <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[12px] bg-[#f3fbd4]">
                <CirclePlus size={22} color="#7fb200" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#0d0f13]">Story</p>
                <p className="text-[13px] text-[#6c7186]">Desaparece em 24 horas</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---- Story creator ---- */
  if (mode === 'story') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-[540px] rounded-t-[22px] sm:rounded-[22px] bg-[#f6f7fb] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#0d0f13]">Novo story</h2>
            <button onClick={onClose} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#eceef4] transition-colors hover:bg-[#dfe1ee]">
              <X size={17} color="#0d0f13" />
            </button>
          </div>
          <button
            onClick={() => setShowMediaPicker(true)}
            className="relative flex w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#eceef4] transition-colors hover:bg-[#dfe1ee] aspect-[9/16] max-h-[52vh]"
          >
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#6c7186]">
                <Image size={26} strokeWidth={1.5} />
                <span className="text-[14px] font-medium">Tirar foto ou galeria</span>
              </div>
            )}
          </button>
          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          {showMediaPicker && (
            <div className="fixed inset-0 z-10 flex items-end justify-center" onClick={() => setShowMediaPicker(false)}>
              <div className="w-full max-w-[540px] rounded-t-[20px] bg-white pb-6 pt-4 px-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-3 mx-auto h-1 w-10 rounded-full bg-[#dfe1ee]" />
                <button onClick={() => galleryRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#0d0f13] hover:bg-neutral-50">
                  <Image size={20} color="#6c7186" /> Galeria de fotos
                </button>
                <button onClick={() => cameraRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#0d0f13] hover:bg-neutral-50">
                  <Camera size={20} color="#6c7186" /> Câmera
                </button>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            disabled={!photo}
            className={`mt-4 w-full rounded-[12px] py-3.5 text-[14px] font-semibold text-[#0d0f13] transition-opacity ${photo ? 'opacity-100' : 'opacity-40'}`}
            style={{ background: '#e7fe8e' }}
          >
            Publicar story
          </button>
        </div>
      </div>
    )
  }

  /* ---- Post creator ---- */
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div
        className="w-full max-w-[540px] rounded-t-[22px] sm:rounded-[22px] bg-[#f6f7fb] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-[#0d0f13]">Nova publicação</h2>
          <button onClick={onClose} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#eceef4] transition-colors hover:bg-[#dfe1ee]">
            <X size={17} color="#0d0f13" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Photo area */}
          <button
            onClick={() => setShowMediaPicker(true)}
            className="relative flex w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#eceef4] transition-colors hover:bg-[#dfe1ee] min-h-[180px]"
          >
            {photo ? (
              <>
                <img src={photo} alt="" className="w-full object-cover rounded-[16px] max-h-[320px]" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPhoto(null) }}
                  className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white"
                  aria-label="Remover foto"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-[#6c7186]">
                <Image size={24} strokeWidth={1.5} />
                <span className="text-[14px] font-medium">Adicionar foto</span>
                <span className="text-[12px] text-[#9a9fb5]">Galeria ou câmera</span>
              </div>
            )}
          </button>

          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

          {showMediaPicker && (
            <div className="fixed inset-0 z-10 flex items-end justify-center" onClick={() => setShowMediaPicker(false)}>
              <div className="w-full max-w-[540px] rounded-t-[20px] bg-white pb-6 pt-4 px-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-3 mx-auto h-1 w-10 rounded-full bg-[#dfe1ee]" />
                <button onClick={() => { galleryRef.current?.click(); setShowMediaPicker(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#0d0f13] hover:bg-neutral-50">
                  <Image size={20} color="#6c7186" /> Galeria de fotos
                </button>
                <button onClick={() => { cameraRef.current?.click(); setShowMediaPicker(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#0d0f13] hover:bg-neutral-50">
                  <Camera size={20} color="#6c7186" /> Câmera
                </button>
              </div>
            </div>
          )}

          {/* Caption with avatar + emoji */}
          <div className="flex items-start gap-3 rounded-[14px] px-3 py-3 bg-surface border border-neutral-200">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full mt-0.5">
              <img src={currentUser.avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Escreva uma legenda..."
                maxLength={2200}
                rows={3}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#0d0f13] outline-none placeholder:text-[#9a9fb5]"
              />
              {/* Emoji row */}
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-200">
                <button
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  className="flex items-center gap-1 text-[13px] text-[#6c7186] hover:text-[#0d0f13] transition-colors"
                >
                  <Smile size={16} strokeWidth={1.75} />
                  <span>Emoji</span>
                </button>
                <span className="text-[12px] text-[#9a9fb5]">{caption.length}/2.200</span>
              </div>
              {showEmojiPicker && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {EMOJI_LIST.map((em) => (
                    <button
                      key={em}
                      onClick={() => { setCaption((c) => c + em); setShowEmojiPicker(false) }}
                      className="text-[20px] hover:scale-125 transition-transform"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Options rows */}
          <div className="rounded-[16px] overflow-hidden bg-neutral-50 border border-neutral-200">
            {/* Tag people */}
            <button
              onClick={() => { setShowTagging((v) => !v); setShowLocationInput(false); setShowPrivacyPicker(false); setShowGroupPicker(false) }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/60 border-b border-neutral-200"
            >
              <User size={18} color="#6c7186" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-medium text-[#0d0f13]">Marcar pessoas</span>
              <span className="text-[13px] text-[#6c7186]">{taggedIds.length > 0 ? `${taggedIds.length} pessoa(s)` : 'Adicionar'}</span>
              <ChevronRight size={16} color="#6c7186" />
            </button>

            {showTagging && (
              <div className="border-b border-neutral-200">
                {taggedIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-4 pt-2 pb-1">
                    {taggedIds.map((id) => {
                      const c = contacts.find((x) => x.id === id)
                      if (!c) return null
                      return (
                        <span key={id} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-ink" style={{ background: '#e7fe8e' }}>
                          {c.handle}
                          <button onClick={() => toggleTag(id)} aria-label="Remover" className="ml-0.5 opacity-60 hover:opacity-100"><X size={10} strokeWidth={2.5} /></button>
                        </span>
                      )
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 pb-3 pt-1">
                  <SearchIcon size={15} color="#6c7186" className="shrink-0" />
                  <input autoFocus type="text" value={tagQuery} onChange={(e) => setTagQuery(e.target.value)} placeholder="Digite @ para buscar pessoas" className="flex-1 bg-transparent text-[14px] text-[#0d0f13] outline-none placeholder:text-[#9a9fb5]" />
                  {tagQuery && <button onClick={() => setTagQuery('')}><X size={14} color="#9a9fb5" /></button>}
                </div>
                {tagSuggestions.length > 0 && (
                  <div className="pb-1">
                    {tagSuggestions.map((c) => (
                      <button key={c.id} onClick={() => toggleTag(c.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/60">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full"><img src={c.avatar} alt="" className="h-full w-full object-cover" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium text-[#0d0f13]">{c.name}</p>
                          <p className="text-[12px] text-[#6c7186]">{c.handle}</p>
                        </div>
                        {taggedIds.includes(c.id) && <div className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-secondary-500"><Check size={12} color="white" strokeWidth={2.5} /></div>}
                      </button>
                    ))}
                  </div>
                )}
                {tagQuery.trim() && tagSuggestions.length === 0 && <p className="px-4 pb-3 text-[13px] text-[#9a9fb5]">Nenhuma pessoa encontrada</p>}
              </div>
            )}

            {/* Location */}
            <button
              onClick={() => { setShowLocationInput((v) => !v); setShowTagging(false); setShowPrivacyPicker(false); setShowGroupPicker(false) }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/60 border-b border-neutral-200"
            >
              <MapPin size={18} color="#6c7186" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-medium text-[#0d0f13]">Adicionar local</span>
              <span className="text-[13px] text-[#6c7186] truncate max-w-[140px]">{location || 'Adicionar'}</span>
              <ChevronRight size={16} color="#6c7186" />
            </button>
            {showLocationInput && (
              <div className="px-4 pb-3 pt-1 border-b border-neutral-200">
                <input
                  autoFocus
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Digite o local..."
                  className="w-full rounded-[10px] bg-white px-3 py-2.5 text-[14px] text-[#0d0f13] outline-none placeholder:text-[#9a9fb5] border border-neutral-200"
                  onKeyDown={(e) => e.key === 'Enter' && setShowLocationInput(false)}
                />
              </div>
            )}

            {/* Privacy */}
            <button
              onClick={() => { setShowPrivacyPicker((v) => !v); setShowTagging(false); setShowLocationInput(false); setShowGroupPicker(false) }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/60 border-b border-neutral-200"
            >
              <PrivacyIcon size={18} color="#6c7186" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-medium text-[#0d0f13]">Privacidade</span>
              <span className="flex items-center gap-1 text-[13px] text-[#6c7186]">{privacy} <ChevronDown size={14} /></span>
            </button>
            {showPrivacyPicker && (
              <div className="border-b border-neutral-200">
                {privacyOptions.map((opt) => {
                  const Icon = privacyIcons[opt]
                  return (
                    <button
                      key={opt}
                      onClick={() => { setPrivacy(opt); setShowPrivacyPicker(false) }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/60"
                    >
                      <Icon size={16} color="#6c7186" strokeWidth={1.75} />
                      <span className="flex-1 text-[14px] text-[#0d0f13]">{opt}</span>
                      {privacy === opt && <Check size={16} color="#004E44" strokeWidth={2.5} />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Group */}
            <button
              onClick={() => { setShowGroupPicker((v) => !v); setShowTagging(false); setShowLocationInput(false); setShowPrivacyPicker(false) }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/60"
            >
              <LayoutGrid size={18} color="#6c7186" strokeWidth={1.75} />
              <span className="flex-1 text-[14px] font-medium text-[#0d0f13]">Publicar no grupo</span>
              <span className="text-[13px] text-[#6c7186] truncate max-w-[140px]">{selectedGroup || 'Nenhum'}</span>
              <ChevronRight size={16} color="#6c7186" />
            </button>
            {showGroupPicker && (
              <div>
                <button
                  onClick={() => { setSelectedGroup(null); setShowGroupPicker(false) }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/60 border-t border-neutral-200"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-neutral-100">
                    <LayoutGrid size={16} color="#6c7186" />
                  </div>
                  <span className="flex-1 text-[14px] text-[#0d0f13]">Nenhum grupo</span>
                  {!selectedGroup && <Check size={16} color="#004E44" />}
                </button>
                {groups.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => { setSelectedGroup(g.name); setShowGroupPicker(false) }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/60 border-t border-neutral-200"
                  >
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-[10px]">
                      <img src={g.cover} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="flex-1 truncate text-[14px] text-[#0d0f13]">{g.name}</span>
                    {selectedGroup === g.name && <Check size={16} color="#004E44" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={onClose}
            disabled={!canShare}
            className={`w-full rounded-[14px] py-3.5 text-[15px] font-bold text-[#0d0f13] transition-opacity ${canShare ? 'opacity-100' : 'opacity-40'}`}
            style={{ background: '#d4f535' }}
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  )
}
