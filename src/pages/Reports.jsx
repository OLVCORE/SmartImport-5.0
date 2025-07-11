import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  MapPin,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  Activity,
  Target,
  Globe,
  Ship,
  Plane,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts'
import toast from 'react-hot-toast'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data para relatórios
  const mockData = {
    overview: {
      totalSimulations: 1234,
      totalValue: 2500000,
      averageProfitability: 72.5,
      completedSimulations: 987,
      pendingSimulations: 156,
      draftSimulations: 91
    },
    monthlyTrends: [
      { month: 'Jan', simulations: 45, value: 125000, profitability: 68.2 },
      { month: 'Fev', simulations: 52, value: 142000, profitability: 71.5 },
      { month: 'Mar', simulations: 38, value: 118000, profitability: 69.8 },
      { month: 'Abr', simulations: 65, value: 168000, profitability: 73.2 },
      { month: 'Mai', simulations: 72, value: 185000, profitability: 75.1 },
      { month: 'Jun', simulations: 58, value: 152000, profitability: 72.8 }
    ],
    productCategories: [
      { name: 'Eletrônicos', value: 35, color: '#3B82F6' },
      { name: 'Têxteis', value: 25, color: '#10B981' },
      { name: 'Máquinas', value: 20, color: '#F59E0B' },
      { name: 'Químicos', value: 15, color: '#EF4444' },
      { name: 'Outros', value: 5, color: '#8B5CF6' }
    ],
    countries: [
      { country: 'China', simulations: 456, value: 920000, percentage: 37 },
      { country: 'Estados Unidos', simulations: 234, value: 580000, percentage: 23 },
      { country: 'Alemanha', simulations: 189, value: 420000, percentage: 17 },
      { country: 'Japão', simulations: 156, value: 320000, percentage: 13 },
      { country: 'Coreia do Sul', simulations: 98, value: 180000, percentage: 7 },
      { country: 'Outros', simulations: 101, value: 80000, percentage: 3 }
    ],
    transportModes: [
      { mode: 'Marítimo', simulations: 678, value: 1450000, percentage: 55 },
      { mode: 'Aéreo', simulations: 412, value: 850000, percentage: 34 },
      { mode: 'Terrestre', simulations: 144, value: 200000, percentage: 11 }
    ],
    states: [
      { state: 'SP', simulations: 456, value: 980000, percentage: 39 },
      { state: 'RJ', simulations: 234, value: 520000, percentage: 21 },
      { state: 'MG', simulations: 189, value: 380000, percentage: 15 },
      { state: 'RS', simulations: 156, value: 320000, percentage: 13 },
      { state: 'PR', simulations: 98, value: 180000, percentage: 7 },
      { state: 'Outros', simulations: 101, value: 120000, percentage: 5 }
    ],
    taxAnalysis: [
      { month: 'Jan', ii: 20000, ipi: 10000, pis: 2625, cofins: 12062, icms: 22500, fcp: 2500 },
      { month: 'Fev', simulations: 52, value: 142000, profitability: 71.5 },
      { month: 'Mar', simulations: 38, value: 118000, profitability: 69.8 },
      { month: 'Abr', simulations: 65, value: 168000, profitability: 73.2 },
      { month: 'Mai', simulations: 72, value: 185000, profitability: 75.1 },
      { month: 'Jun', simulations: 58, value: 152000, profitability: 72.8 }
    ]
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const reports = [
    {
      id: 'overview',
      name: 'Visão Geral',
      description: 'Resumo geral das simulações',
      icon: BarChart3
    },
    {
      id: 'trends',
      name: 'Tendências Mensais',
      description: 'Evolução das simulações ao longo do tempo',
      icon: TrendingUp
    },
    {
      id: 'categories',
      name: 'Categorias de Produtos',
      description: 'Distribuição por tipo de produto',
      icon: Package
    },
    {
      id: 'countries',
      name: 'Países de Origem',
      description: 'Análise por país de origem',
      icon: Globe
    },
    {
      id: 'transport',
      name: 'Modais de Transporte',
      description: 'Distribuição por modal',
      icon: Ship
    },
    {
      id: 'states',
      name: 'Estados de Destino',
      description: 'Análise por estado brasileiro',
      icon: MapPin
    },
    {
      id: 'taxes',
      name: 'Análise Tributária',
      description: 'Detalhamento de impostos',
      icon: DollarSign
    }
  ]

  const handleExport = (format) => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success(`Relatório exportado em ${format.toUpperCase()}`)
      setIsLoading(false)
    }, 2000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total de Simulações',
            value: formatNumber(mockData.overview.totalSimulations),
            change: '+12.5%',
            changeType: 'positive',
            icon: BarChart3,
            color: 'blue'
          },
          {
            title: 'Valor Total',
            value: formatCurrency(mockData.overview.totalValue),
            change: '+8.3%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'green'
          },
          {
            title: 'Lucratividade Média',
            value: `${mockData.overview.averageProfitability}%`,
            change: '+2.1%',
            changeType: 'positive',
            icon: Target,
            color: 'purple'
          },
          {
            title: 'Taxa de Conclusão',
            value: `${((mockData.overview.completedSimulations / mockData.overview.totalSimulations) * 100).toFixed(1)}%`,
            change: '+1.8%',
            changeType: 'positive',
            icon: CheckCircle,
            color: 'green'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  vs período anterior
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tendências Mensais
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">+15.2%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mockData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="simulations" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="profitability" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Categorias de Produtos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={mockData.productCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.productCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )

  const renderTrends = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Evolução das Simulações
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Simulações</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Lucratividade (%)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={mockData.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis yAxisId="left" stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="value" fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" />
            <Line yAxisId="right" type="monotone" dataKey="profitability" stroke="#10B981" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Distribuição por Categoria
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={mockData.productCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.productCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {mockData.productCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderCountries = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Países de Origem
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mockData.countries} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis dataKey="country" type="category" stroke="#6B7280" width={100} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value) => [formatCurrency(value), 'Valor']}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )

  const renderTransport = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Modais de Transporte
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={mockData.transportModes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mode, percent }) => `${mode} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.transportModes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {mockData.transportModes.map((mode, index) => (
              <div key={mode.mode} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {index === 0 && <Ship size={20} className="text-blue-500" />}
                  {index === 1 && <Plane size={20} className="text-green-500" />}
                  {index === 2 && <Truck size={20} className="text-orange-500" />}
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mode.mode}
                    </span>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatNumber(mode.simulations)} simulações
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(mode.value)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {mode.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderStates = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Estados de Destino
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mockData.states}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="state" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value) => [formatCurrency(value), 'Valor']}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )

  const renderTaxes = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Análise Tributária Mensal
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mockData.taxAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value) => [formatCurrency(value), 'Valor']}
            />
            <Legend />
            <Bar dataKey="ii" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ipi" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pis" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cofins" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="icms" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fcp" fill="#EC4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverview()
      case 'trends':
        return renderTrends()
      case 'categories':
        return renderCategories()
      case 'countries':
        return renderCountries()
      case 'transport':
        return renderTransport()
      case 'states':
        return renderStates()
      case 'taxes':
        return renderTaxes()
      default:
        return renderOverview()
    }
  }

  return (
    <>
      <Helmet>
        <title>Relatórios - SmartImport 5.0</title>
        <meta name="description" content="Relatórios e análises de simulações de importação" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Relatórios e Análises
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize insights e tendências das suas simulações
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              <Download size={16} />
              <span>{isLoading ? 'Exportando...' : 'Exportar PDF'}</span>
            </button>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`flex flex-col items-center p-4 rounded-lg border transition-colors duration-200 ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon size={20} className="mb-2" />
                  <span className="text-xs font-medium text-center">{report.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </>
  )
}

export default Reports 