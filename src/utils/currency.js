import { format } from 'currency.js'

// Configurações de moedas
const CURRENCY_CONFIGS = {
  BRL: {
    symbol: 'R$',
    precision: 2,
    decimal: ',',
    thousand: '.',
    format: '%s %v'
  },
  USD: {
    symbol: '$',
    precision: 2,
    decimal: '.',
    thousand: ',',
    format: '%s%v'
  },
  EUR: {
    symbol: '€',
    precision: 2,
    decimal: ',',
    thousand: '.',
    format: '%v %s'
  }
}

/**
 * Formata um valor monetário
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Código da moeda (BRL, USD, EUR)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currency = 'BRL') => {
  if (value === null || value === undefined || isNaN(value)) {
    return format(0, CURRENCY_CONFIGS[currency])
  }
  
  return format(value, CURRENCY_CONFIGS[currency])
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