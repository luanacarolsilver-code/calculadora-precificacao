import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createDefaultActiveProposal,
  createDefaultOfficeConfig,
  withRecalculatedHourlyRate,
} from '../core/defaults'
import { calculateProposalPricing } from '../core/pricing-engine'
import type {
  ActiveProposal,
  ClientInfo,
  CostCategory,
  FixedCost,
  OfficeConfig,
  ProjectPhase,
  ProposalCalculations,
  ProposalStatus,
  SavedProposal,
  TaxMethod,
  TeamRole,
  TeamRoleKey,
  ThemeMode,
  VariableCost,
} from '../core/types'
import { normalizePersistedState } from './normalizeState'

export interface PricingStoreState {
  officeConfig: OfficeConfig
  activeProposal: ActiveProposal
  savedProposals: SavedProposal[]
  theme: ThemeMode
  isReportOpen: boolean
}

export interface PricingStoreActions {
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setReportOpen: (open: boolean) => void

  // Office config
  updateFixedCost: (id: string, value: number) => void
  addFixedCost: (input: { name: string; category: CostCategory; value: number }) => void
  deleteFixedCost: (id: string) => void
  setWorkdays: (workdays: number) => void
  updateTeamRole: (role: TeamRoleKey, patch: Partial<TeamRole>) => void
  updateDefaultPhase: (id: string, patch: Partial<Pick<ProjectPhase, 'name' | 'hours'>>) => void
  addDefaultPhase: (input: { name: string; hours: number }) => void
  deleteDefaultPhase: (id: string) => void
  setDefaultTaxRate: (rate: number) => void
  setDefaultTaxMethod: (method: TaxMethod) => void
  resetOfficeConfig: () => void

  // Active proposal
  updateClientInfo: (patch: Partial<ClientInfo>) => void
  setProposalStatus: (status: ProposalStatus) => void
  togglePhaseSelection: (phaseId: string) => void
  updateSelectedPhaseHours: (id: string, hours: number) => void
  addCustomPhaseToProposal: (input: { name: string; hours: number }) => void
  removePhaseFromProposal: (id: string) => void
  syncPhasesFromCatalog: () => void
  updateVariableCost: (id: string, value: number) => void
  addVariableCost: (input: { name: string; value: number }) => void
  deleteVariableCost: (id: string) => void
  setProfitMargin: (profitMargin: number) => void
  setProposalTaxRate: (taxRate: number) => void
  setProposalTaxMethod: (taxMethod: TaxMethod) => void
  resetActiveProposal: () => void
  loadProposal: (id: string) => void
  saveCurrentProposal: (name?: string) => void
  deleteSavedProposal: (id: string) => void

  getFinalCalculations: () => ProposalCalculations
}

export type PricingStore = PricingStoreState & PricingStoreActions

function patchOffice(
  officeConfig: OfficeConfig,
  updater: (office: OfficeConfig) => OfficeConfig,
): OfficeConfig {
  return withRecalculatedHourlyRate(updater(officeConfig))
}

const initialOffice = createDefaultOfficeConfig()
const initialProposal = createDefaultActiveProposal(initialOffice)

export const usePricingStore = create<PricingStore>()(
  persist(
    (set, get) => ({
      officeConfig: initialOffice,
      activeProposal: initialProposal,
      savedProposals: [],
      theme: 'dark',
      isReportOpen: false,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setReportOpen: (open) => set({ isReportOpen: open }),

      updateFixedCost: (id, value) =>
        set((state) => ({
          officeConfig: patchOffice(state.officeConfig, (office) => ({
            ...office,
            fixedCosts: office.fixedCosts.map((cost) =>
              cost.id === id ? { ...cost, value: Math.max(0, value) } : cost,
            ),
          })),
        })),

      addFixedCost: ({ name, category, value }) => {
        const trimmed = name.trim()
        if (!trimmed) return

        const item: FixedCost = {
          id: `fc-custom-${Date.now()}`,
          name: trimmed,
          category,
          value: Math.max(0, value),
        }

        set((state) => ({
          officeConfig: patchOffice(state.officeConfig, (office) => ({
            ...office,
            fixedCosts: [...office.fixedCosts, item],
          })),
        }))
      },

      deleteFixedCost: (id) =>
        set((state) => ({
          officeConfig: patchOffice(state.officeConfig, (office) => ({
            ...office,
            fixedCosts: office.fixedCosts.filter((cost) => cost.id !== id),
          })),
        })),

      setWorkdays: (workdays) =>
        set((state) => ({
          officeConfig: patchOffice(state.officeConfig, (office) => ({
            ...office,
            productivity: {
              ...office.productivity,
              workdays: Math.max(1, workdays),
            },
          })),
        })),

      updateTeamRole: (role, patch) =>
        set((state) => ({
          officeConfig: patchOffice(state.officeConfig, (office) => {
            const current = office.productivity.team[role]
            return {
              ...office,
              productivity: {
                ...office.productivity,
                team: {
                  ...office.productivity.team,
                  [role]: {
                    hours:
                      patch.hours !== undefined
                        ? Math.max(0, patch.hours)
                        : current.hours,
                    qty:
                      patch.qty !== undefined ? Math.max(0, patch.qty) : current.qty,
                  },
                },
              },
            }
          }),
        })),

      updateDefaultPhase: (id, patch) =>
        set((state) => ({
          officeConfig: {
            ...state.officeConfig,
            defaultPhases: state.officeConfig.defaultPhases.map((phase) =>
              phase.id === id
                ? {
                    ...phase,
                    name: patch.name?.trim() || phase.name,
                    hours:
                      patch.hours !== undefined
                        ? Math.max(0, patch.hours)
                        : phase.hours,
                  }
                : phase,
            ),
          },
        })),

      addDefaultPhase: ({ name, hours }) => {
        const trimmed = name.trim()
        if (!trimmed) return

        const item: ProjectPhase = {
          id: `ph-catalog-${Date.now()}`,
          name: trimmed,
          hours: Math.max(0, hours),
        }

        set((state) => ({
          officeConfig: {
            ...state.officeConfig,
            defaultPhases: [...state.officeConfig.defaultPhases, item],
          },
        }))
      },

      deleteDefaultPhase: (id) =>
        set((state) => ({
          officeConfig: {
            ...state.officeConfig,
            defaultPhases: state.officeConfig.defaultPhases.filter(
              (phase) => phase.id !== id,
            ),
          },
        })),

      setDefaultTaxRate: (rate) =>
        set((state) => ({
          officeConfig: {
            ...state.officeConfig,
            defaultTaxRate: Math.max(0, rate),
          },
        })),

      setDefaultTaxMethod: (method) =>
        set((state) => ({
          officeConfig: {
            ...state.officeConfig,
            defaultTaxMethod: method,
          },
        })),

      resetOfficeConfig: () =>
        set({
          officeConfig: createDefaultOfficeConfig(),
        }),

      updateClientInfo: (patch) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            clientInfo: {
              ...state.activeProposal.clientInfo,
              ...patch,
            },
          },
        })),

      setProposalStatus: (status) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            clientInfo: {
              ...state.activeProposal.clientInfo,
              status,
            },
          },
        })),

      togglePhaseSelection: (phaseId) =>
        set((state) => {
          const exists = state.activeProposal.selectedPhases.some(
            (phase) => phase.id === phaseId,
          )

          if (exists) {
            return {
              activeProposal: {
                ...state.activeProposal,
                selectedPhases: state.activeProposal.selectedPhases.filter(
                  (phase) => phase.id !== phaseId,
                ),
              },
            }
          }

          const catalogPhase = state.officeConfig.defaultPhases.find(
            (phase) => phase.id === phaseId,
          )
          if (!catalogPhase) return state

          return {
            activeProposal: {
              ...state.activeProposal,
              selectedPhases: [
                ...state.activeProposal.selectedPhases,
                structuredClone(catalogPhase),
              ],
            },
          }
        }),

      updateSelectedPhaseHours: (id, hours) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            selectedPhases: state.activeProposal.selectedPhases.map((phase) =>
              phase.id === id ? { ...phase, hours: Math.max(0, hours) } : phase,
            ),
          },
        })),

      addCustomPhaseToProposal: ({ name, hours }) => {
        const trimmed = name.trim()
        if (!trimmed) return

        const item: ProjectPhase = {
          id: `ph-proposal-${Date.now()}`,
          name: trimmed,
          hours: Math.max(0, hours),
        }

        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            selectedPhases: [...state.activeProposal.selectedPhases, item],
          },
        }))
      },

      removePhaseFromProposal: (id) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            selectedPhases: state.activeProposal.selectedPhases.filter(
              (phase) => phase.id !== id,
            ),
          },
        })),

      syncPhasesFromCatalog: () =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            selectedPhases: structuredClone(state.officeConfig.defaultPhases),
          },
        })),

      updateVariableCost: (id, value) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            variableCosts: state.activeProposal.variableCosts.map((cost) =>
              cost.id === id ? { ...cost, value: Math.max(0, value) } : cost,
            ),
          },
        })),

      addVariableCost: ({ name, value }) => {
        const trimmed = name.trim()
        if (!trimmed) return

        const item: VariableCost = {
          id: `vc-custom-${Date.now()}`,
          name: trimmed,
          value: Math.max(0, value),
        }

        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            variableCosts: [...state.activeProposal.variableCosts, item],
          },
        }))
      },

      deleteVariableCost: (id) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            variableCosts: state.activeProposal.variableCosts.filter(
              (cost) => cost.id !== id,
            ),
          },
        })),

      setProfitMargin: (profitMargin) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            profitMargin: Math.max(0, profitMargin),
          },
        })),

      setProposalTaxRate: (taxRate) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            taxRate: Math.max(0, taxRate),
          },
        })),

      setProposalTaxMethod: (taxMethod) =>
        set((state) => ({
          activeProposal: {
            ...state.activeProposal,
            taxMethod,
          },
        })),

      resetActiveProposal: () =>
        set((state) => ({
          activeProposal: createDefaultActiveProposal(state.officeConfig),
          isReportOpen: false,
        })),

      loadProposal: (id) => {
        const found = get().savedProposals.find((item) => item.id === id)
        if (!found) return

        set({
          activeProposal: structuredClone(found.proposalSnapshot),
          isReportOpen: false,
        })
      },

      saveCurrentProposal: (name) => {
        const state = get()
        const calculations = calculateProposalPricing(
          state.officeConfig.calculatedHourlyRate,
          state.activeProposal,
        )
        const clientName =
          name?.trim() ||
          state.activeProposal.clientInfo.name.trim() ||
          'Proposta sem cliente'

        const saved: SavedProposal = {
          id: `proposal-${Date.now()}`,
          name: clientName,
          date: new Date().toLocaleDateString('pt-BR'),
          category: state.activeProposal.clientInfo.category,
          status: state.activeProposal.clientInfo.status,
          finalPrice: calculations.finalPrice,
          hours: calculations.totalProjectHours,
          hourlyRate: calculations.hourlyRate,
          officeHourlyRate: state.officeConfig.calculatedHourlyRate,
          proposalSnapshot: structuredClone(state.activeProposal),
        }

        set({
          savedProposals: [saved, ...state.savedProposals],
        })
      },

      deleteSavedProposal: (id) =>
        set((state) => ({
          savedProposals: state.savedProposals.filter((item) => item.id !== id),
        })),

      getFinalCalculations: () => {
        const state = get()
        return calculateProposalPricing(
          state.officeConfig.calculatedHourlyRate,
          state.activeProposal,
        )
      },
    }),
    {
      name: 'precificacao_state',
      version: 3,
      partialize: (state) => ({
        officeConfig: state.officeConfig,
        activeProposal: state.activeProposal,
        savedProposals: state.savedProposals,
        theme: state.theme,
      }),
      migrate: (persistedState, fromVersion) => {
        console.info(
          `[usePricingStore] Migrating localStorage schema v${fromVersion} → v3`,
        )
        return normalizePersistedState(persistedState)
      },
      merge: (persisted, current) => {
        const normalized = normalizePersistedState(persisted)
        return {
          ...current,
          ...normalized,
        }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[usePricingStore] Rehydration failed:', error)
          try {
            localStorage.removeItem('precificacao_state')
          } catch {
            /* ignore */
          }
          return
        }

        if (!state?.officeConfig || !state.activeProposal) {
          console.warn(
            '[usePricingStore] Incomplete state after rehydrate — resetting defaults',
          )
          const officeConfig = createDefaultOfficeConfig()
          usePricingStore.setState({
            officeConfig,
            activeProposal: createDefaultActiveProposal(officeConfig),
            savedProposals: [],
            isReportOpen: false,
          })
        }
      },
    },
  ),
)

/** Imperative helper for non-React callers (actions). Prefer useMemo in components. */
export function selectFinalCalculations(state: PricingStore): ProposalCalculations {
  return calculateProposalPricing(
    state.officeConfig.calculatedHourlyRate,
    state.activeProposal,
  )
}
