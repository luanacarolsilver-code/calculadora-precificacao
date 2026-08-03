const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatMoney(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatCurrency(value: number): string {
  return `R$ ${formatMoney(value)}`
}

export function formatCompactMoney(value: number): string {
  return compactFormatter.format(Number.isFinite(value) ? value : 0)
}
