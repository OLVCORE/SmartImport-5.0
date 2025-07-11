import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const ErrorFallback = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-danger-600 dark:text-danger-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ops! Algo deu errado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.<br/>
            Tente recarregar a página.<br/>
            <span className="text-red-600 font-bold">Por favor, envie um print desta tela para o suporte!</span>
          </p>
          {/* SEMPRE mostrar detalhes do erro, mesmo em produção */}
          {error && (
            <details className="mb-6 text-left open">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detalhes técnicos do erro (envie ao suporte)
              </summary>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                <pre>{error.message}</pre>
                {error.stack && (
                  <pre className="mt-2 text-gray-600 dark:text-gray-400">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar Página</span>
          </button>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Se o problema persistir, entre em contato: suporte@exceltta.com
            </p>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            ID do Erro: {error?.name || 'UNKNOWN'}-{Date.now()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback 