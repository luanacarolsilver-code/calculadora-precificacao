import type {
  ActiveProposal,
  FixedCost,
  OfficeMetrics,
  ProductivityConfig,
  ProposalCalculations,
  Team,
} from './types'

function toNumber(value: number): number {
  return Number.isFinite(value) ? value : 0
}

function computeCapacityHours(team: Team | undefined, workdays: number): number {
  if (!team) return 0

  const days = Math.max(0, toNumber(workdays))
  const roles = [team.owner, team.collaborators, team.interns]

  return roles.reduce((sum, role) => {
    if (!role) return sum
    return sum + toNumber(role.hours) * toNumber(role.qty) * days
  }, 0)
}

/** Office-level metrics from fixed costs + productivity. */
export function calculateOfficeMetrics(
  fixedCosts: FixedCost[] | undefined,
  productivity: ProductivityConfig | undefined,
): OfficeMetrics {
  const costs = Array.isArray(fixedCosts) ? fixedCosts : []
  const totalFixedCosts = costs.reduce(
    (sum, cost) => sum + toNumber(cost?.value),
    0,
  )
  const capacityHours = computeCapacityHours(
    productivity?.team,
    productivity?.workdays ?? 0,
  )
  const calculatedHourlyRate =
    capacityHours > 0 ? totalFixedCosts / capacityHours : 0

  return {
    totalFixedCosts,
    capacityHours,
    calculatedHourlyRate,
  }
}

/**
 * Proposal pricing combining office hourly rate with proposal hours/margin/tax.
 * Edge cases:
 * - hourlyRate 0 when capacity is zero
 * - taxRate >= 100% with inside method → tax = 0, final = subtotal
 */
export function calculateProposalPricing(
  hourlyRate: number,
  proposal: ActiveProposal | undefined | null,
): ProposalCalculations {
  const rate = toNumber(hourlyRate)
  const phases = Array.isArray(proposal?.selectedPhases)
    ? proposal.selectedPhases
    : []
  const variables = Array.isArray(proposal?.variableCosts)
    ? proposal.variableCosts
    : []

  const totalProjectHours = phases.reduce(
    (sum, phase) => sum + toNumber(phase?.hours),
    0,
  )
  const projectHoursCost = totalProjectHours * rate

  const phaseCosts = phases.map((phase) => {
    const hours = toNumber(phase?.hours)
    return {
      id: phase?.id ?? 'unknown',
      name: phase?.name ?? 'Etapa',
      hours,
      cost: hours * rate,
    }
  })

  const totalVariableCosts = variables.reduce(
    (sum, cost) => sum + toNumber(cost?.value),
    0,
  )

  const projectCost = projectHoursCost + totalVariableCosts
  const profitMargin = toNumber(proposal?.profitMargin ?? 0)
  const taxRate = toNumber(proposal?.taxRate ?? 0)
  const taxMethod = proposal?.taxMethod === 'outside' ? 'outside' : 'inside'

  const profitPct = profitMargin / 100
  const taxPct = taxRate / 100

  const profitAmount = projectCost * profitPct
  const subtotalWithProfit = projectCost * (1 + profitPct)

  let taxAmount = 0
  let finalPrice = 0

  if (taxMethod === 'inside') {
    if (taxPct < 1) {
      finalPrice = subtotalWithProfit / (1 - taxPct)
      taxAmount = finalPrice * taxPct
    } else {
      finalPrice = subtotalWithProfit
      taxAmount = 0
    }
  } else {
    taxAmount = subtotalWithProfit * taxPct
    finalPrice = subtotalWithProfit + taxAmount
  }

  return {
    hourlyRate: rate,
    totalProjectHours,
    projectHoursCost,
    totalVariableCosts,
    projectCost,
    profitAmount,
    subtotalWithProfit,
    taxAmount,
    finalPrice,
    taxMethod,
    profitMargin,
    taxRate,
    phaseCosts,
  }
}
