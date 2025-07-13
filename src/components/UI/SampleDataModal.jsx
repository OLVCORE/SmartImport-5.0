import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Download, FileText, Calculator, TrendingUp } from 'lucide-react'

const SampleDataModal = ({ isOpen, onClose, onLoadSample }) => {
  const [selectedSample, setSelectedSample] = useState(null)

  const sampleData = [
    {
      id: 'smartphone',
      title: 'Smartphone Samsung Galaxy S24',
      description: 'Importação de smartphones da China',
      category: 'Eletrônicos',
      complexity: 'Fácil',
      icon: <FileText className="w-6 h-6" />,
      data: {
        paisOrigem: 'China',
        ufDesembaraco: 'SP',
        ufDestino: 'SP',
        modal: 'maritimo',
        moeda: 'USD',
        zonaAduaneira: 'BRSP',
        produtos: [
          {
            id: 1,
            descricao: 'Smartphone Samsung Galaxy S24, 128GB, Preto, Dual SIM, 5G',
            ncm: '8517.12.00',
            quantidade: 100,
            valorUnitario: 250,
            especificacoes: {
              capacidade: '128GB',
              cor: 'Preto',
              conectividade: '5G',
              dualSim: true
            }
          }
        ]
      }
    },
    {
      id: 'maquina',
      title: 'Máquina Industrial CNC',
      description: 'Importação de máquina industrial da Alemanha',
      category: 'Industrial',
      complexity: 'Médio',
      icon: <Calculator className="w-6 h-6" />,
      data: {
        paisOrigem: 'Alemanha',
        ufDesembaraco: 'RJ',
        ufDestino: 'MG',
        modal: 'aereo',
        moeda: 'EUR',
        zonaAduaneira: 'BRRJ',
        produtos: [
          {
            id: 1,
            descricao: 'Máquina CNC para usinagem de metais, 5 eixos, com sistema de refrigeração',
            ncm: '8457.10.00',
            quantidade: 1,
            valorUnitario: 150000,
            especificacoes: {
              eixos: '5 eixos',
              aplicacao: 'Usinagem de metais',
              refrigercao: 'Sistema integrado',
              peso: '2500kg'
            }
          }
        ]
      }
    },
    {
      id: 'textil',
      title: 'Tecidos e Vestuário',
      description: 'Importação de tecidos da Índia',
      category: 'Têxtil',
      complexity: 'Fácil',
      icon: <TrendingUp className="w-6 h-6" />,
      data: {
        paisOrigem: 'Índia',
        ufDesembaraco: 'SP',
        ufDestino: 'SC',
        modal: 'maritimo',
        moeda: 'USD',
        zonaAduaneira: 'BRSP',
        produtos: [
          {
            id: 1,
            descricao: 'Tecido de algodão 100%, 200g/m², branco, 150cm de largura',
            ncm: '5208.52.00',
            quantidade: 1000,
            valorUnitario: 2.5,
            especificacoes: {
              material: 'Algodão 100%',
              gramatura: '200g/m²',
              cor: 'Branco',
              largura: '150cm'
            }
          },
          {
            id: 2,
            descricao: 'Camisetas de algodão, manga curta, tamanhos P/M/G/GG',
            ncm: '6109.10.00',
            quantidade: 500,
            valorUnitario: 3.8,
            especificacoes: {
              material: 'Algodão 100%',
              manga: 'Curta',
              tamanhos: 'P/M/G/GG',
              genero: 'Unissex'
            }
          }
        ]
      }
    }
  ]

  const handleLoadSample = () => {
    if (selectedSample) {
      const sample = sampleData.find(s => s.id === selectedSample)
      onLoadSample(sample.data)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dados de Exemplo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Carregue dados de exemplo para testar o simulador
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleData.map((sample) => (
              <div
                key={sample.id}
                onClick={() => setSelectedSample(sample.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSample === sample.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    {sample.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {sample.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sample.category}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {sample.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sample.complexity === 'Fácil' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                  }`}>
                    {sample.complexity}
                  </span>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sample.data.produtos.length} produto{sample.data.produtos.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview do exemplo selecionado */}
          {selectedSample && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Preview do Exemplo Selecionado
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">País:</span>
                  <p className="font-medium">{sampleData.find(s => s.id === selectedSample)?.data.paisOrigem}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Modal:</span>
                  <p className="font-medium">{sampleData.find(s => s.id === selectedSample)?.data.modal}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Moeda:</span>
                  <p className="font-medium">{sampleData.find(s => s.id === selectedSample)?.data.moeda}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Produtos:</span>
                  <p className="font-medium">{sampleData.find(s => s.id === selectedSample)?.data.produtos.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            💡 Dica: Use dados de exemplo para aprender como funciona o simulador
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleLoadSample}
              disabled={!selectedSample}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Carregar Exemplo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SampleDataModal 