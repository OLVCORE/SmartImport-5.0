export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  try {
    // Formato esperado pelo Bacen: AAAA-MM-DD
    const [mm, dd, yyyy] = data.split('-')
    const dataISO = `${yyyy}-${mm}-${dd}`

    // URL que funcionava no servidor local
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
    
    console.log(`🔍 Buscando PTAX: ${url}`)
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`❌ Erro PTAX: ${response.status} - ${response.statusText}`)
      return res.status(404).json({ error: 'Cotação não encontrada no Banco Central' })
    }
    
    const json = await response.json()
    console.log(`📊 Resposta PTAX:`, json)
    
    if (json.value && json.value.length > 0) {
      const cotacao = parseFloat(json.value[0].cotacaoVenda)
      const dataCotacao = dataISO
      
      console.log(`✅ PTAX encontrado: ${cotacao} para ${moeda}`)
      return res.status(200).json({ 
        moeda, 
        data, 
        cotacao, 
        dataCotacao, 
        fonte: 'PTAX Banco Central' 
      })
    } else {
      return res.status(404).json({ error: 'Cotação não encontrada para a data/moeda' })
    }
  } catch (e) {
    console.error(`❌ Erro PTAX:`, e)
    return res.status(500).json({ error: 'Erro ao buscar cotação PTAX', details: e.message })
  }
}