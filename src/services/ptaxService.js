// Serviço PTAX Unificado - ÚNICA FONTE DE VERDADE
export async function getPtaxRate(moeda = 'USD', data) {
  if (!moeda || !data) {
    console.error('❌ Parâmetros inválidos:', { moeda, data })
    return { cotacao: null, dataCotacao: null, fonte: 'PTAX Banco Central' }
  }

  // Para BRL, sempre retorna 1.0
  if (moeda === 'BRL') {
    return {
      cotacao: 1.0,
      dataCotacao: data,
      fonte: 'PTAX Banco Central'
    }
  }

  try {
    console.log(`🔍 getPtaxRate: ${moeda} para ${data}`)
    
    const response = await fetch(`/api/ptax?moeda=${moeda}&data=${data}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.cotacao) {
      throw new Error('Cotação não disponível')
    }

    console.log(`✅ getPtaxRate sucesso:`, result)
    return {
      cotacao: parseFloat(result.cotacao),
      dataCotacao: result.dataCotacao,
      fonte: result.fonte || 'PTAX Banco Central'
    }

  } catch (error) {
    console.error(`❌ getPtaxRate erro:`, error.message)
    throw new Error(`Erro ao buscar PTAX: ${error.message}`)
  }
}

// Função de fallback para tentar dias anteriores
export async function getPtaxRateWithFallback(moeda = 'USD', data, maxTentativas = 7) {
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
      
      const resultado = await getPtaxRate(moeda, dataAtual)
      
      if (resultado.cotacao) {
        console.log(`✅ PTAX encontrado na tentativa ${tentativas + 1}`)
        return resultado
      }
    } catch (error) {
      console.log(`❌ Tentativa ${tentativas + 1} falhou:`, error.message)
    }

    // Tentar dia anterior
    const [mm, dd, yyyy] = dataAtual.split('-')
    const dataAnterior = new Date(yyyy, mm - 1, dd - 1)
    const mmAnterior = String(dataAnterior.getMonth() + 1).padStart(2, '0')
    const ddAnterior = String(dataAnterior.getDate()).padStart(2, '0')
    const yyyyAnterior = dataAnterior.getFullYear()
    dataAtual = `${mmAnterior}-${ddAnterior}-${yyyyAnterior}`
    
    tentativas++
  }

  throw new Error(`PTAX não encontrado após ${maxTentativas} tentativas`)
} 