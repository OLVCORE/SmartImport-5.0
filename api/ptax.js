// PTAX API - VERSÃO SIMPLIFICADA E FUNCIONAL
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  try {
    // Testar com data de hoje primeiro
    const hoje = new Date()
    const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
    
    // URL para data de hoje
    const urlHoje = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataHoje}')?$format=json`
    
    console.log('Testando Banco Central:', urlHoje)
    
    const response = await fetch(urlHoje)
    
    console.log('Status da resposta:', response.status)
    
    if (response.ok) {
      const json = await response.json()
      
      if (json.value && json.value.length > 0) {
        const cotacao = parseFloat(json.value[0].cotacaoVenda)
        return res.status(200).json({
          moeda,
          data: dataHoje,
          cotacao,
          dataCotacao: dataHoje,
          fonte: 'PTAX Banco Central'
        })
      } else {
        return res.status(404).json({
          error: 'Banco Central retornou dados vazios',
          moeda,
          data: dataHoje
        })
      }
    } else {
      return res.status(404).json({
        error: 'Erro na resposta do Banco Central',
        moeda,
        data: dataHoje,
        status: response.status
      })
    }
    
  } catch (error) {
    console.error('Erro PTAX:', error.message)
    return res.status(500).json({
      error: 'Erro ao conectar com Banco Central',
      details: error.message
    })
  }
}