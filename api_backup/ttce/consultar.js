// API endpoint para consultar TTCE/Siscomex
// Este arquivo deve ser executado no backend (Node.js/Express)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { ncm, codigoPais, dataFatoGerador, tipoOperacao, fundamentosOpcionais } = req.body

    // Validação dos parâmetros
    if (!ncm || !codigoPais || !dataFatoGerador) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: ncm, codigoPais, dataFatoGerador' 
      })
    }

    console.log('🚀 Backend: Consultando TTCE real...', { ncm, codigoPais, dataFatoGerador })

    // URL oficial do Siscomex TTCE
    const ttceUrl = 'https://portalunico.siscomex.gov.br/ttce/api/ext/tratamentos-tributarios/importacao/'

    const payload = {
      ncm: ncm.toString(),
      codigoPais: codigoPais.toString(),
      dataFatoGerador,
      tipoOperacao: tipoOperacao || 'I'
    }

    if (fundamentosOpcionais && fundamentosOpcionais.length > 0) {
      payload.fundamentosOpcionais = fundamentosOpcionais
    }

    // Chamada real para a API do Siscomex
    const response = await fetch(ttceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SmartImport-5.0/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(payload)
    })

    console.log('📋 Backend: Resposta TTCE status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend: Erro TTCE:', errorText)
      return res.status(response.status).json({
        error: `Erro TTCE: ${response.status} - ${response.statusText}`,
        details: errorText
      })
    }

    const data = await response.json()
    console.log('✅ Backend: Dados TTCE recebidos:', data)

    // Retornar dados oficiais do Siscomex
    return res.status(200).json(data)

  } catch (error) {
    console.error('❌ Backend: Erro na consulta TTCE:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
} 