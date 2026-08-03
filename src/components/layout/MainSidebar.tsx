import { Layers, Moon, Sun } from 'lucide-react'
import { APP_VERSION, appModules } from '../../core/navigation'
import { useAppStore } from '../../store/useAppStore'
import { usePricingStore } from '../../store/usePricingStore'

interface MainSidebarProps {
  className?: string
}

export function MainSidebar({ className = '' }: MainSidebarProps) {
  const activeModule = useAppStore((s) => s.activeModule)
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  const theme = usePricingStore((s) => s.theme)
  const toggleTheme = usePricingStore((s) => s.toggleTheme)

  return (
    <aside
      className={[
        'flex h-screen w-[260px] shrink-0 flex-col border-r border-white/10',
        'bg-[#12121a]/95 backdrop-blur-xl',
        className,
      ].join(' ')}
    >
      {/* Brand */}
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9d4edd] to-[#e050a2] shadow-[0_0_24px_rgba(157,78,221,0.45)]">
            <Layers className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-[family-name:var(--font-display)] text-[13px] font-semibold text-white">
              Jornada dos Escritórios
            </p>
            <p className="bg-gradient-to-r from-[#e050a2] to-[#ff6bcb] bg-clip-text text-[11px] font-extrabold tracking-[0.16em] text-transparent">
              DE SUCE$$O
            </p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 shadow-inner">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7b2cbf] to-[#e050a2] text-sm font-bold text-white shadow-[0_0_16px_rgba(224,80,162,0.35)]">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Olá, Arquiteto</p>
            <p className="truncate text-xs text-white/45">Escritório</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Menu principal">
        {appModules.map((item) => {
          const isActive = activeModule === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModule(item.id)}
              className={[
                'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-[#9d4edd] to-[#e050a2] text-white shadow-[0_8px_24px_rgba(157,78,221,0.35)]'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-[18px] w-[18px] shrink-0',
                  isActive ? 'text-white' : 'text-white/45 group-hover:text-white/80',
                ].join(' ')}
                strokeWidth={2}
              />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Version footer */}
      <div className="space-y-3 border-t border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        </button>
        <p className="text-center text-[11px] tracking-wide text-white/35">
          Versão {APP_VERSION}
        </p>
      </div>
    </aside>
  )
}
