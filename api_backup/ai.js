import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt obrigatório' });
      return;
    }
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      res.status(200).json({ result: completion.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 