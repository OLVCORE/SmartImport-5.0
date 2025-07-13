import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calculator, History, BarChart3, Settings, Zap, X } from 'lucide-react'
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

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Simulador', href: '/simulator', icon: Calculator },
    { name: 'Histórico', href: '/history', icon: History },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Integrações', href: '/integrations', icon: Zap },
    { name: 'Configurações', href: '/settings', icon: Settings },
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
      <div className={`w-64 h-full bg-white dark:bg-gray-800 shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200 dark:border-gray-700
        lg:relative lg:transform-none
        ${isOpen ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'lg:static'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {!isCollapsed && 'SmartImport'}
              </h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (onClose) onClose()
                    navigate(item.href)
                  }}
                  className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && item.name}
                  {active && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
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

export default Sidebar 