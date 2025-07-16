// Serviço PTAX com fallback inteligente - SUA ABORDAGEM
import { format, subBusinessDays } from 'date-fns'

export async function fetchPtax(moeda, dataInput) {
  if (moeda === 'BRL') {
    return {
      cotacao: 1.0,
      dataCotacao: dataInput,
      fonte: 'PTAX Banco Central'
    }
  }

  // SUA ABORDAGEM: Detectar formato e converter
  let [yyyy, mm, dd] = dataInput.split('-')
  if (yyyy.length !== 4) {
    [dd, mm, yyyy] = dataInput.split('-')
  }
  let date = new Date(+yyyy, +mm-1, +dd)
  
  // SUA ABORDAGEM: Tentar até 5 dias úteis anteriores
  for (let i = 0; i < 5; i++) {
    const d = subBusinessDays(date, i)
    const iso = format(d, 'yyyy-MM-dd')
    
    try {
      const res = await fetch(`/api/ptax?moeda=${moeda}&data=${iso}`)
      if (res.ok) {
        const result = await res.json()
        if (result.cotacao) {
          return result
        }
      }
    } catch (error) {
      console.log(`Tentativa ${i + 1} falhou:`, error.message)
    }
  }
  
  throw new Error('PTAX não disponível')
}

// Função para verificar se data é futura
export function isFutureDate(dataInput) {
  let [yyyy, mm, dd] = dataInput.split('-')
  if (yyyy.length !== 4) {
    [dd, mm, yyyy] = dataInput.split('-')
  }
  const selectedDate = new Date(+yyyy, +mm-1, +dd)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate > today
} 