import {
  createDefaultActiveProposal,
  createDefaultOfficeConfig,
  withRecalculatedHourlyRate,
} from '../core/defaults'
import type {
  ActiveProposal,
  ClientInfo,
  CostCategory,
  FixedCost,
  OfficeConfig,
  ProductivityConfig,
  ProjectCategory,
  ProjectPhase,
  ProposalStatus,
  SavedProposal,
  TaxMethod,
  Team,
  ThemeMode,
  VariableCost,
} from '../core/types'

export interface PersistedPricingState {
  officeConfig: OfficeConfig
  activeProposal: ActiveProposal
  savedProposals: SavedProposal[]
  theme: ThemeMode
  isReportOpen: boolean
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Interiores',
  'Arquitetônico',
  'Reforma',
  'Consultoria',
]

const PROPOSAL_STATUSES: ProposalStatus[] = [
  'Rascunho',
  'Enviado',
  'Aceito',
  'Em Negociação',
  'Cancelado',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function isLegacyFlatState(value: unknown): boolean {
  if (!isRecord(value)) return false
  return Array.isArray(value.fixedCosts) && !isRecord(value.officeConfig)
}

function normalizeTeam(raw: unknown, fallback: Team): Team {
  if (!isRecord(raw)) return structuredClone(fallback)

  const role = (key: keyof Team) => {
    const item = isRecord(raw[key]) ? raw[key] : {}
    return {
      hours: asNumber(item.hours, fallback[key].hours),
      qty: asNumber(item.qty, fallback[key].qty),
    }
  }

  return {
    owner: role('owner'),
    collaborators: role('collaborators'),
    interns: role('interns'),
  }
}

function normalizeProductivity(
  raw: unknown,
  fallback: ProductivityConfig,
): ProductivityConfig {
  if (!isRecord(raw)) return structuredClone(fallback)

  return {
    workdays: Math.max(1, asNumber(raw.workdays, fallback.workdays)),
    team: normalizeTeam(raw.team, fallback.team),
  }
}

export function normalizeOfficeConfig(raw: unknown): OfficeConfig {
  const defaults = createDefaultOfficeConfig()

  if (!isRecord(raw)) {
    return defaults
  }

  const fixedCosts: FixedCost[] = Array.isArray(raw.fixedCosts)
    ? raw.fixedCosts.filter(isRecord).map((cost, index) => {
        const category: CostCategory =
          cost.category === 'infra' ||
          cost.category === 'equipe' ||
          cost.category === 'operacional' ||
          cost.category === 'conselhos'
            ? cost.category
            : 'operacional'

        return {
          id: asString(cost.id, `fc-migrated-${index}`),
          name: asString(cost.name, 'Custo'),
          category,
          value: Math.max(0, asNumber(cost.value, 0)),
        }
      })
    : defaults.fixedCosts

  const productivity = normalizeProductivity(raw.productivity, defaults.productivity)

  const mapPhases = (list: unknown[]): ProjectPhase[] =>
    list.filter(isRecord).map((phase, index) => ({
      id: asString(phase.id, `ph-migrated-${index}`),
      name: asString(phase.name, 'Etapa'),
      hours: Math.max(0, asNumber(phase.hours, 0)),
    }))

  const defaultPhases: ProjectPhase[] = Array.isArray(raw.defaultPhases)
    ? mapPhases(raw.defaultPhases)
    : Array.isArray(raw.projectPhases)
      ? mapPhases(raw.projectPhases)
      : defaults.defaultPhases

  const partial: OfficeConfig = {
    fixedCosts: fixedCosts.length > 0 ? fixedCosts : defaults.fixedCosts,
    productivity,
    calculatedHourlyRate: 0,
    defaultPhases: defaultPhases.length > 0 ? defaultPhases : defaults.defaultPhases,
    defaultTaxRate: Math.max(
      0,
      asNumber(raw.defaultTaxRate ?? raw.taxRate, defaults.defaultTaxRate),
    ),
    defaultTaxMethod:
      raw.defaultTaxMethod === 'outside' || raw.taxMethod === 'outside'
        ? 'outside'
        : 'inside',
  }

  return withRecalculatedHourlyRate(partial)
}

function normalizeClientInfo(raw: unknown, fallback: ClientInfo): ClientInfo {
  if (!isRecord(raw)) return { ...fallback }

  const category = asString(raw.category, fallback.category) as ProjectCategory
  const status = asString(raw.status, fallback.status) as ProposalStatus

  return {
    name: asString(raw.name, fallback.name),
    category: PROJECT_CATEGORIES.includes(category) ? category : fallback.category,
    date: asString(raw.date, fallback.date),
    status: PROPOSAL_STATUSES.includes(status) ? status : fallback.status,
  }
}

export function normalizeActiveProposal(
  raw: unknown,
  office: OfficeConfig,
): ActiveProposal {
  const defaults = createDefaultActiveProposal(office)

  if (!isRecord(raw)) {
    return defaults
  }

  const mapPhases = (list: unknown[]): ProjectPhase[] =>
    list.filter(isRecord).map((phase, index) => ({
      id: asString(phase.id, `ph-proposal-${index}`),
      name: asString(phase.name, 'Etapa'),
      hours: Math.max(0, asNumber(phase.hours, 0)),
    }))

  const selectedPhases: ProjectPhase[] = Array.isArray(raw.selectedPhases)
    ? mapPhases(raw.selectedPhases)
    : Array.isArray(raw.projectPhases)
      ? mapPhases(raw.projectPhases)
      : defaults.selectedPhases

  const variableCosts: VariableCost[] = Array.isArray(raw.variableCosts)
    ? raw.variableCosts.filter(isRecord).map((cost, index) => ({
        id: asString(cost.id, `vc-migrated-${index}`),
        name: asString(cost.name, 'Custo variável'),
        value: Math.max(0, asNumber(cost.value, 0)),
      }))
    : defaults.variableCosts

  return {
    clientInfo: normalizeClientInfo(raw.clientInfo, defaults.clientInfo),
    selectedPhases,
    variableCosts,
    profitMargin: Math.max(0, asNumber(raw.profitMargin, defaults.profitMargin)),
    taxRate: Math.max(0, asNumber(raw.taxRate, office.defaultTaxRate)),
    taxMethod: (raw.taxMethod === 'outside' || raw.taxMethod === 'inside'
      ? raw.taxMethod
      : office.defaultTaxMethod) as TaxMethod,
  }
}

function normalizeSavedProposals(
  raw: unknown,
  office: OfficeConfig,
): SavedProposal[] {
  if (!Array.isArray(raw)) return []

  return raw.filter(isRecord).map((item, index) => {
    const snapshot = normalizeActiveProposal(item.proposalSnapshot, office)
    return {
      id: asString(item.id, `proposal-migrated-${index}`),
      name: asString(item.name, snapshot.clientInfo.name || 'Proposta'),
      date: asString(item.date, new Date().toLocaleDateString('pt-BR')),
      category: snapshot.clientInfo.category,
      status: snapshot.clientInfo.status,
      finalPrice: Math.max(0, asNumber(item.finalPrice, 0)),
      hours: Math.max(0, asNumber(item.hours, 0)),
      hourlyRate: Math.max(0, asNumber(item.hourlyRate, office.calculatedHourlyRate)),
      officeHourlyRate: Math.max(
        0,
        asNumber(item.officeHourlyRate, office.calculatedHourlyRate),
      ),
      proposalSnapshot: snapshot,
    }
  })
}

/**
 * Accepts either the new nested schema or the legacy flat calculator state
 * and returns a safe persisted state slice for rehydration.
 */
export function normalizePersistedState(persisted: unknown): PersistedPricingState {
  try {
    if (!isRecord(persisted) || isLegacyFlatState(persisted)) {
      if (isLegacyFlatState(persisted) && isRecord(persisted)) {
        const officeConfig = normalizeOfficeConfig({
          fixedCosts: persisted.fixedCosts,
          productivity: {
            workdays: persisted.workdays,
            team: persisted.team,
          },
          defaultPhases: persisted.projectPhases,
          defaultTaxRate: persisted.taxRate,
          defaultTaxMethod: persisted.taxMethod,
        })

        return {
          officeConfig,
          activeProposal: normalizeActiveProposal(
            {
              selectedPhases: persisted.projectPhases,
              variableCosts: persisted.variableCosts,
              profitMargin: persisted.profitMargin,
              taxRate: persisted.taxRate,
              taxMethod: persisted.taxMethod,
            },
            officeConfig,
          ),
          savedProposals: [],
          theme: persisted.theme === 'light' ? 'light' : 'dark',
          isReportOpen: false,
        }
      }

      const officeConfig = createDefaultOfficeConfig()
      return {
        officeConfig,
        activeProposal: createDefaultActiveProposal(officeConfig),
        savedProposals: [],
        theme: 'dark',
        isReportOpen: false,
      }
    }

    const officeConfig = normalizeOfficeConfig(persisted.officeConfig)
    const activeProposal = normalizeActiveProposal(
      persisted.activeProposal,
      officeConfig,
    )

    return {
      officeConfig,
      activeProposal,
      savedProposals: normalizeSavedProposals(persisted.savedProposals, officeConfig),
      theme: persisted.theme === 'light' ? 'light' : 'dark',
      isReportOpen: false,
    }
  } catch (error) {
    console.error('[normalizePersistedState] Failed, resetting to defaults:', error)
    const officeConfig = createDefaultOfficeConfig()
    return {
      officeConfig,
      activeProposal: createDefaultActiveProposal(officeConfig),
      savedProposals: [],
      theme: 'dark',
      isReportOpen: false,
    }
  }
}
