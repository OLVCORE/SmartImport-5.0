import React, { useState } from 'react'

interface LicencasTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

const LicencasTab: React.FC<LicencasTabProps> = ({ data, onChange, onNext, onPrev }) => {
  const [showCustos, setShowCustos] = useState(false)

  // Custos padrão de licenças (serão buscados via API posteriormente)
  const custosPadrao = {
    mapa: 500, // Licença MAPA
    ibama: 800, // Licença IBAMA
    anvisa: 600, // Licença ANVISA
    inmetro: 400, // Licença INMETRO
    exercito: 300, // Licença Exército
  }

  const handleCustoChange = (field: string, value: string) => {
    onChange({ 
      [field]: value,
      [`${field}Manual`]: true // Marca como alteração manual
    })
  }

  // Calcular custo total das licenças
  const custoTotal = (
    parseFloat(data.custoMapa || 0) +
    parseFloat(data.custoIbama || 0) +
    parseFloat(data.custoAnvisa || 0) +
    parseFloat(data.custoInmetro || 0) +
    parseFloat(data.custoExercito || 0)
  )

  return (
    <div className="space-y-6">
      {/* Licenças Obrigatórias */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Licenças Obrigatórias
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Licença MAPA (Ministério da Agricultura)
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.licencaMapa || ''}
              onChange={e => onChange({ licencaMapa: e.target.value })}
            >
              <option value="">Não se aplica</option>
              <option value="obrigatoria">Obrigatória</option>
              <option value="opcional">Opcional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Licença IBAMA (Meio Ambiente)
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.licencaIbama || ''}
              onChange={e => onChange({ licencaIbama: e.target.value })}
            >
              <option value="">Não se aplica</option>
              <option value="obrigatoria">Obrigatória</option>
              <option value="opcional">Opcional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Licença ANVISA (Saúde)
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.licencaAnvisa || ''}
              onChange={e => onChange({ licencaAnvisa: e.target.value })}
            >
              <option value="">Não se aplica</option>
              <option value="obrigatoria">Obrigatória</option>
              <option value="opcional">Opcional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Licença INMETRO (Metrologia)
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.licencaInmetro || ''}
              onChange={e => onChange({ licencaInmetro: e.target.value })}
            >
              <option value="">Não se aplica</option>
              <option value="obrigatoria">Obrigatória</option>
              <option value="opcional">Opcional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Licença Exército (Armas/Munitions)
            </label>
            <select
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.licencaExercito || ''}
              onChange={e => onChange({ licencaExercito: e.target.value })}
            >
              <option value="">Não se aplica</option>
              <option value="obrigatoria">Obrigatória</option>
              <option value="opcional">Opcional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status das Licenças */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Status das Licenças
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Geral
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.statusLicenca || ''}
              onChange={e => onChange({ statusLicenca: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovada">Aprovada</option>
              <option value="rejeitada">Rejeitada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prazo de Validade (dias)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.prazoValidade || ''}
              onChange={e => onChange({ prazoValidade: e.target.value })}
              placeholder="Ex: 30"
            />
          </div>
        </div>
      </div>

      {/* Custos das Licenças */}
      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Custos das Licenças
          </h3>
          <button
            type="button"
            onClick={() => setShowCustos(!showCustos)}
            className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
          >
            {showCustos ? 'Ocultar' : 'Ver'} Custos Detalhados
          </button>
        </div>

        {showCustos ? (
          // Campos detalhados de custos
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Custo MAPA
                {data.custoMapaManual && <span className="text-orange-600 ml-1">*Manual</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={data.custoMapa || (data.licencaMapa === 'obrigatoria' ? custosPadrao.mapa : 0)}
                onChange={e => handleCustoChange('custoMapa', e.target.value)}
                placeholder="Ex: 500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Custo IBAMA
                {data.custoIbamaManual && <span className="text-orange-600 ml-1">*Manual</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={data.custoIbama || (data.licencaIbama === 'obrigatoria' ? custosPadrao.ibama : 0)}
                onChange={e => handleCustoChange('custoIbama', e.target.value)}
                placeholder="Ex: 800.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Custo ANVISA
                {data.custoAnvisaManual && <span className="text-orange-600 ml-1">*Manual</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={data.custoAnvisa || (data.licencaAnvisa === 'obrigatoria' ? custosPadrao.anvisa : 0)}
                onChange={e => handleCustoChange('custoAnvisa', e.target.value)}
                placeholder="Ex: 600.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Custo INMETRO
                {data.custoInmetroManual && <span className="text-orange-600 ml-1">*Manual</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={data.custoInmetro || (data.licencaInmetro === 'obrigatoria' ? custosPadrao.inmetro : 0)}
                onChange={e => handleCustoChange('custoInmetro', e.target.value)}
                placeholder="Ex: 400.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Custo Exército
                {data.custoExercitoManual && <span className="text-orange-600 ml-1">*Manual</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={data.custoExercito || (data.licencaExercito === 'obrigatoria' ? custosPadrao.exercito : 0)}
                onChange={e => handleCustoChange('custoExercito', e.target.value)}
                placeholder="Ex: 300.00"
              />
            </div>
          </div>
        ) : (
          // Campo simplificado
          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Custo Total das Licenças
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              value={data.custoLicenca || custoTotal}
              onChange={e => onChange({ custoLicenca: e.target.value })}
              placeholder="Ex: 2600.00"
            />
          </div>
        )}

        {/* Resumo dos Custos */}
        <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Custo Total das Licenças:
            </span>
            <span className="text-lg font-semibold text-green-900 dark:text-green-100">
              R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Informações Importantes */}
      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Informações Importantes
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>• Licenças obrigatórias devem ser obtidas antes do desembaraço</li>
          <li>• Custos podem variar conforme complexidade e urgência</li>
          <li>• Prazos de análise podem levar de 5 a 30 dias úteis</li>
          <li>• Algumas licenças têm validade específica (30, 60, 90 dias)</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={onNext}>Próxima Etapa</button>
      </div>
    </div>
  )
}

export default LicencasTab 