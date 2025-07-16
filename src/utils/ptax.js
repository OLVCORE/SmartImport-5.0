// Função PTAX simples
export async function getPtax(moeda, data) {
  try {
    const response = await fetch(`/api/ptax?moeda=${moeda}&data=${data}`)
    const result = await response.json()
    
    if (result.cotacao) {
      return result
    } else {
      throw new Error('Cotação não encontrada')
    }
  } catch (error) {
    throw new Error('Erro ao buscar PTAX')
  }
} 