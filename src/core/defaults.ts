import type {
  ActiveProposal,
  CostCategory,
  FixedCost,
  OfficeConfig,
  ProjectPhase,
  VariableCost,
} from './types'
import { calculateOfficeMetrics } from './pricing-engine'

export const categoryNames: Record<CostCategory, string> = {
  infra: 'Infraestrutura e Utilidades',
  equipe: 'Equipe e Salários',
  operacional: 'Operacional e Geral',
  conselhos: 'Anualidades e Conselhos',
}

export const defaultFixedCosts: FixedCost[] = [
  { id: 'fc-aluguel', name: 'Aluguel', category: 'infra', value: 1800 },
  { id: 'fc-condominio', name: 'Condomínio', category: 'infra', value: 450 },
  { id: 'fc-iptu', name: 'IPTU', category: 'infra', value: 100 },
  { id: 'fc-agua', name: 'Água', category: 'infra', value: 60 },
  { id: 'fc-energia', name: 'Energia', category: 'infra', value: 250 },
  { id: 'fc-internet', name: 'Internet', category: 'infra', value: 120 },
  { id: 'fc-telefone', name: 'Telefone', category: 'infra', value: 50 },
  { id: 'fc-celular', name: 'Celular', category: 'infra', value: 70 },

  { id: 'fc-secretaria', name: 'Salário da Secretária', category: 'equipe', value: 1500 },
  { id: 'fc-prolabore', name: 'Pró-Labores (Sócios)', category: 'equipe', value: 4000 },
  { id: 'fc-bolsa-estagio', name: 'Bolsa dos Estagiários', category: 'equipe', value: 1600 },
  {
    id: 'fc-arquiteto-colab',
    name: 'Salário do Arquiteto Colaborador',
    category: 'equipe',
    value: 0,
  },
  {
    id: 'fc-13th',
    name: '1/12 do 13º Salário dos Funcionários',
    category: 'equipe',
    value: 200,
  },
  {
    id: 'fc-vacations',
    name: '1/12 das Férias dos Funcionários',
    category: 'equipe',
    value: 200,
  },
  { id: 'fc-inss', name: 'INSS', category: 'equipe', value: 350 },
  { id: 'fc-fgts', name: 'FGTS', category: 'equipe', value: 200 },
  {
    id: 'fc-transporte',
    name: 'Vale Transporte / Combustível',
    category: 'equipe',
    value: 250,
  },
  { id: 'fc-alimentacao', name: 'Auxílio Alimentação', category: 'equipe', value: 350 },

  { id: 'fc-contador', name: 'Contador', category: 'operacional', value: 500 },
  { id: 'fc-faxina', name: 'Faxina', category: 'operacional', value: 180 },
  { id: 'fc-cafe', name: 'Despesas com Café', category: 'operacional', value: 80 },
  { id: 'fc-papelaria', name: 'Papelaria e Material', category: 'operacional', value: 100 },
  {
    id: 'fc-cartuchos',
    name: 'Cartuchos para Impressora',
    category: 'operacional',
    value: 60,
  },
  {
    id: 'fc-manutencao',
    name: 'Manutenção de Equipamentos',
    category: 'operacional',
    value: 100,
  },
  { id: 'fc-tarifas', name: 'Tarifas Bancárias', category: 'operacional', value: 40 },
  {
    id: 'fc-maquininha',
    name: 'Máquina de Cartão de Crédito',
    category: 'operacional',
    value: 50,
  },

  { id: 'fc-cau-crea-pj', name: 'Anuidade Conselho (PJ)', category: 'conselhos', value: 60 },
  { id: 'fc-cau-crea-pf', name: 'Anuidade Conselho (PF)', category: 'conselhos', value: 40 },
]

export const defaultProjectPhases: ProjectPhase[] = [
  { id: 'ph-propostas', name: 'Elaboração de Propostas', hours: 8 },
  { id: 'ph-medicoes', name: 'Medições e Conferências', hours: 12 },
  { id: 'ph-estudo-preliminar', name: 'Estudo Preliminar do Projeto', hours: 40 },
  { id: 'ph-rev-estudo', name: 'Revisões do Estudo Preliminar', hours: 15 },
  { id: 'ph-projeto-legal', name: 'Projeto Legal (Prefeitura e Órgãos)', hours: 30 },
  { id: 'ph-rev-legal', name: 'Revisões do Projeto Legal', hours: 10 },
  {
    id: 'ph-complementares',
    name: 'Projetos Complementares e Compatibilizações',
    hours: 25,
  },
  { id: 'ph-rev-complementares', name: 'Revisões de Projetos Complementares', hours: 8 },
  { id: 'ph-projeto-executivo', name: 'Projeto Executivo', hours: 60 },
  { id: 'ph-rev-executivo', name: 'Revisões do Projeto Executivo', hours: 20 },
  { id: 'ph-planilhas', name: 'Planilhas Orçamentárias', hours: 12 },
  { id: 'ph-visita-lojas', name: 'Visitas a Lojas e Fornecedores', hours: 10 },
  { id: 'ph-visita-obra', name: 'Visita a Obra', hours: 25 },
]

export const defaultVariableCosts: VariableCost[] = [
  { id: 'vc-uber', name: 'Uber para deslocamento de clientes/obra', value: 150 },
  { id: 'vc-combustivel', name: 'Combustível para deslocamento', value: 200 },
  { id: 'vc-pedagio', name: 'Pedágio (quando houver)', value: 0 },
  { id: 'vc-estacionamento', name: 'Despesas com estacionamento', value: 50 },
  {
    id: 'vc-rrt',
    name: "RRT's / ART's (Registro de Responsabilidade)",
    value: 120,
  },
  { id: 'vc-terceirizado', name: 'Mão de obra terceirizada', value: 0 },
  { id: 'vc-plotagem', name: 'Plotagem e Impressões dos Projetos', value: 180 },
  { id: 'vc-comissao', name: 'Comissões / Presentes de Indicação', value: 0 },
  { id: 'vc-pastas-mimos', name: 'Pastas e Mimos na entrega do projeto', value: 100 },
]

export function createDefaultOfficeConfig(): OfficeConfig {
  const fixedCosts = structuredClone(defaultFixedCosts)
  const productivity = {
    workdays: 20,
    team: {
      owner: { hours: 6, qty: 1 },
      collaborators: { hours: 6, qty: 0 },
      interns: { hours: 4, qty: 2 },
    },
  }

  const metrics = calculateOfficeMetrics(fixedCosts, productivity)

  return {
    fixedCosts,
    productivity,
    calculatedHourlyRate: metrics.calculatedHourlyRate,
    defaultPhases: structuredClone(defaultProjectPhases),
    defaultTaxRate: 6,
    defaultTaxMethod: 'inside',
  }
}

export function createDefaultActiveProposal(
  office: OfficeConfig = createDefaultOfficeConfig(),
): ActiveProposal {
  return {
    clientInfo: {
      name: '',
      category: 'Arquitetônico',
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Rascunho',
    },
    selectedPhases: structuredClone(office.defaultPhases),
    variableCosts: structuredClone(defaultVariableCosts),
    profitMargin: 30,
    taxRate: office.defaultTaxRate,
    taxMethod: office.defaultTaxMethod,
  }
}

export function withRecalculatedHourlyRate(
  office: OfficeConfig | null | undefined,
): OfficeConfig {
  const safeOffice = office ?? createDefaultOfficeConfig()
  const metrics = calculateOfficeMetrics(
    safeOffice.fixedCosts,
    safeOffice.productivity,
  )
  return {
    ...safeOffice,
    calculatedHourlyRate: metrics.calculatedHourlyRate,
  }
}
