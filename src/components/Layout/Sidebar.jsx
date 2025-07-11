import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard,
  Calculator,
  History as HistoryIcon,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  Zap,
  X,
  TrendingUp,
  Package,
  Globe,
  FileText,
  Users,
  Shield,
  Target
} from 'lucide-react'

const Sidebar = ({ onClose }) => {
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral e métricas'
    },
    {
      name: 'Simulador',
      href: '/simulator',
      icon: Calculator,
      description: 'Simular importações',
      badge: 'NOVO'
    },
    {
      name: 'Histórico',
      href: '/history',
      icon: HistoryIcon,
      description: 'Simulações anteriores'
    },
    {
      name: 'Relatórios',
      href: '/reports',
      icon: BarChart3,
      description: 'Análises e gráficos'
    },
    {
      name: 'Integrações',
      href: '/integrations',
      icon: Zap,
      description: 'APIs e conectores'
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: SettingsIcon,
      description: 'Preferências do sistema'
    },
    {
      name: 'Ajuda',
      href: '/help',
      icon: HelpCircle,
      description: 'Suporte e documentação'
    }
  ]

  const quickActions = [
    {
      name: 'Nova Simulação',
      icon: Calculator,
      action: () => {
        // Implementar nova simulação
        onClose?.()
      }
    },
    {
      name: 'Importar Dados',
      icon: Package,
      action: () => {
        // Implementar importação
        onClose?.()
      }
    },
    {
      name: 'Exportar Relatório',
      icon: FileText,
      action: () => {
        // Implementar exportação
        onClose?.()
      }
    }
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-3" onClick={onClose}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              SmartImport
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              EXCELTTA
            </p>
          </div>
        </Link>
        
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Navegação
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`mr-3 ${
                      isActive(item.href) 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`} 
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Ações Rápidas
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.name}
                  onClick={action.action}
                  className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all duration-200"
                >
                  <Icon size={18} className="mr-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  <span>{action.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Estatísticas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp size={16} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Simulações</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package size={16} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Produtos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">567</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe size={16} className="text-purple-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Países</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">45</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>v5.0.0</span>
          <div className="flex items-center space-x-1">
            <Shield size={12} />
            <span>Seguro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 