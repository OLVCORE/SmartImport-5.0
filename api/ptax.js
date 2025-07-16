// PTAX API - APENAS BANCO CENTRAL REAL
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  try {
    // Converter formato de data MM-DD-YYYY para DD-MM-YYYY
    const [mm, dd, yyyy] = data.split('-')
    const dataCorrigida = `${dd}-${mm}-${yyyy}`
    const dataISO = `${yyyy}-${mm}-${dd}`
    
    // Verificar se é data futura
    const dataSolicitada = new Date(yyyy, mm - 1, dd)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    // Se for data futura, usar data de hoje
    let dataBusca = dataCorrigida
    if (dataSolicitada > hoje) {
      const hojeFormatado = new Date()
      const mmHoje = String(hojeFormatado.getMonth() + 1).padStart(2, '0')
      const ddHoje = String(hojeFormatado.getDate()).padStart(2, '0')
      const yyyyHoje = hojeFormatado.getFullYear()
      dataBusca = `${ddHoje}-${mmHoje}-${yyyyHoje}`
      console.log('Data futura detectada, usando data de hoje:', dataBusca)
    }
    
    let tentativas = 0
    let cotacao = null
    let dataCotacao = null
    
    // Tentar até 7 dias anteriores
    while (tentativas < 7) {
      const [dd, mm, yyyy] = dataBusca.split('-')
      const dataISO = `${yyyy}-${mm}-${dd}`
      
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
      
      try {
        console.log('Tentativa', tentativas + 1, ':', url)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'SmartImport-5.0/1.0',
            'Accept': 'application/json'
          }
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const json = await response.json()
          
          if (json.value && json.value.length > 0) {
            cotacao = parseFloat(json.value[0].cotacaoVenda)
            dataCotacao = dataISO
            console.log('✅ PTAX encontrado:', cotacao, 'para', moeda)
            break
          }
        }
      } catch (error) {
        console.error('Erro na tentativa', tentativas + 1, ':', error.message)
      }
      
      // Tenta o dia anterior
      const [dd, mm, yyyy] = dataBusca.split('-')
      const dataAnterior = new Date(yyyy, mm - 1, dd - 1)
      const mmAnterior = String(dataAnterior.getMonth() + 1).padStart(2, '0')
      const ddAnterior = String(dataAnterior.getDate()).padStart(2, '0')
      const yyyyAnterior = dataAnterior.getFullYear()
      dataBusca = `${ddAnterior}-${mmAnterior}-${yyyyAnterior}`
      tentativas++
    }
    
    if (cotacao !== null) {
      return res.status(200).json({ 
        moeda, 
        data, 
        cotacao, 
        dataCotacao, 
        fonte: 'PTAX Banco Central'
      })
    } else {
      return res.status(404).json({ 
        error: 'Cotação não encontrada no Banco Central',
        moeda,
        data: data || 'hoje',
        message: 'Tente uma data anterior ou verifique o código da moeda'
      })
    }
    
  } catch (error) {
    console.error('Erro na rota PTAX:', error)
    return res.status(500).json({ 
      error: 'Erro ao buscar cotação PTAX', 
      details: error.message 
    })
  }
}