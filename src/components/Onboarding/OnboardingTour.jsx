import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Play, FileText, Calculator, BarChart3, Settings } from 'lucide-react'

const OnboardingTour = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao SmartImport 5.0',
      description: 'Sistema SERP de simulações de importação com IA avançada',
      icon: <Play className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">✨ O que você pode fazer:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Upload de documentos com extração automática</li>
              <li>• Classificação NCM com IA</li>
              <li>• Cálculos tributários precisos</li>
              <li>• Relatórios detalhados</li>
            </ul>
          </div>
          <div className="text-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Começar Tour
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'simulator',
      title: 'Simulador Inteligente',
      description: 'Crie simulações completas em 9 etapas guiadas',
      icon: <Calculator className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['Essenciais', 'Produto', 'Valores', 'Logística', 'Aduana', 'Tributos', 'Incentivos', 'Licenças', 'Resultados'].map((step, index) => (
              <div key={step} className={`p-2 rounded text-center ${index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                {index + 1}. {step}
              </div>
            ))}
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>💡 Dica:</strong> Comece fazendo upload de um documento para extração automática de produtos!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'upload',
      title: 'Upload Inteligente',
      description: 'Suporte a múltiplos formatos com processamento local',
      icon: <FileText className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">📄 Documentos</h5>
              <p className="text-blue-800 dark:text-blue-200">PDF, Word, Excel, Imagem, TXT</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h5 className="font-semibold text-green-900 dark:text-green-100 mb-1">🤖 IA Gratuita</h5>
              <p className="text-green-800 dark:text-green-200">Processamento local sem custo</p>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚡ Rápido:</strong> Documentos grandes são processados localmente, sem limite de tamanho!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ai',
      title: 'Inteligência Artificial',
      description: 'Classificação NCM automática e refinamento',
      icon: <BarChart3 className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 text-sm font-bold">1</span>
              </div>
              <div>
                <h5 className="font-semibold text-purple-900 dark:text-purple-100">Extração Automática</h5>
                <p className="text-sm text-purple-800 dark:text-purple-200">Produtos extraídos do documento</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">2</span>
              </div>
              <div>
                <h5 className="font-semibold text-blue-900 dark:text-blue-100">Sugestão NCM</h5>
                <p className="text-sm text-blue-800 dark:text-blue-200">IA sugere códigos NCM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 text-sm font-bold">3</span>
              </div>
              <div>
                <h5 className="font-semibold text-green-900 dark:text-green-100">Refinamento</h5>
                <p className="text-sm text-green-800 dark:text-green-200">Ajuste com informações adicionais</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Tudo Pronto!',
      description: 'Você está pronto para começar suas simulações',
      icon: <Settings className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 dark:text-green-300 text-2xl">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parabéns!</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você conhece os principais recursos do SmartImport 5.0. 
              Comece criando sua primeira simulação!
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>💡 Dica: Use dados de exemplo para testar</p>
              <p>📊 Acompanhe seus resultados no Dashboard</p>
              <p>🔧 Configure suas preferências em Configurações</p>
            </div>
          </div>
        </div>
      )
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    onSkip()
  }

  if (!isVisible) return null

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <button
              onClick={skipTour}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStepData.content}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OnboardingTour 