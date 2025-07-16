// PTAX API - VERSÃO DEFINITIVA PARA VERCEL
export default async function handler(req, res) {
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
      data: data,
      cotacao: 1.0,
      dataCotacao: data,
      fonte: 'PTAX Banco Central'
    })
  }

  try {
    // Converter formato MM-DD-YYYY para YYYY-MM-DD (formato Banco Central)
    const [mm, dd, yyyy] = data.split('-')
    const dataISO = `${yyyy}-${mm}-${dd}`
    
    console.log(`🔍 Buscando PTAX: ${moeda} para ${dataISO}`)
    
    // URL do Banco Central com formato correto
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    console.log(`📡 URL: ${url}`)
    
    // Fetch com timeout e headers adequados
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SmartImport-5.0/1.0'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log(` Status: ${response.status}`)
    
    if (response.ok) {
      const json = await response.json()
      console.log(` Resposta:`, json)
      
      if (json.value && json.value.length > 0) {
        const cotacao = parseFloat(json.value[0].cotacaoVenda)
        console.log(`✅ PTAX encontrado: ${cotacao}`)
        
        return res.status(200).json({
          moeda,
          data: data,
          cotacao,
          dataCotacao: dataISO,
          fonte: 'PTAX Banco Central'
        })
      } else {
        console.log(`❌ Dados vazios do Banco Central`)
        return res.status(404).json({
          error: 'Cotação não encontrada',
          moeda,
          data: dataISO,
          details: 'Banco Central retornou dados vazios'
        })
      }
    } else {
      console.log(`❌ Erro HTTP: ${response.status}`)
      return res.status(response.status).json({
        error: 'Erro na resposta do Banco Central',
        moeda,
        data: dataISO,
        status: response.status,
        statusText: response.statusText
      })
    }
    
  } catch (error) {
    console.error(` Erro PTAX:`, error.message)
    
    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Timeout na conexão com Banco Central',
        moeda,
        data: data,
        details: 'Tempo limite excedido'
      })
    }
    
    return res.status(500).json({
      error: 'Erro interno do servidor',
      moeda,
      data: data,
      details: error.message
    })
  }
}