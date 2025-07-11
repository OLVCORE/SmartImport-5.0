import React, { useState, useEffect } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { 
  Ship, 
  Plane, 
  Truck, 
  Calculator, 
  Save, 
  RefreshCw, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Package,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

console.log('[SmartImport] Simulator carregado')

const Simulator = () => {
  const {
    simulation,
    setSimulationData,
    calculateSimulation,
    saveSimulation,
    clearSimulation,
    getCustomsRegimes,
    getCustomsLocations,
    getExtraExpenses,
    getICMSRates,
    getFCPRates
  } = useSimulationStore()

  const [activeTab, setActiveTab] = useState('basic')
  const [showResults, setShowResults] = useState(false)

  const customsRegimes = getCustomsRegimes() || []
  const customsLocations = getCustomsLocations() || {}
  const extraExpenses = getExtraExpenses() || []
  const icmsRates = getICMSRates() || {}
  const fcpRates = getFCPRates() || {}

  // Estados brasileiros
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  // Países de origem
  const originCountries = [
    'China', 'Estados Unidos', 'Alemanha', 'Japão', 'Coreia do Sul',
    'Itália', 'França', 'Reino Unido', 'Canadá', 'México',
    'Índia', 'Taiwan', 'Singapura', 'Holanda', 'Bélgica'
  ]

  const handleInputChange = (field, value) => {
    setSimulationData({ [field]: value })
  }

  const handleCalculate = async () => {
    await calculateSimulation()
    setShowResults(true)
  }

  const handleSave = async () => {
    try {
      await saveSimulation()
      alert('Simulação salva com sucesso!')
    } catch (error) {
      alert('Erro ao salvar simulação: ' + error.message)
    }
  }

  const handleClear = () => {
    clearSimulation()
    setShowResults(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`
  }

  const getTransportModeIcon = (mode) => {
    switch (mode) {
      case 'maritime': return <Ship className="w-5 h-5" />
      case 'air': return <Plane className="w-5 h-5" />
      case 'land': return <Truck className="w-5 h-5" />
      default: return <Ship className="w-5 h-5" />
    }
  }

  const getRegimeColor = (regime) => {
    const regimeData = (customsRegimes || []).find(r => r.code === regime)
    if (!regimeData) return 'bg-gray-100'
    
    switch (regimeData.calculationMethod) {
      case 'standard': return 'bg-blue-100 text-blue-800'
      case 'temporary': return 'bg-yellow-100 text-yellow-800'
      case 'drawback': return 'bg-green-100 text-green-800'
      case 'reimport': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Simulador de Importação
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Calcule custos, impostos e despesas de importação com precisão
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCalculate}
                disabled={simulation.isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Calculator className="w-5 h-5 mr-2" />
                {simulation.isLoading ? 'Calculando...' : 'Calcular'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar
              </button>
              <button
                onClick={handleClear}
                className="flex items-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'basic', label: 'Dados Básicos', icon: Package },
                  { id: 'logistics', label: 'Logística', icon: MapPin },
                  { id: 'fiscal', label: 'Fiscal', icon: Shield },
                  { id: 'expenses', label: 'Despesas', icon: DollarSign }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {/* Dados Básicos */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome do Produto
                        </label>
                        <input
                          type="text"
                          value={simulation.productName}
                          onChange={(e) => handleInputChange('productName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Ex: Smartphone iPhone 15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Código NCM
                        </label>
                        <input
                          type="text"
                          value={simulation.ncmCode}
                          onChange={(e) => handleInputChange('ncmCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Ex: 8517.13.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          País de Origem
                        </label>
                        <select
                          value={simulation.originCountry}
                          onChange={(e) => handleInputChange('originCountry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          {originCountries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado de Origem
                        </label>
                        <select
                          value={simulation.originState}
                          onChange={(e) => handleInputChange('originState', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          {brazilianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado de Destino
                        </label>
                        <select
                          value={simulation.destinationState}
                          onChange={(e) => handleInputChange('destinationState', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          {brazilianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Valor do Produto (USD)
                        </label>
                        <input
                          type="number"
                          value={simulation.productValue}
                          onChange={(e) => handleInputChange('productValue', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frete (USD)
                        </label>
                        <input
                          type="number"
                          value={simulation.freightValue}
                          onChange={(e) => handleInputChange('freightValue', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Seguro (USD)
                        </label>
                        <input
                          type="number"
                          value={simulation.insuranceValue}
                          onChange={(e) => handleInputChange('insuranceValue', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Logística */}
                {activeTab === 'logistics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modal de Transporte
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { mode: 'maritime', label: 'Marítimo', icon: Ship },
                            { mode: 'air', label: 'Aéreo', icon: Plane },
                            { mode: 'land', label: 'Terrestre', icon: Truck }
                          ].map(({ mode, label, icon: Icon }) => (
                            <button
                              key={mode}
                              onClick={() => handleInputChange('transportMode', mode)}
                              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                                simulation.transportMode === mode
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <Icon className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Local de Desembaraço
                        </label>
                        <select
                          value={simulation.customsLocation}
                          onChange={(e) => handleInputChange('customsLocation', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Selecione...</option>
                          {(customsLocations[simulation.transportMode] || []).map(location => (
                            <option key={location.code} value={location.code}>
                              {location.name} - {location.city}/{location.state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Peso (toneladas)
                        </label>
                        <input
                          type="number"
                          value={simulation.weight}
                          onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Containers
                        </label>
                        <input
                          type="number"
                          value={simulation.containers}
                          onChange={(e) => handleInputChange('containers', parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dias de Armazenagem
                        </label>
                        <input
                          type="number"
                          value={simulation.storageDays}
                          onChange={(e) => handleInputChange('storageDays', parseInt(e.target.value) || 5)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Fiscal */}
                {activeTab === 'fiscal' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Regime Aduaneiro
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(customsRegimes || []).map(regime => (
                          <button
                            key={regime.code}
                            onClick={() => handleInputChange('customsRegime', regime.code)}
                            className={`flex items-start p-4 rounded-lg border-2 transition-colors text-left ${
                              simulation.customsRegime === regime.code
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {regime.code} - {regime.name}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegimeColor(regime.code)}`}>
                                  {regime.calculationMethod}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {regime.description}
                              </p>
                              <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                {regime.requiresLicense && (
                                  <span className="flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Licença
                                  </span>
                                )}
                                {regime.hasIncentives && (
                                  <span className="flex items-center">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    Incentivos
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ICMS Interestadual */}
                    {simulation.originState && simulation.destinationState && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          ICMS Interestadual
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Origem ({simulation.originState}):</span>
                            <div className="font-medium">{formatPercentage(icmsRates[simulation.originState] || 18.0)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Destino ({simulation.destinationState}):</span>
                            <div className="font-medium">{formatPercentage(icmsRates[simulation.destinationState] || 18.0)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">FCP:</span>
                            <div className="font-medium">{formatPercentage(fcpRates[simulation.destinationState] || 2.0)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Diferencial:</span>
                            <div className="font-medium text-blue-600 dark:text-blue-400">
                              {simulation.originState !== simulation.destinationState ? 'Sim' : 'Não'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Despesas */}
                {activeTab === 'expenses' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Despesas Extras
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(extraExpenses || []).map(expense => (
                          <label
                            key={expense.code}
                            className="flex items-start p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={simulation.selectedExtraExpenses.includes(expense.code)}
                              onChange={(e) => {
                                const newExpenses = e.target.checked
                                  ? [...simulation.selectedExtraExpenses, expense.code]
                                  : simulation.selectedExtraExpenses.filter(code => code !== expense.code)
                                handleInputChange('selectedExtraExpenses', newExpenses)
                              }}
                              className="mt-1 mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {expense.name}
                                </span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {expense.calculationMethod === 'percentage' 
                                    ? `${expense.rate}%` 
                                    : formatCurrency(expense.rate)
                                  }
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {expense.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Resultados da Simulação
              </h3>

              {simulation.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 dark:text-red-400 text-sm">
                      {simulation.error}
                    </span>
                  </div>
                </div>
              )}

              {showResults && simulation.lastCalculated && (
                <div className="space-y-6">
                  {/* Resumo */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                      Resumo da Simulação
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Produto:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {simulation.productName || 'Não informado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">NCM:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {simulation.ncmCode || 'Não informado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Modal:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100 flex items-center">
                          {getTransportModeIcon(simulation.transportMode)}
                          <span className="ml-1 capitalize">{simulation.transportMode}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Regime:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {(customsRegimes || []).find(r => r.code === simulation.customsRegime)?.name || 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Valor do Produto:</span>
                      <span className="font-medium">${simulation.productValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Frete:</span>
                      <span className="font-medium">${simulation.freightValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Seguro:</span>
                      <span className="font-medium">${simulation.insuranceValue.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-medium">
                        <span>Base de Cálculo:</span>
                        <span>${(simulation.productValue + simulation.freightValue + simulation.insuranceValue).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Impostos */}
                  {Object.keys(simulation.calculatedTaxes).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Impostos</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">II:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.ii)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">IPI:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.ipi)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">PIS:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.pis)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">COFINS:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.cofins)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">ICMS:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.icms)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">FCP:</span>
                          <span className="font-medium">{formatCurrency(simulation.calculatedTaxes.fcp)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Impostos:</span>
                            <span className="text-red-600 dark:text-red-400">
                              {formatCurrency(
                                simulation.calculatedTaxes.ii + 
                                simulation.calculatedTaxes.ipi + 
                                simulation.calculatedTaxes.pis + 
                                simulation.calculatedTaxes.cofins + 
                                simulation.calculatedTaxes.icms + 
                                simulation.calculatedTaxes.fcp
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Despesas */}
                  {simulation.calculatedExpenses?.customs && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Despesas Aduaneiras</h4>
                      <div className="space-y-2 text-sm">
                        {(simulation.calculatedExpenses.customs.details || []).map((expense, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{expense.name}:</span>
                            <span className="font-medium">{formatCurrency(expense.amount)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Despesas:</span>
                            <span className="text-orange-600 dark:text-orange-400">
                              {formatCurrency(simulation.calculatedExpenses.customs.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Incentivos */}
                  {simulation.calculatedIncentives?.totalSavings > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Incentivos Fiscais</h4>
                      <div className="space-y-2 text-sm">
                        {(simulation.calculatedIncentives.details || []).map((incentive, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{incentive.name}:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              -{formatCurrency(incentive.savings)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total Economia:</span>
                            <span className="text-green-600 dark:text-green-400">
                              -{formatCurrency(simulation.calculatedIncentives.totalSavings)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Licenças */}
                  {(simulation.requiredLicenses || []).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Licenças Obrigatórias</h4>
                      <div className="space-y-2">
                        {(simulation.requiredLicenses || []).map((license, index) => (
                          <div key={index} className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                {license.name}
                              </div>
                              <div className="text-xs text-yellow-600 dark:text-yellow-300">
                                Custo: {formatCurrency(license.cost)} | Prazo: {license.processingTime} dias
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Final:</span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatCurrency(simulation.totalCost)}
                      </span>
                    </div>
                  </div>

                  {/* Última atualização */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Última atualização: {new Date(simulation.lastCalculated).toLocaleString('pt-BR')}
                  </div>
                </div>
              )}

              {!showResults && (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Preencha os dados e clique em "Calcular" para ver os resultados
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulator 