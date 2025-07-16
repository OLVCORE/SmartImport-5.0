// Endpoint de teste simples
export default async function handler(req, res) {
  console.log('Test endpoint called')
  return res.status(200).json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    query: req.query
  })
} 