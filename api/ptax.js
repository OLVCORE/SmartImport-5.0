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
    let dataISO = `${yyyy}-${mm}-${dd}`
    
    // Tentar até 7 dias anteriores se não encontrar dados
    let tentativas = 0
    let cotacao = null
    let dataCotacao = null
    
    while (tentativas < 7 && cotacao === null) {
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
      
      console.log(`🔍 Tentativa ${tentativas + 1}: Buscando PTAX para ${dataISO}`)
      console.log(`📡 URL: ${url}`)
      
      const response = await fetch(url)
      
      if (response.ok) {
        const json = await response.json()
        console.log(`📊 Resposta PTAX:`, json)
        
        if (json.value && json.value.length > 0) {
          cotacao = parseFloat(json.value[0].cotacaoVenda)
          dataCotacao = dataISO
          console.log(`✅ PTAX encontrado: ${cotacao} para ${moeda} em ${dataISO}`)
          break
        } else {
          console.log(`⚠️ Nenhum valor encontrado para ${moeda} em ${dataISO}`)
        }
      } else {
        console.log(`⚠️ HTTP ${response.status} para ${dataISO}`)
      }
      
      // Tentar o dia anterior
      const dataAnterior = new Date(dataISO)
      dataAnterior.setDate(dataAnterior.getDate() - 1)
      dataISO = dataAnterior.toISOString().slice(0, 10)
      tentativas++
    }
    
    if (cotacao !== null) {
      return res.status(200).json({ 
        moeda, 
        data, 
        cotacao, 
        dataCotacao, 
        fonte: 'PTAX Banco Central',
        tentativas: tentativas + 1,
        dataOriginal: data
      })
    } else {
      console.error(`❌ PTAX não encontrado após ${tentativas} tentativas`)
      return res.status(404).json({ 
        error: 'Cotação não encontrada no Banco Central',
        message: `Tentamos buscar dados para ${moeda} nos últimos ${tentativas} dias úteis, mas não encontramos cotações disponíveis.`,
        moeda,
        dataOriginal: data,
        tentativas
      })
    }
  } catch (e) {
    console.error(`❌ Erro PTAX:`, e)
    return res.status(500).json({ 
      error: 'Erro ao buscar cotação PTAX', 
      details: e.message 
    })
  }
}