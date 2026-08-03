import { FileText, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatCurrency } from '../../core/format'
import { calculateProposalPricing } from '../../core/pricing-engine'
import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type TaxMethod,
} from '../../core/types'
import { usePricingStore } from '../../store/usePricingStore'
import {
  DEFAULT_CLIENT_INFO,
  EMPTY_PHASES,
  EMPTY_SAVED_PROPOSALS,
  EMPTY_VARIABLE_COSTS,
} from '../../store/stableDefaults'
import { ProposalReportModal } from '../report/ProposalReportModal'
import { GlassCard } from '../ui/GlassCard'

export function NewProposalWorkspace() {
  const hourlyRate = usePricingStore((s) => s.officeConfig.calculatedHourlyRate)
  const defaultPhases = usePricingStore((s) => s.officeConfig.defaultPhases)
  const activeProposal = usePricingStore((s) => s.activeProposal)
  const savedProposals = usePricingStore((s) => s.savedProposals)

  const calculations = useMemo(
    () => calculateProposalPricing(hourlyRate, activeProposal),
    [hourlyRate, activeProposal],
  )

  const updateClientInfo = usePricingStore((s) => s.updateClientInfo)
  const togglePhaseSelection = usePricingStore((s) => s.togglePhaseSelection)
  const updateSelectedPhaseHours = usePricingStore((s) => s.updateSelectedPhaseHours)
  const addCustomPhaseToProposal = usePricingStore((s) => s.addCustomPhaseToProposal)
  const removePhaseFromProposal = usePricingStore((s) => s.removePhaseFromProposal)
  const syncPhasesFromCatalog = usePricingStore((s) => s.syncPhasesFromCatalog)
  const updateVariableCost = usePricingStore((s) => s.updateVariableCost)
  const addVariableCost = usePricingStore((s) => s.addVariableCost)
  const deleteVariableCost = usePricingStore((s) => s.deleteVariableCost)
  const setProfitMargin = usePricingStore((s) => s.setProfitMargin)
  const setProposalTaxRate = usePricingStore((s) => s.setProposalTaxRate)
  const setProposalTaxMethod = usePricingStore((s) => s.setProposalTaxMethod)
  const setReportOpen = usePricingStore((s) => s.setReportOpen)
  const resetActiveProposal = usePricingStore((s) => s.resetActiveProposal)
  const loadProposal = usePricingStore((s) => s.loadProposal)
  const deleteSavedProposal = usePricingStore((s) => s.deleteSavedProposal)
  const saveCurrentProposal = usePricingStore((s) => s.saveCurrentProposal)

  const [customPhaseName, setCustomPhaseName] = useState('')
  const [customPhaseHours, setCustomPhaseHours] = useState(8)
  const [variableName, setVariableName] = useState('')
  const [variableValue, setVariableValue] = useState(0)

  const selectedPhases = activeProposal.selectedPhases ?? EMPTY_PHASES
  const variableCosts = activeProposal.variableCosts ?? EMPTY_VARIABLE_COSTS
  const catalogPhases = defaultPhases ?? EMPTY_PHASES
  const clientInfo = activeProposal.clientInfo ?? DEFAULT_CLIENT_INFO
  const proposalsList = savedProposals ?? EMPTY_SAVED_PROPOSALS

  const selectedIds = useMemo(
    () => new Set(selectedPhases.map((phase) => phase.id)),
    [selectedPhases],
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-glass)] px-4 py-3 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Serviços
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold md:text-xl">
            Novo Orçamento
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Iniciar um novo orçamento em branco?')) {
                resetActiveProposal()
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Novo
          </button>
          <button
            type="button"
            onClick={() => saveCurrentProposal()}
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2 text-sm font-semibold text-white"
          >
            <FileText className="h-4 w-4" />
            Ver relatório
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mx-auto max-w-4xl space-y-5">
            <GlassCard
              title="Cliente e categoria"
              description="Identifique o projeto antes de precificar as atividades."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--text-muted)]">Cliente</span>
                  <input
                    value={clientInfo.name}
                    onChange={(e) => updateClientInfo({ name: e.target.value })}
                    placeholder="Nome do cliente ou projeto"
                    className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[var(--text-muted)]">
                    Categoria do projeto
                  </span>
                  <select
                    value={clientInfo.category}
                    onChange={(e) =>
                      updateClientInfo({
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  >
                    {PROJECT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </GlassCard>

            <GlassCard
              title="Atividades do projeto"
              description="Selecione etapas do catálogo do escritório e ajuste as horas deste orçamento."
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={syncPhasesFromCatalog}
                  className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                >
                  Restaurar catálogo padrão
                </button>
              </div>

              <div className="space-y-2">
                {catalogPhases.map((phase) => {
                  const selected = selectedIds.has(phase.id)
                  const selectedPhase = selectedPhases.find(
                    (item) => item.id === phase.id,
                  )
                  return (
                    <div
                      key={phase.id}
                      className={[
                        'grid grid-cols-[auto_1fr_110px] items-center gap-3 rounded-xl border px-3 py-2.5',
                        selected
                          ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary-glow)]'
                          : 'border-[var(--border-glass)] opacity-70',
                      ].join(' ')}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => togglePhaseSelection(phase.id)}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                      <span className="truncate text-sm">{phase.name}</span>
                      <input
                        type="number"
                        min={0}
                        disabled={!selected}
                        value={selectedPhase?.hours ?? phase.hours}
                        onChange={(e) =>
                          updateSelectedPhaseHours(
                            phase.id,
                            Number(e.target.value) || 0,
                          )
                        }
                        className="rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] px-2 py-1.5 text-sm outline-none disabled:opacity-40 focus:border-[var(--color-primary)]"
                      />
                    </div>
                  )
                })}

                {selectedPhases
                  .filter(
                    (phase) =>
                      !catalogPhases.some((item) => item.id === phase.id),
                  )
                  .map((phase) => (
                    <div
                      key={phase.id}
                      className="grid grid-cols-[1fr_110px_auto] items-center gap-3 rounded-xl border border-[var(--border-glass)] px-3 py-2.5"
                    >
                      <span className="truncate text-sm">{phase.name}</span>
                      <input
                        type="number"
                        min={0}
                        value={phase.hours}
                        onChange={(e) =>
                          updateSelectedPhaseHours(
                            phase.id,
                            Number(e.target.value) || 0,
                          )
                        }
                        className="rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => removePhaseFromProposal(phase.id)}
                        className="text-[var(--color-danger)]"
                        aria-label="Remover etapa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-[1.4fr_110px_auto]">
                <input
                  value={customPhaseName}
                  onChange={(e) => setCustomPhaseName(e.target.value)}
                  placeholder="Etapa personalizada neste orçamento"
                  className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  type="number"
                  min={0}
                  value={customPhaseHours}
                  onChange={(e) => setCustomPhaseHours(Number(e.target.value) || 0)}
                  className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    addCustomPhaseToProposal({
                      name: customPhaseName,
                      hours: customPhaseHours,
                    })
                    setCustomPhaseName('')
                    setCustomPhaseHours(8)
                  }}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border-glass)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Plus className="h-4 w-4" />
                  Incluir
                </button>
              </div>
            </GlassCard>

            <GlassCard
              title="Custos variáveis do projeto"
              description="Despesas que só existem se este projeto for executado."
            >
              <div className="space-y-2">
                {variableCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="grid grid-cols-[1fr_130px_auto] items-center gap-2"
                  >
                    <span className="truncate text-sm">{cost.name}</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                        R$
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={cost.value}
                        onChange={(e) =>
                          updateVariableCost(cost.id, Number(e.target.value) || 0)
                        }
                        className="w-full rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] py-1.5 pl-7 pr-2 text-sm outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteVariableCost(cost.id)}
                      className="text-xs text-[var(--color-danger)]"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-[1.4fr_130px_auto]">
                <input
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  placeholder="Novo custo variável"
                  className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={variableValue}
                  onChange={(e) => setVariableValue(Number(e.target.value) || 0)}
                  className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    addVariableCost({ name: variableName, value: variableValue })
                    setVariableName('')
                    setVariableValue(0)
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2 text-sm font-semibold text-white"
                >
                  Adicionar
                </button>
              </div>
            </GlassCard>

            <GlassCard
              title="Margem de lucro e imposto"
              description="Ajuste a formação de preço desta proposta."
            >
              <label className="mb-5 block text-sm">
                <div className="mb-2 flex justify-between">
                  <span className="text-[var(--text-muted)]">Margem de lucro</span>
                  <span className="font-semibold text-[var(--color-success)]">
                    {activeProposal.profitMargin}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={activeProposal.profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </label>

              <label className="mb-4 block max-w-xs text-sm">
                <span className="mb-1 block text-[var(--text-muted)]">Alíquota (%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={activeProposal.taxRate}
                  onChange={(e) => setProposalTaxRate(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    { id: 'inside', label: 'Imposto por dentro' },
                    { id: 'outside', label: 'Imposto por fora' },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={[
                      'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm',
                      activeProposal.taxMethod === option.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]'
                        : 'border-[var(--border-glass)] text-[var(--text-secondary)]',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="proposal-tax-method"
                      checked={activeProposal.taxMethod === option.id}
                      onChange={() =>
                        setProposalTaxMethod(option.id as TaxMethod)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </GlassCard>

            {proposalsList.length > 0 ? (
              <GlassCard title="Simulações salvas">
                <div className="grid gap-3 sm:grid-cols-2">
                  {proposalsList.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => loadProposal(proposal.id)}
                        className="w-full text-left"
                      >
                        <p className="truncate font-semibold">{proposal.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {proposal.date} · {proposal.category} · {proposal.status}
                        </p>
                        <p className="mt-1 text-gradient font-[family-name:var(--font-display)] text-lg font-bold">
                          {formatCurrency(proposal.finalPrice)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Excluir esta simulação?')) {
                            deleteSavedProposal(proposal.id)
                          }
                        }}
                        className="mt-2 text-xs text-[var(--color-danger)]"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ) : null}
          </div>
        </div>

        <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-[var(--border-glass)] p-4 xl:block">
          <div className="glass-card sticky top-4 space-y-4 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Custo hora aplicado
              </p>
              <p className="text-gradient font-[family-name:var(--font-display)] text-2xl font-bold">
                {formatCurrency(hourlyRate)}
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  /h
                </span>
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Vindo dos parâmetros do escritório
              </p>
            </div>

            <hr className="border-[var(--border-glass)]" />

            <SummaryLine
              label="Horas selecionadas"
              value={`${calculations.totalProjectHours}h`}
            />
            <SummaryLine
              label="Custo de horas"
              value={formatCurrency(calculations.projectHoursCost)}
            />
            <SummaryLine
              label="Variáveis"
              value={formatCurrency(calculations.totalVariableCosts)}
            />
            <SummaryLine
              label="Lucro"
              value={formatCurrency(calculations.profitAmount)}
              valueClassName="text-[var(--color-success)]"
            />
            <SummaryLine
              label="Impostos"
              value={formatCurrency(calculations.taxAmount)}
              valueClassName="text-[var(--color-warning)]"
            />

            <div className="rounded-xl bg-[var(--color-primary-glow)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Preço final sugerido
              </p>
              <p className="text-gradient font-[family-name:var(--font-display)] text-2xl font-bold">
                {formatCurrency(calculations.finalPrice)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="w-full rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Abrir relatório
            </button>
          </div>
        </aside>
      </div>

      <ProposalReportModal />
    </div>
  )
}

function SummaryLine({
  label,
  value,
  valueClassName = '',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className={`font-semibold ${valueClassName}`}>{value}</span>
    </div>
  )
}
