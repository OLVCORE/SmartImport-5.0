import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { descricao, especificacoes } = req.body;
    if (!descricao) {
      res.status(400).json({ error: 'Descrição obrigatória' });
      return;
    }
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `Sugira o NCM mais adequado para o seguinte produto: ${descricao}. Especificações: ${JSON.stringify(especificacoes)}`;
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      // Exemplo de extração de NCM do texto retornado
      const texto = completion.choices[0].message.content;
      const ncmMatch = texto.match(/\d{4}\.\d{2}\.\d{2}|\d{8}/g);
      res.status(200).json({ sugestoes: ncmMatch || [], resposta: texto });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 