import React, { useState, useEffect } from 'react'
import { DollarSign, Euro, PoundSterling, RefreshCw, Globe, AlertTriangle, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { getPtaxRate } from '../../services/ptaxService.js'

const PTAXPanel = ({ selectedDate, onCurrencySelect, selectedCurrency }) => {
  const [ptaxData, setPtaxData] = useState({})
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const allCurrencies = [
    { code: 'USD', name: 'Dólar Americano', symbol: '$', icon: DollarSign },
    { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£', icon: PoundSterling },
    { code: 'JPY', name: 'Iene Japonês', symbol: '¥', icon: DollarSign },
    { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$', icon: DollarSign },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', icon: DollarSign },
    { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF', icon: DollarSign },
    { code: 'CNY', name: 'Yuan Chinês', symbol: '¥', icon: DollarSign },
    { code: 'ARS', name: 'Peso Argentino', symbol: '$', icon: DollarSign },
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', icon: DollarSign }
  ]

  const mainCurrencies = allCurrencies.slice(0, 4)
  const secondaryCurrencies = allCurrencies.slice(4)

  const fetchAllPTAX = async () => {
    setLoading(true)
    setError(null)
    try {
      const [yyyy, mm, dd] = selectedDate.split('-')
      const dataParam = `${mm}-${dd}-${yyyy}`
      const promises = allCurrencies.map(async (currency) => {
        const result = await getPtaxRate(currency.code, dataParam)
        return { code: currency.code, ...result }
      })
      const results = await Promise.all(promises)
      const newPtaxData = {}
      results.forEach(result => { newPtaxData[result.code] = result })
      setPtaxData(newPtaxData)
      setLastUpdate(new Date())
    } catch (err) {
      setError('Erro ao buscar cotações do Banco Central')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) fetchAllPTAX()
  }, [selectedDate])

  const handleCurrencyClick = (currencyCode) => {
    const currencyData = ptaxData[currencyCode]
    if (currencyData && currencyData.cotacao) {
      onCurrencySelect(currencyCode, currencyData.cotacao)
    }
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4
    }).format(value)
  }

  const CurrencyCard = ({ currency, isMain = false }) => {
    const currencyData = ptaxData[currency.code]
    const isSelected = selectedCurrency === currency.code
    const hasData = currencyData && currencyData.cotacao
    
    return (
      <button
        onClick={() => handleCurrencyClick(currency.code)}
        disabled={!hasData || loading}
        className={`p-2 rounded-lg border transition-all ${
          isSelected
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm'
        } ${!hasData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1">
            <currency.icon className={`w-3 h-3 ${isMain ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
            <span className={`text-xs font-medium ${isMain ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              {currency.code}
            </span>
          </div>
          {isSelected && <CheckCircle className="w-3 h-3 text-green-600" />}
        </div>
        <div className="text-left">
          <div className={`font-bold ${isMain ? 'text-sm' : 'text-xs'} text-gray-900 dark:text-white`}>
            {hasData ? formatCurrency(currencyData.cotacao) : 'N/A'}
          </div>
          {isMain && hasData && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currencyData.dataCotacao}
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3 shadow-sm">
      {/* Header minimizado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            💱 Cotações PTAX - Banco Central
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAllPTAX}
            disabled={loading}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Moedas principais sempre visíveis */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {mainCurrencies.map((currency) => (
          <CurrencyCard key={currency.code} currency={currency} isMain={true} />
        ))}
      </div>

      {/* Moedas secundárias (expandível) */}
      {isExpanded && (
        <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
          <div className="grid grid-cols-3 gap-2">
            {secondaryCurrencies.map((currency) => (
              <CurrencyCard key={currency.code} currency={currency} />
            ))}
          </div>
        </div>
      )}

      {/* Status e erro */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {lastUpdate && (
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 text-center">
          Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
        </div>
      )}
    </div>
  )
}

export default PTAXPanel 