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

    // Monta endpoint correto para cada moeda
    const moedaMap = {
      USD: 'Dolar',
      EUR: 'Euro',
      JPY: 'Iene',
      GBP: 'LibraEsterlina',
      ARS: 'PesoArgentino',
      AUD: 'DolarAustraliano',
      CAD: 'DolarCanadense',
      CHF: 'FrancoSuico',
      CNY: 'Yuan',
      BRL: 'Real'
    }
    const moedaBacen = moedaMap[moeda.toUpperCase()]
    if (!moedaBacen) {
      return res.status(400).json({ error: 'Moeda não suportada pelo Bacen' })
    }

    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Cotacao${moedaBacen}Dia(dataCotacao=@dataCotacao)?@dataCotacao='${dataISO}'&$top=1&$format=json`
    
    console.log(`🔍 Buscando PTAX: ${url}`)
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`❌ Erro PTAX: ${response.status} - ${response.statusText}`)
      return res.status(404).json({ error: 'Cotação não encontrada no Banco Central' })
    }
    
    const json = await response.json()
    console.log(`📊 Resposta PTAX:`, json)
    
    const cotacaoObj = json.value && json.value[0]
    if (!cotacaoObj) {
      return res.status(404).json({ error: 'Cotação não encontrada para a data/moeda' })
    }
    
    // Para dólar, campo é 'cotacaoVenda', para outras moedas pode variar
    const cotacao = cotacaoObj.cotacaoVenda || cotacaoObj.valor || cotacaoObj.cotacaoCompra || null
    const dataCotacao = cotacaoObj.dataHoraCotacao || dataISO
    
    if (!cotacao) {
      return res.status(404).json({ error: 'Cotação não disponível para a moeda/data' })
    }
    
    console.log(`✅ PTAX encontrado: ${cotacao} para ${moeda}`)
    return res.status(200).json({ 
      moeda, 
      data, 
      cotacao, 
      dataCotacao, 
      fonte: 'PTAX Banco Central' 
    })
  } catch (e) {
    console.error(`❌ Erro PTAX:`, e)
    return res.status(500).json({ error: 'Erro ao buscar cotação PTAX', details: e.message })
  }
}