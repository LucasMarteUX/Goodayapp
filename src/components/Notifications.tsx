import { useState } from 'react'
import { X } from 'lucide-react'

type NotifType = 'like' | 'follow' | 'mention' | 'group_approved' | 'comment' | 'group_invite'

interface Notif {
  id: string
  type: NotifType
  name: string
  avatar: string
  text: string
  time: string
  read: boolean
  cta?: { label: string; action: string }
}

const initialNotifs: Notif[] = [
  {
    id: 'n1',
    type: 'like',
    name: 'Renata Silva',
    avatar: '/assets/0b179.png',
    text: 'curtiu sua publicação sobre suco verde',
    time: '12 min',
    read: false,
  },
  {
    id: 'n2',
    type: 'follow',
    name: 'Bruno Mendes',
    avatar: '/assets/2f96e.png',
    text: 'começou a seguir você',
    time: '1 h',
    read: false,
    cta: { label: 'Seguir de volta', action: 'follow' },
  },
  {
    id: 'n3',
    type: 'mention',
    name: 'Tiago Souza',
    avatar: '/assets/4b35d.png',
    text: 'mencionou você em um comentário',
    time: '3 h',
    read: false,
  },
  {
    id: 'n4',
    type: 'group_approved',
    name: 'Júlia Andrade',
    avatar: '/assets/a35b8.png',
    text: 'aprovou sua entrada em Corrida 5K',
    time: 'ter',
    read: true,
    cta: { label: 'Ver grupo', action: 'group' },
  },
  {
    id: 'n5',
    type: 'comment',
    name: 'Camila Ferreira',
    avatar: '/assets/eec11.png',
    text: 'comentou: "vamos marcar aquele pedal"',
    time: 'seg',
    read: true,
  },
  {
    id: 'n6',
    type: 'group_invite',
    name: 'Marina Rocha',
    avatar: '/assets/7c77a.png',
    text: 'convidou você para Vida Natural',
    time: 'seg',
    read: true,
    cta: { label: 'Aceitar', action: 'accept' },
  },
]

const today = ['n1', 'n2', 'n3']
const week = ['n4', 'n5', 'n6']

export default function Notifications({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs)
  const [acted, setActed] = useState<Set<string>>(new Set())

  const unreadCount = notifs.filter((n) => !n.read).length

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const handleCta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActed((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    markRead(id)
  }

  const renderGroup = (ids: string[], label: string) => {
    const items = notifs.filter((n) => ids.includes(n.id))
    if (!items.length) return null
    return (
      <div className="mb-1">
        <p className="px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">{label}</p>
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors"
            style={{ background: n.read ? 'transparent' : 'rgba(212,245,53,0.14)' }}
          >
            {/* Avatar */}
            <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full">
              <img src={n.avatar} alt="" className="h-full w-full object-cover" />
            </div>

            {/* Text + time */}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-snug text-ink">
                <span className="font-bold">{n.name}</span>{' '}
                <span className="font-normal text-neutral-600">{n.text}</span>
              </p>
              <p className="mt-0.5 text-[12px] text-neutral-400">{n.time}</p>
            </div>

            {/* CTA button */}
            {n.cta && (
              <button
                onClick={(e) => handleCta(n.id, e)}
                className={acted.has(n.id) ? 'ml-2 shrink-0 self-center rounded-full bg-neutral-100 px-3.5 py-2 text-[13px] font-semibold text-neutral-700 transition-colors' : 'ml-2 shrink-0 self-center rounded-full px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors'}
                style={!acted.has(n.id) ? { background: '#d4f535' } : undefined}
              >
                {acted.has(n.id)
                  ? n.cta.action === 'follow'
                    ? 'Seguindo'
                    : n.cta.action === 'accept'
                    ? 'Aceito'
                    : n.cta.label
                  : n.cta.label}
              </button>
            )}

            {/* Unread dot */}
            {!n.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full self-start bg-green-500" />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center min-[600px]:items-center"
      style={{ background: 'rgba(18,22,28,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Sheet / modal */}
      <div
        className="w-full max-w-[580px] overflow-hidden bg-white min-[600px]:rounded-[24px] rounded-t-[24px]"
        style={{ maxHeight: '90dvh', boxShadow: '0 8px 40px rgba(18,22,28,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[20px] font-bold text-ink">Notificações</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-[12px] bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Mark all read */}
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="mx-5 mb-2 text-[14px] font-semibold text-secondary-500 transition-opacity hover:opacity-70"
          >
            Marcar todas como lidas
          </button>
        )}

        {/* Scrollable list */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 100px)' }}>
          {renderGroup(today, 'Hoje')}
          {renderGroup(week, 'Esta semana')}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
