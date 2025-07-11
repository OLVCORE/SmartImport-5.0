import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      name: 'Sobre',
      href: '/about',
      external: false
    },
    {
      name: 'Documentação',
      href: '/docs',
      external: false
    },
    {
      name: 'Suporte',
      href: '/support',
      external: false
    },
    {
      name: 'EXCELTTA',
      href: 'https://exceltta.com',
      external: true
    },
    {
      name: 'OLV Internacional',
      href: 'https://olvinternacional.com.br',
      external: true
    }
  ]

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">SI</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                SmartImport 4.0
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} EXCELTTA
            </span>
          </div>

          {/* Center - Links */}
          <nav className="flex items-center space-x-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${
                  link.external ? 'group' : ''
                }`}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                <span>{link.name}</span>
                {link.external && (
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Feito com
            </span>
            <Heart className="w-4 h-4 text-danger-500 animate-pulse" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              pela OLV Internacional
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                Simulador Estratégico de Operações de Importação com IA, OCR e análise tributária.
              </p>
              <p className="mt-1">
                Automatize decisões logísticas e fiscais para PMEs brasileiras.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Sistema Online
                </span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                v4.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 