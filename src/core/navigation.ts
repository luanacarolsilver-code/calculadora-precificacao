import type { LucideIcon } from 'lucide-react'
import {
  CircleHelp,
  FolderOpen,
  Globe,
  LayoutDashboard,
  CircleDollarSign,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react'

export type AppModuleId =
  | 'inicio'
  | 'financeiro'
  | 'clientes'
  | 'servicos'
  | 'historico'
  | 'perfil'
  | 'configuracoes'
  | 'ajuda'

export interface AppModuleItem {
  id: AppModuleId
  label: string
  description: string
  icon: LucideIcon
}

export const appModules: AppModuleItem[] = [
  {
    id: 'inicio',
    label: 'Início',
    description: 'Dashboard com visão geral do escritório.',
    icon: LayoutDashboard,
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    description: 'Controle de receitas, despesas e fluxo de caixa.',
    icon: CircleDollarSign,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    description: 'Cadastro e gestão da carteira de clientes.',
    icon: Users,
  },
  {
    id: 'servicos',
    label: 'Serviços',
    description: 'Elaboração de orçamentos e propostas de precificação.',
    icon: FolderOpen,
  },
  {
    id: 'historico',
    label: 'Histórico / Leads',
    description: 'Leads e histórico de interações.',
    icon: ScrollText,
  },
  {
    id: 'perfil',
    label: 'Perfil',
    description: 'Dados do escritório e preferências pessoais.',
    icon: Globe,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    description: 'Parâmetros do escritório: custos fixos, equipe, etapas e impostos.',
    icon: Settings,
  },
  {
    id: 'ajuda',
    label: 'Ajuda',
    description: 'Central de suporte e documentação.',
    icon: CircleHelp,
  },
]

export const APP_VERSION = '1.2.0'
