import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  Ship,
  Plane,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  FileText,
  BarChart3
} from 'lucide-react'
import { useSimulationStore } from '../store/simulationStore'
import toast from 'react-hot-toast'

const History = () => {
  const { getSimulations, deleteSimulation } = useSimulationStore()
  const [simulations, setSimulations] = useState([])
  const [filteredSimulations, setFilteredSimulations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data para simulações
  const mockSimulations = [
    {
      id: 1,
      productName: 'Smartphone Samsung Galaxy S24',
      ncmCode: '8517.12.00',
      originCountry: 'China',
      destinationState: 'SP',
      transportMode: 'maritime',
      totalValue: 25000,
      finalValue: 42500,
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      profitability: 70.0,
      taxes: {
        ii: 4000,
        ipi: 2000,
        pis: 525,
        cofins: 2412.5,
        icms: 4500,
        fcp: 500
      }
    },
    {
      id: 2,
      productName: 'Máquina Industrial CNC',
      ncmCode: '8457.10.00',
      originCountry: 'Alemanha',
      destinationState: 'RJ',
      transportMode: 'air',
      totalValue: 150000,
      finalValue: 285000,
      status: 'pending',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T16:10:00Z',
      profitability: 90.0,
      taxes: {
        ii: 24000,
        ipi: 12000,
        pis: 3150,
        cofins: 14475,
        icms: 27000,
        fcp: 3000
      }
    },
    {
      id: 3,
      productName: 'Tecidos de Algodão',
      ncmCode: '5208.52.00',
      originCountry: 'Índia',
      destinationState: 'MG',
      transportMode: 'maritime',
      totalValue: 8500,
      finalValue: 14450,
      status: 'completed',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T10:30:00Z',
      profitability: 70.0,
      taxes: {
        ii: 1360,
        ipi: 680,
        pis: 178.5,
        cofins: 820.25,
        icms: 1530,
        fcp: 170
      }
    },
    {
      id: 4,
      productName: 'Componentes Eletrônicos',
      ncmCode: '8542.31.00',
      originCountry: 'Taiwan',
      destinationState: 'RS',
      transportMode: 'air',
      totalValue: 12000,
      finalValue: 20400,
      status: 'completed',
      createdAt: '2024-01-12T11:45:00Z',
      updatedAt: '2024-01-12T13:20:00Z',
      profitability: 70.0,
      taxes: {
        ii: 1920,
        ipi: 960,
        pis: 252,
        cofins: 1158,
        icms: 2160,
        fcp: 240
      }
    },
    {
      id: 5,
      productName: 'Ferramentas Industriais',
      ncmCode: '8205.51.00',
      originCountry: 'Estados Unidos',
      destinationState: 'PR',
      transportMode: 'maritime',
      totalValue: 35000,
      finalValue: 59500,
      status: 'draft',
      createdAt: '2024-01-11T16:30:00Z',
      updatedAt: '2024-01-11T17:45:00Z',
      profitability: 70.0,
      taxes: {
        ii: 5600,
        ipi: 2800,
        pis: 735,
        cofins: 3377.5,
        icms: 6300,
        fcp: 700
      }
    }
  ]

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setSimulations(mockSimulations)
      setFilteredSimulations(mockSimulations)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filtrar simulações
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
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sim => sim.status === statusFilter)
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(sim => new Date(sim.createdAt) >= filterDate)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(sim => new Date(sim.createdAt) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(sim => new Date(sim.createdAt) >= filterDate)
          break
        default:
          break
      }
    }

    setFilteredSimulations(filtered)
  }, [simulations, searchTerm, statusFilter, dateFilter])

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      setSimulations(prev => prev.filter(sim => sim.id !== id))
      toast.success('Simulação excluída com sucesso!')
    }
  }

  const handleExport = (simulation) => {
    toast.success(`Exportando simulação: ${simulation.productName}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />
      case 'draft':
        return <AlertCircle size={16} className="text-gray-500" />
      default:
        return <Clock size={16} className="text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluída'
      case 'pending':
        return 'Pendente'
      case 'draft':
        return 'Rascunho'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const getTransportIcon = (mode) => {
    switch (mode) {
      case 'maritime':
        return <Ship size={16} />
      case 'air':
        return <Plane size={16} />
      case 'land':
        return <Truck size={16} />
      default:
        return <Ship size={16} />
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Histórico - SmartImport 5.0</title>
        <meta name="description" content="Histórico de simulações de importação" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Histórico de Simulações
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize e gerencie todas as suas simulações de importação
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
              <Download size={16} />
              <span>Exportar Tudo</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar simulações..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluídas</option>
              <option value="pending">Pendentes</option>
              <option value="draft">Rascunhos</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as Datas</option>
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filteredSimulations.length} simulação{filteredSimulations.length !== 1 ? 'ões' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Simulations List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NCM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Origem → Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Modal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSimulations.map((simulation, index) => (
                  <motion.tr
                    key={simulation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {simulation.productName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(simulation.totalValue)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                        {simulation.ncmCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {simulation.originCountry} → {simulation.destinationState}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getTransportIcon(simulation.transportMode)}
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {simulation.transportMode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(simulation.finalValue)}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          +{simulation.profitability.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(simulation.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(simulation.status)}`}>
                          {getStatusText(simulation.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(simulation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleExport(simulation)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="Exportar"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(simulation.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSimulations.length === 0 && (
            <div className="text-center py-12">
              <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma simulação encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie sua primeira simulação no simulador'
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredSimulations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Valor Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatCurrency(filteredSimulations.reduce((sum, sim) => sum + sim.finalValue, 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Produtos Simulados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {filteredSimulations.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Lucratividade Média
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {filteredSimulations.length > 0 
                        ? (filteredSimulations.reduce((sum, sim) => sum + sim.profitability, 0) / filteredSimulations.length).toFixed(1)
                        : 0
                      }%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Concluídas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {filteredSimulations.filter(sim => sim.status === 'completed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default History 