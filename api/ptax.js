// PTAX API com mecanismo de fallback robusto
// Versão: 5.0.1 - Fallback Prioritário
// Data: 2025-01-15
// Status: PRODUÇÃO

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }

  // Configuração do mecanismo de fallback
  const FALLBACK_CONFIG = {
    maxTentativas: 7,
    diasAnteriores: true,
    logDetalhado: true,
    versao: '5.0.1',
    ambiente: process.env.NODE_ENV || 'production'
  }

  try {
    // Formato esperado pelo Bacen: AAAA-MM-DD
    const [mm, dd, yyyy] = data.split('-')
    let dataISO = `${yyyy}-${mm}-${dd}`
    
    // Mecanismo de fallback prioritário
    let tentativas = 0
    let cotacao = null
    let dataCotacao = null
    let tentativasRealizadas = []
    
    while (tentativas < FALLBACK_CONFIG.maxTentativas && cotacao === null) {
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataISO}')?$format=json`
      
      if (FALLBACK_CONFIG.logDetalhado) {
        console.log(`🔍 [PTAX ${FALLBACK_CONFIG.versao}] Tentativa ${tentativas + 1}: ${dataISO}`)
        console.log(`📡 URL: ${url}`)
      }
      
      const response = await fetch(url)
      tentativasRealizadas.push({
        data: dataISO,
        status: response.status,
        sucesso: response.ok
      })
      
      if (response.ok) {
        const json = await response.json()
        
        if (json.value && json.value.length > 0) {
          cotacao = parseFloat(json.value[0].cotacaoVenda)
          dataCotacao = dataISO
          
          if (FALLBACK_CONFIG.logDetalhado) {
            console.log(`✅ [PTAX ${FALLBACK_CONFIG.versao}] Encontrado: ${cotacao} para ${moeda} em ${dataISO}`)
          }
          break
        } else {
          if (FALLBACK_CONFIG.logDetalhado) {
            console.log(`⚠️ [PTAX ${FALLBACK_CONFIG.versao}] Sem dados para ${moeda} em ${dataISO}`)
          }
        }
      } else {
        if (FALLBACK_CONFIG.logDetalhado) {
          console.log(`⚠️ [PTAX ${FALLBACK_CONFIG.versao}] HTTP ${response.status} para ${dataISO}`)
        }
      }
      
      // Calcular dia anterior
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
        versao: FALLBACK_CONFIG.versao,
        tentativas: tentativas + 1,
        dataOriginal: data,
        mecanismo: 'fallback-prioritario',
        ambiente: FALLBACK_CONFIG.ambiente,
        tentativasRealizadas
      })
    } else {
      console.error(`❌ [PTAX ${FALLBACK_CONFIG.versao}] Não encontrado após ${tentativas} tentativas`)
      return res.status(404).json({ 
        error: 'Cotação não encontrada no Banco Central',
        message: `Mecanismo de fallback tentou ${tentativas} dias anteriores para ${moeda}, mas não encontrou cotações disponíveis.`,
        moeda,
        dataOriginal: data,
        versao: FALLBACK_CONFIG.versao,
        tentativas,
        tentativasRealizadas,
        mecanismo: 'fallback-prioritario'
      })
    }
  } catch (e) {
    console.error(`❌ [PTAX ${FALLBACK_CONFIG.versao}] Erro:`, e)
    return res.status(500).json({ 
      error: 'Erro ao buscar cotação PTAX', 
      details: e.message,
      versao: FALLBACK_CONFIG.versao,
      mecanismo: 'fallback-prioritario'
    })
  }
}