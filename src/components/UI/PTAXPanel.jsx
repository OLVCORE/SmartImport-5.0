import React, { useState, useEffect } from 'react'
import { DollarSign, Euro, PoundSterling, TrendingUp, TrendingDown, RefreshCw, Calendar, CircleDollarSign } from 'lucide-react'

const PTAXPanel = ({ selectedDate, onCurrencySelect, selectedCurrency }) => {
  const [ptaxData, setPtaxData] = useState({})
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const mainCurrencies = [
    { code: 'USD', name: 'Dólar Americano', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { code: 'EUR', name: 'Euro', icon: Euro, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { code: 'GBP', name: 'Libra Esterlina', icon: PoundSterling, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { code: 'JPY', name: 'Iene Japonês', icon: CircleDollarSign, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  ]

  const fetchAllPTAX = async () => {
    if (!selectedDate) return
    
    setLoading(true)
    const [yyyy, mm, dd] = selectedDate.split('-')
    const dataParam = `${mm}-${dd}-${yyyy}`
    
    try {
      const promises = mainCurrencies.map(async (currency) => {
        try {
          const response = await fetch(`/api/ptax?moeda=${currency.code}&data=${dataParam}`)
          const data = await response.json()
          return { code: currency.code, ...data }
        } catch (error) {
          return { code: currency.code, cotacao: null, error: true }
        }
      })
      
      const results = await Promise.all(promises)
      const ptaxMap = {}
      results.forEach(result => {
        ptaxMap[result.code] = result
      })
      
      setPtaxData(ptaxMap)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao buscar PTAX:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchAllPTAX()
    }
  }, [selectedDate])

  const getTrendIcon = (currencyCode) => {
    // Simulação de tendência (em produção, você compararia com dados anteriores)
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
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cotações PTAX</h3>
              <p className="text-blue-100 text-sm">
                {selectedDate ? `Data: ${formatDate(selectedDate.split('-').reverse().join('-'))}` : 'Selecione uma data'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAllPTAX}
            disabled={loading || !selectedDate}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!selectedDate ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Selecione uma data para visualizar as cotações PTAX
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Currencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainCurrencies.map((currency) => {
                const data = ptaxData[currency.code]
                const isSelected = selectedCurrency === currency.code
                const IconComponent = currency.icon
                
                return (
                  <div
                    key={currency.code}
                    onClick={() => onCurrencySelect(currency.code, data?.cotacao)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : `${currency.borderColor} ${currency.bgColor} dark:bg-gray-700 dark:border-gray-600`
                      }
                      ${data?.error ? 'opacity-60' : ''}
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
                        {data?.error ? (
                          <div className="text-red-500 text-sm">Erro</div>
                        ) : data?.cotacao ? (
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
                            {loading ? 'Carregando...' : 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional Info */}
            {lastUpdate && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
                  <span>Fonte: Banco Central do Brasil</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onCurrencySelect('USD', ptaxData.USD?.cotacao)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                Usar USD
              </button>
              <button
                onClick={() => onCurrencySelect('EUR', ptaxData.EUR?.cotacao)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Usar EUR
              </button>
              <button
                onClick={() => onCurrencySelect('GBP', ptaxData.GBP?.cotacao)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                Usar GBP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PTAXPanel 