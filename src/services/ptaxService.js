// Serviço PTAX UNIFICADO - ÚNICA FONTE DE VERDADE
import { subDays, format, parseISO } from 'date-fns'

/**
 * Busca PTAX com fallback automático para datas não úteis
 * @param {string} moeda - Código da moeda
 * @param {string} data - Data no formato MM-DD-YYYY ou YYYY-MM-DD
 * @param {number} maxTentativas - Máximo de tentativas (dias anteriores)
 * @returns {Promise<{cotacao: number, dataCotacao: string, fonte: string}>}
 */
export async function getPtaxRateWithFallback(moeda = 'USD', data, maxTentativas = 7) {
  if (!moeda || !data) {
    console.error('❌ Parâmetros inválidos:', { moeda, data })
    throw new Error('Moeda e data são obrigatórios')
  }

  // Para BRL, sempre retorna 1.0
  if (moeda === 'BRL') {
    return {
      cotacao: 1.0,
      dataCotacao: data,
      fonte: 'PTAX Banco Central'
    }
  }

  let dataAtual = data
  let tentativas = 0

  while (tentativas < maxTentativas) {
    try {
      console.log(`🔄 Tentativa ${tentativas + 1}: ${moeda} para ${dataAtual}`)
      
      const resultado = await fetchPtaxRate(moeda, dataAtual)
      
      if (resultado.cotacao) {
        console.log(`✅ PTAX encontrado na tentativa ${tentativas + 1}:`, resultado)
        return resultado
      }
    } catch (error) {
      console.log(`❌ Tentativa ${tentativas + 1} falhou:`, error.message)
    }

    // Tentar dia anterior
    dataAtual = getPreviousDay(dataAtual)
    tentativas++
  }

  throw new Error(`PTAX não encontrado após ${maxTentativas} tentativas`)
}

/**
 * Busca PTAX para uma data específica
 * @param {string} moeda - Código da moeda
 * @param {string} data - Data no formato MM-DD-YYYY ou YYYY-MM-DD
 * @returns {Promise<{cotacao: number, dataCotacao: string, fonte: string}>}
 */
export async function fetchPtaxRate(moeda, data) {
  try {
    console.log(`🔍 fetchPtaxRate: ${moeda} para ${data}`)
    
    const response = await fetch(`/api/ptax?moeda=${moeda}&data=${data}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.cotacao) {
      throw new Error('Cotação não disponível')
    }

    console.log(`✅ fetchPtaxRate sucesso:`, result)
    return {
      cotacao: parseFloat(result.cotacao),
      dataCotacao: result.dataCotacao,
      fonte: result.fonte || 'PTAX Banco Central'
    }

  } catch (error) {
    console.error(`❌ fetchPtaxRate erro:`, error.message)
    throw error
  }
}

/**
 * Obtém o dia anterior em formato MM-DD-YYYY
 * @param {string} data - Data no formato MM-DD-YYYY ou YYYY-MM-DD
 * @returns {string} Data anterior
 */
function getPreviousDay(data) {
  let dataISO
  
  // Detectar formato
  if (data.includes('-')) {
    const parts = data.split('-')
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      dataISO = data
    } else if (parts[0].length === 2) {
      // MM-DD-YYYY ou DD-MM-YYYY
      if (parseInt(parts[0]) > 12) {
        // DD-MM-YYYY
        const [dd, mm, yyyy] = parts
        dataISO = `${yyyy}-${mm}-${dd}`
      } else {
        // MM-DD-YYYY
        const [mm, dd, yyyy] = parts
        dataISO = `${yyyy}-${mm}-${dd}`
      }
    }
  }
  
  // Calcular dia anterior
  const dataAnterior = subDays(parseISO(dataISO), 1)
  const mmAnterior = String(dataAnterior.getMonth() + 1).padStart(2, '0')
  const ddAnterior = String(dataAnterior.getDate()).padStart(2, '0')
  const yyyyAnterior = dataAnterior.getFullYear()
  
  return `${mmAnterior}-${ddAnterior}-${yyyyAnterior}`
}

/**
 * Verifica se uma data é futura
 * @param {string} data - Data no formato MM-DD-YYYY ou YYYY-MM-DD
 * @returns {boolean} True se for futura
 */
export function isFutureDate(data) {
  let dataISO
  
  // Detectar formato
  if (data.includes('-')) {
    const parts = data.split('-')
    if (parts[0].length === 4) {
      dataISO = data
    } else if (parts[0].length === 2) {
      if (parseInt(parts[0]) > 12) {
        const [dd, mm, yyyy] = parts
        dataISO = `${yyyy}-${mm}-${dd}`
      } else {
        const [mm, dd, yyyy] = parts
        dataISO = `${yyyy}-${mm}-${dd}`
      }
    }
  }
  
  const selectedDate = parseISO(dataISO)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return selectedDate > today
} 