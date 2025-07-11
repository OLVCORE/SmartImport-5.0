// Dados reais de importação para o SmartImport 4.0

// ===== REGIMES ADUANEIROS =====
export const customsRegimes = [
  {
    code: '01',
    name: 'Importação por Conta e Ordem',
    description: 'Importação realizada por conta e ordem de terceiros',
    calculationMethod: 'standard',
    requiresLicense: false,
    hasIncentives: false
  },
  {
    code: '02', 
    name: 'Importação por Conta Própria',
    description: 'Importação realizada por conta própria do importador',
    calculationMethod: 'standard',
    requiresLicense: false,
    hasIncentives: false
  },
  {
    code: '03',
    name: 'Admissão Temporária',
    description: 'Importação temporária com reexportação obrigatória',
    calculationMethod: 'temporary',
    requiresLicense: true,
    hasIncentives: true
  },
  {
    code: '04',
    name: 'Drawback',
    description: 'Suspensão de impostos para reexportação',
    calculationMethod: 'drawback',
    requiresLicense: true,
    hasIncentives: true
  },
  {
    code: '05',
    name: 'Reimportação',
    description: 'Reimportação de mercadorias exportadas',
    calculationMethod: 'reimport',
    requiresLicense: false,
    hasIncentives: false
  },
  {
    code: '06',
    name: 'Importação para Consumo',
    description: 'Importação definitiva para consumo',
    calculationMethod: 'standard',
    requiresLicense: false,
    hasIncentives: false
  }
]

// ===== PORTOS, AEROPORTOS E FRONTEIRAS =====
export const customsLocations = {
  maritime: [
    {
      code: 'BRSSZ',
      name: 'Porto de Santos',
      city: 'Santos',
      state: 'SP',
      type: 'maritime',
      incentives: ['Fundap'],
      afrmm: 25.00,
      thc: 150.00,
      storage: 50.00
    },
    {
      code: 'BRRIO',
      name: 'Porto do Rio de Janeiro',
      city: 'Rio de Janeiro', 
      state: 'RJ',
      type: 'maritime',
      incentives: [],
      afrmm: 25.00,
      thc: 140.00,
      storage: 45.00
    },
    {
      code: 'BRPAR',
      name: 'Porto de Paranaguá',
      city: 'Paranaguá',
      state: 'PR', 
      type: 'maritime',
      incentives: ['SC-Paraná'],
      afrmm: 25.00,
      thc: 130.00,
      storage: 40.00
    },
    {
      code: 'BRITJ',
      name: 'Porto de Itajaí',
      city: 'Itajaí',
      state: 'SC',
      type: 'maritime', 
      incentives: ['SC-Paraná'],
      afrmm: 25.00,
      thc: 120.00,
      storage: 35.00
    },
    {
      code: 'BRMAO',
      name: 'Porto de Manaus',
      city: 'Manaus',
      state: 'AM',
      type: 'maritime',
      incentives: ['ZFM'],
      afrmm: 25.00,
      thc: 200.00,
      storage: 80.00
    }
  ],
  air: [
    {
      code: 'BRGRU',
      name: 'Aeroporto de Guarulhos',
      city: 'São Paulo',
      state: 'SP',
      type: 'air',
      incentives: ['Fundap'],
      afrmm: 0.00,
      thc: 80.00,
      storage: 120.00
    },
    {
      code: 'BRBSB',
      name: 'Aeroporto de Brasília',
      city: 'Brasília',
      state: 'DF',
      type: 'air',
      incentives: [],
      afrmm: 0.00,
      thc: 70.00,
      storage: 100.00
    },
    {
      code: 'BRCGH',
      name: 'Aeroporto de Congonhas',
      city: 'São Paulo',
      state: 'SP',
      type: 'air',
      incentives: ['Fundap'],
      afrmm: 0.00,
      thc: 75.00,
      storage: 110.00
    },
    {
      code: 'BRMAO',
      name: 'Aeroporto de Manaus',
      city: 'Manaus',
      state: 'AM',
      type: 'air',
      incentives: ['ZFM'],
      afrmm: 0.00,
      thc: 150.00,
      storage: 200.00
    }
  ],
  land: [
    {
      code: 'BRFSA',
      name: 'Fronteira Foz do Iguaçu',
      city: 'Foz do Iguaçu',
      state: 'PR',
      type: 'land',
      incentives: [],
      afrmm: 0.00,
      thc: 50.00,
      storage: 30.00
    },
    {
      code: 'BRURG',
      name: 'Fronteira Uruguaiana',
      city: 'Uruguaiana',
      state: 'RS',
      type: 'land',
      incentives: [],
      afrmm: 0.00,
      thc: 45.00,
      storage: 25.00
    },
    {
      code: 'BRACR',
      name: 'Fronteira Acre',
      city: 'Rio Branco',
      state: 'AC',
      type: 'land',
      incentives: ['ZFM'],
      afrmm: 0.00,
      thc: 80.00,
      storage: 60.00
    }
  ]
}

// ===== INCENTIVOS FISCAIS =====
export const fiscalIncentives = [
  {
    code: 'FUNDAP',
    name: 'Fundap - Fundo de Desenvolvimento e Aproveitamento do Porto de Santos',
    description: 'Incentivo fiscal para importações pelo Porto de Santos',
    rate: 0.5, // 0.5%
    applicableStates: ['SP'],
    applicableLocations: ['BRSSZ'],
    applicableNCMs: ['all'],
    calculationMethod: 'percentage'
  },
  {
    code: 'ZFM',
    name: 'Zona Franca de Manaus',
    description: 'Incentivo fiscal para importações pela ZFM',
    rate: 0.0, // 0% de II e IPI
    applicableStates: ['AM', 'AC', 'RR', 'RO'],
    applicableLocations: ['BRMAO'],
    applicableNCMs: ['all'],
    calculationMethod: 'exemption'
  },
  {
    code: 'SC-PARANA',
    name: 'Incentivo Santa Catarina - Paraná',
    description: 'Incentivo fiscal para importações pelos portos de SC e PR',
    rate: 0.3, // 0.3%
    applicableStates: ['SC', 'PR'],
    applicableLocations: ['BRPAR', 'BRITJ'],
    applicableNCMs: ['all'],
    calculationMethod: 'percentage'
  },
  {
    code: 'TTD-MG',
    name: 'Terminal de Transbordo de Cargas de Minas Gerais',
    description: 'Incentivo fiscal para importações por MG',
    rate: 0.2, // 0.2%
    applicableStates: ['MG'],
    applicableLocations: ['all'],
    applicableNCMs: ['all'],
    calculationMethod: 'percentage'
  }
]

// ===== DESPESAS ADUANEIRAS =====
export const customsExpenses = {
  maritime: [
    {
      code: 'AFRMM',
      name: 'Adicional ao Frete para Renovação da Marinha Mercante',
      description: 'Taxa obrigatória para importações marítimas',
      rate: 25.00, // USD por tonelada
      calculationMethod: 'per_ton',
      taxable: true,
      taxRate: 0.0 // Não incide impostos
    },
    {
      code: 'THC',
      name: 'Terminal Handling Charge',
      description: 'Taxa de utilização do terminal portuário',
      rate: 150.00, // USD por container
      calculationMethod: 'per_container',
      taxable: true,
      taxRate: 0.0
    },
    {
      code: 'STORAGE',
      name: 'Armazenagem',
      description: 'Taxa de armazenagem no porto',
      rate: 50.00, // USD por dia
      calculationMethod: 'per_day',
      taxable: true,
      taxRate: 0.0
    },
    {
      code: 'CAPATAZIA',
      name: 'Capatazia',
      description: 'Serviços de capatazia e movimentação',
      rate: 80.00, // USD por container
      calculationMethod: 'per_container',
      taxable: true,
      taxRate: 0.0
    }
  ],
  air: [
    {
      code: 'THC_AIR',
      name: 'Terminal Handling Charge - Aéreo',
      description: 'Taxa de utilização do terminal aeroportuário',
      rate: 80.00, // USD por tonelada
      calculationMethod: 'per_ton',
      taxable: true,
      taxRate: 0.0
    },
    {
      code: 'STORAGE_AIR',
      name: 'Armazenagem - Aéreo',
      description: 'Taxa de armazenagem no aeroporto',
      rate: 120.00, // USD por dia
      calculationMethod: 'per_day',
      taxable: true,
      taxRate: 0.0
    }
  ],
  land: [
    {
      code: 'THC_LAND',
      name: 'Terminal Handling Charge - Terrestre',
      description: 'Taxa de utilização do terminal fronteiriço',
      rate: 50.00, // USD por tonelada
      calculationMethod: 'per_ton',
      taxable: true,
      taxRate: 0.0
    },
    {
      code: 'STORAGE_LAND',
      name: 'Armazenagem - Terrestre',
      description: 'Taxa de armazenagem na fronteira',
      rate: 30.00, // USD por dia
      calculationMethod: 'per_day',
      taxable: true,
      taxRate: 0.0
    }
  ]
}

// ===== DESPESAS EXTRAS =====
export const extraExpenses = [
  {
    code: 'DESPACHANTE',
    name: 'Despachante Aduaneiro',
    description: 'Honorários do despachante aduaneiro',
    rate: 500.00, // BRL
    calculationMethod: 'fixed',
    taxable: true,
    taxRate: 0.0
  },
  {
    code: 'COMISSAO',
    name: 'Comissão de Intermediação',
    description: 'Comissão para intermediários',
    rate: 2.0, // 2%
    calculationMethod: 'percentage',
    taxable: true,
    taxRate: 0.0
  },
  {
    code: 'PAPELARIA',
    name: 'Papelaria e Documentação',
    description: 'Custos com documentação e papelaria',
    rate: 150.00, // BRL
    calculationMethod: 'fixed',
    taxable: true,
    taxRate: 0.0
  },
  {
    code: 'ECARRETO',
    name: 'Ecarreto',
    description: 'Transporte interno do porto/aeroporto',
    rate: 200.00, // BRL
    calculationMethod: 'fixed',
    taxable: true,
    taxRate: 0.0
  },
  {
    code: 'CERTIFICACAO',
    name: 'Certificações e Licenças',
    description: 'Custos com certificações obrigatórias',
    rate: 800.00, // BRL
    calculationMethod: 'fixed',
    taxable: true,
    taxRate: 0.0
  }
]

// ===== LICENÇAS OBRIGATÓRIAS =====
export const requiredLicenses = [
  {
    code: 'MAPA',
    name: 'Licença de Importação - MAPA',
    description: 'Licença obrigatória para produtos agropecuários',
    requiredNCMs: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    automatic: false,
    cost: 300.00,
    processingTime: 30 // dias
  },
  {
    code: 'IBAMA',
    name: 'Licença de Importação - IBAMA',
    description: 'Licença obrigatória para produtos ambientais',
    requiredNCMs: ['44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97'],
    automatic: false,
    cost: 500.00,
    processingTime: 45
  },
  {
    code: 'EXERCITO',
    name: 'Licença de Importação - Exército',
    description: 'Licença obrigatória para produtos militares',
    requiredNCMs: ['93'],
    automatic: false,
    cost: 1000.00,
    processingTime: 60
  },
  {
    code: 'INMETRO',
    name: 'Licença de Importação - Inmetro',
    description: 'Licença obrigatória para produtos regulamentados',
    requiredNCMs: ['84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97'],
    automatic: false,
    cost: 400.00,
    processingTime: 20
  },
  {
    code: 'ANVISA',
    name: 'Licença de Importação - Anvisa',
    description: 'Licença obrigatória para produtos de saúde',
    requiredNCMs: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
    automatic: false,
    cost: 600.00,
    processingTime: 40
  }
]

// ===== ALÍQUOTAS DE ICMS POR UF =====
export const icmsRates = {
  'AC': 17.0,
  'AL': 17.0,
  'AP': 18.0,
  'AM': 18.0,
  'BA': 18.0,
  'CE': 18.0,
  'DF': 18.0,
  'ES': 17.0,
  'GO': 17.0,
  'MA': 18.0,
  'MT': 17.0,
  'MS': 17.0,
  'MG': 18.0,
  'PA': 17.0,
  'PB': 18.0,
  'PR': 18.0,
  'PE': 17.5,
  'PI': 18.0,
  'RJ': 20.0,
  'RN': 18.0,
  'RS': 18.0,
  'RO': 17.5,
  'RR': 17.0,
  'SC': 17.0,
  'SP': 18.0,
  'SE': 17.0,
  'TO': 18.0
}

// ===== FCP (Fundo de Combate à Pobreza) =====
export const fcpRates = {
  'AC': 2.0,
  'AL': 2.0,
  'AP': 2.0,
  'AM': 2.0,
  'BA': 2.0,
  'CE': 2.0,
  'DF': 2.0,
  'ES': 2.0,
  'GO': 2.0,
  'MA': 2.0,
  'MT': 2.0,
  'MS': 2.0,
  'MG': 2.0,
  'PA': 2.0,
  'PB': 2.0,
  'PR': 2.0,
  'PE': 2.0,
  'PI': 2.0,
  'RJ': 2.0,
  'RN': 2.0,
  'RS': 2.0,
  'RO': 2.0,
  'RR': 2.0,
  'SC': 2.0,
  'SP': 2.0,
  'SE': 2.0,
  'TO': 2.0
}

// ===== FUNÇÕES AUXILIARES =====
export const getCustomsLocation = (code) => {
  const allLocations = [
    ...customsLocations.maritime,
    ...customsLocations.air,
    ...customsLocations.land
  ]
  return allLocations.find(location => location.code === code)
}

export const getRequiredLicenses = (ncmCode) => {
  const ncmPrefix = ncmCode.substring(0, 2)
  return requiredLicenses.filter(license => 
    license.requiredNCMs.includes(ncmPrefix) || license.requiredNCMs.includes('all')
  )
}

export const getApplicableIncentives = (state, location, ncmCode) => {
  return fiscalIncentives.filter(incentive => {
    const stateMatch = incentive.applicableStates.includes(state) || incentive.applicableStates.includes('all')
    const locationMatch = incentive.applicableLocations.includes(location) || incentive.applicableLocations.includes('all')
    const ncmMatch = incentive.applicableNCMs.includes('all')
    
    return stateMatch && locationMatch && ncmMatch
  })
}

export const calculateICMSInterestadual = (ufOrigem, ufDestino, baseCalculo) => {
  const aliqOrigem = icmsRates[ufOrigem] || 18.0
  const aliqDestino = icmsRates[ufDestino] || 18.0
  const fcpDestino = fcpRates[ufDestino] || 2.0
  
  const icmsInterestadual = (baseCalculo * aliqOrigem) / 100
  const icmsDestino = (baseCalculo * aliqDestino) / 100
  const fcp = (baseCalculo * fcpDestino) / 100
  
  return {
    icmsInterestadual,
    icmsDestino,
    fcp,
    diferencial: icmsDestino - icmsInterestadual
  }
} 