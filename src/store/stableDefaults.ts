import type {
  ClientInfo,
  FixedCost,
  ProductivityConfig,
  ProjectPhase,
  SavedProposal,
  VariableCost,
} from '../core/types'

/** Stable empty references for Zustand selector fallbacks (never allocate inline). */
export const EMPTY_FIXED_COSTS: FixedCost[] = []
export const EMPTY_PHASES: ProjectPhase[] = []
export const EMPTY_VARIABLE_COSTS: VariableCost[] = []
export const EMPTY_SAVED_PROPOSALS: SavedProposal[] = []

export const DEFAULT_PRODUCTIVITY: ProductivityConfig = {
  workdays: 20,
  team: {
    owner: { hours: 0, qty: 0 },
    collaborators: { hours: 0, qty: 0 },
    interns: { hours: 0, qty: 0 },
  },
}

export const DEFAULT_CLIENT_INFO: ClientInfo = {
  name: '',
  category: 'Arquitetônico',
  date: '',
  status: 'Rascunho',
}
