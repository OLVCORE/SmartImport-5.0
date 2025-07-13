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
    '/settings': 'Configurações',
    '/help': 'Ajuda'
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
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          {breadcrumb.isLast ? (
            <span className="font-medium text-gray-900 dark:text-white">
              {breadcrumb.icon && <span className="inline-block mr-1">{breadcrumb.icon}</span>}
              {breadcrumb.name}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              {breadcrumb.icon && <span className="inline-block">{breadcrumb.icon}</span>}
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs 