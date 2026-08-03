import { formatCompactMoney, formatCurrency } from '../../core/format'
import type { ProposalCalculations } from '../../core/types'

interface PriceCompositionChartProps {
  calculations: ProposalCalculations
}

interface Slice {
  name: string
  value: number
  color: string
}

export function PriceCompositionChart({ calculations }: PriceCompositionChartProps) {
  const total = calculations.finalPrice
  const radius = 70
  const circumference = 2 * Math.PI * radius

  const slices: Slice[] = [
    {
      name: 'Custo Operacional',
      value: calculations.projectCost,
      color: 'var(--color-primary)',
    },
    {
      name: 'Lucro Esperado',
      value: calculations.profitAmount,
      color: 'var(--color-success)',
    },
    {
      name: 'Impostos',
      value: calculations.taxAmount,
      color: 'var(--color-warning)',
    },
  ]

  let currentOffset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative h-[200px] w-[200px] shrink-0">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--border-glass)"
            strokeWidth="20"
          />
          {total > 0
            ? slices.map((slice) => {
                const pct = slice.value / total
                if (pct <= 0) return null

                const strokeLength = circumference * pct
                const strokeSpace = circumference - strokeLength
                const dashOffset = -currentOffset
                currentOffset += strokeLength

                return (
                  <circle
                    key={slice.name}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="20"
                    strokeDasharray={`${strokeLength} ${strokeSpace}`}
                    strokeDashoffset={dashOffset}
                  />
                )
              })
            : null}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[var(--text-primary)]">
            R$ {formatCompactMoney(total)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">Valor Total</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {slices.map((slice) => {
          const pct = total > 0 ? (slice.value / total) * 100 : 0
          return (
            <div key={slice.name} className="flex items-start gap-3">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{slice.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatCurrency(slice.value)} ({pct.toFixed(0)}%)
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
