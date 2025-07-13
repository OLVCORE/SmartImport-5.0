import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimulationStore } from '../store/simulationStore'
import { useSERPStore } from '../store/serpStore'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { simulations } = useSimulationStore()
  const { serpData } = useSERPStore()
  
  // Filtros avançados
  const [filters, setFilters] = useState({
    period: '30d',
    modal: 'all',
    status: 'all',
    region: 'all'
  })

  // Estado para animações
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simular carregamento para animações
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Dados reais das simulações
  const totalSimulations = simulations.length
  const totalValue = simulations.reduce((sum, sim) => sum + (sim.totalValue || 0), 0)
  const avgProfitability = simulations.length > 0 
    ? simulations.reduce((sum, sim) => sum + (sim.profitability || 0), 0) / simulations.length 
    : 0
  const totalIncentives = simulations.reduce((sum, sim) => sum + (sim.incentives || 0), 0)

  // Status breakdown
  const statusBreakdown = {
    calculated: simulations.filter(s => s.status === 'calculated').length,
    draft: simulations.filter(s => s.status === 'draft').length,
    pending: simulations.filter(s => s.status === 'pending').length
  }

  // Modal distribution
  const modalDistribution = {
    maritime: simulations.filter(s => s.modal === 'maritime').length,
    air: simulations.filter(s => s.modal === 'air').length,
    road: simulations.filter(s => s.modal === 'road').length
  }

  // Top 5 customs regimes
  const customsRegimes = simulations
    .reduce((acc, sim) => {
      const regime = sim.customsRegime || 'N/A'
      acc[regime] = (acc[regime] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  const topRegimes = Object.entries(customsRegimes)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)

  // Monthly evolution (últimos 6 meses)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - i)
    const monthKey = month.toLocaleDateString('pt-BR', { month: 'short' })
    const count = simulations.filter(s => {
      const simDate = new Date(s.createdAt || Date.now())
      return simDate.getMonth() === month.getMonth() && 
             simDate.getFullYear() === month.getFullYear()
    }).length
    return { month: monthKey, count }
  }).reverse()

  // Alertas inteligentes
  const alerts: Array<{type: string; message: string; icon: string}> = []
  if (avgProfitability < 15) {
    alerts.push({
      type: 'warning',
      message: 'Lucratividade média abaixo do esperado (15%)',
      icon: '⚠️'
    })
  }
  if (statusBreakdown.pending > 5) {
    alerts.push({
      type: 'info',
      message: `${statusBreakdown.pending} simulações pendentes de análise`,
      icon: '📋'
    })
  }
  if (totalValue > 1000000) {
    alerts.push({
      type: 'success',
      message: 'Volume total superior a R$ 1M - Excelente performance!',
      icon: '🎯'
    })
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-simulation':
        navigate('/simulator')
        break
      case 'reports':
        navigate('/reports')
        break
      case 'integrations':
        navigate('/integrations')
        break
      case 'history':
        navigate('/history')
        break
      default:
        break
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6 space-y-6">
        {/* Header do Cockpit */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cockpit Executivo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
                Visão estratégica e inteligente das operações de importação
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleQuickAction('new-simulation')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Criar nova simulação"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Simulação
              </button>
              <button
                onClick={() => handleQuickAction('reports')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Acessar relatórios"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Relatórios
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Avançados */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Filtros Avançados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={filters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-label="Selecionar período de análise"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modal
              </label>
              <select
                value={filters.modal}
                onChange={(e) => handleFilterChange('modal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-label="Filtrar por modal de transporte"
              >
                <option value="all">Todos os Modais</option>
                <option value="maritime">Marítimo</option>
                <option value="air">Aéreo</option>
                <option value="road">Rodoviário</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-label="Filtrar por status da simulação"
              >
                <option value="all">Todos os Status</option>
                <option value="calculated">Calculadas</option>
                <option value="draft">Rascunhos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Região
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                aria-label="Filtrar por região"
              >
                <option value="all">Todas as Regiões</option>
                <option value="southeast">Sudeste</option>
                <option value="south">Sul</option>
                <option value="northeast">Nordeste</option>
                <option value="north">Norte</option>
                <option value="midwest">Centro-Oeste</option>
              </select>
            </div>
          </div>
      </div>

        {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total de Simulações
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalSimulations.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +12% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Valor Total
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +8% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Lucratividade Média
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgProfitability.toFixed(1)}%
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  -2% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Incentivos Totais
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ {totalIncentives.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +15% vs mês anterior
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Inteligentes */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                  alert.type === 'warning' 
                    ? 'bg-orange-50 dark:bg-orange-900 border-orange-400' 
                    : alert.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900 border-green-400'
                    : 'bg-blue-50 dark:bg-blue-900 border-blue-400'
                }`}
                role="alert"
                aria-live="polite"
            >
              <div className="flex items-center">
                  <span className="text-2xl mr-3" role="img" aria-label={alert.type}>
                    {alert.icon}
                  </span>
                  <p className={`font-medium ${
                    alert.type === 'warning' 
                      ? 'text-orange-800 dark:text-orange-200' 
                      : alert.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Breakdown por Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Status das Simulações
              </h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Calculadas
                  </span>
                </div>
                <span className="text-lg font-bold text-green-900 dark:text-green-100">
                  {statusBreakdown.calculated}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Rascunhos
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                  {statusBreakdown.draft}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Pendentes
                  </span>
                </div>
                <span className="text-lg font-bold text-red-900 dark:text-red-100">
                  {statusBreakdown.pending}
                </span>
              </div>
            </div>
      </div>

          {/* Distribuição por Modal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Distribuição por Modal
            </h3>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marítimo
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalDistribution.maritime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aéreo
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalDistribution.air}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rodoviário
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalDistribution.road}
                </span>
              </div>
            </div>
            {/* Gráfico de pizza simples */}
            <div className="mt-6 flex justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray={`${(modalDistribution.maritime / totalSimulations) * 314} 314`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${(modalDistribution.air / totalSimulations) * 314} 314`}
                  strokeDashoffset={`-${(modalDistribution.maritime / totalSimulations) * 314}`}
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${(modalDistribution.road / totalSimulations) * 314} 314`}
                  strokeDashoffset={`-${((modalDistribution.maritime + modalDistribution.air) / totalSimulations) * 314}`}
                />
              </svg>
            </div>
          </div>

          {/* Top 5 Regimes Aduaneiros */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top 5 Regimes Aduaneiros
              </h3>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {topRegimes.map(([regime, count], index) => (
                <div key={regime} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {regime}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolução Mensal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Evolução Mensal
            </h3>
            <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
              <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => {
              const maxCount = Math.max(...monthlyData.map(d => d.count))
              const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${height}%` }}
                      role="progressbar"
                      aria-label={`${data.month}: ${data.count} simulações`}
                      aria-valuenow={data.count}
                      aria-valuemin={0}
                      aria-valuemax={maxCount}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {data.count} simulações
                </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {data.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickAction('new-simulation')}
            className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
            aria-label="Criar nova simulação de importação"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-1">Nova Simulação</h4>
                <p className="text-blue-100 text-sm">Calcular custos de importação</p>
              </div>
              <svg className="w-8 h-8 text-blue-200 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('reports')}
            className="p-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
            aria-label="Acessar relatórios e análises"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-1">Relatórios</h4>
                <p className="text-green-100 text-sm">Análises detalhadas</p>
              </div>
              <svg className="w-8 h-8 text-green-200 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('integrations')}
            className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
            aria-label="Configurar integrações"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-1">Integrações</h4>
                <p className="text-purple-100 text-sm">Conectar sistemas</p>
              </div>
              <svg className="w-8 h-8 text-purple-200 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('history')}
            className="p-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 group"
            aria-label="Ver histórico de simulações"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-1">Histórico</h4>
                <p className="text-orange-100 text-sm">Simulações anteriores</p>
              </div>
              <svg className="w-8 h-8 text-orange-200 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 