import { useEffect } from 'react'
import { appModules } from '../../core/navigation'
import { useAppStore } from '../../store/useAppStore'
import { usePricingStore } from '../../store/usePricingStore'
import { ModulePlaceholder } from '../modules/ModulePlaceholder'
import { NewProposalWorkspace } from '../modules/NewProposalWorkspace'
import { OfficeSettings } from '../modules/OfficeSettings'
import { MainSidebar } from './MainSidebar'

export function AppShell() {
  const activeModule = useAppStore((s) => s.activeModule)
  const theme = usePricingStore((s) => s.theme)

  useEffect(() => {
    document.body.classList.remove('dark-theme', 'light-theme')
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme')
  }, [theme])

  const activeModuleMeta = appModules.find((module) => module.id === activeModule)

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="glow-bg" aria-hidden />

      <MainSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-hidden">
          {activeModule === 'servicos' ? (
            <NewProposalWorkspace />
          ) : activeModule === 'configuracoes' ? (
            <OfficeSettings />
          ) : activeModuleMeta ? (
            <div className="h-full overflow-y-auto">
              <ModulePlaceholder module={activeModuleMeta} />
            </div>
          ) : null}
        </main>

        {activeModule !== 'servicos' && activeModule !== 'configuracoes' ? (
          <footer className="border-t border-[var(--border-glass)] px-4 py-3 text-center text-xs text-[var(--text-muted)] md:px-6">
            Jornada dos Escritórios de Sucesso © 2026
          </footer>
        ) : null}
      </div>
    </div>
  )
}
