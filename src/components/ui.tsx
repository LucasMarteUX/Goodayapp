import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { useState } from 'react'

/* Large CTA / standard buttons per design.md (§ buttons). */
export function Button({
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'lg' | 'md'
}) {
  const sizes = {
    // Large CTA: full pill, weight 600. Standard: radius 12, weight 600.
    lg: 'h-13 px-7 text-[16px] rounded-full',
    md: 'h-11 px-5 text-[15px] rounded-xl',
  }
  const variants = {
    // Flat pink CTA, white label — matches the reference. No elevation glow.
    primary: 'bg-accent-500 text-white font-semibold hover:bg-accent-600 active:scale-[0.99]',
    ghost: 'bg-transparent text-neutral-600 font-medium hover:bg-neutral-100',
    // Secondary action: filled neutral surface, no stroke.
    outline: 'bg-neutral-100 text-ink font-semibold hover:bg-neutral-200',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 [transition-timing-function:var(--ease-standard)] disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* Inputs: h 52-56, radius 16, canvas fill, transparent border → focus accent. */
export function Field({
  label,
  icon,
  trailing,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: ReactNode; trailing?: ReactNode }) {
  return (
    <label className={`group block ${className}`}>
      {label && (
        <span className="mb-1.5 block pl-1 text-[13px] font-medium text-neutral-500">{label}</span>
      )}
      <div className="relative flex items-center">
        {icon && <span className="pointer-events-none absolute left-4 text-neutral-400">{icon}</span>}
        <input
          className={`h-14 w-full rounded-lg border border-transparent bg-neutral-100 text-[16px] text-ink placeholder:text-neutral-400 outline-none transition-colors duration-200 focus:border-accent-500 focus:bg-neutral-50 focus:ring-4 focus:ring-accent-200/50 ${
            icon ? 'pl-11' : 'pl-4'
          } ${trailing ? 'pr-11' : 'pr-4'}`}
          {...props}
        />
        {trailing && <span className="absolute right-4 text-neutral-400">{trailing}</span>}
      </div>
    </label>
  )
}

export function Avatar({
  src,
  alt = '',
  size = 40,
  ring,
  className = '',
}: {
  src: string
  alt?: string
  size?: number
  ring?: 'accent' | 'seen' | 'surface'
  className?: string
}) {
  const rings = {
    accent: 'ring-2 ring-accent-500 ring-offset-2 ring-offset-surface',
    seen: 'ring-2 ring-neutral-300 ring-offset-2 ring-offset-surface',
    surface: 'ring-2 ring-surface',
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full object-cover ${ring ? rings[ring] : ''} ${className}`}
    />
  )
}

export function AvatarStack({ srcs, size = 26 }: { srcs: string[]; size?: number }) {
  return (
    <div className="flex items-center">
      {srcs.map((s, i) => (
        <img
          key={i}
          src={s}
          alt=""
          style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.34, zIndex: srcs.length - i }}
          className="rounded-full object-cover ring-2 ring-surface"
        />
      ))}
    </div>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 text-[13px] font-medium text-accent-700">
      {children}
    </span>
  )
}

export function Checkbox({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="inline-flex items-center gap-2.5 text-[14px] text-neutral-600"
    >
      <span
        className={`grid h-[22px] w-[22px] place-items-center rounded-[5px] transition-colors ${
          on ? 'bg-accent-500' : 'bg-neutral-200'
        }`}
      >
        {on && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="m2.5 6 2.3 2.5L9.5 3.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

export function IconButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`grid h-10 w-10 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
