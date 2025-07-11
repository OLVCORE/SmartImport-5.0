import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Termos de Uso', href: '/terms' },
    { name: 'Política de Privacidade', href: '/privacy' },
    { name: 'Suporte', href: '/help' },
    { name: 'Documentação', href: '/docs' }
  ]

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/company/exceltta', icon: '💼' },
    { name: 'WhatsApp', href: 'https://wa.me/5511999999999', icon: '💬' },
    { name: 'Email', href: 'mailto:contato@exceltta.com', icon: '📧' }
  ]

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  SmartImport 5.0
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  EXCELTTA - OLV Internacional
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 max-w-md">
              Simulador estratégico de operações de importação com IA. 
              Desmistifique e automatize decisões logísticas, tributárias e fiscais.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield size={14} />
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={14} />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contato
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Mail size={14} />
                <a 
                  href="mailto:contato@exceltta.com"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  contato@exceltta.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Phone size={14} />
                <a 
                  href="tel:+5511999999999"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  (11) 99999-9999
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={14} />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>© {currentYear} EXCELTTA. Todos os direitos reservados.</span>
              <span>•</span>
              <span>Feito com</span>
              <Heart size={14} className="text-red-500" />
              <span>no Brasil</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <span>{social.icon}</span>
                  <span>{social.name}</span>
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 