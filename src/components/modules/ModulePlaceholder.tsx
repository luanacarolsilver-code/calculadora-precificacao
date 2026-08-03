import { Construction } from 'lucide-react'
import type { AppModuleItem } from '../../core/navigation'

interface ModulePlaceholderProps {
  module: AppModuleItem
}

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const Icon = module.icon

  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center px-6 py-10">
      <div className="glass-card w-full max-w-xl space-y-5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9d4edd]/30 to-[#e050a2]/30 text-[var(--color-primary)]">
          <Icon className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-primary)]">
            {module.label}
          </h2>
          <p className="text-[var(--text-secondary)]">{module.description}</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)]">
          <Construction className="h-3.5 w-3.5" />
          Módulo em desenvolvimento — disponível em breve
        </div>
      </div>
    </div>
  )
}
