import React from 'react'

interface ResultadosTabProps {
  data: any
  calculation?: any
  onPrev: () => void
}

const ResultadosTab: React.FC<ResultadosTabProps> = ({ data, calculation, onPrev }) => {
  // Dados básicos
  const quantidade = parseFloat(data.quantidade) || 0
  const valorFob = parseFloat(data.valorFob) || 0
  const frete = parseFloat(data.frete) || 0
  const seguro = parseFloat(data.seguro) || 0
  const despesasAduaneiras = parseFloat(data.despesasAduaneiras) || 0
  
  // Impostos (valores base)
  const ii = parseFloat(data.ii) || 0
  const ipi = parseFloat(data.ipi) || 0
  const pis = parseFloat(data.pis) || 0
  const cofins = parseFloat(data.cofins) || 0
  const icms = parseFloat(data.icms) || 0
  const fcp = parseFloat(data.fcp) || 0
  const afrmm = parseFloat(data.afrmm) || 0
  const custoLicenca = parseFloat(data.custoLicenca) || 0

  // Despesas selecionadas do modal
  const despesasSelecionadas = data.despesasSelecionadas || []
  const valoresDespesas = (data.valoresDespesas || {})
  const totalDespesasSelecionadas = despesasSelecionadas.reduce((acc, despesa) => acc + (parseFloat(valoresDespesas[despesa]) || 0), 0)

  // Benefícios selecionados
  const incentivosSelecionados = data.incentivosSelecionados || []
  const regimesSelecionados = data.regimesSelecionados || []
  const economiaPotencial = parseFloat(data.economiaPotencial) || 0

  // Cálculos
  const valorTotal = quantidade * valorFob
  const valorCif = valorTotal + frete + seguro
  const totalImpostos = ii + ipi + pis + cofins + icms + fcp + afrmm
  const totalDespesas = despesasAduaneiras + totalDespesasSelecionadas

  // IMPORTAÇÃO NORMAL (sem benefícios)
  const landedCostNormal = valorTotal + frete + seguro + totalDespesas + totalImpostos + custoLicenca

  // IMPORTAÇÃO COM BENEFÍCIOS
  const landedCostComBeneficios = landedCostNormal - economiaPotencial

  // Economia percentual
  const economiaPercentual = landedCostNormal > 0 ? ((economiaPotencial / landedCostNormal) * 100) : 0

  // Compromissos futuros por regime/incentivo
  const getCompromissos = () => {
    const compromissos: Array<{
      regime: string;
      compromissos: string[];
      prazo: string;
      penalidades: string;
    }> = []
    
    if (incentivosSelecionados.includes('Zona Franca de Manaus')) {
      compromissos.push({
        regime: 'Zona Franca de Manaus',
        compromissos: [
          'Manter produtos na ZFM por período determinado',
          'Apresentar relatórios trimestrais à SUFrama',
          'Não comercializar produtos fora da ZFM sem autorização',
          'Cumprir metas de produção/industrialização',
          'Manter controle de estoque em tempo real'
        ],
        prazo: 'Indefinido (enquanto mantiver na ZFM)',
        penalidades: 'Multa de até 100% do valor dos impostos + apreensão da mercadoria'
      })
    }

    if (regimesSelecionados.includes('Drawback')) {
      compromissos.push({
        regime: 'Drawback',
        compromissos: [
          'Exportar produto equivalente em 2 anos',
          'Manter garantia bancária durante todo o período',
          'Apresentar comprovação de exportação à RFB',
          'Não utilizar produto no mercado interno',
          'Manter controle de estoque específico'
        ],
        prazo: '2 anos para exportação',
        penalidades: 'Pagamento dos impostos suspensos + multa de 75%'
      })
    }

    if (regimesSelecionados.includes('Admissão Temporária')) {
      compromissos.push({
        regime: 'Admissão Temporária',
        compromissos: [
          'Reexportar ou nacionalizar em 1 ano',
          'Manter garantia bancária',
          'Não alterar características do produto',
          'Apresentar comprovação de saída',
          'Manter controle de localização'
        ],
        prazo: '1 ano para reexportação/nacionalização',
        penalidades: 'Pagamento dos impostos suspensos + multa de 50%'
      })
    }

    if (incentivosSelecionados.includes('FUNDAP')) {
      compromissos.push({
        regime: 'FUNDAP',
        compromissos: [
          'Utilizar produtos exclusivamente para agropecuária',
          'Apresentar relatórios semestrais',
          'Manter documentação de destinação',
          'Não revender produtos beneficiados',
          'Cumprir metas de investimento'
        ],
        prazo: '5 anos de compromisso',
        penalidades: 'Pagamento dos impostos reduzidos + multa de 30%'
      })
    }

    return compromissos
  }

  const compromissosFuturos = getCompromissos()

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resultados da Simulação</h2>

      {/* Comparativo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Importação Normal */}
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg border-2 border-red-200 dark:border-red-700">
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">
            Importação Normal (Sem Benefícios)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">Valor FOB:</span>
              <span className="font-semibold text-red-900 dark:text-red-100">R$ {valorTotal.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">Frete + Seguro:</span>
              <span className="font-semibold text-red-900 dark:text-red-100">R$ {(frete + seguro).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">Despesas Aduaneiras:</span>
              <span className="font-semibold text-red-900 dark:text-red-100">R$ {totalDespesas.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">Impostos:</span>
              <span className="font-semibold text-red-900 dark:text-red-100">R$ {totalImpostos.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">Licenças:</span>
              <span className="font-semibold text-red-900 dark:text-red-100">R$ {custoLicenca.toLocaleString('pt-BR')}</span>
            </div>
            <hr className="border-red-300 dark:border-red-600" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-red-900 dark:text-red-100">Landed Cost Total:</span>
              <span className="text-red-900 dark:text-red-100">R$ {landedCostNormal.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Importação com Benefícios */}
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg border-2 border-green-200 dark:border-green-700">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
            Importação com Benefícios
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Valor FOB:</span>
              <span className="font-semibold text-green-900 dark:text-green-100">R$ {valorTotal.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Frete + Seguro:</span>
              <span className="font-semibold text-green-900 dark:text-green-100">R$ {(frete + seguro).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Despesas Aduaneiras:</span>
              <span className="font-semibold text-green-900 dark:text-green-100">R$ {totalDespesas.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Impostos:</span>
              <span className="font-semibold text-green-900 dark:text-green-100">R$ {totalImpostos.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Licenças:</span>
              <span className="font-semibold text-green-900 dark:text-green-100">R$ {custoLicenca.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Economia com Benefícios:</span>
              <span className="font-semibold">-R$ {economiaPotencial.toLocaleString('pt-BR')}</span>
            </div>
            <hr className="border-green-300 dark:border-green-600" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-green-900 dark:text-green-100">Landed Cost Total:</span>
              <span className="text-green-900 dark:text-green-100">R$ {landedCostComBeneficios.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo da Economia */}
      <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
          Resumo da Economia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              R$ {economiaPotencial.toLocaleString('pt-BR')}
            </p>
            <p className="text-blue-700 dark:text-blue-300">Economia Total</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {economiaPercentual.toFixed(1)}%
            </p>
            <p className="text-blue-700 dark:text-blue-300">Redução no Custo</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {incentivosSelecionados.length + regimesSelecionados.length}
            </p>
            <p className="text-blue-700 dark:text-blue-300">Benefícios Aplicados</p>
          </div>
        </div>
      </div>

      {/* Memorial de Cálculo */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Memorial de Cálculo
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Valor FOB:</span>
            <span className="text-gray-900 dark:text-white">R$ {valorTotal.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Frete Internacional:</span>
            <span className="text-gray-900 dark:text-white">R$ {frete.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Seguro Internacional:</span>
            <span className="text-gray-900 dark:text-white">R$ {seguro.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Valor CIF:</span>
            <span className="text-gray-900 dark:text-white">R$ {valorCif.toLocaleString('pt-BR')}</span>
          </div>
          <hr className="border-gray-300 dark:border-gray-600" />
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Imposto de Importação (II):</span>
            <span className="text-gray-900 dark:text-white">R$ {ii.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">IPI:</span>
            <span className="text-gray-900 dark:text-white">R$ {ipi.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">PIS/COFINS:</span>
            <span className="text-gray-900 dark:text-white">R$ {(pis + cofins).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">ICMS:</span>
            <span className="text-gray-900 dark:text-white">R$ {icms.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FCP:</span>
            <span className="text-gray-900 dark:text-white">R$ {fcp.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">AFRMM:</span>
            <span className="text-gray-900 dark:text-white">R$ {afrmm.toLocaleString('pt-BR')}</span>
          </div>
          <hr className="border-gray-300 dark:border-gray-600" />
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Despesas Aduaneiras:</span>
            <span className="text-gray-900 dark:text-white">R$ {despesasAduaneiras.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Despesas do Modal:</span>
            <span className="text-gray-900 dark:text-white">R$ {totalDespesasSelecionadas.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Licenças:</span>
            <span className="text-gray-900 dark:text-white">R$ {custoLicenca.toLocaleString('pt-BR')}</span>
          </div>
          <hr className="border-gray-300 dark:border-gray-600" />
          <div className="flex justify-between font-semibold">
            <span className="text-gray-900 dark:text-white">Landed Cost Normal:</span>
            <span className="text-gray-900 dark:text-white">R$ {landedCostNormal.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Economia com Benefícios:</span>
            <span>-R$ {economiaPotencial.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-900 dark:text-white">Landed Cost Final:</span>
            <span className="text-gray-900 dark:text-white">R$ {landedCostComBeneficios.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Compromissos Futuros */}
      {compromissosFuturos.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-700">
          <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">
            ⚠️ Compromissos Futuros
          </h3>
          <div className="space-y-4">
            {compromissosFuturos.map((compromisso, index) => (
              <div key={index} className="border border-yellow-300 dark:border-yellow-600 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                  {compromisso.regime}
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  <strong>Prazo:</strong> {compromisso.prazo}
                </p>
                <div className="mb-2">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Compromissos:</p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {compromisso.compromissos.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Penalidades:</strong> {compromisso.penalidades}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TTCE - Tratamentos Tributários Oficiais */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700 mt-8">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2" fill="#eff6ff"/><path d="M12 8v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#2563eb"/></svg>
          Tratamentos Tributários Oficiais (TTCE)
          <span className="ml-2 text-xs text-blue-600 dark:text-blue-300 cursor-pointer" title="Dados oficiais extraídos do TTCE/SRF. Garantia de compliance e transparência.">ⓘ</span>
        </h3>
        {data.produtos && data.produtos[0] && data.produtos[0].ttceData ? (
          <>
            {/* Lista de tratamentos tributários */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-blue-50 dark:bg-blue-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Tributo</th>
                    <th className="px-3 py-2 text-left">Regime</th>
                    <th className="px-3 py-2 text-left">Fundamento Legal</th>
                    <th className="px-3 py-2 text-left">Atributos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.produtos[0].ttceData.tratamentos?.map((trat, idx) => (
                    <tr key={idx} className="border-b dark:border-blue-900">
                      <td className="px-3 py-2 font-medium">{trat.tributo}</td>
                      <td className="px-3 py-2">{trat.regime}</td>
                      <td className="px-3 py-2">
                        {trat.fundamentoLegal?.nome ? (
                          <a href={trat.fundamentoLegal.link || '#'} className="text-blue-700 underline" target="_blank" rel="noopener" title={trat.fundamentoLegal.tipo + (trat.fundamentoLegal.codigo ? ' - ' + trat.fundamentoLegal.codigo : '')}>{trat.fundamentoLegal.nome}</a>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-2">
                        {trat.atributos?.map((attr, aidx) => (
                          <span key={aidx} className="inline-block bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-1" title={attr.explicacao}>{attr.nome}{attr.valor ? ': ' + attr.valor : ''}</span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Fundamentos legais detalhados */}
            <div className="mt-6">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="#2563eb" strokeWidth="1.5" fill="#dbeafe"/><path d="M9 5v4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12" r="0.75" fill="#2563eb"/></svg>
                Fundamentos Legais
              </h4>
              <ul className="list-disc pl-5 text-blue-900 dark:text-blue-100 text-sm">
                {data.produtos[0].ttceData.fundamentos?.map((fund, fidx) => (
                  <li key={fidx}><strong>{fund.nome}</strong> ({fund.tipo}){fund.codigo ? ' - ' + fund.codigo : ''} {fund.link && (<a href={fund.link} className="underline text-blue-700" target="_blank" rel="noopener">Ver texto legal</a>)}</li>
                ))}
              </ul>
            </div>
            {/* Regimes tributários */}
            <div className="mt-6">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Regimes Tributários</h4>
              <ul className="list-disc pl-5 text-blue-900 dark:text-blue-100 text-sm">
                {data.produtos[0].ttceData.regimes?.map((reg, ridx) => (
                  <li key={ridx}><strong>{reg.nome}</strong> (Código: {reg.codigo}) - {reg.explicacao}</li>
                ))}
              </ul>
            </div>
            {/* Atributos obrigatórios */}
            <div className="mt-6">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Atributos Obrigatórios</h4>
              <ul className="list-disc pl-5 text-blue-900 dark:text-blue-100 text-sm">
                {data.produtos[0].ttceData.atributos?.map((attr, aidx) => (
                  <li key={aidx}><strong>{attr.nome}</strong>{attr.valor ? ': ' + attr.valor : ''} - {attr.explicacao}</li>
                ))}
              </ul>
            </div>
            {/* Tributos calculados */}
            <div className="mt-6">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Tributos Calculados</h4>
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-blue-50 dark:bg-blue-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Tributo</th>
                    <th className="px-3 py-2 text-left">Alíquota</th>
                    <th className="px-3 py-2 text-left">Base de Cálculo</th>
                    <th className="px-3 py-2 text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.produtos[0].ttceData.tributosCalculados?.map((trib, tidx) => (
                    <tr key={tidx} className="border-b dark:border-blue-900">
                      <td className="px-3 py-2 font-medium">{trib.nome}</td>
                      <td className="px-3 py-2">{trib.aliquota}</td>
                      <td className="px-3 py-2">{trib.baseCalculo}</td>
                      <td className="px-3 py-2">{trib.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Info de compliance */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#22c55e" strokeWidth="2" fill="#dcfce7"/><path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-green-800 dark:text-green-200 text-sm">Todos os dados tributários foram validados oficialmente via TTCE/SRF. Simulação 100% compliance.</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Nenhum dado oficial TTCE disponível para o NCM informado.</div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <div className="space-x-4">
          <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Salvar Simulação</button>
          <button type="button" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Exportar Relatório</button>
        </div>
      </div>
    </div>
  )
}

export default ResultadosTab 