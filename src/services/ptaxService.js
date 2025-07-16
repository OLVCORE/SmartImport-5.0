// Serviço para buscar cotação PTAX do Banco Central via backend (NUNCA direto do browser)
export async function getPtaxRate(moeda = 'USD', data) {
  if (!moeda || !data) return { cotacao: null, dataCotacao: null, fonte: 'PTAX Banco Central' }
  let dataBusca = data
  let tentativas = 0
  let cotacao = null
  let dataCotacao = null
  while (tentativas < 7) {
    const response = await fetch(`/api/ptax?moeda=${moeda}&data=${dataBusca}`)
    if (response.ok) {
      const result = await response.json()
      cotacao = parseFloat(result.cotacao)
      dataCotacao = result.dataCotacao
      break
    }
    // Tenta o dia anterior
    const [mm, dd, yyyy] = dataBusca.split('-')
    const dataAnterior = new Date(yyyy, mm - 1, dd - 1)
    const mmAnterior = String(dataAnterior.getMonth() + 1).padStart(2, '0')
    const ddAnterior = String(dataAnterior.getDate()).padStart(2, '0')
    const yyyyAnterior = dataAnterior.getFullYear()
    dataBusca = `${mmAnterior}-${ddAnterior}-${yyyyAnterior}`
    tentativas++
  }
  return { cotacao, dataCotacao, fonte: 'PTAX Banco Central' }
} 