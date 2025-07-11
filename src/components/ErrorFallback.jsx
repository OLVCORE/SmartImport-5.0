import React from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/dashboard')
    resetErrorBoundary()
  }

  const handleContactSupport = () => {
    window.open('mailto:suporte@exceltta.com?subject=Erro no SmartImport 5.0', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Ops! Algo deu errado
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detalhes do erro (Desenvolvimento)
            </summary>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400 font-mono overflow-auto max-h-32">
              <div className="mb-2">
                <strong>Mensagem:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <RefreshCw size={18} />
            <span>Tentar Novamente</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <Home size={18} />
            <span>Ir para o Dashboard</span>
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <Mail size={18} />
            <span>Contatar Suporte</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Se o problema persistir, entre em contato conosco através do email{' '}
            <a 
              href="mailto:suporte@exceltta.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              suporte@exceltta.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback 