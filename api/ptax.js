import { getPtaxRate } from '../src/services/ptaxService.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  const { moeda, data } = req.query
  if (!moeda || !data) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: moeda, data' })
  }
  const { cotacao, dataCotacao, fonte } = await getPtaxRate(moeda, data)
  if (cotacao === null) {
    return res.status(404).json({ error: 'Cotação não encontrada' })
  }
  return res.status(200).json({ moeda, data, cotacao, dataCotacao, fonte })
}