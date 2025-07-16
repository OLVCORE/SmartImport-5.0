import OpenAI from 'openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  const { descricao, especificacoes } = req.body
  if (!descricao) {
    return res.status(400).json({ error: 'Descrição obrigatória' })
  }
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const prompt = `Sugira o NCM mais adequado para o seguinte produto: ${descricao}. 
    Especificações: ${JSON.stringify(especificacoes || {})}
    
    Responda APENAS com o código NCM no formato XXXX.XX.XX (8 dígitos) e uma breve descrição.
    Exemplo: 8517.12.00 - Aparelhos telefônicos celulares`
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.3
    })
    
    const texto = completion.choices[0].message.content
    const ncmMatch = texto.match(/\d{4}\.\d{2}\.\d{2}|\d{8}/g)
    
    return res.status(200).json({ 
      sugestoes: ncmMatch || [], 
      resposta: texto,
      descricao: descricao
    })
  } catch (err) {
    console.error('Erro na sugestão de NCM:', err)
    return res.status(500).json({ error: err.message })
  }
} 