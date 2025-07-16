import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔧 Forçando atualização do Sidebar...')

// Forçar atualização do Sidebar.tsx com timestamp
const sidebarContent = `import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  BarChart3, 
  Settings, 
  Zap, 
  X, 
  Brain, 
  HelpCircle,
  Truck,
  Ship,
  TrendingUp,
  FileText,
  Users,
  Shield,
  Globe
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [isCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Forçar re-renderização
  useEffect(() => {
    console.log('🎯 Sidebar renderizado com todos os itens:', navigation.length)
  }, [])

  // Navegação completa com todos os módulos - ATUALIZADO ${new Date().toISOString()}
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Simulador', 
      href: '/simulator', 
      icon: Calculator,
      description: 'Simulação de importação'
    },
    { 
      name: 'Histórico', 
      href: '/history', 
      icon: History,
      description: 'Histórico de simulações'
    },
    { 
      name: 'Relatórios', 
      href: '/reports', 
      icon: BarChart3,
      description: 'Relatórios e análises'
    },
    { 
      name: 'SmartFrete', 
      href: '/smartfrete', 
      icon: Truck,
      description: 'Logística inteligente'
    },
    { 
      name: 'SeaFrete', 
      href: '/seafrete', 
      icon: Ship,
      description: 'Cotações marítimas'
    },
    { 
      name: 'OPN IA', 
      href: '/opnia', 
      icon: Brain,
      description: 'Inteligência artificial'
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
      icon: Settings,
      description: 'Configurações do sistema'
    },
    { 
      name: 'Ajuda', 
      href: '/help', 
      icon: HelpCircle,
      description: 'Suporte e documentação'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75" onClick={onClose} />
      )}
      {/* Sidebar */}
      <div className={\`w-64 h-full bg-white dark:bg-gray-800 shadow-lg
        \${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 dark:border-gray-700
        lg:relative lg:transform-none
        \${isOpen ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'lg:static'}\`}
      >
        {/* Header do Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {!isCollapsed && 'SmartImport'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {!isCollapsed && 'Sistema SERP'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navegação Principal */}
        <nav className="mt-6 px-2">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <button
                  key={\`\${item.name}-\${index}\`}
                  onClick={() => {
                    console.log('🎯 Navegando para:', item.href)
                    if (onClose) onClose()
                    navigate(item.href)
                  }}
                  className={\`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer \${active
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }\`}
                  title={item.description}
                >
                  <Icon className={\`mr-3 h-5 w-5 flex-shrink-0 \${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'}\`} />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">{item.name}</span>
                  )}
                  {active && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Status do Sistema */}
        <div className="px-3 mt-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {!isCollapsed && 'Sistema Online'}
              </span>
            </div>
            {!isCollapsed && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Todas as APIs conectadas (10 itens ativos)
              </p>
            )}
          </div>
        </div>

        {/* Toggle de Tema */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <div className="mr-3 h-5 w-5 flex-shrink-0">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
            {!isCollapsed && (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro')}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar`

// Escrever o novo Sidebar
const sidebarPath = join(__dirname, '..', 'src', 'components', 'Layout', 'Sidebar.tsx')
writeFileSync(sidebarPath, sidebarContent)

console.log('✅ Sidebar atualizado com força!')
console.log('📋 Itens no sidebar:')
console.log('1. Dashboard')
console.log('2. Simulador')
console.log('3. Histórico')
console.log('4. Relatórios')
console.log('5. SmartFrete')
console.log('6. SeaFrete')
console.log('7. OPN IA')
console.log('8. Integrações')
console.log('9. Configurações')
console.log('10. Ajuda')
console.log('\\n Total: 10 itens')
console.log('\\n🔄 Próximo passo: Reiniciar o frontend') 