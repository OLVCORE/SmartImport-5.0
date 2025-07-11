import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Ship, 
  Plane, 
  Truck,
  MapPin,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Users,
  Target,
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Calculator
} from 'lucide-react'
import { useSimulationStore } from '../store/simulationStore'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { getCustomsRegimes, getRecentSimulations } = useSimulationStore()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for charts
  const simulationData = [
    { name: 'Jan', value: 45 },
    { name: 'Fev', value: 52 },
    { name: 'Mar', value: 38 },
    { name: 'Abr', value: 65 },
    { name: 'Mai', value: 72 },
    { name: 'Jun', value: 58 }
  ]

  const revenueData = [
    { name: 'Jan', revenue: 125000, costs: 98000 },
    { name: 'Fev', revenue: 142000, costs: 105000 },
    { name: 'Mar', revenue: 118000, costs: 92000 },
    { name: 'Abr', revenue: 168000, costs: 125000 },
    { name: 'Mai', revenue: 185000, costs: 138000 },
    { name: 'Jun', value: 152000, costs: 115000 }
  ]

  const productCategories = [
    { name: 'Eletrônicos', value: 35, color: '#3B82F6' },
    { name: 'Têxteis', value: 25, color: '#10B981' },
    { name: 'Máquinas', value: 20, color: '#F59E0B' },
    { name: 'Químicos', value: 15, color: '#EF4444' },
    { name: 'Outros', value: 5, color: '#8B5CF6' }
  ]

  const recentSimulations = [
    {
      id: 1,
      product: 'Smartphone Samsung Galaxy',
      origin: 'China',
      destination: 'São Paulo',
      value: 25000,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 2,
      product: 'Máquina Industrial CNC',
      origin: 'Alemanha',
      destination: 'Rio de Janeiro',
      value: 150000,
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: 3,
      product: 'Tecidos de Algodão',
      origin: 'Índia',
      destination: 'Minas Gerais',
      value: 8500,
      status: 'completed',
      date: '2024-01-13'
    }
  ]

  const stats = [
    {
      title: 'Total de Simulações',
      value: '1,234',
      change: '+12.5%',
      changeType: 'positive',
      icon: Calculator,
      color: 'blue'
    },
    {
      title: 'Valor Total',
      value: 'R$ 2.5M',
      change: '+8.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Produtos Simulados',
      value: '567',
      change: '+15.2%',
      changeType: 'positive',
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'orange'
    }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <>
      <Helmet>
        <title>Dashboard - SmartImport 5.0</title>
        <meta name="description" content="Dashboard principal do SmartImport 5.0 - Visão geral das simulações e métricas" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visão geral das suas simulações e métricas de importação
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
              <Plus size={16} />
              <span>Nova Simulação</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulation Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tendência de Simulações
              </h3>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">+15.2%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue vs Costs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receita vs Custos
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Receita</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Custos</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costs" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Product Categories & Recent Simulations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Categorias de Produtos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productCategories.map((entry, index) => (
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

          {/* Recent Simulations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Simulações Recentes
              </h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {recentSimulations.map((simulation) => (
                <div key={simulation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {simulation.product}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {simulation.origin} → {simulation.destination}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(simulation.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      R$ {simulation.value.toLocaleString('pt-BR')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      simulation.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {simulation.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard 