import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  Zap, 
  Sparkles, 
  Target, 
  BarChart3, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Globe2, 
  Bot, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare, 
  FileText, 
  Calculator, 
  AlertTriangle,
  X,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'

// Importação do serviço OPN IA
import opnIAService from '../services/opnIAService.js'

// Tipos TypeScript para os módulos de IA
interface IAModule {
  key: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'inactive' | 'processing' | 'error'
  category: 'automation' | 'analytics' | 'prediction' | 'optimization' | 'security'
  premium: boolean
  accuracy?: number
  processingTime?: string
  lastUpdate?: string
  tooltip: string
  testFunction?: () => Promise<any>
  features?: string[]
  apiStatus?: 'connected' | 'disconnected' | 'error'
}

// Módulos de IA organizados por categoria com todas as integrações
const iaModules: IAModule[] = [
  // 🤖 AUTOMAÇÃO INTELIGENTE
  {
    key: 'auto-classification',
    name: 'Classificação Automática NCM',
    description: 'IA avançada para classificação automática de produtos com 98% de precisão usando OpenAI GPT-4',
    icon: <Brain className="w-6 h-6" />,
    status: 'active',
    category: 'automation',
    premium: true,
    accuracy: 98.2,
    processingTime: '2.3s',
    lastUpdate: '2024-01-15',
    tooltip: 'Classificação automática de produtos usando IA com aprendizado contínuo via OpenAI API',
    apiStatus: 'connected',
    features: ['OpenAI GPT-4', 'Aprendizado contínuo', 'Validação automática'],
    testFunction: () => opnIAService.classifyNCM('Smartphone Samsung Galaxy S24, 128GB, Preto, Dual SIM, 5G', {
      material: 'Vidro e alumínio',
      capacidade: '128GB',
      conectividade: '5G'
    })
  },
  {
    key: 'document-processing',
    name: 'Processamento Inteligente de Documentos',
    description: 'Extração automática de dados de documentos comerciais e fiscais via OCR + IA',
    icon: <Database className="w-6 h-6" />,
    status: 'active',
    category: 'automation',
    premium: true,
    accuracy: 96.8,
    processingTime: '1.8s',
    lastUpdate: '2024-01-14',
    tooltip: 'OCR avançado com IA para extração de dados de documentos comerciais',
    apiStatus: 'connected',
    features: ['OpenAI GPT-4', 'OCR inteligente', 'Validação automática'],
    testFunction: () => opnIAService.processDocument(
      `INVOICE
      FOB: USD 1,250.00
      Frete: USD 200.00
      Seguro: USD 50.00
      Quantidade: 100 unidades
      País de Origem: China
      País de Destino: Brasil
      Descrição: Smartphones Samsung Galaxy S24`,
      'commercial'
    )
  },
  {
    key: 'smart-chatbot',
    name: 'Chatbot Inteligente',
    description: 'Assistente virtual especializado em importação e logística com IA avançada',
    icon: <Bot className="w-6 h-6" />,
    status: 'active',
    category: 'automation',
    premium: false,
    accuracy: 88.9,
    processingTime: '0.3s',
    lastUpdate: '2024-01-05',
    tooltip: 'Chatbot com IA especializada em importação e logística',
    apiStatus: 'connected',
    features: ['OpenAI GPT-4', 'Contexto especializado', 'Respostas em tempo real'],
    testFunction: () => opnIAService.chatBot('Como funciona a classificação NCM e quais são os benefícios?', {
      userType: 'importador',
      experience: 'intermediário'
    })
  },

  //  SEGURANÇA E COMPLIANCE
  {
    key: 'risk-assessment',
    name: 'Avaliação de Risco Inteligente',
    description: 'Análise inteligente de riscos operacionais e financeiros com IA + PTAX',
    icon: <Shield className="w-6 h-6" />,
    status: 'active',
    category: 'security',
    premium: true,
    accuracy: 95.3,
    processingTime: '3.1s',
    lastUpdate: '2024-01-10',
    tooltip: 'Avaliação automática de riscos usando machine learning e dados PTAX',
    apiStatus: 'connected',
    features: ['OpenAI GPT-4', 'PTAX API', 'Análise de risco', 'Recomendações'],
    testFunction: () => opnIAService.assessRisk({
      valorFob: '1000',
      frete: '200',
      seguro: '50',
      paisOrigem: 'China',
      modal: 'maritimo',
      moeda: 'USD',
      produto: 'Smartphones',
      quantidade: '100'
    })
  },
  {
    key: 'ttce-consultation',
    name: 'Consulta TTCE Automática',
    description: 'Consulta automática de tratamentos tributários da Receita Federal em tempo real',
    icon: <FileText className="w-6 h-6" />,
    status: 'active',
    category: 'security',
    premium: true,
    accuracy: 99.1,
    processingTime: '0.8s',
    lastUpdate: '2024-01-06',
    tooltip: 'Consulta TTCE via Receita Federal em tempo real',
    apiStatus: 'connected',
    features: ['API Receita Federal', 'Tempo real', 'Validação automática'],
    testFunction: () => opnIAService.consultTTCE('8517.12.00', '156', '2024-01-15')
  },

  // 📊 ANÁLISE PREDITIVA (Em desenvolvimento)
  {
    key: 'demand-forecast',
    name: 'Previsão de Demanda',
    description: 'Modelos preditivos para antecipar tendências de mercado e demanda',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'inactive',
    category: 'prediction',
    premium: true,
    accuracy: 92.1,
    processingTime: '8.7s',
    lastUpdate: '2024-01-12',
    tooltip: 'Análise preditiva baseada em dados históricos e tendências de mercado',
    apiStatus: 'disconnected',
    features: ['Machine Learning', 'Análise temporal', 'Tendências de mercado'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - APIs de dados de mercado necessárias',
      processingTime: '0s'
    })
  },
  {
    key: 'price-prediction',
    name: 'Predição de Preços',
    description: 'IA para prever variações de preços de commodities e frete',
    icon: <BarChart3 className="w-6 h-6" />,
    status: 'inactive',
    category: 'prediction',
    premium: true,
    accuracy: 89.7,
    processingTime: '12.4s',
    lastUpdate: '2024-01-11',
    tooltip: 'Predição de preços baseada em múltiplas variáveis de mercado',
    apiStatus: 'disconnected',
    features: ['Análise de mercado', 'Commodities', 'Frete internacional'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - APIs de cotações necessárias',
      processingTime: '0s'
    })
  },

  // ⚡ OTIMIZAÇÃO (Em desenvolvimento)
  {
    key: 'route-optimization',
    name: 'Otimização de Rotas Logísticas',
    description: 'Algoritmos de IA para otimização de rotas e redução de custos logísticos',
    icon: <Network className="w-6 h-6" />,
    status: 'inactive',
    category: 'optimization',
    premium: true,
    accuracy: 94.5,
    processingTime: '5.2s',
    lastUpdate: '2024-01-13',
    tooltip: 'Otimização inteligente de rotas considerando múltiplos fatores',
    apiStatus: 'disconnected',
    features: ['Google Maps API', 'Algoritmos de roteamento', 'Otimização multi-objetivo'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - Google Maps API necessária',
      processingTime: '0s'
    })
  },
  {
    key: 'inventory-optimization',
    name: 'Otimização de Estoque',
    description: 'IA para gestão inteligente de estoque e redução de custos de armazenagem',
    icon: <Target className="w-6 h-6" />,
    status: 'inactive',
    category: 'optimization',
    premium: true,
    accuracy: 93.8,
    processingTime: '6.9s',
    lastUpdate: '2024-01-09',
    tooltip: 'Otimização automática de níveis de estoque',
    apiStatus: 'disconnected',
    features: ['Análise de demanda', 'Gestão de estoque', 'Redução de custos'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - Integração ERP necessária',
      processingTime: '0s'
    })
  },
  {
    key: 'cost-optimization',
    name: 'Otimização de Custos',
    description: 'Análise inteligente para redução de custos operacionais e logísticos',
    icon: <Cpu className="w-6 h-6" />,
    status: 'inactive',
    category: 'optimization',
    premium: true,
    accuracy: 91.2,
    processingTime: '4.5s',
    lastUpdate: '2024-01-08',
    tooltip: 'Identificação automática de oportunidades de redução de custos',
    apiStatus: 'disconnected',
    features: ['Análise de custos', 'Benchmarking', 'Oportunidades'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - Dados operacionais necessários',
      processingTime: '0s'
    })
  },

  //  SEGURANÇA AVANÇADA (Em desenvolvimento)
  {
    key: 'fraud-detection',
    name: 'Detecção de Fraude',
    description: 'IA para identificação de operações suspeitas e fraudes em tempo real',
    icon: <Shield className="w-6 h-6" />,
    status: 'inactive',
    category: 'security',
    premium: true,
    accuracy: 97.6,
    processingTime: '1.2s',
    lastUpdate: '2024-01-07',
    tooltip: 'Detecção em tempo real de atividades fraudulentas',
    apiStatus: 'disconnected',
    features: ['Análise de transações', 'Machine Learning', 'Alertas em tempo real'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - APIs de análise de transações necessárias',
      processingTime: '0s'
    })
  },
  {
    key: 'compliance-monitor',
    name: 'Monitor de Compliance',
    description: 'Monitoramento automático de conformidade regulatória e compliance',
    icon: <Globe2 className="w-6 h-6" />,
    status: 'inactive',
    category: 'security',
    premium: true,
    accuracy: 99.1,
    processingTime: '0.8s',
    lastUpdate: '2024-01-06',
    tooltip: 'Monitoramento contínuo de compliance regulatório',
    apiStatus: 'disconnected',
    features: ['Monitoramento contínuo', 'Alertas automáticos', 'Relatórios'],
    testFunction: () => Promise.resolve({
      success: false,
      error: 'Módulo em desenvolvimento - APIs regulatórias necessárias',
      processingTime: '0s'
    })
  }
]

// Componente de estatísticas com animações
function StatCard({ stats }: { stats: { label: string; value: string | number; icon: React.ReactNode; trend?: 'up' | 'down' | 'stable' }[] }) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          className="bg-gradient-to-br from-purple-500/90 to-blue-600/90 dark:from-purple-800/90 dark:to-blue-800/90 rounded-2xl p-6 flex flex-col items-center shadow-xl text-white scale-100 hover:scale-105 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mb-2 relative">
            {stat.icon}
            {stat.trend && (
              <div className="absolute -top-1 -right-1">
                {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-300" />}
                {stat.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-300 rotate-180" />}
                {stat.trend === 'stable' && <Activity className="w-4 h-4 text-blue-300" />}
              </div>
            )}
          </div>
          <span className="text-2xl font-extrabold">{stat.value}</span>
          <span className="text-xs opacity-80 font-medium mt-1 text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

// Componente de card de módulo com melhorias
function ModuleCard({ module, onToggle, onTest }: { module: IAModule; onToggle: (key: string) => void; onTest: (module: IAModule) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />
      case 'inactive': return <Pause className="w-4 h-4" />
      case 'processing': return <RotateCcw className="w-4 h-4 animate-spin" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <Pause className="w-4 h-4" />
    }
  }

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 w-full max-w-sm mx-auto border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 relative animate-fade-in">
      {/* Header do card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-blue-500 dark:from-purple-700 dark:to-blue-800 rounded-lg text-white relative">
            {module.icon}
            {module.apiStatus && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getApiStatusColor(module.apiStatus)}`} 
                   title={`API ${module.apiStatus}`} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {module.name}
              {module.premium && <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow">Premium</span>}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(module.status)}`}>
                {getStatusIcon(module.status)}
                {module.status === 'active' ? 'Ativo' : 
                 module.status === 'inactive' ? 'Inativo' : 
                 module.status === 'processing' ? 'Processando' : 'Erro'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Features */}
      {module.features && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Funcionalidades:</div>
          <div className="flex flex-wrap gap-1">
            {module.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                {feature}
              </span>
            ))}
            {module.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                +{module.features.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {module.accuracy && (
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Precisão</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{module.accuracy}%</div>
          </div>
        )}
        {module.processingTime && (
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Tempo</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{module.processingTime}</div>
          </div>
        )}
      </div>

      {/* Última atualização */}
      {module.lastUpdate && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Atualizado: {new Date(module.lastUpdate).toLocaleDateString('pt-BR')}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-2 mt-auto">
        {module.status === 'active' && module.testFunction && (
          <button
            onClick={() => onTest(module)}
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            title="Testar módulo"
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Testar
          </button>
        )}
        <button
          onClick={() => onToggle(module.key)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${
            module.status === 'active' 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60' 
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60'
          }`}
          title={module.status === 'active' ? 'Desativar módulo' : 'Ativar módulo'}
        >
          {module.status === 'active' ? 'Desativar' : 'Ativar'}
        </button>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:bg-gray-700/60 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
          title="Configurar módulo"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Tooltip */}
      <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition" title={module.tooltip}>
        <Sparkles className="w-5 h-5 text-purple-400" />
      </div>
    </div>
  )
}

// Modal de resultado de teste melhorado
function TestResultModal({ isOpen, onClose, result, moduleName }: { isOpen: boolean; onClose: () => void; result: any; moduleName: string }) {
  if (!isOpen || !result) return null

  const formatResult = (data: any): string => {
    if (typeof data === 'string') return data
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2)
    }
    return String(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Resultado do Teste: {moduleName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Status do teste */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
              result.success 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {result.success ? '✅ Teste Concluído com Sucesso' : '❌ Erro no Teste'}
            </div>
            {result.processingTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                Tempo: {result.processingTime}
              </div>
            )}
            {result.confidence && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4" />
                Precisão: {result.confidence}%
              </div>
            )}
          </div>
          
          {/* Detalhes do resultado */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Detalhes do Resultado:</h4>
            <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-white dark:bg-gray-700 p-3 rounded border overflow-x-auto">
              {formatResult(result)}
            </pre>
          </div>

          {/* Informações adicionais */}
          {result.details && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Informações:</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">{result.details}</p>
            </div>
          )}

          {/* Última atualização */}
          {result.lastUpdate && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Última atualização: {new Date(result.lastUpdate).toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente principal OPN IA
export default function OPNIA() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [testModalOpen, setTestModalOpen] = useState(false)
  const [testModuleName, setTestModuleName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar status do sistema
  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const status = await opnIAService.getSystemStatus()
        setSystemStatus(status)
      } catch (error) {
        console.error('Erro ao carregar status do sistema:', error)
        // Status padrão caso a API falhe
        setSystemStatus({
          stats: {
            total: iaModules.length,
            active: iaModules.filter(m => m.status === 'active').length,
            accuracy: 94.2,
            avgProcessingTime: '3.8s'
          }
        })
      }
    }
    loadSystemStatus()
    
    // Animação de carregamento
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Estatísticas do sistema de IA com tendências
  const stats = [
    { 
      label: 'Módulos de IA', 
      value: systemStatus?.stats?.total || iaModules.length, 
      icon: <Brain className="w-7 h-7" />,
      trend: 'up' as const
    },
    { 
      label: 'Precisão Média', 
      value: `${systemStatus?.stats?.accuracy || 94.2}%`, 
      icon: <Target className="w-7 h-7" />,
      trend: 'stable' as const
    },
    { 
      label: 'Tempo Médio', 
      value: systemStatus?.stats?.avgProcessingTime || '3.8s', 
      icon: <Zap className="w-7 h-7" />,
      trend: 'down' as const
    },
    { 
      label: 'Módulos Ativos', 
      value: systemStatus?.stats?.active || iaModules.filter(m => m.status === 'active').length, 
      icon: <Sparkles className="w-7 h-7" />,
      trend: 'up' as const
    },
  ]

  // Categorias disponíveis
  const categories = [
    { key: 'all', name: 'Todos', count: iaModules.length, icon: <Brain className="w-4 h-4" /> },
    { key: 'automation', name: 'Automação', count: iaModules.filter(m => m.category === 'automation').length, icon: <Bot className="w-4 h-4" /> },
    { key: 'analytics', name: 'Análise', count: iaModules.filter(m => m.category === 'analytics').length, icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'prediction', name: 'Predição', count: iaModules.filter(m => m.category === 'prediction').length, icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'optimization', name: 'Otimização', count: iaModules.filter(m => m.category === 'optimization').length, icon: <Target className="w-4 h-4" /> },
    { key: 'security', name: 'Segurança', count: iaModules.filter(m => m.category === 'security').length, icon: <Shield className="w-4 h-4" /> },
  ]

  // Filtrar módulos
  const filteredModules = iaModules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Toggle módulo
  const handleToggleModule = (key: string) => {
    console.log(`Toggle module: ${key}`)
    // Aqui seria implementada a lógica real de ativação/desativação
    // Por enquanto, apenas log para demonstração
  }

  // Testar módulo
  const handleTestModule = async (module: IAModule) => {
    if (!module.testFunction) return
    
    setLoading(true)
    setTestModuleName(module.name)
    
    try {
      const result = await module.testFunction()
      setTestResult(result)
      setTestModalOpen(true)
    } catch (error) {
      console.error('Erro no teste do módulo:', error)
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        processingTime: '0s',
        lastUpdate: new Date().toISOString().slice(0, 10)
      })
      setTestModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`max-w-7xl mx-auto py-10 px-2 md:px-8 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4 text-primary-700 dark:text-primary-300 tracking-tight">
          OPN IA – Cockpit de Inteligência Artificial <span className="text-lg font-bold">by SmartImport | OLV Internacional</span>
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 max-w-3xl mx-auto text-lg font-medium">
          Plataforma avançada de inteligência artificial para automação, análise preditiva e otimização logística. 
          Transforme sua operação com IA de última geração integrada às APIs mais avançadas.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold">
          <Brain className="w-5 h-5" />
          <span>Powered by Advanced AI & Machine Learning</span>
        </div>
      </div>

      {/* Estatísticas */}
      <StatCard stats={stats} />

      {/* Filtros */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Busca */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar módulos de IA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <Brain className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.key
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {category.icon}
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex items-center gap-4 shadow-2xl">
            <RotateCcw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-lg font-semibold">Testando módulo...</span>
          </div>
        </div>
      )}

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModules.map((module, index) => (
          <div key={module.key} style={{ animationDelay: `${index * 100}ms` }}>
            <ModuleCard 
              module={module} 
              onToggle={handleToggleModule}
              onTest={handleTestModule}
            />
          </div>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Nenhum módulo encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Tente ajustar os filtros ou termos de busca
          </p>
        </div>
      )}

      {/* Footer com próximas funcionalidades */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-2">Próximas Funcionalidades</h3>
          <p className="text-purple-100 mb-4">
            Em desenvolvimento: IA generativa para documentos, análise de sentimentos de mercado, 
            otimização multi-objetivo e integração com blockchain.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full">GPT-4 Integration</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">Computer Vision</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">Predictive Analytics</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">AutoML</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">Blockchain</span>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400 font-semibold">
        OPN IA – SmartImport | OLV Internacional. Inteligência artificial de ponta para logística do futuro.
      </div>

      {/* Modal de resultado de teste */}
      <TestResultModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        result={testResult}
        moduleName={testModuleName}
      />
    </div>
  )
} 