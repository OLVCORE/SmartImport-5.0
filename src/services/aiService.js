import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// Configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Cliente de IA para o frontend: faz requisições ao backend seguro

class AIService {
  async askOpenAI(prompt) {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error('Erro ao consultar IA');
    const data = await response.json();
    return data.result;
  }

  // Exemplo de método para sugestão de NCM
  async suggestNCMByDescription(descricao, especificacoes = {}) {
    const response = await fetch('/api/ai/suggest-ncm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao, especificacoes })
    });
    if (!response.ok) throw new Error('Erro ao sugerir NCM');
    return await response.json();
  }

  // Adicione outros métodos conforme necessário, sempre chamando o backend
}

export default new AIService(); 