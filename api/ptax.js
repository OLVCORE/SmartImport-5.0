// PTAX API - Versão funcional do Vercel (baseada no server.js)
// Esta versão funcionava perfeitamente no Vercel

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  try {
    // Usar a mesma lógica do server.js que funcionava
    let dataBusca = data
    let tentativas = 0
    let cotacao = null
    let dataCotacao = null
    
    console.log(` Buscando PTAX para ${moeda} na data ${dataBusca}`)
    
    while (tentativas < 7) {
      // Formato esperado pelo Bacen: AAAA-MM-DD
      const [mm, dd, yyyy] = dataBusca.split('-')
      const dataISO = `${yyyy}-${mm}-${dd}`
      
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
      
      try {
        console.log(`📡 Tentativa ${tentativas + 1}: ${url}`)
        const response = await fetch(url)
        
        if (!response.ok) {
          console.warn(`⚠️ Resposta não OK: ${response.status}`)
          throw new Error(`HTTP ${response.status}`)
        }
        
        const json = await response.json()
        console.log(`📊 Resposta PTAX:`, json)
        
        if (json.value && json.value.length > 0) {
          cotacao = parseFloat(json.value[0].cotacaoVenda)
          dataCotacao = dataISO
          console.log(`✅ PTAX encontrado: ${cotacao} para ${moeda}`)
          break
        } else {
          console.log(`⚠️ Nenhum valor encontrado para ${moeda} em ${dataISO}`)
        }
      } catch (error) {
        console.error(`❌ Erro na tentativa ${tentativas + 1}:`, error.message)
      }
      
      // Tenta o dia anterior
      const [mm, dd, yyyy] = dataBusca.split('-')
      const dataAnterior = new Date(yyyy, mm - 1, dd - 1)
      const mmAnterior = String(dataAnterior.getMonth() + 1).padStart(2, '0')
      const ddAnterior = String(dataAnterior.getDate()).padStart(2, '0')
      const yyyyAnterior = dataAnterior.getFullYear()
      dataBusca = `${mmAnterior}-${ddAnterior}-${yyyyAnterior}`
      tentativas++
    }
    
    if (cotacao === null) {
      console.warn(`⚠️ PTAX não encontrado após ${tentativas} tentativas`)
      return res.status(404).json({ 
        error: 'Cotação não encontrada',
        moeda,
        data: data || 'hoje',
        message: 'Tente uma data anterior ou verifique o código da moeda'
      })
    }
    
    console.log(`✅ PTAX retornado:`, { moeda, data, cotacao, dataCotacao })
    return res.status(200).json({ 
      moeda, 
      data, 
      cotacao, 
      dataCotacao, 
      fonte: 'PTAX Banco Central' 
    })
    
  } catch (error) {
    console.error(`❌ Erro na rota PTAX:`, error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    })
  }
}