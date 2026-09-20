import { ChevronLeft } from 'lucide-react'
import { contacts, conversations } from '../lib/media'

export default function Messages({
  onBack,
  onSelectContact,
  onOpenProfile,
}: {
  onBack: () => void
  onSelectContact: (contactId: string) => void
  onOpenProfile?: (contactId: string) => void
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 bg-canvas px-4 py-3 border-b border-neutral-200"
      >
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-200/60"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[17px] font-semibold text-ink">Mensagens</h1>
      </header>

      {/* Conversation list */}
      <div className="mx-auto max-w-[640px] pb-8">
        <ul>
          {conversations.map((conv) => {
            const contact = contacts.find((c) => c.id === conv.contactId)
            if (!contact) return null
            return (
              <li key={conv.contactId}>
                <div className="flex w-full items-center gap-3 px-4 py-3.5">
                  {/* Avatar — tappable → profile */}
                  <button
                    onClick={() => onOpenProfile?.(contact.id)}
                    aria-label={`Ver perfil de ${contact.name}`}
                    className="relative shrink-0 transition-opacity hover:opacity-80"
                  >
                    <div className="h-[52px] w-[52px] overflow-hidden rounded-full">
                      <img src={contact.avatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-green-500" />
                    )}
                  </button>

                  {/* Content — tappable → chat */}
                  <button
                    onClick={() => onSelectContact(conv.contactId)}
                    className="flex flex-1 min-w-0 items-center gap-2 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-ink">{contact.name}</p>
                      <p className="truncate text-[13px] leading-snug text-neutral-400">
                        {conv.fromMe ? 'Você: ' : ''}
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Time + unread */}
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-[12px] text-neutral-400">{conv.time}</span>
                      {conv.unread ? (
                        <span
                          className="grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[11px] font-bold text-ink"
                          style={{ background: '#d4f535' }}
                        >
                          {conv.unread}
                        </span>
                      ) : (
                        <span className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="ml-[76px] h-px bg-neutral-200" />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
