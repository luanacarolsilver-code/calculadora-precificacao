import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function GlassCard({
  children,
  className = '',
  title,
  description,
}: GlassCardProps) {
  return (
    <section className={`glass-card p-5 md:p-6 ${className}`}>
      {(title || description) && (
        <header className="mb-4 space-y-1">
          {title ? (
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </section>
  )
}
