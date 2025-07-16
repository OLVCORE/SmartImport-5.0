// PTAX API - Versão mínima para debug
export default async function handler(req, res) {
  // Resposta imediata para testar se o endpoint funciona
  return res.status(200).json({ 
    message: 'PTAX API funcionando',
    query: req.query,
    timestamp: new Date().toISOString()
  })
}