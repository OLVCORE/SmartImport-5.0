// PTAX API - VERSÃO SIMPLES E FUNCIONAL
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
      cotacao: 1.0,
      dataCotacao: data,
      fonte: 'PTAX Banco Central'
    })
  }

  try {
    // Converter data para formato Banco Central (YYYY-MM-DD)
    const [mm, dd, yyyy] = data.split('-')
    const dataISO = `${yyyy}-${mm}-${dd}`
    
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
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
    return res.status(500).json({ error: 'Erro interno' })
  }
}