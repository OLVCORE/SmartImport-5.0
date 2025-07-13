import React, { useState, useEffect } from 'react'

const ProcessingProgress = ({ 
  isVisible, 
  currentChunk, 
  totalChunks, 
  documentSize, 
  productsFound,
  processingStage = 'analyzing',
  onCancel 
}) => {
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(elapsed)
      
      // Calcular tempo estimado baseado no progresso
      if (currentChunk > 0 && totalChunks > 0) {
        const progress = currentChunk / totalChunks
        const estimated = Math.ceil(elapsed / progress)
        setEstimatedTime(estimated)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, currentChunk, totalChunks, startTime])

  if (!isVisible) return null

  const progress = totalChunks > 0 ? (currentChunk / totalChunks) * 100 : 0
  const remainingTime = estimatedTime - elapsedTime

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStageText = () => {
    switch (processingStage) {
      case 'extracting':
        return 'Extraindo texto do documento...'
      case 'analyzing':
        return 'Analisando documento com IA...'
      case 'suggesting':
        return 'Sugerindo códigos NCM...'
      default:
        return 'Processando documento...'
    }
  }

  const getStageIcon = () => {
    switch (processingStage) {
      case 'extracting':
        return '📄'
      case 'analyzing':
        return '🤖'
      case 'suggesting':
        return '🏷️'
      default:
        return '⚙️'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {getStageIcon()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {getStageText()}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Documento com {documentSize.toLocaleString()} caracteres
          </p>
          
          {totalChunks > 0 && (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progresso</span>
                  <span className="font-semibold">{currentChunk} de {totalChunks}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-4 rounded-full transition-all duration-500 shadow-sm animate-pulse"
                    style={{
                      width: `${progress}%`,
                      background: 'repeating-linear-gradient(135deg, #3b82f6 0 10px, #1d4ed8 10px 20px, #3b82f6 20px 30px, #1d4ed8 30px 40px)',
                      backgroundSize: '40px 40px'
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {progress.toFixed(1)}% concluído
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="font-medium text-blue-900 dark:text-blue-100">Tempo decorrido</div>
                  <div className="text-blue-600 dark:text-blue-400 font-mono text-lg font-bold">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="font-medium text-green-900 dark:text-green-100">Tempo restante</div>
                  <div className="text-green-600 dark:text-green-400 font-mono text-lg font-bold">
                    {remainingTime > 0 ? formatTime(remainingTime) : 'Calculando...'}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {productsFound > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-green-900 dark:text-green-100">
                    {productsFound} produto{productsFound !== 1 ? 's' : ''} encontrado{productsFound !== 1 ? 's' : ''}
                  </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                  {processingStage === 'suggesting' ? 'Sugerindo códigos NCM...' : 'Análise em andamento...'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Processamento otimizado para documentos grandes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Análise paralela para maior velocidade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Retry automático em caso de falhas</span>
              </div>
            </div>
          </div>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-6 px-6 py-3 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
            >
              Cancelar processamento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcessingProgress 