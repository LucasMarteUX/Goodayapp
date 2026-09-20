import { useState, useRef, useEffect } from 'react'
import { contacts, chatHistory, type ChatMessage } from '../lib/media'

export default function Chat({
  contactId,
  onBack,
}: {
  contactId: string
  onBack: () => void
}) {
  const contact = contacts.find((c) => c.id === contactId)
  const initial = chatHistory[contactId] ?? []

  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages((prev) => [...prev, { id: String(Date.now()), text, time, fromMe: true }])
    setDraft('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!contact) return null

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 backdrop-blur-[40px] bg-white/95 border-b border-neutral-200"
      >
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-11 w-11 place-items-center rounded-xl text-ink transition-colors hover:bg-neutral-100"
        >
          <img src="/assets/132f9.svg" alt="" className="w-[22px] h-[22px]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[15px] font-semibold text-ink">{contact.name}</p>
            <p className={`text-[12px] ${contact.online ? 'text-green-500' : 'text-neutral-400'}`}>
              {contact.online ? 'online agora' : 'offline'}
            </p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <img src={contact.avatar} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.fromMe ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[72%] px-4 py-2.5 text-[15px] leading-snug text-ink ${msg.fromMe ? '[border-radius:18px_18px_4px_18px]' : 'bg-surface [border-radius:18px_18px_18px_4px]'}`}
              style={msg.fromMe ? { background: '#d4f535' } : undefined}
            >
              {msg.text}
            </div>
            <span className="mt-1 text-[11px] text-neutral-400">
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <div
        className="sticky bottom-0 flex items-center gap-3 px-4 py-3 bg-canvas/95 backdrop-blur-md border-t border-neutral-200"
      >
        <div
          className="flex flex-1 items-center rounded-full px-4 py-2.5 bg-neutral-100 border border-neutral-200"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-400"
          />
        </div>
        <button
          onClick={sendMessage}
          aria-label="Enviar"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-opacity hover:opacity-80 active:scale-95"
          style={{ background: '#d4f535' }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" className="text-ink">
            <path d="M22 2 11 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
