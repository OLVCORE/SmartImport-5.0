import React, { useState, useEffect } from 'react'

interface IncentivosTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

// Regimes Aduaneiros e Incentivos por UF
const REGIMES_E_INCENTIVOS = {
  'AC': {
    'Zona Franca de Manaus': {
      descricao: 'Suspensão total de II, IPI, ICMS, PIS/COFINS',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Produtos para ZFM', 'Autorização SUFrama'],
      calculo: (valorFob: number) => valorFob * 0.35 // 35% de economia estimada
    },
    'Admissão Temporária': {
      descricao: 'Suspensão de impostos para reexportação',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Reexportação em 1 ano', 'Garantia bancária'],
      calculo: (valorFob: number) => valorFob * 0.25
    }
  },
  'AM': {
    'Zona Franca de Manaus': {
      descricao: 'Suspensão total de II, IPI, ICMS, PIS/COFINS',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Produtos para ZFM', 'Autorização SUFrama'],
      calculo: (valorFob: number) => valorFob * 0.35
    },
    'Repetro': {
      descricao: 'Regime especial para petróleo e gás',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Atividade de E&P', 'Autorização ANP'],
      calculo: (valorFob: number) => valorFob * 0.30
    }
  },
  'AP': {
    'Zona Franca de Macapá': {
      descricao: 'Redução de II e IPI',
      baseCalculo: 'valorFob',
      percentual: 60,
      tipo: 'reducao',
      condicoes: ['Produtos para ZFM', 'Autorização SUDAM'],
      calculo: (valorFob: number) => valorFob * 0.20
    }
  },
  'PA': {
    'Zona Franca de Belém': {
      descricao: 'Redução de II e IPI',
      baseCalculo: 'valorFob',
      percentual: 60,
      tipo: 'reducao',
      condicoes: ['Produtos para ZFM', 'Autorização SUDAM'],
      calculo: (valorFob: number) => valorFob * 0.20
    }
  },
  'RO': {
    'Zona Franca de Porto Velho': {
      descricao: 'Redução de II e IPI',
      baseCalculo: 'valorFob',
      percentual: 60,
      tipo: 'reducao',
      condicoes: ['Produtos para ZFM', 'Autorização SUDAM'],
      calculo: (valorFob: number) => valorFob * 0.20
    }
  },
  'RR': {
    'Zona Franca de Boa Vista': {
      descricao: 'Redução de II e IPI',
      baseCalculo: 'valorFob',
      percentual: 60,
      tipo: 'reducao',
      condicoes: ['Produtos para ZFM', 'Autorização SUDAM'],
      calculo: (valorFob: number) => valorFob * 0.20
    }
  },
  'TO': {
    'Zona Franca de Palmas': {
      descricao: 'Redução de II e IPI',
      baseCalculo: 'valorFob',
      percentual: 60,
      tipo: 'reducao',
      condicoes: ['Produtos para ZFM', 'Autorização SUDAM'],
      calculo: (valorFob: number) => valorFob * 0.20
    }
  },
  'SC': {
    'FUNDAP': {
      descricao: 'Fundo de Desenvolvimento da Agropecuária',
      baseCalculo: 'valorFob',
      percentual: 50,
      tipo: 'reducao',
      condicoes: ['Produtos agropecuários', 'Autorização FUNDAP'],
      calculo: (valorFob: number) => valorFob * 0.15
    },
    'PRODEC': {
      descricao: 'Programa de Desenvolvimento Econômico',
      baseCalculo: 'valorFob',
      percentual: 40,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização PRODEC'],
      calculo: (valorFob: number) => valorFob * 0.12
    }
  },
  'MG': {
    'FUNDAP-MG': {
      descricao: 'Fundo de Desenvolvimento de MG',
      baseCalculo: 'valorFob',
      percentual: 45,
      tipo: 'reducao',
      condicoes: ['Projetos estratégicos', 'Autorização FUNDAP-MG'],
      calculo: (valorFob: number) => valorFob * 0.14
    },
    'Zona de Processamento de Exportação': {
      descricao: 'ZPE para exportação',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Exportação obrigatória', 'Autorização ZPE'],
      calculo: (valorFob: number) => valorFob * 0.30
    }
  },
  'RS': {
    'FUNDOP': {
      descricao: 'Fundo de Desenvolvimento do RS',
      baseCalculo: 'valorFob',
      percentual: 50,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização FUNDOP'],
      calculo: (valorFob: number) => valorFob * 0.15
    }
  },
  'PR': {
    'FUNDOPAR': {
      descricao: 'Fundo de Desenvolvimento do PR',
      baseCalculo: 'valorFob',
      percentual: 45,
      tipo: 'reducao',
      condicoes: ['Projetos estratégicos', 'Autorização FUNDOPAR'],
      calculo: (valorFob: number) => valorFob * 0.14
    }
  },
  'SP': {
    'FUNDAP-SP': {
      descricao: 'Fundo de Desenvolvimento de SP',
      baseCalculo: 'valorFob',
      percentual: 40,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização FUNDAP-SP'],
      calculo: (valorFob: number) => valorFob * 0.12
    },
    'Zona de Processamento de Exportação': {
      descricao: 'ZPE para exportação',
      baseCalculo: 'valorFob',
      percentual: 100,
      tipo: 'suspensao',
      condicoes: ['Exportação obrigatória', 'Autorização ZPE'],
      calculo: (valorFob: number) => valorFob * 0.30
    }
  },
  'RJ': {
    'FUNDAP-RJ': {
      descricao: 'Fundo de Desenvolvimento do RJ',
      baseCalculo: 'valorFob',
      percentual: 45,
      tipo: 'reducao',
      condicoes: ['Projetos estratégicos', 'Autorização FUNDAP-RJ'],
      calculo: (valorFob: number) => valorFob * 0.14
    }
  },
  'BA': {
    'FUNDAP-BA': {
      descricao: 'Fundo de Desenvolvimento da BA',
      baseCalculo: 'valorFob',
      percentual: 50,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização FUNDAP-BA'],
      calculo: (valorFob: number) => valorFob * 0.15
    }
  },
  'CE': {
    'FUNDAP-CE': {
      descricao: 'Fundo de Desenvolvimento do CE',
      baseCalculo: 'valorFob',
      percentual: 45,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização FUNDAP-CE'],
      calculo: (valorFob: number) => valorFob * 0.14
    }
  },
  'PE': {
    'FUNDAP-PE': {
      descricao: 'Fundo de Desenvolvimento de PE',
      baseCalculo: 'valorFob',
      percentual: 50,
      tipo: 'reducao',
      condicoes: ['Projetos aprovados', 'Autorização FUNDAP-PE'],
      calculo: (valorFob: number) => valorFob * 0.15
    }
  }
}

// Regimes Aduaneiros Nacionais (aplicáveis em qualquer UF)
const REGIMES_NACIONAIS = {
  'Drawback': {
    descricao: 'Suspensão de impostos para exportação',
    baseCalculo: 'valorFob',
    percentual: 100,
    tipo: 'suspensao',
    condicoes: ['Exportação obrigatória', 'Garantia bancária'],
    calculo: (valorFob: number) => valorFob * 0.25
  },
  'Admissão Temporária': {
    descricao: 'Suspensão para reexportação ou nacionalização',
    baseCalculo: 'valorFob',
    percentual: 100,
    tipo: 'suspensao',
    condicoes: ['Reexportação em 1 ano', 'Garantia bancária'],
    calculo: (valorFob: number) => valorFob * 0.20
  },
  'Repetro': {
    descricao: 'Regime especial para petróleo e gás',
    baseCalculo: 'valorFob',
    percentual: 100,
    tipo: 'suspensao',
    condicoes: ['Atividade de E&P', 'Autorização ANP'],
    calculo: (valorFob: number) => valorFob * 0.30
  },
  'Zona de Processamento de Exportação (ZPE)': {
    descricao: 'Suspensão total para exportação',
    baseCalculo: 'valorFob',
    percentual: 100,
    tipo: 'suspensao',
    condicoes: ['Exportação obrigatória', 'Autorização ZPE'],
    calculo: (valorFob: number) => valorFob * 0.30
  },
  'Importação por Conta e Ordem': {
    descricao: 'Importação para terceiros',
    baseCalculo: 'valorFob',
    percentual: 0,
    tipo: 'operacional',
    condicoes: ['Contrato de representação', 'Autorização RFB'],
    calculo: (valorFob: number) => 0 // Não gera economia, apenas mudança operacional
  },
  'Importação por Encomenda': {
    descricao: 'Importação sob encomenda',
    baseCalculo: 'valorFob',
    percentual: 0,
    tipo: 'operacional',
    condicoes: ['Contrato de encomenda', 'Autorização RFB'],
    calculo: (valorFob: number) => 0
  }
}

const IncentivosTab: React.FC<IncentivosTabProps> = ({ data, onChange, onNext, onPrev }) => {
  const [incentivosSelecionados, setIncentivosSelecionados] = useState<string[]>(data.incentivosSelecionados || [])
  const [regimesSelecionados, setRegimesSelecionados] = useState<string[]>(data.regimesSelecionados || [])
  const [economiaTotal, setEconomiaTotal] = useState(0)
  
  const ufDesembaraco = data.estadoDestino || ''
  const valorFob = parseFloat(data.valorFob) || 0

  useEffect(() => {
    // Calcular economia total baseada nos incentivos e regimes selecionados
    let economia = 0
    
    // Incentivos regionais
    if (ufDesembaraco && REGIMES_E_INCENTIVOS[ufDesembaraco]) {
      incentivosSelecionados.forEach(incentivo => {
        if (REGIMES_E_INCENTIVOS[ufDesembaraco][incentivo]) {
          economia += REGIMES_E_INCENTIVOS[ufDesembaraco][incentivo].calculo(valorFob)
        }
      })
    }
    
    // Regimes nacionais
    regimesSelecionados.forEach(regime => {
      if (REGIMES_NACIONAIS[regime]) {
        economia += REGIMES_NACIONAIS[regime].calculo(valorFob)
      }
    })
    
    setEconomiaTotal(economia)
    onChange({ ...data, economiaPotencial: economia })
  }, [incentivosSelecionados, regimesSelecionados, valorFob, ufDesembaraco])

  const handleToggleIncentivo = (incentivo: string) => {
    let novosIncentivos: string[]
    if (incentivosSelecionados.includes(incentivo)) {
      novosIncentivos = incentivosSelecionados.filter(i => i !== incentivo)
    } else {
      novosIncentivos = [...incentivosSelecionados, incentivo]
    }
    setIncentivosSelecionados(novosIncentivos)
    onChange({ ...data, incentivosSelecionados: novosIncentivos })
  }

  const handleToggleRegime = (regime: string) => {
    let novosRegimes: string[]
    if (regimesSelecionados.includes(regime)) {
      novosRegimes = regimesSelecionados.filter(r => r !== regime)
    } else {
      novosRegimes = [...regimesSelecionados, regime]
    }
    setRegimesSelecionados(novosRegimes)
    onChange({ ...data, regimesSelecionados: novosRegimes })
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Regimes Aduaneiros e Incentivos Fiscais
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          UF de Desembaraço: <strong>{ufDesembaraco || 'Não informado'}</strong>
        </p>
        {ufDesembaraco && REGIMES_E_INCENTIVOS[ufDesembaraco] && (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Incentivos disponíveis: {Object.keys(REGIMES_E_INCENTIVOS[ufDesembaraco]).length}
          </p>
        )}
      </div>

      {/* Incentivos Regionais */}
      {ufDesembaraco && REGIMES_E_INCENTIVOS[ufDesembaraco] && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Incentivos Regionais - {ufDesembaraco}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(REGIMES_E_INCENTIVOS[ufDesembaraco]).map(([incentivo, dados]) => (
              <div key={incentivo} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={incentivosSelecionados.includes(incentivo)}
                    onChange={() => handleToggleIncentivo(incentivo)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{incentivo}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{(dados as any).descricao}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Redução: {(dados as any).percentual}% | Economia estimada: R$ {(dados as any).calculo(valorFob).toLocaleString('pt-BR')}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Condições:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {(dados as any).condicoes.map((condicao: string, index: number) => (
                          <li key={index}>• {condicao}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regimes Nacionais */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Regimes Aduaneiros Nacionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(REGIMES_NACIONAIS).map(([regime, dados]) => (
            <div key={regime} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={regimesSelecionados.includes(regime)}
                  onChange={() => handleToggleRegime(regime)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{regime}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{(dados as any).descricao}</p>
                  {(dados as any).tipo !== 'operacional' && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Redução: {(dados as any).percentual}% | Economia estimada: R$ {(dados as any).calculo(valorFob).toLocaleString('pt-BR')}
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Condições:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {(dados as any).condicoes.map((condicao: string, index: number) => (
                        <li key={index}>• {condicao}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo da Economia */}
      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          Resumo da Economia Potencial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Incentivos Selecionados</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">
              {incentivosSelecionados.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Regimes Selecionados</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">
              {regimesSelecionados.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Economia Total</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">
              R$ {economiaTotal.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={onNext}>Próxima Etapa</button>
      </div>
    </div>
  )
}

export default IncentivosTab 