export type CostCategory = 'infra' | 'equipe' | 'operacional' | 'conselhos'

export type TaxMethod = 'inside' | 'outside'

export type ThemeMode = 'light' | 'dark'

export type ProjectCategory =
  | 'Interiores'
  | 'Arquitetônico'
  | 'Reforma'
  | 'Consultoria'

export type ProposalStatus =
  | 'Rascunho'
  | 'Enviado'
  | 'Aceito'
  | 'Em Negociação'
  | 'Cancelado'

export interface FixedCost {
  id: string
  name: string
  category: CostCategory
  value: number
}

export interface TeamRole {
  hours: number
  qty: number
}

export interface Team {
  owner: TeamRole
  collaborators: TeamRole
  interns: TeamRole
}

export type TeamRoleKey = keyof Team

export interface ProductivityConfig {
  workdays: number
  team: Team
}

export interface ProjectPhase {
  id: string
  name: string
  hours: number
}

export interface VariableCost {
  id: string
  name: string
  value: number
}

export interface OfficeConfig {
  fixedCosts: FixedCost[]
  productivity: ProductivityConfig
  /** Derived: totalFixed / totalCapacityHours */
  calculatedHourlyRate: number
  defaultPhases: ProjectPhase[]
  defaultTaxRate: number
  defaultTaxMethod: TaxMethod
}

export interface ClientInfo {
  name: string
  category: ProjectCategory
  date: string
  status: ProposalStatus
}

export interface ActiveProposal {
  clientInfo: ClientInfo
  selectedPhases: ProjectPhase[]
  variableCosts: VariableCost[]
  profitMargin: number
  /** Snapshot of tax settings for this proposal (seeded from office defaults). */
  taxRate: number
  taxMethod: TaxMethod
}

export interface PhaseCostBreakdown {
  id: string
  name: string
  hours: number
  cost: number
}

export interface OfficeMetrics {
  totalFixedCosts: number
  capacityHours: number
  calculatedHourlyRate: number
}

export interface ProposalCalculations {
  hourlyRate: number
  totalProjectHours: number
  projectHoursCost: number
  totalVariableCosts: number
  projectCost: number
  profitAmount: number
  subtotalWithProfit: number
  taxAmount: number
  finalPrice: number
  taxMethod: TaxMethod
  profitMargin: number
  taxRate: number
  phaseCosts: PhaseCostBreakdown[]
}

export interface SavedProposal {
  id: string
  name: string
  date: string
  category: ProjectCategory
  status: ProposalStatus
  finalPrice: number
  hours: number
  hourlyRate: number
  proposalSnapshot: ActiveProposal
  officeHourlyRate: number
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Interiores',
  'Arquitetônico',
  'Reforma',
  'Consultoria',
]

export const PROPOSAL_STATUSES: ProposalStatus[] = [
  'Rascunho',
  'Enviado',
  'Aceito',
  'Em Negociação',
  'Cancelado',
]
