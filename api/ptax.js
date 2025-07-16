// PTAX API - VERSÃO DEFINITIVA COM TODAS AS CORREÇÕES
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
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
    // CORREÇÃO 1: Detectar formato de data automaticamente
    let dataISO
    if (data.includes('-')) {
      const parts = data.split('-')
      if (parts[0].length === 4) {
        // Já está em YYYY-MM-DD
        dataISO = data
      } else if (parts[0].length === 2) {
        // Está em MM-DD-YYYY ou DD-MM-YYYY
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
    } else {
      throw new Error('Formato de data inválido')
    }
    
    console.log(` PTAX Request: ${moeda} para ${dataISO} (original: ${data})`)
    
    // CORREÇÃO 2: URL do Banco Central com formato correto
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    console.log(`📡 URL: ${url}`)
    
    // CORREÇÃO 3: Timeout de 12s (dentro do limite do Vercel)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)
    
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
      console.log(` Response:`, json)
      
      if (json.value && json.value.length > 0) {
        const cotacao = parseFloat(json.value[0].cotacaoVenda)
        console.log(`✅ PTAX encontrado: ${cotacao}`)
        
        return res.status(200).json({
          moeda,
          data: data,
          cotacao,
          dataCotacao: dataISO,
          fonte: 'PTAX Banco Central',
          timestamp: new Date().toISOString()
        })
      } else {
        console.log(`❌ Dados vazios do Banco Central`)
        return res.status(404).json({
          error: 'Cotação não encontrada',
          moeda,
          data: dataISO,
          details: 'Banco Central retornou dados vazios',
          timestamp: new Date().toISOString()
        })
      }
    } else {
      console.log(`❌ Erro HTTP: ${response.status}`)
      return res.status(response.status).json({
        error: 'Erro na resposta do Banco Central',
        moeda,
        data: dataISO,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString()
      })
    }
    
  } catch (error) {
    console.error(` Erro PTAX:`, error.message)
    
    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Timeout na conexão com Banco Central',
        moeda,
        data: data,
        details: 'Tempo limite excedido (12s)',
        timestamp: new Date().toISOString()
      })
    }
    
    return res.status(500).json({
      error: 'Erro interno do servidor',
      moeda,
      data: data,
      details: error.message,
      timestamp: new Date().toISOString()
    })
  }
}