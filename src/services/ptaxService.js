// Serviço para buscar cotação PTAX do Banco Central
// https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='USD',dataCotacao='03-12-2024')?$format=json

import fetch from 'node-fetch'

export async function getPtaxRate(moeda = 'USD', data) {
  if (!moeda || !data) return { cotacao: null, dataCotacao: null, fonte: 'PTAX Banco Central' }
  
  let dataBusca = data
  let tentativas = 0
  let cotacao = null
  let dataCotacao = null
  
  while (tentativas < 7) {
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataBusca}')?$format=json`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.value && data.value.length > 0) {
        cotacao = parseFloat(data.value[0].cotacaoVenda)
        dataCotacao = dataBusca
        break
      }
    } catch (error) {
      console.error('Erro ao buscar PTAX:', error)
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