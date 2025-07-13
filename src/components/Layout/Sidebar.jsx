import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiHome, FiBarChart2, FiRepeat, FiFileText, FiSettings, FiHelpCircle, FiLayers } from 'react-icons/fi'

const menuItems = [
  { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/simulator', icon: <FiBarChart2 />, label: 'Simulador' },
  { to: '/history', icon: <FiRepeat />, label: 'Histórico' },
  { to: '/reports', icon: <FiFileText />, label: 'Relatórios' },
  { to: '/integrations', icon: <FiLayers />, label: 'Integrações' },
  { to: '/settings', icon: <FiSettings />, label: 'Configurações' },
  { to: '/help', icon: <FiHelpCircle />, label: 'Ajuda' },
]

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()

  const handleNav = (to) => {
    if (onNavigate) onNavigate(to)
    navigate(to)
    if (onClose) onClose()
  }

  return (
    <div
      className={`h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-200 z-30
        flex flex-col shadow-lg group`
      }
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="flex-1 flex flex-col gap-2 py-4">
        {menuItems.map((item) => (
          <button
            key={item.to}
            onClick={() => handleNav(item.to)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150
              ${collapsed ? 'justify-center' : ''}`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-base font-medium truncate transition-all duration-200">{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar 