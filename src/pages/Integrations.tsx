import React, { useState, useMemo } from 'react'
import { Zap, Plus, Settings, Trash2, ExternalLink, CheckCircle, XCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]} transition-opacity duration-200`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2' :
            'right-full top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  )
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'API Receita Federal',
      description: 'Consulta de NCM e impostos',
      status: 'connected',
      type: 'api',
      lastSync: '2 minutos atrás',
    },
    {
      id: 2,
      name: 'Webhook Banco Central',
      description: 'Taxas de câmbio em tempo real',
      status: 'connected',
      type: 'webhook',
      lastSync: '5 minutos atrás',
    },
    {
      id: 3,
      name: 'API Siscomex',
      description: 'Dados de importação',
      status: 'disconnected',
      type: 'api',
      lastSync: 'Nunca',
    },
  ])

  const activeCount = useMemo(() => integrations.filter(i => i.status === 'connected').length, [integrations])
  const failedCount = useMemo(() => integrations.filter(i => i.status !== 'connected').length, [integrations])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Zap className="h-7 w-7 text-blue-600 mr-2" />
                Integrações
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Conecte APIs e webhooks para dados em tempo real e automação inteligente.
              </p>
            </div>
            <Tooltip content="Adicionar nova integração de API ou webhook">
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Nova Integração
              </button>
            </Tooltip>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Integrações Ativas</span>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="w-7 h-7" /> {activeCount}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Falhas/Desconectadas</span>
            <span className="text-3xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <XCircle className="w-7 h-7" /> {failedCount}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Integrações</span>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{integrations.length}</span>
          </div>
        </div>

        {/* Lista de Integrações */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Tooltip content={integration.status === 'connected' ? 'Conectado' : 'Desconectado'}>
                    <div className={`w-3 h-3 rounded-full ${
                      integration.status === 'connected' 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`} />
                  </Tooltip>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {integration.name}
                      <Tooltip content={integration.type === 'api' ? 'API RESTful' : 'Webhook para eventos'}>
                        <Info className="w-4 h-4 text-blue-400" />
                      </Tooltip>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {integration.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Tipo: {integration.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Última sincronização: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip content="Configurar integração">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Settings className="h-4 w-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Abrir documentação da integração">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Remover integração">
                    <button className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APIs e Webhooks disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" /> APIs Disponíveis
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Receita Federal</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">NCM e impostos</p>
                </div>
                <Tooltip content="Conectar API Receita Federal">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Conectar
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Banco Central</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taxas de câmbio</p>
                </div>
                <Tooltip content="Conectar API Banco Central">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Conectar
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" /> Webhooks
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notificações</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status de simulações</p>
                </div>
                <Tooltip content="Configurar webhook de notificações">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Relatórios</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Relatórios automáticos</p>
                </div>
                <Tooltip content="Configurar webhook de relatórios automáticos">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Integrations 