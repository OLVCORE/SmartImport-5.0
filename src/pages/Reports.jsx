import React, { useState, useEffect } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  DollarSign,
  Package,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Printer,
  Share2,
  Eye,
  Settings
} from 'lucide-react'

console.log('[SmartImport] Reports carregado')

const Reports = () => {
  const { fetchSimulations, getCustomsRegimes, getCustomsLocations, getFiscalIncentives } = useSimulationStore()
  
  const [simulations, setSimulations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [filters, setFilters] = useState({
    regime: 'all',
    location: 'all',
    transportMode: 'all'
  })

  const customsRegimes = getCustomsRegimes() || []
  const customsLocations = getCustomsLocations() || {}
  const fiscalIncentives = getFiscalIncentives() || []
  const requiredLicenses = getRequiredLicenses() || []

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSimulations()
      setSimulations(data)
    } catch (error) {
      console.error('Erro ao carregar dados para relatórios:', error)
      // Usar dados mock para demonstração
      const mockData = generateMockSimulations()
      setSimulations(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockSimulations = () => {
    const mockSimulations = []
    const products = [
      'Smartphone iPhone 15', 'Notebook Dell XPS', 'Tablet Samsung Galaxy',
      'Smart TV LG OLED', 'Fone de Ouvido Sony', 'Câmera Canon EOS',
      'Drone DJI Mavic', 'Console PlayStation 5', 'Smartwatch Apple Watch',
      'Monitor Dell UltraSharp', 'Impressora HP LaserJet', 'Scanner Epson',
      'Teclado Mecânico Logitech', 'Mouse Gaming Razer', 'Webcam Logitech',
      'Microfone Blue Yeti', 'Placa de Vídeo RTX 4080', 'Processador Intel i9',
      'SSD Samsung 1TB', 'Memória RAM Corsair 32GB'
    ]
    const countries = ['China', 'Estados Unidos', 'Alemanha', 'Japão', 'Coreia do Sul', 'Itália', 'França', 'Taiwan']
    const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'CE', 'GO', 'MT', 'MS', 'PA', 'PE', 'PI']
    const regimes = ['01', '02', '03', '04', '05', '06']
    const modes = ['maritime', 'air', 'land']

    for (let i = 0; i < 100; i++) {
      const productValue = Math.random() * 15000 + 2000
      const freightValue = Math.random() * 2000 + 500
      const insuranceValue = productValue * 0.03
      const baseCalculo = productValue + freightValue + insuranceValue
      
      const regime = regimes[Math.floor(Math.random() * regimes.length)]
      const taxes = calculateTaxesByRegime(regime, baseCalculo)
      const expenses = Math.random() * 800 + 200
      const hasIncentives = Math.random() > 0.6
      const incentives = hasIncentives ? baseCalculo * 0.05 : 0
      const totalCost = baseCalculo + taxes.total + expenses - incentives

      mockSimulations.push({
        id: `sim_${i + 1}`,
        productName: products[Math.floor(Math.random() * products.length)],
        ncmCode: `${Math.floor(Math.random() * 99) + 1}.${Math.floor(Math.random() * 99) + 1}.${Math.floor(Math.random() * 99) + 1}`,
        originCountry: countries[Math.floor(Math.random() * countries.length)],
        originState: states[Math.floor(Math.random() * states.length)],
        destinationState: states[Math.floor(Math.random() * states.length)],
        transportMode: modes[Math.floor(Math.random() * modes.length)],
        customsRegime: regime,
        customsLocation: `BR${states[Math.floor(Math.random() * states.length)]}`,
        productValue,
        freightValue,
        insuranceValue,
        weight: Math.random() * 30 + 5,
        containers: Math.floor(Math.random() * 8) + 1,
        storageDays: Math.floor(Math.random() * 20) + 5,
        calculatedTaxes: taxes,
        calculatedExpenses: { customs: { total: expenses }, extra: { total: 0 } },
        calculatedIncentives: { totalSavings: incentives },
        requiredLicenses: Math.random() > 0.7 ? ['MAPA', 'IBAMA', 'ANVISA'] : [],
        totalCost,
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.2 ? 'calculated' : 'draft'
      })
    }

    return mockSimulations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const calculateTaxesByRegime = (regime, baseCalculo) => {
    const regimeData = (customsRegimes || []).find(r => r.code === regime)
    if (!regimeData) return { total: 0, ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, fcp: 0 }

    switch (regimeData.calculationMethod) {
      case 'standard':
        return {
          ii: baseCalculo * 0.16,
          ipi: baseCalculo * 0.08,
          pis: baseCalculo * 0.021,
          cofins: baseCalculo * 0.0965,
          icms: baseCalculo * 0.18,
          fcp: baseCalculo * 0.02,
          total: baseCalculo * 0.4775
        }
      case 'temporary':
      case 'drawback':
        return { total: 0, ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, fcp: 0 }
      case 'reimport':
        return {
          ii: baseCalculo * 0.08,
          ipi: baseCalculo * 0.04,
          pis: baseCalculo * 0.021,
          cofins: baseCalculo * 0.0965,
          icms: baseCalculo * 0.18,
          fcp: baseCalculo * 0.02,
          total: baseCalculo * 0.3975
        }
      default:
        return { total: 0, ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, fcp: 0 }
    }
  }

  const getFilteredData = () => {
    let filtered = simulations.filter(sim => sim.status === 'calculated')

    // Filtro por período
    const now = new Date()
    const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 180
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    filtered = filtered.filter(sim => new Date(sim.createdAt) >= cutoffDate)

    // Filtros adicionais
    if (filters.regime !== 'all') {
      filtered = filtered.filter(sim => sim.customsRegime === filters.regime)
    }
    if (filters.transportMode !== 'all') {
      filtered = filtered.filter(sim => sim.transportMode === filters.transportMode)
    }

    return filtered
  }

  const calculateReportStats = () => {
    const data = getFilteredData()
    
    const totalSimulations = data.length
    const totalValue = data.reduce((acc, sim) => acc + sim.totalCost, 0)
    const averageCost = totalSimulations > 0 ? totalValue / totalSimulations : 0
    
    // Estatísticas por regime
    const regimeStats = {}
    data.forEach(sim => {
      const regimeName = (customsRegimes || []).find(r => r.code === sim.customsRegime)?.name || 'Desconhecido'
      if (!regimeStats[regimeName]) {
        regimeStats[regimeName] = { count: 0, totalValue: 0, averageTaxes: 0 }
      }
      regimeStats[regimeName].count++
      regimeStats[regimeName].totalValue += sim.totalCost
      regimeStats[regimeName].averageTaxes += sim.calculatedTaxes.total
    })

    // Estatísticas por modal
    const modalStats = {}
    data.forEach(sim => {
      const modalName = getTransportModeName(sim.transportMode)
      if (!modalStats[modalName]) {
        modalStats[modalName] = { count: 0, totalValue: 0 }
      }
      modalStats[modalName].count++
      modalStats[modalName].totalValue += sim.totalCost
    })

    // Top produtos
    const productStats = {}
    data.forEach(sim => {
      if (!productStats[sim.productName]) {
        productStats[sim.productName] = { count: 0, totalValue: 0 }
      }
      productStats[sim.productName].count++
      productStats[sim.productName].totalValue += sim.totalCost
    })

    // Top países
    const countryStats = {}
    data.forEach(sim => {
      if (!countryStats[sim.originCountry]) {
        countryStats[sim.originCountry] = { count: 0, totalValue: 0 }
      }
      countryStats[sim.originCountry].count++
      countryStats[sim.originCountry].totalValue += sim.totalCost
    })

    return {
      totalSimulations,
      totalValue,
      averageCost,
      regimeStats,
      modalStats,
      productStats,
      countryStats
    }
  }

  const getTransportModeName = (mode) => {
    switch (mode) {
      case 'maritime': return 'Marítimo'
      case 'air': return 'Aéreo'
      case 'land': return 'Terrestre'
      default: return 'Marítimo'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value, total) => {
    return `${((value / total) * 100).toFixed(1)}%`
  }

  const handleExport = (format) => {
    const stats = calculateReportStats()
    const data = getFilteredData()
    
    let exportData = {
      reportType: selectedReport,
      dateRange: dateRange,
      filters: filters,
      generatedAt: new Date().toISOString(),
      summary: stats,
      details: data
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio_importacao_${new Date().toISOString().split('T')[0]}.json`
      a.click()
    } else if (format === 'csv') {
      // Implementar exportação CSV
      console.log('Exportando CSV...')
    } else if (format === 'pdf') {
      // Implementar exportação PDF
      console.log('Exportando PDF...')
    }
  }

  const renderOverviewReport = () => {
    const stats = calculateReportStats()
    
    return (
      <div className="space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Simulações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSimulations}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Custo Médio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.averageCost)}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Período</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dateRange}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regimes Aduaneiros */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Distribuição por Regime Aduaneiro
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.regimeStats)
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5)
                .map(([regime, data]) => (
                  <div key={regime} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">{regime}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(data.totalValue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.count / stats.totalSimulations) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{data.count} simulações</span>
                        <span>{formatPercentage(data.count, stats.totalSimulations)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Modais de Transporte */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Modais de Transporte
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.modalStats)
                .sort(([,a], [,b]) => b.count - a.count)
                .map(([modal, data]) => (
                  <div key={modal} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">{modal}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(data.totalValue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(data.count / stats.totalSimulations) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{data.count} simulações</span>
                        <span>{formatPercentage(data.count, stats.totalSimulations)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Top Produtos e Países */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Top Produtos
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.productStats)
                .sort(([,a], [,b]) => b.totalValue - a.totalValue)
                .slice(0, 5)
                .map(([product, data]) => (
                  <div key={product} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{product}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{data.count} simulações</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {formatCurrency(data.totalValue)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercentage(data.totalValue, stats.totalValue)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Top Países de Origem
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.countryStats)
                .sort(([,a], [,b]) => b.totalValue - a.totalValue)
                .slice(0, 5)
                .map(([country, data]) => (
                  <div key={country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{country}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{data.count} simulações</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {formatCurrency(data.totalValue)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercentage(data.totalValue, stats.totalValue)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDetailedReport = () => {
    const data = getFilteredData()
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Detalhado - {data.length} Simulações
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">NCM</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Origem</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Modal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Regime</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Valor Total</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Impostos</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 20).map((sim) => (
                  <tr key={sim.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{sim.productName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{sim.ncmCode}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{sim.originCountry}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{getTransportModeName(sim.transportMode)}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {(customsRegimes || []).find(r => r.code === sim.customsRegime)?.name}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(sim.totalCost)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">
                      {formatCurrency(sim.calculatedTaxes.total)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">
                      {new Date(sim.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data.length > 20 && (
            <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
              Mostrando 20 de {data.length} simulações. Use a exportação para ver todos os dados.
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Relatórios de Importação
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Análises detalhadas e exportação de dados de simulação
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport('json')}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="overview">Visão Geral</option>
                <option value="detailed">Relatório Detalhado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="180d">Últimos 180 dias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Regime
              </label>
              <select
                value={filters.regime}
                onChange={(e) => setFilters({ ...filters, regime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todos</option>
                {(customsRegimes || []).map(regime => (
                  <option key={regime.code} value={regime.code}>
                    {regime.code} - {regime.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modal
              </label>
              <select
                value={filters.transportMode}
                onChange={(e) => setFilters({ ...filters, transportMode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="maritime">Marítimo</option>
                <option value="air">Aéreo</option>
                <option value="land">Terrestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        {selectedReport === 'overview' ? renderOverviewReport() : renderDetailedReport()}
      </div>
    </div>
  )
}

export default Reports 