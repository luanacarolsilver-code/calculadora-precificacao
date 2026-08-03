import { useMemo, useState } from 'react'
import { categoryNames } from '../../core/defaults'
import { formatCurrency } from '../../core/format'
import { calculateOfficeMetrics } from '../../core/pricing-engine'
import type { CostCategory, TaxMethod, TeamRoleKey } from '../../core/types'
import { usePricingStore } from '../../store/usePricingStore'
import {
  DEFAULT_PRODUCTIVITY,
  EMPTY_FIXED_COSTS,
  EMPTY_PHASES,
} from '../../store/stableDefaults'
import { GlassCard } from '../ui/GlassCard'

type SettingsTab = 'custos' | 'equipe' | 'etapas' | 'imposto'

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'custos', label: 'Custos Fixos' },
  { id: 'equipe', label: 'Equipe / Produtividade' },
  { id: 'etapas', label: 'Catálogo de Etapas' },
  { id: 'imposto', label: 'Imposto Padrão' },
]

const teamLabels: Record<TeamRoleKey, string> = {
  owner: 'Sócios',
  collaborators: 'Colaboradores',
  interns: 'Estagiários',
}

export function OfficeSettings() {
  const [tab, setTab] = useState<SettingsTab>('custos')
  const officeConfig = usePricingStore((s) => s.officeConfig)
  const resetOfficeConfig = usePricingStore((s) => s.resetOfficeConfig)

  const fixedCosts = officeConfig.fixedCosts
  const productivity = officeConfig.productivity

  const metrics = useMemo(
    () => calculateOfficeMetrics(fixedCosts, productivity),
    [fixedCosts, productivity],
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Configurações
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
              Parâmetros do Escritório
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
              Cadastre uma única vez. Esses dados alimentam o custo/hora usado em
              todos os novos orçamentos.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-glass)] bg-gradient-to-r from-[#9d4edd]/20 to-[#e050a2]/20 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Custo hora do escritório
            </p>
            <p className="text-gradient font-[family-name:var(--font-display)] text-2xl font-bold">
              {formatCurrency(metrics.calculatedHourlyRate)}
              <span className="text-sm font-medium text-[var(--text-secondary)]"> /h</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {formatCurrency(metrics.totalFixedCosts)} ÷ {metrics.capacityHours}h/mês
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={[
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                tab === item.id
                  ? 'bg-gradient-to-r from-[#9d4edd] to-[#e050a2] text-white shadow-lg'
                  : 'border border-[var(--border-glass)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'custos' ? <FixedCostsPanel /> : null}
        {tab === 'equipe' ? <ProductivityPanel /> : null}
        {tab === 'etapas' ? <PhasesCatalogPanel /> : null}
        {tab === 'imposto' ? <TaxDefaultsPanel /> : null}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Restaurar parâmetros do escritório para os valores padrão?',
                )
              ) {
                resetOfficeConfig()
              }
            }}
            className="rounded-xl border border-[var(--border-glass)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          >
            Restaurar padrões do escritório
          </button>
        </div>
      </div>
    </div>
  )
}

function FixedCostsPanel() {
  const fixedCosts = usePricingStore(
    (s) => s.officeConfig.fixedCosts ?? EMPTY_FIXED_COSTS,
  )
  const updateFixedCost = usePricingStore((s) => s.updateFixedCost)
  const addFixedCost = usePricingStore((s) => s.addFixedCost)
  const deleteFixedCost = usePricingStore((s) => s.deleteFixedCost)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<CostCategory>('operacional')
  const [value, setValue] = useState(0)
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase()
    const categories: CostCategory[] = ['infra', 'equipe', 'operacional', 'conselhos']

    return categories
      .map((cat) => ({
        category: cat,
        items: fixedCosts.filter(
          (cost) =>
            cost.category === cat &&
            (!term || cost.name.toLowerCase().includes(term)),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [fixedCosts, search])

  return (
    <div className="space-y-4">
      <GlassCard
        title="Custos fixos mensais"
        description="Valores independentes de ter cliente ou não."
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar custo fixo..."
          className="mb-4 w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />

        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.category}>
              <h4 className="mb-2 text-sm font-semibold text-[var(--color-primary)]">
                {categoryNames[group.category]}
              </h4>
              <div className="space-y-2">
                {group.items.map((cost) => (
                  <div
                    key={cost.id}
                    className="grid grid-cols-[1fr_120px_auto] items-center gap-2"
                  >
                    <span className="truncate text-sm text-[var(--text-primary)]">
                      {cost.name}
                    </span>
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
                          updateFixedCost(cost.id, Number(e.target.value) || 0)
                        }
                        className="w-full rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] py-1.5 pl-7 pr-2 text-sm outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteFixedCost(cost.id)}
                      className="rounded-lg px-2 py-1 text-xs text-[var(--color-danger)] hover:bg-[var(--bg-glass-hover)]"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Adicionar custo personalizado">
        <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_120px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do custo"
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CostCategory)}
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          >
            {(Object.keys(categoryNames) as CostCategory[]).map((key) => (
              <option key={key} value={key}>
                {categoryNames[key]}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            step={0.01}
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => {
              addFixedCost({ name, category, value })
              setName('')
              setValue(0)
            }}
            className="rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2 text-sm font-semibold text-white"
          >
            Adicionar
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

function ProductivityPanel() {
  const productivity = usePricingStore(
    (s) => s.officeConfig.productivity ?? DEFAULT_PRODUCTIVITY,
  )
  const setWorkdays = usePricingStore((s) => s.setWorkdays)
  const updateTeamRole = usePricingStore((s) => s.updateTeamRole)

  return (
    <GlassCard
      title="Produtividade da equipe"
      description="Horas produtivas por dia × quantidade × dias no mês = capacidade mensal."
    >
      <label className="mb-5 block max-w-xs text-sm">
        <span className="mb-1 block text-[var(--text-muted)]">Dias trabalhados no mês</span>
        <input
          type="number"
          min={1}
          value={productivity.workdays}
          onChange={(e) => setWorkdays(Number(e.target.value) || 1)}
          className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(teamLabels) as TeamRoleKey[]).map((role) => {
          const data = productivity.team[role]
          const subtotal = data.hours * data.qty * productivity.workdays
          return (
            <div
              key={role}
              className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-4"
            >
              <h4 className="mb-3 font-semibold text-[var(--text-primary)]">
                {teamLabels[role]}
              </h4>
              <label className="mb-2 block text-xs text-[var(--text-muted)]">
                Horas/dia
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={data.hours}
                  onChange={(e) =>
                    updateTeamRole(role, { hours: Number(e.target.value) || 0 })
                  }
                  className="mt-1 w-full rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </label>
              <label className="block text-xs text-[var(--text-muted)]">
                Quantidade
                <input
                  type="number"
                  min={0}
                  value={data.qty}
                  onChange={(e) =>
                    updateTeamRole(role, { qty: Number(e.target.value) || 0 })
                  }
                  className="mt-1 w-full rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </label>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                Capacidade: <strong>{subtotal}h/mês</strong>
              </p>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

function PhasesCatalogPanel() {
  const defaultPhases = usePricingStore(
    (s) => s.officeConfig.defaultPhases ?? EMPTY_PHASES,
  )
  const updateDefaultPhase = usePricingStore((s) => s.updateDefaultPhase)
  const addDefaultPhase = usePricingStore((s) => s.addDefaultPhase)
  const deleteDefaultPhase = usePricingStore((s) => s.deleteDefaultPhase)

  const [name, setName] = useState('')
  const [hours, setHours] = useState(8)

  return (
    <div className="space-y-4">
      <GlassCard
        title="Catálogo de etapas padrão"
        description="Essas atividades ficam disponíveis para seleção em cada novo orçamento."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-[var(--text-muted)]">
              <tr>
                <th className="pb-2 font-medium">Etapa / Atividade</th>
                <th className="w-28 pb-2 font-medium">Horas padrão</th>
                <th className="w-20 pb-2" />
              </tr>
            </thead>
            <tbody>
              {defaultPhases.map((phase) => (
                <tr key={phase.id} className="border-t border-[var(--border-glass)]">
                  <td className="py-2 pr-2">
                    <input
                      value={phase.name}
                      onChange={(e) =>
                        updateDefaultPhase(phase.id, { name: e.target.value })
                      }
                      className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none hover:border-[var(--border-glass)] focus:border-[var(--color-primary)]"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={0}
                      value={phase.hours}
                      onChange={(e) =>
                        updateDefaultPhase(phase.id, {
                          hours: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-lg border border-[var(--border-glass)] bg-[var(--input-bg)] px-2 py-1.5 outline-none focus:border-[var(--color-primary)]"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => deleteDefaultPhase(phase.id)}
                      className="text-xs text-[var(--color-danger)]"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard title="Nova etapa no catálogo">
        <div className="grid gap-2 md:grid-cols-[1.5fr_120px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da etapa"
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value) || 0)}
            className="rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => {
              addDefaultPhase({ name, hours })
              setName('')
              setHours(8)
            }}
            className="rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#e050a2] px-4 py-2 text-sm font-semibold text-white"
          >
            Adicionar
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

function TaxDefaultsPanel() {
  const defaultTaxRate = usePricingStore((s) => s.officeConfig.defaultTaxRate)
  const defaultTaxMethod = usePricingStore((s) => s.officeConfig.defaultTaxMethod)
  const setDefaultTaxRate = usePricingStore((s) => s.setDefaultTaxRate)
  const setDefaultTaxMethod = usePricingStore((s) => s.setDefaultTaxMethod)

  return (
    <GlassCard
      title="Alíquota e método tributário padrão"
      description="Novos orçamentos herdam esses valores (podem ser ajustados por proposta)."
    >
      <label className="mb-5 block max-w-xs text-sm">
        <span className="mb-1 block text-[var(--text-muted)]">Alíquota padrão (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(Number(e.target.value) || 0)}
          className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--input-bg)] px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {(
          [
            { id: 'inside', label: 'Por dentro (recomendado)' },
            { id: 'outside', label: 'Por fora' },
          ] as const
        ).map((option) => (
          <label
            key={option.id}
            className={[
              'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm transition',
              defaultTaxMethod === option.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)] text-[var(--text-primary)]'
                : 'border-[var(--border-glass)] text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <input
              type="radio"
              name="default-tax-method"
              checked={defaultTaxMethod === option.id}
              onChange={() => setDefaultTaxMethod(option.id as TaxMethod)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </GlassCard>
  )
}
