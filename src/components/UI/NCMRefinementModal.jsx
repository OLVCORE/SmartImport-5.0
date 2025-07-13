import React, { useState, useEffect } from 'react'
import aiService from '../../services/aiService'

const NCMRefinementModal = ({ 
  isOpen, 
  onClose, 
  produto, 
  onNCMRefined,
  ncmSugerido 
}) => {
  const [loading, setLoading] = useState(false)
  const [informacoesAdicionais, setInformacoesAdicionais] = useState({
    material: '',
    capacidade: '',
    especificacoesTecnicas: '',
    usoFinal: '',
    composicao: '',
    montado: '',
    potencia: '',
    dimensoes: '',
    peso: '',
    outras: ''
  })
  const [resultadoRefinamento, setResultadoRefinamento] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Campos de especificações técnicas
  const camposEspecificacoes = [
    { key: 'material', label: 'Material Principal', placeholder: 'Ex: Aço inox, plástico, alumínio...' },
    { key: 'capacidade', label: 'Capacidade/Carga', placeholder: 'Ex: 1000kg, 50L, 1000W...' },
    { key: 'especificacoesTecnicas', label: 'Especificações Técnicas', placeholder: 'Ex: Tensão 220V, frequência 60Hz...' },
    { key: 'usoFinal', label: 'Uso Final', placeholder: 'Ex: Industrial, doméstico, comercial...' },
    { key: 'composicao', label: 'Composição Material', placeholder: 'Ex: 70% aço, 30% plástico...' },
    { key: 'montado', label: 'Estado de Montagem', placeholder: 'Montado, desmontado, semi-montado...' },
    { key: 'potencia', label: 'Potência', placeholder: 'Ex: 500W, 2HP, 1000VA...' },
    { key: 'dimensoes', label: 'Dimensões', placeholder: 'Ex: 50x30x20cm, diâmetro 10cm...' },
    { key: 'peso', label: 'Peso', placeholder: 'Ex: 5kg, 100g...' },
    { key: 'outras', label: 'Outras Características', placeholder: 'Ex: Certificação, marca, modelo...' }
  ]

  // Refinar classificação NCM
  const refinarNCM = async () => {
    if (!produto || !ncmSugerido) return

    setLoading(true)
    try {
      const resultado = await aiService.refineNCMClassification(
        produto.descricao,
        ncmSugerido,
        informacoesAdicionais
      )
      
      setResultadoRefinamento(resultado)
      setShowResult(true)
    } catch (error) {
      console.error('Erro no refinamento:', error)
      alert('Erro ao refinar classificação NCM. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Aplicar NCM refinado
  const aplicarNCMRefinado = () => {
    if (resultadoRefinamento) {
      onNCMRefined(resultadoRefinamento.ncmFinal, resultadoRefinamento)
      onClose()
    }
  }

  // Resetar formulário
  const resetarFormulario = () => {
    setInformacoesAdicionais({
      material: '',
      capacidade: '',
      especificacoesTecnicas: '',
      usoFinal: '',
      composicao: '',
      montado: '',
      potencia: '',
      dimensoes: '',
      peso: '',
      outras: ''
    })
    setResultadoRefinamento(null)
    setShowResult(false)
  }

  // Fechar modal
  const handleClose = () => {
    resetarFormulario()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Refinamento de Classificação NCM
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Forneça informações adicionais para classificação mais precisa
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResult ? (
            <>
              {/* Informações do Produto */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Produto para Refinamento
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Descrição:</strong> {produto?.descricao}</p>
                  <p><strong>NCM Atual:</strong> {ncmSugerido}</p>
                </div>
              </div>

              {/* Formulário de Informações Adicionais */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Informações Adicionais para Classificação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {camposEspecificacoes.map((campo) => (
                    <div key={campo.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {campo.label}
                      </label>
                      <input
                        type="text"
                        value={informacoesAdicionais[campo.key]}
                        onChange={(e) => setInformacoesAdicionais(prev => ({
                          ...prev,
                          [campo.key]: e.target.value
                        }))}
                        placeholder={campo.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={refinarNCM}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    'Refinar Classificação'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Resultado do Refinamento */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Resultado do Refinamento
                </h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      Classificação Refinada
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>NCM Final:</strong> <span className="font-mono text-green-700 dark:text-green-300">{resultadoRefinamento.ncmFinal}</span></p>
                    <p><strong>Descrição:</strong> {resultadoRefinamento.descricaoNCM}</p>
                    <p><strong>Confiança:</strong> {(resultadoRefinamento.confianca * 100).toFixed(1)}%</p>
                    {resultadoRefinamento.mudou && (
                      <p className="text-orange-700 dark:text-orange-300">
                        <strong>⚠️ NCM alterado</strong> - Classificação foi refinada com base nas informações adicionais
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Justificativa</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{resultadoRefinamento.justificativa}</p>
                </div>

                {resultadoRefinamento.observacoes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Observações</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{resultadoRefinamento.observacoes}</p>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResult(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={aplicarNCMRefinado}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Aplicar NCM Refinado
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NCMRefinementModal 