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

class AIService {
  constructor() {
    this.documentCache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutos
  }

  // Métodos de extração e análise (exemplo)
  async extractTextFromDocument(file) {
    // Implementação básica
    return '';
  }

  // Adicione outros métodos conforme necessário...
}

export default new AIService(); 