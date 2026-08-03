import { create } from 'zustand'
import type { AppModuleId } from '../core/navigation'

interface AppStore {
  activeModule: AppModuleId
  setActiveModule: (moduleId: AppModuleId) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeModule: 'servicos',
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
}))
