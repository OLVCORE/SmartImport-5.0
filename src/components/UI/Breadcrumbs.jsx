import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = () => {
  const location = useLocation()
  
  const pathMap = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/simulator': 'Simulador',
    '/history': 'Histórico',
    '/reports': 'Relatórios',
    '/integrations': 'Integrações',
    '/opnia': 'OPN IA',
    '/settings': 'Configurações',
    '/help': 'Ajuda',
    '/smartfrete': 'SmartFrete'
  }

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const name = pathMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === paths.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <Link
            to={breadcrumb.path}
            className={`flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${
              breadcrumb.isLast ? 'text-gray-900 dark:text-white font-medium' : ''
            }`}
          >
            {breadcrumb.icon && breadcrumb.icon}
            <span>{breadcrumb.name}</span>
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs 