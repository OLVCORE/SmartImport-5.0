import React, { useState, useEffect } from 'react'
import { validateRequiredFields, showValidationAlert, convertToBRL, formatDualCurrency } from '../../utils/currency'

interface TributosTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

const TributosTab: React.FC<TributosTabProps> = ({ data, onChange, onNext, onPrev }) => {
  const [showAliquotas, setShowAliquotas] = useState(false)
  const [brlValues, setBrlValues] = useState({
    ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, fcp: 0, afrmm: 0
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Valores base para cálculos
  const valorFob = parseFloat(data.valorFob) || 0
  const quantidade = parseFloat(data.quantidade) || 0
  const valorTotal = valorFob * quantidade
  const frete = parseFloat(data.frete) || 0
  const seguro = parseFloat(data.seguro) || 0
  const valorCif = valorTotal + frete + seguro

  // Alíquotas padrão (serão buscadas via API posteriormente)
  const aliquotasPadrao = {
    ii: 16, // 16% - Imposto de Importação
    ipi: 10, // 10% - IPI
    pis: 2.1, // 2.1% - PIS
    cofins: 9.65, // 9.65% - COFINS
    icms: 18, // 18% - ICMS (varia por estado)
    fcp: 2, // 2% - FCP (varia por estado)
    afrmm: 25, // 25% - AFRMM (sobre frete marítimo)
  }

  // Calcular valores em BRL quando CIF ou moeda mudarem
  useEffect(() => {
    const calculateBrlValues = async () => {
      const currency = data.moeda || 'USD'
      
      const ii = parseFloat(data.ii) || 0
      const ipi = parseFloat(data.ipi) || 0
      const pis = parseFloat(data.pis) || 0
      const cofins = parseFloat(data.cofins) || 0
      const icms = parseFloat(data.icms) || 0
      const fcp = parseFloat(data.fcp) || 0
      const afrmm = parseFloat(data.afrmm) || 0

      const brlIi = await convertToBRL(ii, currency)
      const brlIpi = await convertToBRL(ipi, currency)
      const brlPis = await convertToBRL(pis, currency)
      const brlCofins = await convertToBRL(cofins, currency)
      const brlIcms = await convertToBRL(icms, currency)
      const brlFcp = await convertToBRL(fcp, currency)
      const brlAfrmm = await convertToBRL(afrmm, currency)

      setBrlValues({
        ii: brlIi,
        ipi: brlIpi,
        pis: brlPis,
        cofins: brlCofins,
        icms: brlIcms,
        fcp: brlFcp,
        afrmm: brlAfrmm
      })
    }

    calculateBrlValues()
  }, [data.ii, data.ipi, data.pis, data.cofins, data.icms, data.fcp, data.afrmm, data.moeda])

  // Calcular valores automaticamente se alíquotas estiverem disponíveis
  useEffect(() => {
    if (data.calcularAutomatico !== false) {
      const novosValores = {
        ii: valorCif * (aliquotasPadrao.ii / 100),
        ipi: valorCif * (aliquotasPadrao.ipi / 100),
        pis: valorCif * (aliquotasPadrao.pis / 100),
        cofins: valorCif * (aliquotasPadrao.cofins / 100),
        icms: valorCif * (aliquotasPadrao.icms / 100),
        fcp: valorCif * (aliquotasPadrao.fcp / 100),
        afrmm: frete * (aliquotasPadrao.afrmm / 100),
      }
      
      // Só atualiza se os valores não foram inseridos manualmente
      Object.keys(novosValores).forEach(key => {
        if (!data[`${key}Manual`]) {
          onChange({ [key]: novosValores[key].toFixed(2) })
        }
      })
    }
  }, [valorCif, frete, data.calcularAutomatico])

  const handleManualChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Validação: valores não podem ser negativos
    if (numValue < 0) {
      alert('❌ Valor não pode ser negativo')
      return
    }

    onChange({ 
      [field]: value,
      [`${field}Manual`]: true // Marca como alteração manual
    })
  }

  // Validar campos antes de prosseguir
  const handleNext = () => {
    const requiredFields = ['ii', 'ipi', 'pis', 'cofins', 'icms', 'fcp']
    const validation = validateRequiredFields(data, requiredFields)
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      showValidationAlert(validation.errors)
      return
    }

    // Validar se valores são não-negativos
    const valueErrors: string[] = []
    const tributos = ['ii', 'ipi', 'pis', 'cofins', 'icms', 'fcp', 'afrmm']
    
    tributos.forEach(tributo => {
      const valor = parseFloat(data[tributo]) || 0
      if (valor < 0) {
        valueErrors.push(`${tributo.toUpperCase()} não pode ser negativo`)
      }
    })

    if (valueErrors.length > 0) {
      setValidationErrors(valueErrors)
      showValidationAlert(valueErrors)
      return
    }

    setValidationErrors([])
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Alerta de validação */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Campos com erro:
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações da moeda e CIF */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Base de Cálculo: CIF = {formatDualCurrency(valorCif, data.moeda || 'USD', valorCif * (data.moeda === 'BRL' ? 1 : 5.15))}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Todos os tributos são calculados sobre o valor CIF e convertidos para BRL
        </p>
      </div>

      {/* Controle de cálculo automático */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100">
              Cálculo Automático de Tributos
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Marque para calcular automaticamente baseado nas alíquotas padrão
            </p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.calcularAutomatico !== false}
              onChange={e => onChange({ calcularAutomatico: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-yellow-800 dark:text-yellow-200">Ativar</span>
          </label>
        </div>
      </div>

      {/* Tributos principais */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tributos Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              II (Imposto de Importação) * <span className="text-red-500">(Obrigatório)</span>
              {data.iiManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.ii || ''}
              onChange={e => handleManualChange('ii', e.target.value)}
              placeholder="Ex: 1600.00"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.ii) || 0, data.moeda || 'USD', brlValues.ii)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IPI (Imposto sobre Produtos Industrializados) * <span className="text-red-500">(Obrigatório)</span>
              {data.ipiManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.ipi || ''}
              onChange={e => handleManualChange('ipi', e.target.value)}
              placeholder="Ex: 1000.00"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.ipi) || 0, data.moeda || 'USD', brlValues.ipi)}
            </div>
          </div>
        </div>
      </div>

      {/* Tributos sociais */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tributos Sociais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              PIS * <span className="text-red-500">(Obrigatório)</span>
              {data.pisManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.pis || ''}
              onChange={e => handleManualChange('pis', e.target.value)}
              placeholder="Ex: 525.00"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.pis) || 0, data.moeda || 'USD', brlValues.pis)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              COFINS * <span className="text-red-500">(Obrigatório)</span>
              {data.cofinsManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.cofins || ''}
              onChange={e => handleManualChange('cofins', e.target.value)}
              placeholder="Ex: 2412.50"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.cofins) || 0, data.moeda || 'USD', brlValues.cofins)}
            </div>
          </div>
        </div>
      </div>

      {/* Tributos estaduais */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tributos Estaduais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ICMS * <span className="text-red-500">(Obrigatório)</span>
              {data.icmsManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.icms || ''}
              onChange={e => handleManualChange('icms', e.target.value)}
              placeholder="Ex: 1800.00"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.icms) || 0, data.moeda || 'USD', brlValues.icms)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              FCP (Fundo de Combate à Pobreza) * <span className="text-red-500">(Obrigatório)</span>
              {data.fcpManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.fcp || ''}
              onChange={e => handleManualChange('fcp', e.target.value)}
              placeholder="Ex: 200.00"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.fcp) || 0, data.moeda || 'USD', brlValues.fcp)}
            </div>
          </div>
        </div>
      </div>

      {/* AFRMM (apenas para modal marítimo) */}
      {data.modal === 'maritimo' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AFRMM (Adicional de Frete para Renovação da Marinha Mercante)
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AFRMM
              {data.afrmmManual && <span className="text-orange-600 ml-1">*Manual</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.afrmm || ''}
              onChange={e => handleManualChange('afrmm', e.target.value)}
              placeholder="Ex: 50.00"
            />
            <div className="mt-1 text-xs text-gray-500">
              {formatDualCurrency(parseFloat(data.afrmm) || 0, data.moeda || 'USD', brlValues.afrmm)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Calculado sobre o valor do frete marítimo
            </p>
          </div>
        </div>
      )}

      {/* Resumo dos tributos */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
          Resumo dos Tributos
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-700 dark:text-green-300">Total Tributos:</span>
            <span className="ml-2 font-semibold text-green-900 dark:text-green-100">
              {formatDualCurrency(
                parseFloat(data.ii || 0) + 
                parseFloat(data.ipi || 0) + 
                parseFloat(data.pis || 0) + 
                parseFloat(data.cofins || 0) + 
                parseFloat(data.icms || 0) + 
                parseFloat(data.fcp || 0) + 
                parseFloat(data.afrmm || 0),
                data.moeda || 'USD',
                brlValues.ii + brlValues.ipi + brlValues.pis + brlValues.cofins + brlValues.icms + brlValues.fcp + brlValues.afrmm
              )}
            </span>
          </div>
          <div>
            <span className="text-green-700 dark:text-green-300">% sobre CIF:</span>
            <span className="ml-2 font-semibold text-green-900 dark:text-green-100">
              {valorCif > 0 ? (
                ((parseFloat(data.ii || 0) + 
                  parseFloat(data.ipi || 0) + 
                  parseFloat(data.pis || 0) + 
                  parseFloat(data.cofins || 0) + 
                  parseFloat(data.icms || 0) + 
                  parseFloat(data.fcp || 0) + 
                  parseFloat(data.afrmm || 0)) / valorCif * 100
                ).toFixed(2)
              ) : '0.00'}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <button 
          type="button" 
          className={`px-6 py-2 rounded-md font-semibold ${
            validationErrors.length === 0 && data.ii && data.ipi && data.pis && data.cofins && data.icms && data.fcp
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleNext}
          disabled={validationErrors.length > 0 || !data.ii || !data.ipi || !data.pis || !data.cofins || !data.icms || !data.fcp}
        >
          {validationErrors.length === 0 ? 'Próxima Etapa' : 'Corrija os erros'}
        </button>
      </div>
    </div>
  )
}

export default TributosTab 