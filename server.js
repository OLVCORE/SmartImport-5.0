import express from 'express'
import fetch from 'node-fetch'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { copyFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(express.json())

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Rota de status do sistema
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '5.0.0',
    services: {
      ptax: 'active',
      ai: 'active',
      ttce: 'active'
    }
  })
})

// Função PTAX melhorada
async function getPtaxRate(moeda = 'USD', data) {
  if (!moeda || !data) {
    // Se não tem data, usa hoje
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const yyyy = now.getFullYear()
    data = `${mm}-${dd}-${yyyy}`
  }
  
  let dataBusca = data
  let tentativas = 0
  let cotacao = null
  let dataCotacao = null
  
  console.log(`🔍 Buscando PTAX para ${moeda} na data ${dataBusca}`)
  
  while (tentativas < 7) {
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda='${moeda}',dataCotacao='${dataBusca}')?$format=json`
    
    try {
      console.log(`📡 Tentativa ${tentativas + 1}: ${url}`)
      const response = await fetch(url)
      
      if (!response.ok) {
        console.warn(`⚠️ Resposta não OK: ${response.status}`)
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`📊 Resposta PTAX:`, data)
      
      if (data.value && data.value.length > 0) {
        cotacao = parseFloat(data.value[0].cotacaoVenda)
        dataCotacao = dataBusca
        console.log(`✅ PTAX encontrado: ${cotacao} para ${moeda}`)
        break
      } else {
        console.log(`⚠️ Nenhum valor encontrado para ${moeda} em ${dataBusca}`)
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
    return { cotacao: null, dataCotacao: null, fonte: 'PTAX Banco Central', error: 'Cotação não disponível' }
  }
  
  return { cotacao, dataCotacao, fonte: 'PTAX Banco Central' }
}

// Rota PTAX melhorada
app.get('/api/ptax', async (req, res) => {
  const { moeda, data } = req.query
  
  console.log(`🚀 Requisição PTAX: moeda=${moeda}, data=${data}`)
  
  try {
    const result = await getPtaxRate(moeda, data)
    
    if (result.cotacao === null) {
      console.log(`❌ PTAX não encontrado para ${moeda}`)
      return res.status(404).json({ 
        error: 'Cotação não encontrada',
        moeda,
        data: data || 'hoje',
        message: 'Tente uma data anterior ou verifique o código da moeda'
      })
    }
    
    console.log(`✅ PTAX retornado:`, result)
    res.json(result)
  } catch (error) {
    console.error(`❌ Erro na rota PTAX:`, error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    })
  }
})

// Rota AI - Ask
app.post('/api/ai/ask', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt obrigatório' })
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
    res.status(200).json({ result: completion.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Rota AI - Suggest NCM
app.post('/api/ai/suggest-ncm', async (req, res) => {
  const { descricao, especificacoes } = req.body
  if (!descricao) {
    return res.status(400).json({ error: 'Descrição obrigatória' })
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const prompt = `Sugira o NCM mais adequado para o seguinte produto: ${descricao}. Especificações: ${JSON.stringify(especificacoes)}`
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
    const texto = completion.choices[0].message.content
    const ncmMatch = texto.match(/\d{4}\.\d{2}\.\d{2}|\d{8}/g)
    res.status(200).json({ sugestoes: ncmMatch || [], resposta: texto })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Rota TTCE
app.post('/api/ttce/consultar', async (req, res) => {
  try {
    const { ncm, codigoPais, dataFatoGerador, tipoOperacao, fundamentosOpcionais } = req.body

    if (!ncm || !codigoPais || !dataFatoGerador) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: ncm, codigoPais, dataFatoGerador' 
      })
    }

    console.log('🚀 Backend: Consultando TTCE real...', { ncm, codigoPais, dataFatoGerador })

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

    return res.status(200).json(data)

  } catch (error) {
    console.error('❌ Backend: Erro na consulta TTCE:', error)
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`)
  console.log(`📊 PTAX: http://localhost:${PORT}/api/ptax`)
  console.log(`🤖 AI: http://localhost:${PORT}/api/ai/ask`)
  console.log(`🔍 NCM: http://localhost:${PORT}/api/ai/suggest-ncm`)
  console.log(`🏛️ TTCE: http://localhost:${PORT}/api/ttce/consultar`)
  console.log(`📈 Status: http://localhost:${PORT}/api/status`)
}) 