import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Euro, 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Calendar, 
  CircleDollarSign,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import ptaxDirectService from '../../services/ptaxDirectService'

const PTAXDirectPanel = ({ selectedDate, onCurrencySelect, selectedCurrency }) => {
  const [ptaxData, setPtaxData] = useState({})
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  // Moedas principais para exibição
  const mainCurrencies = [
    { code: 'USD', name: 'Dólar Americano', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { code: 'EUR', name: 'Euro', icon: Euro, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { code: 'GBP', name: 'Libra Esterlina', icon: PoundSterling, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { code: 'JPY', name: 'Iene Japonês', icon: CircleDollarSign, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { code: 'CNY', name: 'Yuan Chinês', icon: Globe, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { code: 'CHF', name: 'Franco Suíço', icon: DollarSign, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' }
  ]

  const fetchAllPTAXDirect = async () => {
    if (!selectedDate) return
    
    setLoading(true)
    setError(null)
    
    try {
      const formattedDate = ptaxDirectService.formatDateForAPI(selectedDate)
      console.log('�� PTAX Direto: Iniciando busca para', formattedDate)
      
      const result = await ptaxDirectService.getAllRatesWithFallback(formattedDate)
      
      setPtaxData(result.rates)
      setSummary(result.summary)
      setLastUpdate(new Date())
      
      console.log('✅ PTAX Direto: Busca concluída', result.summary)
    } catch (error) {
      console.error('❌ PTAX Direto: Erro na busca', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchAllPTAXDirect()
    }
  }, [selectedDate])

  const getStatusIcon = (currencyCode) => {
    const data = ptaxData[currencyCode]
    if (!data) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
    if (data.success) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getTrendIcon = (currencyCode) => {
    // Simulação de tendência (em produção, compararia com dados anteriores)
    const random = Math.random()
    if (random > 0.6) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (random > 0.3) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4 border-l-2 border-gray-400 transform rotate-45"></div>
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [mm, dd, yyyy] = dateString.split('-')
    return `${dd}/${mm}/${yyyy}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">PTAX Direto - Banco Central</h3>
              <p className="text-blue-100 text-sm">
                {selectedDate ? `Data: ${formatDate(selectedDate.split('-').reverse().join('-'))}` : 'Selecione uma data'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAllPTAXDirect}
            disabled={loading || !selectedDate}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mt-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erro na busca PTAX</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Total: {summary.total} moedas | 
              <span className="text-green-600 dark:text-green-400 ml-1">
                ✅ {summary.successful} sucessos
              </span> | 
              <span className="text-red-600 dark:text-red-400 ml-1">
                ❌ {summary.failed} falhas
              </span>
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Última atualização: {lastUpdate?.toLocaleTimeString('pt-BR')}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {!selectedDate ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Selecione uma data para buscar as cotações PTAX diretamente no Banco Central
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Currencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainCurrencies.map((currency) => {
                const data = ptaxData[currency.code]
                const isSelected = selectedCurrency === currency.code
                const IconComponent = currency.icon
                
                return (
                  <div
                    key={currency.code}
                    onClick={() => data?.success && onCurrencySelect(currency.code, data.cotacao)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : `${currency.borderColor} ${currency.bgColor} dark:bg-gray-700 dark:border-gray-600`
                      }
                      ${!data?.success ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${currency.color} bg-white/50`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {currency.code}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currency.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-1 mb-1">
                          {getStatusIcon(currency.code)}
                        </div>
                        {data?.success ? (
                          <>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              R$ {formatCurrency(data.cotacao)}
                            </div>
                            <div className="flex items-center justify-end space-x-1 mt-1">
                              {getTrendIcon(currency.code)}
                              <span className="text-xs text-gray-500">
                                {data.dataCotacao ? formatDate(data.dataCotacao) : 'Hoje'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            {loading ? 'Carregando...' : 'Erro'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Fonte: API Direta do Banco Central do Brasil</span>
                <span>URL: olinda.bcb.gov.br</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {mainCurrencies.map(currency => {
                const data = ptaxData[currency.code]
                return (
                  <button
                    key={currency.code}
                    onClick={() => data?.success && onCurrencySelect(currency.code, data.cotacao)}
                    disabled={!data?.success}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      data?.success 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Usar {currency.code}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PTAXDirectPanel 