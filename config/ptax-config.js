// Configuração PTAX API - Controle de Versões
// Este arquivo garante que o mecanismo de fallback seja sempre prioritário

export const PTAX_CONFIG = {
  // Versão atual do mecanismo de fallback
  versao: '5.0.1',
  
  // Configurações do mecanismo de fallback
  fallback: {
    maxTentativas: 7,
    diasAnteriores: true,
    logDetalhado: true,
    prioritario: true
  },
  
  // URLs do Banco Central
  urls: {
    principal: 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia',
    formato: 'json'
  },
  
  // Configurações por ambiente
  ambientes: {
    development: {
      logDetalhado: true,
      maxTentativas: 10
    },
    production: {
      logDetalhado: false,
      maxTentativas: 7
    }
  },
  
  // Histórico de versões (para controle)
  historico: [
    {
      versao: '5.0.1',
      data: '2025-01-15',
      mudancas: [
        'Mecanismo de fallback prioritário implementado',
        'Tentativas automáticas para dias anteriores',
        'Logs detalhados para debugging',
        'Metadata completo na resposta'
      ],
      status: 'PRODUÇÃO'
    },
    {
      versao: '5.0.0',
      data: '2025-01-14',
      mudancas: [
        'Implementação inicial PTAX API',
        'Busca direta no Banco Central'
      ],
      status: 'LEGADO'
    }
  ]
}

// Função para verificar se o mecanismo de fallback está ativo
export const isFallbackAtivo = () => {
  return PTAX_CONFIG.fallback.prioritario
}

// Função para obter configuração do ambiente atual
export const getConfigAmbiente = () => {
  const ambiente = process.env.NODE_ENV || 'production'
  return {
    ...PTAX_CONFIG,
    ...PTAX_CONFIG.ambientes[ambiente]
  }
} 