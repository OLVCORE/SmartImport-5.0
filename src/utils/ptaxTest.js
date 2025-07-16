// Teste de conectividade PTAX direta
export const testPTAXDirect = async () => {
  const testUrl = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=\'USD\',dataCotacao=\'01-15-2024\')?$format=json'
  
  try {
    console.log('🧪 Testando conectividade PTAX direta...')
    
    const response = await fetch(testUrl)
    console.log('�� Status da resposta:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ PTAX direto funcionando:', data)
    
    return {
      success: true,
      data: data,
      message: 'Conectividade PTAX direta OK'
    }
  } catch (error) {
    console.error('❌ Erro na conectividade PTAX direta:', error)
    
    return {
      success: false,
      error: error.message,
      message: 'Problema de conectividade PTAX direta'
    }
  }
}