// PTAX API - VERSÃO DEFINITIVA COM SUA ABORDAGEM
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  // Para BRL, sempre retorna 1.0
  if (moeda === 'BRL') {
    return res.status(200).json({
      moeda: 'BRL',
      cotacao: 1.0,
      dataCotacao: data,
      fonte: 'PTAX Banco Central'
    })
  }

  try {
    // SUA ABORDAGEM: Detectar formato de data automaticamente
    let [yyyy, mm, dd] = data.split('-')
    if (yyyy.length !== 4) {
      [dd, mm, yyyy] = data.split('-')
    }
    const dataISO = `${yyyy}-${mm}-${dd}`
    
    console.log(` PTAX Request: ${moeda} para ${dataISO} (original: ${data})`)
    
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    // SUA ABORDAGEM: Timeout de 12s
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const json = await response.json()
      
      if (json.value && json.value.length > 0) {
        const cotacao = parseFloat(json.value[0].cotacaoVenda)
        return res.status(200).json({
          moeda,
          cotacao,
          dataCotacao: dataISO,
          fonte: 'PTAX Banco Central'
        })
      }
    }
    
    return res.status(404).json({ error: 'Cotação não encontrada' })
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Timeout na conexão' })
    }
    return res.status(500).json({ error: 'Erro interno' })
  }
}