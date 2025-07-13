import currency from 'currency.js'

// Configurações de moedas
const CURRENCY_CONFIGS = {
  BRL: {
    symbol: 'R$',
    precision: 2,
    decimal: ',',
    thousand: '.'
  },
  USD: {
    symbol: '$',
    precision: 2,
    decimal: '.',
    thousand: ','
  },
  EUR: {
    symbol: '€',
    precision: 2,
    decimal: ',',
    thousand: '.'
  },
  CNY: {
    symbol: '¥',
    precision: 2,
    decimal: '.',
    thousand: ','
  }
}

// Taxas PTAX de referência (serão atualizadas via API)
const PTAX_RATES = {
  USD: 5.15,
  EUR: 5.65,
  CNY: 0.72,
  BRL: 1.00
}

/**
 * Busca taxa PTAX atual do Banco Central
 * @param {string} currency - Código da moeda
 * @param {string} date - Data no formato 'MM-DD-YYYY' (opcional, default hoje)
 * @returns {Promise<{cotacao: number, dataCotacao: string, fonte: string}>}
 */
export const fetchPTAXRate = async (currency = 'USD', date) => {
  if (currency === 'BRL') {
    // Para BRL, a cotação é sempre 1.0, data de hoje, fonte fixa
    return {
      cotacao: 1.0,
      dataCotacao: new Date().toISOString().slice(0, 10),
      fonte: 'PTAX Banco Central'
    }
  }
  try {
    // Se não passar data, usa hoje
    let dataParam = date
    if (!dataParam) {
      const now = new Date()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const yyyy = now.getFullYear()
      dataParam = `${mm}-${dd}-${yyyy}`
    }
    const res = await fetch(`/api/ptax?moeda=${currency}&data=${dataParam}`)
    if (!res.ok) return { cotacao: PTAX_RATES[currency] || 1.0, dataCotacao: null, fonte: 'PTAX Banco Central' }
    const json = await res.json()
    return {
      cotacao: json.cotacao || PTAX_RATES[currency] || 1.0,
      dataCotacao: json.dataCotacao || dataParam,
      fonte: json.fonte || 'PTAX Banco Central'
    }
  } catch (error) {
    console.error('Erro ao buscar PTAX:', error)
    return { cotacao: PTAX_RATES[currency] || 1.0, dataCotacao: null, fonte: 'PTAX Banco Central' }
  }
}

/**
 * Converte valor para BRL usando PTAX
 * @param {number} value - Valor a ser convertido
 * @param {string} fromCurrency - Moeda de origem
 * @returns {Promise<number>} Valor em BRL
 */
export const convertToBRL = async (value, fromCurrency) => {
  if (fromCurrency === 'BRL') return value
  
  const rate = await fetchPTAXRate(fromCurrency)
  return value * rate
}

/**
 * Formata valor em duas colunas: original e BRL
 * @param {number} value - Valor original
 * @param {string} currency - Moeda original
 * @param {number} brlValue - Valor em BRL
 * @returns {string} String formatada
 */
export const formatDualCurrency = (value, currency, brlValue) => {
  const original = formatCurrency(value, currency)
  const brl = formatCurrency(brlValue, 'BRL')
  return `${original} (${brl})`
}

/**
 * Valida campos obrigatórios
 * @param {object} data - Dados a serem validados
 * @param {array} requiredFields - Lista de campos obrigatórios
 * @returns {object} Resultado da validação
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = []
  const missing = []

  requiredFields.forEach(field => {
    const value = data[field]
    if (!value || (typeof value === 'string' && value.trim() === '') || 
        (Array.isArray(value) && value.length === 0)) {
      missing.push(field)
      errors.push(`Campo obrigatório: ${field}`)
    }
  })

  return {
    isValid: missing.length === 0,
    errors,
    missing
  }
}

/**
 * Exibe alerta de validação
 * @param {array} errors - Lista de erros
 */
export const showValidationAlert = (errors) => {
  if (errors.length > 0) {
    const message = errors.join('\n')
    alert(`❌ Campos obrigatórios não preenchidos:\n\n${message}`)
    return false
  }
  return true
}

/**
 * Formata um valor monetário
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Código da moeda (BRL, USD, EUR)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currencyCode = 'BRL') => {
  if (value === null || value === undefined || isNaN(value)) {
    const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.BRL
    return `${config.symbol} 0,00`
  }
  
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.BRL
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
  
  return formatted
}

/**
 * Converte valor entre moedas
 * @param {number} value - Valor a ser convertido
 * @param {string} fromCurrency - Moeda de origem
 * @param {string} toCurrency - Moeda de destino
 * @param {number} exchangeRate - Taxa de câmbio
 * @returns {number} Valor convertido
 */
export const convertCurrency = (value, fromCurrency, toCurrency, exchangeRate) => {
  if (fromCurrency === toCurrency) {
    return value
  }
  
  return value * exchangeRate
}

/**
 * Calcula a variação percentual entre dois valores
 * @param {number} oldValue - Valor antigo
 * @param {number} newValue - Valor novo
 * @returns {number} Variação percentual
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Arredonda valor para 2 casas decimais
 * @param {number} value - Valor a ser arredondado
 * @returns {number} Valor arredondado
 */
export const roundToTwoDecimals = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * Valida se um valor é um número válido
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se for válido
 */
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value) && value !== null && value !== undefined
}

/**
 * Formata número para exibição
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Número formatado
 */
export const formatNumber = (value, decimals = 2) => {
  if (!isValidNumber(value)) return '0'
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Converte string para número
 * @param {string} value - String a ser convertida
 * @returns {number} Número convertido
 */
export const parseNumber = (value) => {
  if (typeof value === 'number') return value
  
  const cleaned = String(value).replace(/[^\d.,]/g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  
  return isValidNumber(parsed) ? parsed : 0
} 