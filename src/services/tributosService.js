// Serviço para buscar alíquotas de tributos por NCM
// Mock inicial, pronto para integração com API IBPT ou Receita Federal

const IBPT_API_URL = 'https://api.ibpt.org.br/ncm'
const IBPT_TOKEN = 'SUA_CHAVE_AQUI' // Trocar por token real

export async function getAliquotasByNCM(ncm, uf = 'SP') {
  // Exemplo de chamada real (descomentar quando tiver token):
  // const res = await fetch(`${IBPT_API_URL}/${ncm}?token=${IBPT_TOKEN}&uf=${uf}`)
  // if (!res.ok) throw new Error('Erro ao consultar IBPT')
  // return await res.json()

  // MOCK: Retorna alíquotas simuladas
  return {
    ncm,
    uf,
    descricao: 'Produto Exemplo',
    nacional: 0.12,
    estadual: 0.18,
    municipal: 0.02,
    importado: 0.16,
    ii: 0.16,
    ipi: 0.08,
    pis: 0.0186,
    cofins: 0.0854,
    fcp: 0.02,
    data: new Date().toISOString(),
    fonte: 'IBPT (mock)'
  }
} 