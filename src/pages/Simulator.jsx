import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator,
  Upload,
  FileText,
  Brain,
  DollarSign,
  Ship,
  Plane,
  Truck,
  MapPin,
  Globe,
  Package,
  Shield,
  Download,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react'
import { useSimulationStore } from '../store/simulationStore'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Simulator = () => {
  const { 
    createSimulation, 
    updateSimulation, 
    getCustomsRegimes, 
    getCustomsLocations,
    calculateTaxes,
    saveSimulation 
  } = useSimulationStore()

  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [simulationData, setSimulationData] = useState({
    // Dados básicos
    productName: '',
    productDescription: '',
    ncmCode: '',
    quantity: 1,
    unitValue: 0,
    currency: 'USD',
    
    // Origem e destino
    originCountry: 'China',
    destinationState: 'SP',
    entryPort: 'BRSSZ',
    transportMode: 'maritime',
    
    // Regime aduaneiro
    customsRegime: '06',
    
    // Custos logísticos
    freightCost: 0,
    insuranceCost: 0,
    afrmmCost: 0,
    thcCost: 0,
    storageCost: 0,
    
    // Resultados calculados
    totalValue: 0,
    totalTaxes: 0,
    totalCosts: 0,
    finalValue: 0,
    profitability: 0
  })

  const [extractedText, setExtractedText] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [calculationResults, setCalculationResults] = useState(null)

  // Dropzone para upload de PDF
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: handleFileUpload
  })

  function handleFileUpload(acceptedFiles) {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    toast.loading('Processando arquivo...')

    // Simular processamento OCR
    setTimeout(() => {
      const mockExtractedText = `
        PRODUTO: Smartphone Samsung Galaxy S24
        DESCRIÇÃO: Telefone celular smartphone com tela de 6.2 polegadas,
        processador Snapdragon 8 Gen 3, 256GB de armazenamento,
        câmera tripla de 50MP + 12MP + 10MP, bateria de 4000mAh.
        Peso: 167g, Dimensões: 147.0 x 70.6 x 7.6mm
        MATERIAL: Vidro e alumínio
        FUNÇÃO: Comunicação móvel e computação pessoal
      `
      setExtractedText(mockExtractedText)
      setSimulationData(prev => ({
        ...prev,
        productName: 'Smartphone Samsung Galaxy S24',
        productDescription: mockExtractedText
      }))
      setIsProcessing(false)
      toast.dismiss()
      toast.success('Arquivo processado com sucesso!')
    }, 2000)
  }

  // Simular sugestões de IA
  useEffect(() => {
    if (simulationData.productDescription) {
      const suggestions = [
        { ncm: '8517.12.00', description: 'Smartphones', confidence: 95 },
        { ncm: '8517.13.00', description: 'Telefones celulares', confidence: 90 },
        { ncm: '8517.11.00', description: 'Telefones móveis', confidence: 85 }
      ]
      setAiSuggestions(suggestions)
    }
  }, [simulationData.productDescription])

  // Calcular resultados
  const calculateResults = () => {
    setIsLoading(true)
    
    // Simular cálculo
    setTimeout(() => {
      const baseValue = simulationData.quantity * simulationData.unitValue
      const totalLogistics = simulationData.freightCost + simulationData.insuranceCost + 
                           simulationData.afrmmCost + simulationData.thcCost + simulationData.storageCost
      
      // Simular impostos (valores mock)
      const taxes = {
        ii: baseValue * 0.16, // 16% II
        ipi: baseValue * 0.08, // 8% IPI
        pis: baseValue * 0.021, // 2.1% PIS
        cofins: baseValue * 0.0965, // 9.65% COFINS
        icms: baseValue * 0.18, // 18% ICMS
        fcp: baseValue * 0.02 // 2% FCP
      }
      
      const totalTaxes = Object.values(taxes).reduce((sum, tax) => sum + tax, 0)
      const totalCosts = totalLogistics + totalTaxes
      const finalValue = baseValue + totalCosts
      const profitability = ((finalValue - baseValue) / baseValue) * 100

      setCalculationResults({
        baseValue,
        totalLogistics,
        taxes,
        totalTaxes,
        totalCosts,
        finalValue,
        profitability
      })

      setSimulationData(prev => ({
        ...prev,
        totalValue: baseValue,
        totalTaxes,
        totalCosts,
        finalValue,
        profitability
      }))

      setIsLoading(false)
      toast.success('Cálculo concluído!')
    }, 1500)
  }

  const handleSave = () => {
    saveSimulation(simulationData)
    toast.success('Simulação salva com sucesso!')
  }

  const handleExport = () => {
    toast.success('Relatório exportado!')
  }

  const tabs = [
    { id: 'basic', name: 'Dados Básicos', icon: FileText },
    { id: 'upload', name: 'Upload & OCR', icon: Upload },
    { id: 'ai', name: 'IA & NCM', icon: Brain },
    { id: 'logistics', name: 'Logística', icon: Ship },
    { id: 'taxes', name: 'Tributos', icon: DollarSign },
    { id: 'results', name: 'Resultados', icon: TrendingUp }
  ]

  return (
    <>
      <Helmet>
        <title>Simulador - SmartImport 5.0</title>
        <meta name="description" content="Simulador avançado de importação com IA e OCR" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Simulador de Importação
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Simule operações de importação com IA, OCR e análise tributária avançada
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              <Save size={16} />
              <span>Salvar</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                          value={simulationData.productName}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, productName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Smartphone Samsung Galaxy"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Código NCM
                        </label>
                        <input
                          type="text"
                          value={simulationData.ncmCode}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, ncmCode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: 8517.12.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição do Produto
                      </label>
                      <textarea
                        value={simulationData.productDescription}
                        onChange={(e) => setSimulationData(prev => ({ ...prev, productDescription: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descreva detalhadamente o produto..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          value={simulationData.quantity}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Valor Unitário
                        </label>
                        <input
                          type="number"
                          value={simulationData.unitValue}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, unitValue: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Moeda
                        </label>
                        <select
                          value={simulationData.currency}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="USD">USD - Dólar Americano</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="CNY">CNY - Yuan Chinês</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload & OCR */}
                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                        isDragActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      {isDragActive ? (
                        <p className="text-blue-600 dark:text-blue-400">Solte o arquivo aqui...</p>
                      ) : (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            Arraste e solte um arquivo PDF ou imagem aqui, ou clique para selecionar
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Suporta PDF, PNG, JPG (máx. 10MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {isProcessing && (
                      <div className="flex items-center justify-center p-8">
                        <LoadingSpinner text="Processando arquivo com OCR..." />
                      </div>
                    )}

                    {extractedText && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Texto Extraído
                        </h4>
                        <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {extractedText}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* IA & NCM */}
                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          Sugestões de IA
                        </h4>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Com base na descrição do produto, nossa IA sugere os códigos NCM mais prováveis:
                      </p>
                    </div>

                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {suggestion.ncm}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {suggestion.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {suggestion.confidence}%
                              </span>
                            </div>
                            <button
                              onClick={() => setSimulationData(prev => ({ ...prev, ncmCode: suggestion.ncm }))}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                            >
                              Usar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logística */}
                {activeTab === 'logistics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          País de Origem
                        </label>
                        <select
                          value={simulationData.originCountry}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, originCountry: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="China">China</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="Alemanha">Alemanha</option>
                          <option value="Japão">Japão</option>
                          <option value="Coreia do Sul">Coreia do Sul</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado de Destino
                        </label>
                        <select
                          value={simulationData.destinationState}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, destinationState: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="SP">São Paulo</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="PR">Paraná</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modal de Transporte
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'maritime', icon: Ship, label: 'Marítimo' },
                            { value: 'air', icon: Plane, label: 'Aéreo' },
                            { value: 'land', icon: Truck, label: 'Terrestre' }
                          ].map((mode) => {
                            const Icon = mode.icon
                            return (
                              <button
                                key={mode.value}
                                onClick={() => setSimulationData(prev => ({ ...prev, transportMode: mode.value }))}
                                className={`flex flex-col items-center p-3 rounded-lg border transition-colors duration-200 ${
                                  simulationData.transportMode === mode.value
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                              >
                                <Icon size={20} />
                                <span className="text-xs mt-1">{mode.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Porto/Aeroporto de Entrada
                        </label>
                        <select
                          value={simulationData.entryPort}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, entryPort: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="BRSSZ">Porto de Santos (SP)</option>
                          <option value="BRRIO">Porto do Rio de Janeiro (RJ)</option>
                          <option value="BRGRU">Aeroporto de Guarulhos (SP)</option>
                          <option value="BRBSB">Aeroporto de Brasília (DF)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { key: 'freightCost', label: 'Frete', icon: Ship },
                        { key: 'insuranceCost', label: 'Seguro', icon: Shield },
                        { key: 'afrmmCost', label: 'AFRMM', icon: DollarSign },
                        { key: 'thcCost', label: 'THC', icon: Package },
                        { key: 'storageCost', label: 'Armazenagem', icon: Package }
                      ].map((cost) => {
                        const Icon = cost.icon
                        return (
                          <div key={cost.key}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {cost.label}
                            </label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="number"
                                value={simulationData[cost.key]}
                                onChange={(e) => setSimulationData(prev => ({ ...prev, [cost.key]: parseFloat(e.target.value) || 0 }))}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Tributos */}
                {activeTab === 'taxes' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Regime Aduaneiro
                      </label>
                      <select
                        value={simulationData.customsRegime}
                        onChange={(e) => setSimulationData(prev => ({ ...prev, customsRegime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="06">06 - Importação para Consumo</option>
                        <option value="03">03 - Admissão Temporária</option>
                        <option value="04">04 - Drawback</option>
                        <option value="05">05 - Reimportação</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Alíquotas Aplicáveis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { name: 'II', rate: '16%', description: 'Imposto de Importação' },
                          { name: 'IPI', rate: '8%', description: 'Imposto sobre Produtos Industrializados' },
                          { name: 'PIS', rate: '2.1%', description: 'Programa de Integração Social' },
                          { name: 'COFINS', rate: '9.65%', description: 'Contribuição para o Financiamento da Seguridade Social' },
                          { name: 'ICMS', rate: '18%', description: 'Imposto sobre Circulação de Mercadorias' },
                          { name: 'FCP', rate: '2%', description: 'Fundo de Combate à Pobreza' }
                        ].map((tax) => (
                          <div key={tax.name} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{tax.name}</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{tax.rate}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tax.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Resultados */}
                {activeTab === 'results' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Resultados da Simulação
                      </h3>
                      <button
                        onClick={calculateResults}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                      >
                        {isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Calculator size={16} />
                        )}
                        <span>{isLoading ? 'Calculando...' : 'Calcular'}</span>
                      </button>
                    </div>

                    {calculationResults && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Resumo */}
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resumo Financeiro</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Valor Base:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                R$ {calculationResults.baseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Custos Logísticos:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                R$ {calculationResults.totalLogistics.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Total de Impostos:</span>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                R$ {calculationResults.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-600" />
                            <div className="flex justify-between text-lg font-semibold">
                              <span className="text-gray-900 dark:text-white">Valor Final:</span>
                              <span className="text-blue-600 dark:text-blue-400">
                                R$ {calculationResults.finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Detalhamento de Impostos */}
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Detalhamento de Impostos</h4>
                          <div className="space-y-2">
                            {Object.entries(calculationResults.taxes).map(([tax, value]) => (
                              <div key={tax} className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300 text-sm">
                                  {tax.toUpperCase()}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Indicadores */}
                    {calculationResults && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {calculationResults.profitability.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Custo Adicional
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {((calculationResults.totalTaxes / calculationResults.baseValue) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Carga Tributária
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {((calculationResults.totalLogistics / calculationResults.baseValue) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Custo Logístico
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default Simulator 