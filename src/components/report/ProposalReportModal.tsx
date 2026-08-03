import { Printer, X } from 'lucide-react'
import { useMemo } from 'react'
import { formatCurrency } from '../../core/format'
import { calculateProposalPricing } from '../../core/pricing-engine'
import { PROPOSAL_STATUSES } from '../../core/types'
import type { ProposalStatus } from '../../core/types'
import { usePricingStore } from '../../store/usePricingStore'
import { DEFAULT_CLIENT_INFO } from '../../store/stableDefaults'
import { PriceCompositionChart } from './PriceCompositionChart'

export function ProposalReportModal() {
  const isOpen = usePricingStore((s) => s.isReportOpen)
  const setReportOpen = usePricingStore((s) => s.setReportOpen)
  const setProposalStatus = usePricingStore((s) => s.setProposalStatus)
  const saveCurrentProposal = usePricingStore((s) => s.saveCurrentProposal)
  const hourlyRate = usePricingStore((s) => s.officeConfig.calculatedHourlyRate)
  const activeProposal = usePricingStore((s) => s.activeProposal)
  const clientInfo = activeProposal.clientInfo ?? DEFAULT_CLIENT_INFO

  const calculations = useMemo(
    () => calculateProposalPricing(hourlyRate, activeProposal),
    [hourlyRate, activeProposal],
  )

  const reportDate = useMemo(
    () => clientInfo.date || new Date().toLocaleDateString('pt-BR'),
    [clientInfo.date],
  )

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    saveCurrentProposal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm print:static print:bg-transparent print:p-0">
      <div className="glass-card relative my-6 w-full max-w-3xl p-0 print:my-0 print:max-w-none print:border-0 print:bg-white print:shadow-none">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-glass)] px-5 py-4 print:hidden">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
              Relatório da Proposta
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Revise, altere o status e exporte em PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReportOpen(false)}
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
            aria-label="Fechar relatório"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div id="proposal-report-print" className="space-y-6 px-5 py-5 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Jornada dos Escritórios DE SUCE$$O
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                Proposta de Precificação
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Cliente: {clientInfo.name.trim() || 'Não informado'} ·{' '}
                {clientInfo.category} · {reportDate}
              </p>
            </div>

            <label className="print:hidden block min-w-[180px] text-sm">
              <span className="mb-1 block text-[var(--text-muted)]">Status da proposta</span>
              <select
                value={clientInfo.status}
                onChange={(event) =>
                  setProposalStatus(event.target.value as ProposalStatus)
                }
                className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]"
              >
                {PROPOSAL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ReportRow
              label="Custo hora aplicado"
              value={`${formatCurrency(hourlyRate)} / h`}
            />
            <ReportRow
              label="Horas do projeto"
              value={`${calculations.totalProjectHours}h`}
            />
            <ReportRow
              label="Custo de horas"
              value={formatCurrency(calculations.projectHoursCost)}
            />
            <ReportRow
              label="Custos variáveis"
              value={formatCurrency(calculations.totalVariableCosts)}
            />
            <ReportRow
              label="Custo total de execução"
              value={formatCurrency(calculations.projectCost)}
            />
            <ReportRow
              label={`Lucro (${calculations.profitMargin}%)`}
              value={formatCurrency(calculations.profitAmount)}
            />
            <ReportRow
              label={`Impostos (${calculations.taxRate}% · ${calculations.taxMethod === 'inside' ? 'por dentro' : 'por fora'})`}
              value={formatCurrency(calculations.taxAmount)}
            />
            <ReportRow
              label="Preço final sugerido"
              value={formatCurrency(calculations.finalPrice)}
              highlight
            />
          </div>

          <div>
            <h4 className="mb-3 font-[family-name:var(--font-display)] text-lg font-semibold">
              Composição do Preço Final
            </h4>
            <PriceCompositionChart calculations={calculations} />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border-glass)] px-5 py-4 print:hidden">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-glass-hover)]"
          >
            Salvar simulação
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function ReportRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3 py-2.5">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p
        className={[
          'font-[family-name:var(--font-display)] text-base font-semibold',
          highlight ? 'text-gradient' : 'text-[var(--text-primary)]',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  )
}
