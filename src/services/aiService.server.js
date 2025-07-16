// Serviço de IA do backend/serverless: sugere NCM via OpenAI
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function suggestNCMByDescription(descricao) {
  if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 5) {
    throw new Error('Descrição inválida para sugestão de NCM.')
  }
  const prompt = `Qual o código NCM mais adequado para o seguinte produto: "${descricao}"? Responda apenas o código NCM, sem texto adicional.`
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
    const resposta = completion.choices[0].message.content
    const ncm = resposta.match(/\d{8}/)?.[0] || resposta.replace(/\D/g, '').slice(0, 8)
    if (!ncm || ncm.length !== 8) {
      throw new Error(`NCM não encontrado na resposta da IA: "${resposta}"`)
    }
    return ncm
  } catch (err) {
    console.error('Erro ao consultar OpenAI:', err)
    throw new Error('Erro ao consultar OpenAI: ' + err.message)
  }
} 