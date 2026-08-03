import { createDefaultActiveProposal, createDefaultOfficeConfig } from './defaults'
import {
  calculateOfficeMetrics,
  calculateProposalPricing,
} from './pricing-engine'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

function runPricingEngineChecks(): void {
  const office = createDefaultOfficeConfig()
  const metrics = calculateOfficeMetrics(office.fixedCosts, office.productivity)

  assert(metrics.capacityHours > 0, 'default office should have capacity')
  assert(metrics.calculatedHourlyRate > 0, 'default office should have hourly rate')
  assert(
    Math.abs(metrics.calculatedHourlyRate - office.calculatedHourlyRate) < 0.0001,
    'officeConfig.calculatedHourlyRate should match metrics',
  )

  const zeroCapacityOffice = {
    ...office,
    productivity: {
      workdays: 0,
      team: {
        owner: { hours: 0, qty: 0 },
        collaborators: { hours: 0, qty: 0 },
        interns: { hours: 0, qty: 0 },
      },
    },
  }
  const zeroMetrics = calculateOfficeMetrics(
    zeroCapacityOffice.fixedCosts,
    zeroCapacityOffice.productivity,
  )
  assert(zeroMetrics.calculatedHourlyRate === 0, 'hourly rate should be 0 when capacity is 0')

  const proposal = createDefaultActiveProposal(office)
  const highTaxProposal = {
    ...proposal,
    taxMethod: 'inside' as const,
    taxRate: 100,
  }
  const highTaxResult = calculateProposalPricing(
    office.calculatedHourlyRate,
    highTaxProposal,
  )
  assert(highTaxResult.taxAmount === 0, 'taxAmount should be 0 when taxRate >= 100% (inside)')
  assert(
    highTaxResult.finalPrice === highTaxResult.subtotalWithProfit,
    'finalPrice should equal subtotal when taxRate >= 100% (inside)',
  )

  const defaultsResult = calculateProposalPricing(
    office.calculatedHourlyRate,
    proposal,
  )
  assert(defaultsResult.finalPrice > 0, 'default proposal should have positive finalPrice')

  console.log('pricing-engine checks passed')
}

runPricingEngineChecks()
