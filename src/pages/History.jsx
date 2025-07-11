import React, { useState, useEffect } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  Shield,
  DollarSign,
  Package,
  Ship,
  Plane,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  FileText,
  Award
} from 'lucide-react'

const History = () => {
  const { fetchSimulations, getCustomsRegimes, getCustomsLocations, getFiscalIncentives } = useSimulationStore()
  
  const [simulations, setSimulations] = useState([])
  const [filteredSimulations, setFilteredSimulations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    regime: 'all',
    location: 'all',
    transportMode: 'all',
    dateRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)

  const customsRegimes = getCustomsRegimes()
  const customsLocations = getCustomsLocations()
  const fiscalIncentives = getFiscalIncentives()

  useEffect(() => {
    loadHistoryData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [simulations, searchTerm, filters])

  const loadHistoryData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSimulations()
      setSimulations(data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
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
      'Teclado Mecânico Logitech', 'Mouse Gaming Razer', 'Webcam Logitech'
    ]
    const countries = ['China', 'Estados Unidos', 'Alemanha', 'Japão', 'Coreia do Sul', 'Itália', 'França']
    const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'CE', 'GO', 'MT', 'MS', 'PA', 'PE', 'PI']
    const regimes = ['01', '02', '03', '04', '05', '06']
    const modes = ['maritime', 'air', 'land']
    const statuses = ['calculated', 'draft', 'pending']

    for (let i = 0; i < 50; i++) {
      const productValue = Math.random() * 10000 + 1000
      const freightValue = Math.random() * 1500 + 300
      const insuranceValue = productValue * 0.025
      const baseCalculo = productValue + freightValue + insuranceValue
      
      const regime = regimes[Math.floor(Math.random() * regimes.length)]
      const taxes = calculateTaxesByRegime(regime, baseCalculo)
      const expenses = Math.random() * 500 + 150
      const hasIncentives = Math.random() > 0.7
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
        weight: Math.random() * 20 + 2,
        containers: Math.floor(Math.random() * 5) + 1,
        storageDays: Math.floor(Math.random() * 15) + 5,
        calculatedTaxes: taxes,
        calculatedExpenses: { customs: { total: expenses }, extra: { total: 0 } },
        calculatedIncentives: { totalSavings: incentives },
        requiredLicenses: Math.random() > 0.8 ? ['MAPA', 'IBAMA'] : [],
        totalCost,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      })
    }

    return mockSimulations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const calculateTaxesByRegime = (regime, baseCalculo) => {
    const regimeData = customsRegimes.find(r => r.code === regime)
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

  const applyFilters = () => {
    let filtered = simulations

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(sim =>
        sim.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sim.ncmCode.includes(searchTerm) ||
        sim.originCountry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = filtered.filter(sim => sim.status === filters.status)
    }

    // Filtro por regime
    if (filters.regime !== 'all') {
      filtered = filtered.filter(sim => sim.customsRegime === filters.regime)
    }

    // Filtro por localização
    if (filters.location !== 'all') {
      filtered = filtered.filter(sim => sim.customsLocation === filters.location)
    }

    // Filtro por modal
    if (filters.transportMode !== 'all') {
      filtered = filtered.filter(sim => sim.transportMode === filters.transportMode)
    }

    // Filtro por data
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const daysAgo = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(sim => new Date(sim.createdAt) >= cutoffDate)
    }

    setFilteredSimulations(filtered)
  }

  const getCustomsLocation = (code) => {
    const allLocations = [
      ...customsLocations.maritime,
      ...customsLocations.air,
      ...customsLocations.land
    ]
    return allLocations.find(location => location.code === code)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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

  const getTransportModeIcon = (mode) => {
    switch (mode) {
      case 'maritime': return <Ship className="w-4 h-4" />
      case 'air': return <Plane className="w-4 h-4" />
      case 'land': return <Truck className="w-4 h-4" />
      default: return <Ship className="w-4 h-4" />
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'calculated':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Calculada</span>
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Rascunho</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pendente</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>
    }
  }

  const getRegimeBadge = (regime) => {
    const regimeData = customsRegimes.find(r => r.code === regime)
    if (!regimeData) return null

    const colors = {
      standard: 'bg-blue-100 text-blue-800',
      temporary: 'bg-yellow-100 text-yellow-800',
      drawback: 'bg-green-100 text-green-800',
      reimport: 'bg-purple-100 text-purple-800'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[regimeData.calculationMethod] || 'bg-gray-100 text-gray-800'}`}>
        {regimeData.name}
      </span>
    )
  }

  const handleExport = (format) => {
    // Implementar exportação
    console.log(`Exportando em ${format}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando histórico...</p>
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
                Histórico de Simulações
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize e gerencie todas as simulações realizadas
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos</option>
                  <option value="calculated">Calculadas</option>
                  <option value="draft">Rascunhos</option>
                  <option value="pending">Pendentes</option>
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
                  {customsRegimes.map(regime => (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos</option>
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Limpar Filtros
                </label>
                <button
                  onClick={() => setFilters({
                    status: 'all',
                    regime: 'all',
                    location: 'all',
                    transportMode: 'all',
                    dateRange: 'all'
                  })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por produto, NCM ou país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {filteredSimulations.length} simulação{filteredSimulations.length !== 1 ? 'ões' : ''} encontrada{filteredSimulations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de Simulações */}
        <div className="space-y-4">
          {filteredSimulations.map((simulation) => (
            <div key={simulation.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {simulation.productName}
                      </h3>
                      {getStatusBadge(simulation.status)}
                      {getRegimeBadge(simulation.customsRegime)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        NCM: {simulation.ncmCode}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {simulation.originCountry} → {simulation.destinationState}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTransportModeIcon(simulation.transportMode)}
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {getTransportModeName(simulation.transportMode)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(simulation.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Valores</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Produto:</span>
                          <span className="font-medium">${simulation.productValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Frete:</span>
                          <span className="font-medium">${simulation.freightValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Total:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(simulation.totalCost)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Impostos</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">II + IPI:</span>
                          <span className="font-medium">
                            {formatCurrency(simulation.calculatedTaxes.ii + simulation.calculatedTaxes.ipi)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">ICMS:</span>
                          <span className="font-medium">
                            {formatCurrency(simulation.calculatedTaxes.icms)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Total:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(simulation.calculatedTaxes.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detalhes</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Peso:</span>
                          <span className="font-medium">{simulation.weight.toFixed(2)}t</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Containers:</span>
                          <span className="font-medium">{simulation.containers}</span>
                        </div>
                        {simulation.calculatedIncentives?.totalSavings > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Incentivos:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              -{formatCurrency(simulation.calculatedIncentives.totalSavings)}
                            </span>
                          </div>
                        )}
                        {simulation.requiredLicenses?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              {simulation.requiredLicenses.length} licença{simulation.requiredLicenses.length !== 1 ? 's' : ''} obrigatória{simulation.requiredLicenses.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSimulations.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma simulação encontrada com os filtros aplicados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default History 