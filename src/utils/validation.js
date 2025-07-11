/**
 * Validações para o SmartImport 4.0
 */

/**
 * Valida se um NCM é válido
 * @param {string} ncm - Código NCM
 * @returns {boolean} True se válido
 */
export const isValidNCM = (ncm) => {
  if (!ncm) return false
  
  // NCM deve ter 8 dígitos
  const ncmRegex = /^\d{8}$/
  return ncmRegex.test(ncm.replace(/\D/g, ''))
}

/**
 * Valida se um valor monetário é válido
 * @param {number|string} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCurrency = (value) => {
  if (value === null || value === undefined || value === '') return false
  
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0 && isFinite(num)
}

/**
 * Valida se uma taxa percentual é válida
 * @param {number|string} rate - Taxa a ser validada
 * @returns {boolean} True se válida
 */
export const isValidRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return false
  
  const num = parseFloat(rate)
  return !isNaN(num) && num >= 0 && num <= 100 && isFinite(num)
}

/**
 * Valida se um email é válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
export const isValidEmail = (email) => {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se um CNPJ é válido
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false
  
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  let weight = 2
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  sum = 0
  weight = 2
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return (
    parseInt(cleanCNPJ.charAt(12)) === digit1 &&
    parseInt(cleanCNPJ.charAt(13)) === digit2
  )
}

/**
 * Valida se um CPF é válido
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return (
    parseInt(cleanCPF.charAt(9)) === digit1 &&
    parseInt(cleanCPF.charAt(10)) === digit2
  )
}

/**
 * Valida se uma data é válida
 * @param {string|Date} date - Data a ser validada
 * @returns {boolean} True se válida
 */
export const isValidDate = (date) => {
  if (!date) return false
  
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj)
}

/**
 * Valida se uma data está no futuro
 * @param {string|Date} date - Data a ser validada
 * @returns {boolean} True se está no futuro
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = new Date(date)
  const now = new Date()
  
  return dateObj > now
}

/**
 * Valida se uma data está no passado
 * @param {string|Date} date - Data a ser validada
 * @returns {boolean} True se está no passado
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = new Date(date)
  const now = new Date()
  
  return dateObj < now
}

/**
 * Valida se um arquivo é uma imagem
 * @param {File} file - Arquivo a ser validado
 * @returns {boolean} True se é imagem
 */
export const isValidImage = (file) => {
  if (!file) return false
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Valida se um arquivo é um PDF
 * @param {File} file - Arquivo a ser validado
 * @returns {boolean} True se é PDF
 */
export const isValidPDF = (file) => {
  if (!file) return false
  
  return file.type === 'application/pdf'
}

/**
 * Valida tamanho máximo de arquivo
 * @param {File} file - Arquivo a ser validado
 * @param {number} maxSizeMB - Tamanho máximo em MB
 * @returns {boolean} True se está dentro do limite
 */
export const isValidFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Valida se uma string tem comprimento mínimo
 * @param {string} value - String a ser validada
 * @param {number} minLength - Comprimento mínimo
 * @returns {boolean} True se válida
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false
  
  return String(value).length >= minLength
}

/**
 * Valida se uma string tem comprimento máximo
 * @param {string} value - String a ser validada
 * @param {number} maxLength - Comprimento máximo
 * @returns {boolean} True se válida
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true
  
  return String(value).length <= maxLength
}

/**
 * Valida se uma string contém apenas números
 * @param {string} value - String a ser validada
 * @returns {boolean} True se contém apenas números
 */
export const isNumeric = (value) => {
  if (!value) return false
  
  return /^\d+$/.test(String(value))
}

/**
 * Valida se uma string contém apenas letras
 * @param {string} value - String a ser validada
 * @returns {boolean} True se contém apenas letras
 */
export const isAlpha = (value) => {
  if (!value) return false
  
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(String(value))
}

/**
 * Valida se uma string contém apenas letras e números
 * @param {string} value - String a ser validada
 * @returns {boolean} True se contém apenas letras e números
 */
export const isAlphanumeric = (value) => {
  if (!value) return false
  
  return /^[a-zA-Z0-9À-ÿ\s]+$/.test(String(value))
} 