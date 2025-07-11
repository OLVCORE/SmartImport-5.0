import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Link,
  Settings,
  Zap,
  Database,
  Cloud,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  TestTube,
  Code,
  Webhook,
  Api,
  FileText,
  Download,
  Upload,
  Globe,
  Server,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('apis')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState(null)

  // Mock data para integrações
  const integrations = {
    apis: [
      {
        id: 1,
        name: 'API de Cotações',
        description: 'Integração com APIs de câmbio e frete',
        provider: 'Exchange Rate API',
        status: 'active',
        lastSync: '2024-01-15T10:30:00Z',
        apiKey: 'sk_live_1234567890abcdef',
        endpoints: ['/v1/rates', '/v1/freight', '/v1/insurance'],
        usage: {
          requests: 1250,
          limit: 10000,
          resetDate: '2024-02-01T00:00:00Z'
        }
      },
      {
        id: 2,
        name: 'API de NCM',
        description: 'Classificação fiscal e códigos NCM',
        provider: 'Receita Federal',
        status: 'active',
        lastSync: '2024-01-14T15:45:00Z',
        apiKey: 'rf_api_9876543210fedcba',
        endpoints: ['/ncm/search', '/ncm/validate', '/ncm/rates'],
        usage: {
          requests: 890,
          limit: 5000,
          resetDate: '2024-02-01T00:00:00Z'
        }
      },
      {
        id: 3,
        name: 'API de Logística',
        description: 'Rastreamento e informações de frete',
        provider: 'Logistics Hub',
        status: 'inactive',
        lastSync: '2024-01-10T09:20:00Z',
        apiKey: 'lh_api_abcdef1234567890',
        endpoints: ['/tracking', '/rates', '/schedules'],
        usage: {
          requests: 0,
          limit: 2000,
          resetDate: '2024-02-01T00:00:00Z'
        }
      }
    ],
    webhooks: [
      {
        id: 1,
        name: 'Notificações de Simulação',
        description: 'Webhook para notificar conclusão de simulações',
        url: 'https://api.empresa.com/webhooks/simulations',
        events: ['simulation.completed', 'simulation.failed'],
        status: 'active',
        lastTriggered: '2024-01-15T11:20:00Z',
        secret: 'whsec_1234567890abcdef',
        retryCount: 3
      },
      {
        id: 2,
        name: 'Sincronização ERP',
        description: 'Integração com sistema ERP da empresa',
        url: 'https://erp.empresa.com/api/sync',
        events: ['simulation.created', 'simulation.updated'],
        status: 'active',
        lastTriggered: '2024-01-15T08:15:00Z',
        secret: 'whsec_abcdef1234567890',
        retryCount: 5
      },
      {
        id: 3,
        name: 'Relatórios Automáticos',
        description: 'Envio de relatórios para email',
        url: 'https://reports.empresa.com/webhook',
        events: ['report.generated', 'report.failed'],
        status: 'inactive',
        lastTriggered: '2024-01-12T16:30:00Z',
        secret: 'whsec_7890abcdef123456',
        retryCount: 2
      }
    ],
    databases: [
      {
        id: 1,
        name: 'PostgreSQL Principal',
        description: 'Banco de dados principal da aplicação',
        type: 'postgresql',
        host: 'db.smartimport.com',
        port: 5432,
        database: 'smartimport_prod',
        status: 'active',
        lastBackup: '2024-01-15T02:00:00Z',
        size: '2.5 GB',
        connections: 45
      },
      {
        id: 2,
        name: 'Redis Cache',
        description: 'Cache em memória para performance',
        type: 'redis',
        host: 'cache.smartimport.com',
        port: 6379,
        database: '0',
        status: 'active',
        lastBackup: '2024-01-15T01:30:00Z',
        size: '512 MB',
        connections: 120
      },
      {
        id: 3,
        name: 'MongoDB Analytics',
        description: 'Banco para dados analíticos',
        type: 'mongodb',
        host: 'analytics.smartimport.com',
        port: 27017,
        database: 'analytics',
        status: 'active',
        lastBackup: '2024-01-15T03:00:00Z',
        size: '1.8 GB',
        connections: 23
      }
    ],
    services: [
      {
        id: 1,
        name: 'OCR Service',
        description: 'Reconhecimento óptico de caracteres',
        provider: 'Google Cloud Vision',
        status: 'active',
        lastUsed: '2024-01-15T12:45:00Z',
        usage: {
          requests: 156,
          limit: 1000,
          resetDate: '2024-02-01T00:00:00Z'
        },
        config: {
          language: 'pt-BR',
          confidence: 0.8
        }
      },
      {
        id: 2,
        name: 'AI Classification',
        description: 'Classificação automática de produtos',
        provider: 'OpenAI GPT-4',
        status: 'active',
        lastUsed: '2024-01-15T13:20:00Z',
        usage: {
          requests: 89,
          limit: 500,
          resetDate: '2024-02-01T00:00:00Z'
        },
        config: {
          model: 'gpt-4',
          temperature: 0.1
        }
      },
      {
        id: 3,
        name: 'Email Service',
        description: 'Envio de emails e notificações',
        provider: 'SendGrid',
        status: 'active',
        lastUsed: '2024-01-15T14:10:00Z',
        usage: {
          requests: 234,
          limit: 10000,
          resetDate: '2024-02-01T00:00:00Z'
        },
        config: {
          fromEmail: 'noreply@smartimport.com',
          template: 'default'
        }
      }
    ]
  }

  const tabs = [
    { id: 'apis', name: 'APIs', icon: Api, count: integrations.apis.length },
    { id: 'webhooks', name: 'Webhooks', icon: Webhook, count: integrations.webhooks.length },
    { id: 'databases', name: 'Bancos de Dados', icon: Database, count: integrations.databases.length },
    { id: 'services', name: 'Serviços', icon: Cloud, count: integrations.services.length }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />
      case 'inactive':
        return <AlertCircle size={16} className="text-red-500" />
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />
      default:
        return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'inactive':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'inactive':
        return 'Inativo'
      case 'pending':
        return 'Pendente'
      default:
        return 'Desconhecido'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatUsage = (usage) => {
    const percentage = (usage.requests / usage.limit) * 100
    return {
      percentage: Math.round(percentage),
      color: percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600'
    }
  }

  const handleCopyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey)
    toast.success('Chave da API copiada!')
  }

  const handleTestConnection = (integration) => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success(`Teste de conexão com ${integration.name} realizado com sucesso!`)
      setIsLoading(false)
    }, 2000)
  }

  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success('Dados atualizados com sucesso!')
      setIsLoading(false)
    }, 1500)
  }

  const handleEditIntegration = (integration) => {
    setEditingIntegration(integration)
  }

  const handleSaveIntegration = () => {
    toast.success('Integração atualizada com sucesso!')
    setEditingIntegration(null)
  }

  const handleCancelEdit = () => {
    setEditingIntegration(null)
  }

  const renderApiCard = (api) => (
    <motion.div
      key={api.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Api className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {api.name}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(api.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(api.status)}`}>
                {getStatusText(api.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{api.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Provedor: {api.provider}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleTestConnection(api)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Testar Conexão"
          >
            <TestTube size={16} />
          </button>
          <button
            onClick={() => handleEditIntegration(api)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chave da API
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={api.apiKey}
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={() => handleCopyApiKey(api.apiKey)}
              className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uso da API
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {api.usage.requests} / {api.usage.limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                formatUsage(api.usage).percentage > 80
                  ? 'bg-red-500'
                  : formatUsage(api.usage).percentage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${formatUsage(api.usage).percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatUsage(api.usage).percentage}% utilizado</span>
            <span>Reset: {formatDate(api.usage.resetDate)}</span>
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endpoints Disponíveis
          </label>
          <div className="space-y-1">
            {api.endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Code size={12} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {endpoint}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Sync */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Última sincronização: {formatDate(api.lastSync)}</span>
        </div>
      </div>
    </motion.div>
  )

  const renderWebhookCard = (webhook) => (
    <motion.div
      key={webhook.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Webhook className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {webhook.name}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(webhook.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                {getStatusText(webhook.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{webhook.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleTestConnection(webhook)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Testar Webhook"
          >
            <TestTube size={16} />
          </button>
          <button
            onClick={() => handleEditIntegration(webhook)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL do Webhook
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={webhook.url}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
            />
            <button
              onClick={() => handleCopyApiKey(webhook.url)}
              className="px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Events */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Eventos Configurados
          </label>
          <div className="flex flex-wrap gap-2">
            {webhook.events.map((event, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
              >
                {event}
              </span>
            ))}
          </div>
        </div>

        {/* Secret */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secret
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={webhook.secret}
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={() => handleCopyApiKey(webhook.secret)}
              className="px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Último disparo: {formatDate(webhook.lastTriggered)}</span>
          <span>Tentativas: {webhook.retryCount}</span>
        </div>
      </div>
    </motion.div>
  )

  const renderDatabaseCard = (db) => (
    <motion.div
      key={db.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {db.name}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(db.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(db.status)}`}>
                {getStatusText(db.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{db.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleTestConnection(db)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Testar Conexão"
          >
            <TestTube size={16} />
          </button>
          <button
            onClick={() => handleEditIntegration(db)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Host
            </label>
            <span className="text-sm text-gray-900 dark:text-white font-mono">{db.host}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Porta
            </label>
            <span className="text-sm text-gray-900 dark:text-white">{db.port}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Database
            </label>
            <span className="text-sm text-gray-900 dark:text-white font-mono">{db.database}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <span className="text-sm text-gray-900 dark:text-white capitalize">{db.type}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{db.size}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tamanho</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{db.connections}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Conexões</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(db.lastBackup)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Último Backup</div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderServiceCard = (service) => (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Cloud className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.name}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(service.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {getStatusText(service.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Provedor: {service.provider}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleTestConnection(service)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Testar Serviço"
          >
            <TestTube size={16} />
          </button>
          <button
            onClick={() => handleEditIntegration(service)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uso do Serviço
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {service.usage.requests} / {service.usage.limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                formatUsage(service.usage).percentage > 80
                  ? 'bg-red-500'
                  : formatUsage(service.usage).percentage > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${formatUsage(service.usage).percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatUsage(service.usage).percentage}% utilizado</span>
            <span>Reset: {formatDate(service.usage.resetDate)}</span>
          </div>
        </div>

        {/* Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Configuração
          </label>
          <div className="space-y-2">
            {Object.entries(service.config).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key}:</span>
                <span className="text-gray-900 dark:text-white font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Used */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Último uso: {formatDate(service.lastUsed)}</span>
        </div>
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'apis':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.apis.map(renderApiCard)}
          </div>
        )
      case 'webhooks':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.webhooks.map(renderWebhookCard)}
          </div>
        )
      case 'databases':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.databases.map(renderDatabaseCard)}
          </div>
        )
      case 'services':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.services.map(renderServiceCard)}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Helmet>
        <title>Integrações - SmartImport 5.0</title>
        <meta name="description" content="Gerencie integrações e APIs do SmartImport" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Integrações
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie APIs, webhooks e conectores externos
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Atualizar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
              <Plus size={16} />
              <span>Nova Integração</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Integrations 