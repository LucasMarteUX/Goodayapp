import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Lock,
  Palette,
  User,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Smartphone,
  Shield,
  Eye,
  AtSign,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { currentUser as fallbackUser } from '../lib/media'

type Section = 'main' | 'conta' | 'notificacoes' | 'privacidade' | 'aparencia'

interface ToggleItem {
  id: string
  label: string
  description?: string
  defaultOn?: boolean
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative h-6 w-10 rounded-full transition-colors ${on ? 'bg-secondary-500' : 'bg-neutral-200'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

function RowLink({ icon: Icon, label, subtitle, onClick, danger }: {
  icon: React.ElementType
  label: string
  subtitle?: string
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[14px] bg-surface px-4 py-3.5 transition-colors hover:bg-neutral-50 text-left"
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${danger ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-600'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium ${danger ? 'text-red-500' : 'text-ink'}`}>{label}</p>
        {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {!danger && <ChevronRight size={18} className="shrink-0 text-neutral-300" />}
    </button>
  )
}

function RowToggle({ icon: Icon, label, subtitle, on, onToggle }: {
  icon: React.ElementType
  label: string
  subtitle?: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex w-full items-center gap-3.5 rounded-[14px] bg-surface px-4 py-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-600">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-ink">{label}</p>
        {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
      {children}
    </p>
  )
}

export default function Settings({
  onBack,
  onLogout,
  isAdmin = false,
}: {
  onBack: () => void
  onLogout: () => void
  isAdmin?: boolean
  adminEmail?: string
}) {
  const { profile, authUser } = useAuth()
  const displayName = profile?.name ?? fallbackUser.name
  const displayHandle = profile?.handle ?? fallbackUser.handle
  const displayAvatar = profile?.avatar_url ?? fallbackUser.avatar
  const [section, setSection] = useState<Section>('main')
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pushNotif: true,
    emailNotif: false,
    groupNotif: true,
    postNotif: true,
    privateAccount: false,
    showActivity: true,
    showLocation: false,
    darkMode: false,
    reduceMotion: false,
    showOnlineStatus: true,
  })

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  const sectionTitle: Record<Section, string> = {
    main: 'Configurações',
    conta: 'Conta',
    notificacoes: 'Notificações',
    privacidade: 'Privacidade',
    aparencia: 'Aparência',
  }

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={section === 'main' ? onBack : () => setSection('main')}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">{sectionTitle[section]}</span>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">

        {/* ---- MAIN ---- */}
        {section === 'main' && (
          <>
            {/* User card */}
            <div className="mb-5 flex items-center gap-4 rounded-[18px] bg-surface px-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-semibold text-ink leading-tight">{displayName}</p>
                <p className="text-[14px] text-neutral-500">{displayHandle}</p>
                {isAdmin && (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold text-secondary-600">
                    <Shield size={12} /> Admin · acesso total
                  </p>
                )}
                {authUser?.email && (
                  <p className="mt-1 text-[12px] text-neutral-400">{authUser.email}</p>
                )}
              </div>
            </div>

            <SectionLabel>Conta</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={User} label="Editar perfil" subtitle="Nome, foto e bio" onClick={() => setSection('conta')} />
              <RowLink icon={AtSign} label="Nome de usuário" subtitle={displayHandle} onClick={() => setSection('conta')} />
              <RowLink icon={Globe} label="Idioma" subtitle="Português (BR)" onClick={() => setSection('conta')} />
            </div>

            <SectionLabel>Preferências</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={Bell} label="Notificações" onClick={() => setSection('notificacoes')} />
              <RowLink icon={Lock} label="Privacidade" onClick={() => setSection('privacidade')} />
              <RowLink icon={Palette} label="Aparência" onClick={() => setSection('aparencia')} />
            </div>

            <SectionLabel>Suporte</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={HelpCircle} label="Ajuda e suporte" />
              <RowLink icon={Shield} label="Termos e privacidade" />
              <RowLink icon={Smartphone} label="Sobre o Gooday" subtitle="Versão 1.0.0" />
            </div>

            <div className="mt-5 space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={LogOut} label="Sair da conta" onClick={onLogout} danger />
              <RowLink icon={Trash2} label="Excluir conta" danger />
            </div>
          </>
        )}

        {/* ---- CONTA ---- */}
        {section === 'conta' && (
          <>
            <SectionLabel>Informações pessoais</SectionLabel>
            <div className="space-y-3">
              {[
                { label: 'Nome completo', value: 'Marcos Vinícius' },
                { label: 'Nome de usuário', value: '@marcos_v' },
                { label: 'E-mail', value: 'marcos@gooday.app' },
                { label: 'Telefone', value: '+55 11 99999-0000' },
                { label: 'Localização', value: 'São Paulo, SP' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[14px] bg-surface px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">{label}</p>
                  <p className="mt-1 text-[15px] text-ink">{value}</p>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-[14px] bg-secondary-500 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-secondary-600">
              Salvar alterações
            </button>
          </>
        )}

        {/* ---- NOTIFICAÇÕES ---- */}
        {section === 'notificacoes' && (
          <>
            <SectionLabel>Push</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Bell} label="Notificações push" subtitle="Ativar todas" on={toggles.pushNotif} onToggle={() => toggle('pushNotif')} />
              <RowToggle icon={User} label="Novos seguidores" on={toggles.postNotif} onToggle={() => toggle('postNotif')} />
              <RowToggle icon={Globe} label="Atividade nos grupos" on={toggles.groupNotif} onToggle={() => toggle('groupNotif')} />
            </div>
            <SectionLabel>E-mail</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Bell} label="Resumo semanal" subtitle="Receba um resumo por e-mail" on={toggles.emailNotif} onToggle={() => toggle('emailNotif')} />
            </div>
          </>
        )}

        {/* ---- PRIVACIDADE ---- */}
        {section === 'privacidade' && (
          <>
            <SectionLabel>Visibilidade</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Lock} label="Conta privada" subtitle="Apenas seguidores aprovados veem seu conteúdo" on={toggles.privateAccount} onToggle={() => toggle('privateAccount')} />
              <RowToggle icon={Eye} label="Status de atividade" subtitle="Mostrar quando você está online" on={toggles.showOnlineStatus} onToggle={() => toggle('showOnlineStatus')} />
              <RowToggle icon={Globe} label="Mostrar localização" on={toggles.showLocation} onToggle={() => toggle('showLocation')} />
            </div>
            <SectionLabel>Dados</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={Shield} label="Baixar meus dados" />
              <RowLink icon={Trash2} label="Limpar histórico de busca" danger />
            </div>
          </>
        )}

        {/* ---- APARÊNCIA ---- */}
        {section === 'aparencia' && (
          <>
            <SectionLabel>Tema</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Moon} label="Modo escuro" subtitle="Em breve" on={toggles.darkMode} onToggle={() => toggle('darkMode')} />
              <RowToggle icon={Smartphone} label="Reduzir animações" on={toggles.reduceMotion} onToggle={() => toggle('reduceMotion')} />
            </div>
            <SectionLabel>Tamanho do texto</SectionLabel>
            <div className="rounded-[18px] bg-surface px-4 py-4">
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-neutral-400">A</span>
                <input type="range" min={1} max={5} defaultValue={3} className="flex-1 accent-secondary-500" />
                <span className="text-[18px] font-semibold text-ink">A</span>
              </div>
              <p className="mt-2 text-center text-[14px] text-neutral-500">Tamanho padrão</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
