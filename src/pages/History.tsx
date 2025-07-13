import React, { useState, useMemo } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { History as HistoryIcon, Search, Filter, Download, Eye } from 'lucide-react'
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

const History: React.FC = () => {
  const { simulations } = useSimulationStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSimulations = useMemo(() => {
    return simulations.filter(sim => {
      const matchesSearch =
        sim.productName?.toLowerCase().includes(search.toLowerCase()) ||
        sim.originCountry?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || sim.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [simulations, search, filterStatus])

  const totalValue = filteredSimulations.reduce((sum, sim) => sum + (sim.totalCost || 0), 0)
  const totalFOB = filteredSimulations.reduce((sum, sim) => sum + (sim.fobValue || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <HistoryIcon className="h-7 w-7 text-blue-600 mr-2" />
                Histórico de Simulações
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize todas as suas simulações anteriores, filtre, pesquise e exporte resultados.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Tooltip content="Pesquisar por produto ou país de origem">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar simulação..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </Tooltip>
              <Tooltip content="Filtrar por status da simulação">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="completed">Concluídos</option>
                  <option value="pending">Pendentes</option>
                  <option value="failed">Falhos</option>
                </select>
              </Tooltip>
              <Tooltip content="Exportar histórico para CSV">
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => toast.success('Exportação em desenvolvimento')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Simulações</span>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredSimulations.length}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor FOB Total</span>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">USD {totalFOB.toLocaleString()}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Custo Total</span>
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">USD {totalValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor FOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Custo Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Origem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSimulations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 dark:text-gray-500">
                      Nenhuma simulação encontrada.
                    </td>
                  </tr>
                )}
                {filteredSimulations.map((simulation) => (
                  <tr key={simulation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {simulation.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {simulation.date ? new Date(simulation.date).toLocaleDateString('pt-BR') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        USD {simulation.fobValue?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        USD {simulation.totalCost?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {simulation.originCountry}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        simulation.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : simulation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {simulation.status === 'completed' ? 'Concluído' : simulation.status === 'pending' ? 'Pendente' : 'Falho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Tooltip content="Visualizar detalhes da simulação">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Exportar simulação em PDF">
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <Download className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History 