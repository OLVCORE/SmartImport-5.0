import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimulationStore } from '../store/simulationStore'
import { useSERPStore } from '../store/serpStore'
import toast from 'react-hot-toast'

// Componente Tooltip
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

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const { simulations } = useSimulationStore()
  const { serpData } = useSERPStore()
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedReport, setSelectedReport] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Dados reais para relatórios
  const totalSimulations = simulations.length
  const totalValue = simulations.reduce((sum, sim) => sum + (sim.totalValue || 0), 0)
  const avgProfitability = simulations.length > 0 
    ? simulations.reduce((sum, sim) => sum + (sim.profitability || 0), 0) / simulations.length 
    : 0

  // Dados por período
  const getPeriodData = (period) => {
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    return simulations.filter(sim => {
      const simDate = new Date(sim.createdAt || Date.now())
      return simDate >= startDate && simDate <= now
    })
  }

  const periodData = getPeriodData(selectedPeriod)

  // Função para gerar relatório
  const generateReport = async (reportType) => {
    setIsGenerating(true)
    setSelectedReport(reportType)
    
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    toast.success(`Relatório ${reportType} gerado com sucesso!`)
  }

  const reportTypes = [
    {
      id: 'monthly',
      title: 'Relatório Mensal',
      description: 'Análise completa das simulações do período selecionado',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue',
      data: {
        simulations: periodData.length,
        value: periodData.reduce((sum, sim) => sum + (sim.totalValue || 0), 0),
        avgProfit: periodData.length > 0 
          ? periodData.reduce((sum, sim) => sum + (sim.profitability || 0), 0) / periodData.length 
          : 0
      }
    },
    {
      id: 'trends',
      title: 'Análise de Tendências',
      description: 'Evolução dos custos e indicadores ao longo do tempo',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'green',
      data: {
        growth: '+12.5%',
        trend: 'up',
        topCountries: ['China', 'Estados Unidos', 'Alemanha'],
        topProducts: ['Eletrônicos', 'Máquinas', 'Produtos Químicos']
      }
    },
    {
      id: 'financial',
      title: 'Relatório Financeiro',
      description: 'Análise detalhada de custos, impostos e rentabilidade',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'purple',
      data: {
        totalCosts: periodData.reduce((sum, sim) => sum + (sim.totalCosts || 0), 0),
        totalTaxes: periodData.reduce((sum, sim) => sum + (sim.totalTaxes || 0), 0),
        totalIncentives: periodData.reduce((sum, sim) => sum + (sim.incentives || 0), 0),
        roi: avgProfitability
      }
    },
    {
      id: 'customs',
      title: 'Relatório Aduaneiro',
      description: 'Análise de procedimentos e despesas aduaneiras',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'orange',
      data: {
        customsExpenses: periodData.reduce((sum, sim) => sum + (sim.customsExpenses || 0), 0),
        avgProcessingTime: '5.2 dias',
        topCustoms: ['Santos', 'Paranaguá', 'Itajaí'],
        clearanceTypes: { green: 65, yellow: 25, red: 10 }
      }
    },
    {
      id: 'logistics',
      title: 'Relatório Logístico',
      description: 'Análise de transportes, fretes e lead times',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: 'teal',
      data: {
        avgFreight: periodData.reduce((sum, sim) => sum + (sim.freight || 0), 0) / periodData.length,
        modalDistribution: { maritime: 60, air: 25, road: 15 },
        avgLeadTime: '18.5 dias',
        topRoutes: ['China-Brasil', 'EUA-Brasil', 'Alemanha-Brasil']
      }
    },
    {
      id: 'compliance',
      title: 'Relatório de Compliance',
      description: 'Análise de conformidade regulatória e licenças',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'indigo',
      data: {
        complianceRate: '98.5%',
        pendingLicenses: 3,
        regulatoryAlerts: 1,
        topRegulations: ['IN 680', 'IN 675', 'IN 672']
      }
    }
  ]

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Relatórios e Análises
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Análises detalhadas e relatórios inteligentes das suas operações de importação
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Tooltip content="Configurar período de análise dos relatórios">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                  <option value="1y">Último ano</option>
                </select>
              </Tooltip>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Voltar ao Dashboard"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Resumo dos Dados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Simulações no Período
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {periodData.length}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +{Math.round((periodData.length / totalSimulations) * 100)}% do total
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Valor Total
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {periodData.reduce((sum, sim) => sum + (sim.totalValue || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +8% vs período anterior
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Lucratividade Média
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {periodData.length > 0 
                    ? (periodData.reduce((sum, sim) => sum + (sim.profitability || 0), 0) / periodData.length).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  -2% vs período anterior
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Relatórios Gerados
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  12
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +3 este mês
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${report.color}-100 dark:bg-${report.color}-900 rounded-lg`}>
                  <div className={`text-${report.color}-600 dark:text-${report.color}-400`}>
                    {report.icon}
                  </div>
                </div>
                <Tooltip content="Baixar relatório em PDF">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
              
              <Tooltip content={report.description}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h3>
              </Tooltip>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {report.description}
              </p>

              {/* Dados do relatório */}
              <div className="mb-4 space-y-2">
                {report.id === 'monthly' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Simulações:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{report.data.simulations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Valor Total:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        R$ {report.data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                                         <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Lucro Médio:</span>
                       <span className="font-medium text-gray-900 dark:text-white">{(report.data.avgProfit || 0).toFixed(1)}%</span>
                     </div>
                  </>
                )}
                
                {report.id === 'trends' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Crescimento:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{report.data.growth}</span>
                    </div>
                                         <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Top País:</span>
                       <span className="font-medium text-gray-900 dark:text-white">{(report.data.topCountries || [])[0] || 'N/A'}</span>
                     </div>
                  </>
                )}

                {report.id === 'financial' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Custos Totais:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        R$ {report.data.totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Impostos:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        R$ {report.data.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                                         <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">ROI:</span>
                       <span className="font-medium text-green-600 dark:text-green-400">{(report.data.roi || 0).toFixed(1)}%</span>
                     </div>
                  </>
                )}
              </div>

              <button
                onClick={() => generateReport(report.id)}
                disabled={isGenerating && selectedReport === report.id}
                className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isGenerating && selectedReport === report.id
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : `bg-${report.color}-600 hover:bg-${report.color}-700 text-white focus:ring-${report.color}-500`
                }`}
              >
                {isGenerating && selectedReport === report.id ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando...
                  </div>
                ) : (
                  'Gerar Relatório'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Gráficos e Análises */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Gráficos e Análises
            </h2>
            <Tooltip content="Configurar visualizações e filtros">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Simulações por Mês</h3>
              <div className="h-48 flex items-end justify-between space-x-2">
                {Array.from({ length: 6 }, (_, i) => {
                  const month = new Date()
                  month.setMonth(month.getMonth() - i)
                  const monthKey = month.toLocaleDateString('pt-BR', { month: 'short' })
                  const count = periodData.filter(sim => {
                    const simDate = new Date(sim.createdAt || Date.now())
                    return simDate.getMonth() === month.getMonth() && 
                           simDate.getFullYear() === month.getFullYear()
                  }).length
                  const maxCount = Math.max(...Array.from({ length: 6 }, (_, j) => {
                    const m = new Date()
                    m.setMonth(m.getMonth() - j)
                    return periodData.filter(sim => {
                      const simDate = new Date(sim.createdAt || Date.now())
                      return simDate.getMonth() === m.getMonth() && 
                             simDate.getFullYear() === m.getFullYear()
                    }).length
                  }))
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <Tooltip content={`${monthKey}: ${count} simulações`}>
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                          style={{ height: `${height}%` }}
                        ></div>
                      </Tooltip>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {monthKey}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribuição por País</h3>
              <div className="space-y-3">
                {['China', 'Estados Unidos', 'Alemanha', 'Japão', 'Coreia do Sul'].map((country, index) => {
                  const count = periodData.filter(sim => sim.paisOrigem === country).length
                  const percentage = periodData.length > 0 ? (count / periodData.length) * 100 : 0
                  
                  return (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{country}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports 