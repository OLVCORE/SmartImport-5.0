import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EssenciaisTab from '../components/SimulatorTabs/EssenciaisTab'
import ProdutoTab from '../components/SimulatorTabs/ProdutoTab'
import ValoresTab from '../components/SimulatorTabs/ValoresTab'
import AduanaTab from '../components/SimulatorTabs/AduanaTab'
import TributosTab from '../components/SimulatorTabs/TributosTab'
import IncentivosTab from '../components/SimulatorTabs/IncentivosTab'
import LicencasTab from '../components/SimulatorTabs/LicencasTab'
import ResultadosTab from '../components/SimulatorTabs/ResultadosTab'

const TABS = [
  { 
    id: 'essenciais', 
    label: 'Essenciais', 
    description: 'Informações básicas da operação',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    id: 'produto', 
    label: 'Produto', 
    description: 'Detalhes dos produtos a importar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    id: 'valores', 
    label: 'Valores', 
    description: 'Valores e custos da operação',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  { 
    id: 'aduana', 
    label: 'Aduana', 
    description: 'Despesas e informações aduaneiras',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    id: 'tributos', 
    label: 'Tributos', 
    description: 'Cálculo de impostos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    id: 'incentivos', 
    label: 'Incentivos', 
    description: 'Benefícios fiscais e incentivos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  { 
    id: 'licencas', 
    label: 'Licenças', 
    description: 'Autorizações e licenças necessárias',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    id: 'resultados', 
    label: 'Resultados', 
    description: 'Resumo final e custos totais',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
]

// Tipagem para os dados essenciais e demais campos
interface FormData {
  produto: string
  ncm: string
  paisOrigem: string
  ufDesembaraco: string
  ufDestino: string
  modal: string
  quantidade: string | number
  valorFob: string | number
  moeda: string
  zonaAduaneira: string
  produtos: { id: string; descricao: string; ncm: string; quantidade: number; valorUnitario: number }[]
  [key: string]: any // Para permitir extensões dinâmicas
}

// Componente Tooltip
const Tooltip: React.FC<{ children: React.ReactNode; content: string; position?: 'top' | 'bottom' | 'left' | 'right' }> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
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

const Simulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('essenciais')
  const [formData, setFormData] = useState<FormData>({
    produto: '',
    ncm: '',
    paisOrigem: '',
    ufDesembaraco: '',
    ufDestino: '',
    modal: '',
    quantidade: '',
    valorFob: '',
    moeda: '',
    zonaAduaneira: '',
    produtos: [],
  })
  const [calculation, setCalculation] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Debug log
  console.log('🎯 Simulator component loaded, pathname:', location.pathname)
  console.log('🎯 Simulator component state:', { activeTab, formData: Object.keys(formData) })

  useEffect(() => {
    // Simular carregamento para animações
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Atualiza dados do formulário
  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  // Avança aba
  const nextTab = () => {
    const idx = TABS.findIndex(t => t.id === activeTab)
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id)
  }
  // Volta aba
  const prevTab = () => {
    const idx = TABS.findIndex(t => t.id === activeTab)
    if (idx > 0) setActiveTab(TABS[idx - 1].id)
  }

  // Só libera as abas após preenchimento dos essenciais
  const essenciaisPreenchidos = formData.paisOrigem && formData.ufDesembaraco && formData.ufDestino && 
                                formData.modal && formData.moeda && formData.zonaAduaneira && 
                                formData.produtos && formData.produtos.length > 0 &&
                                formData.produtos.every(p => p.descricao && p.descricao.trim() !== '' && p.ncm && p.ncm.trim() !== '')

  // Progresso da simulação
  const progressPercentage = ((TABS.findIndex(t => t.id === activeTab) + 1) / TABS.length) * 100

  // Painel de resumo dos dados essenciais
  const Resumo = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resumo da Simulação
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Progresso:</span>
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tooltip content="País de origem dos produtos a serem importados">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">País Origem</div>
            <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">{formData.paisOrigem || 'Não informado'}</div>
          </div>
        </Tooltip>
        <Tooltip content="Estado onde será realizado o desembaraço aduaneiro">
          <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">UF Desembaraço</div>
            <div className="text-sm font-semibold text-green-900 dark:text-green-100">{formData.ufDesembaraco || 'Não informado'}</div>
          </div>
        </Tooltip>
        <Tooltip content="Estado de destino final dos produtos">
          <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">UF Destino</div>
            <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">{formData.ufDestino || 'Não informado'}</div>
          </div>
        </Tooltip>
        <Tooltip content="Modal de transporte utilizado na importação">
          <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg">
            <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Modal</div>
            <div className="text-sm font-semibold text-orange-900 dark:text-orange-100">{formData.modal || 'Não informado'}</div>
          </div>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Tooltip content="Moeda utilizada na operação de importação">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Moeda</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{formData.moeda || 'Não informado'}</div>
          </div>
        </Tooltip>
        <Tooltip content="Quantidade total de produtos cadastrados">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Produtos</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{formData.produtos ? formData.produtos.length : 0}</div>
          </div>
        </Tooltip>
        <Tooltip content="Valor total dos produtos em moeda estrangeira">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {formData.produtos ? 
          formData.produtos.reduce((acc, p) => acc + (p.quantidade * p.valorUnitario), 0).toFixed(2) : 
              '0.00'} {formData.moeda}
            </div>
          </div>
        </Tooltip>
      </div>

      {formData.produtos && formData.produtos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center mb-3">
            <svg className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Produtos Cadastrados</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {formData.produtos.map((produto, index) => (
              <div key={produto.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {produto.descricao.substring(0, 40)}...
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {produto.quantidade}x {produto.valorUnitario} {formData.moeda}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  useEffect(() => {
    // Resetar simulador ao entrar na rota /simulator
    if (location.pathname === '/simulator') {
      setFormData({
        produto: '',
        ncm: '',
        paisOrigem: '',
        ufDesembaraco: '',
        ufDestino: '',
        modal: '',
        quantidade: '',
        valorFob: '',
        moeda: '',
        zonaAduaneira: '',
        produtos: [],
      })
      setActiveTab('essenciais')
    }
    // eslint-disable-next-line
  }, [location.pathname])

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6 space-y-6">
        {/* Header do Simulador */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Simulador de Importação
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Simule operações completas com cálculo real e inteligência artificial
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Tooltip content="Exibir guia de ajuda e dicas de uso">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Abrir guia de ajuda"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ajuda
                </button>
              </Tooltip>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Voltar ao Dashboard"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Dashboard
              </button>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sistema Online
              </div>
            </div>
          </div>
        </div>

        {/* Guia de Ajuda */}
        {showHelp && (
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Guia de Uso do Simulador
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                aria-label="Fechar guia de ajuda"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <h4 className="font-semibold mb-2">📋 Etapa Essenciais</h4>
                <p>Preencha as informações básicas da operação: país de origem, estados de desembaraço e destino, modal de transporte e moeda.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📦 Etapa Produto</h4>
                <p>Cadastre os produtos a serem importados com suas descrições, quantidades e valores unitários.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💰 Etapa Valores</h4>
                <p>Informe os valores FOB, frete internacional, seguro e outros custos relacionados à operação.</p>
              </div>
      <div>
                <h4 className="font-semibold mb-2">🚢 Etapa Logística</h4>
                <p>Configure as informações de transporte, armazenagem e distribuição dos produtos.</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progresso da Simulação
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Etapa {TABS.findIndex(t => t.id === activeTab) + 1} de {TABS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
      </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id
              const isDisabled = !essenciaisPreenchidos && tab.id !== 'essenciais'
              const isCompleted = index < TABS.findIndex(t => t.id === activeTab)
              
              return (
                <Tooltip key={tab.id} content={tab.description}>
          <button
            onClick={() => essenciaisPreenchidos || tab.id === 'essenciais' ? setActiveTab(tab.id) : null}
                    disabled={isDisabled}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md focus:ring-blue-500'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 focus:ring-green-500'
                        : isDisabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
                    }`}
                    aria-label={`${tab.label} - ${isActive ? 'Ativo' : isCompleted ? 'Concluído' : 'Pendente'}`}
                  >
                    <span className="mr-2 text-lg" role="img" aria-hidden="true">
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        tab.icon
                      )}
                    </span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.icon}</span>
          </button>
                </Tooltip>
              )
            })}
          </div>
      </div>

      {/* Painel de resumo visível em todas as etapas (exceto Essenciais) */}
      {activeTab !== 'essenciais' && <Resumo />}

      {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {activeTab === 'essenciais' && (
        <EssenciaisTab data={formData} onChange={updateFormData} onNext={nextTab} />
      )}
      {activeTab === 'produto' && (
        <ProdutoTab data={formData} onChange={updateFormData} onNext={nextTab} />
      )}
      {activeTab === 'valores' && (
        <ValoresTab data={formData} onChange={updateFormData} onNext={nextTab} onPrev={prevTab} />
      )}
      {activeTab === 'aduana' && (
        <AduanaTab data={formData} onChange={updateFormData} onNext={nextTab} onPrev={prevTab} />
      )}
      {activeTab === 'tributos' && (
        <TributosTab data={formData} onChange={updateFormData} onNext={nextTab} onPrev={prevTab} />
      )}
      {activeTab === 'incentivos' && (
        <IncentivosTab data={formData} onChange={updateFormData} onNext={nextTab} onPrev={prevTab} />
      )}
      {activeTab === 'licencas' && (
        <LicencasTab data={formData} onChange={updateFormData} onNext={nextTab} onPrev={prevTab} />
      )}
      {activeTab === 'resultados' && (
        <ResultadosTab data={formData} calculation={calculation} onPrev={prevTab} />
      )}
        </div>
      </div>
    </div>
  )
}

export default Simulator 