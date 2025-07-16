// PTAX API - VERSÃO DEFINITIVA
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  try {
    // Formato correto: MM-DD-YYYY para DD-MM-YYYY
    const [mm, dd, yyyy] = data.split('-')
    const dataISO = `${yyyy}-${mm}-${dd}`
    
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    console.log('Buscando PTAX:', url)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SmartImport-5.0/1.0'
      }
    })
    
    if (response.ok) {
      const json = await response.json()
      
      if (json.value && json.value.length > 0) {
        const cotacao = parseFloat(json.value[0].cotacaoVenda)
        return res.status(200).json({
          moeda,
          data,
          cotacao,
          dataCotacao: dataISO,
          fonte: 'PTAX Banco Central'
        })
      }
    }
    
    return res.status(404).json({
      error: 'Cotação não encontrada no Banco Central',
      moeda,
      data
    })
    
  } catch (error) {
    console.error('Erro PTAX:', error)
    return res.status(500).json({
      error: 'Erro ao buscar PTAX',
      details: error.message
    })
  }
}