import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'

const ContextualTooltip = ({ 
  children, 
  content, 
  position = 'top', 
  size = 'medium',
  trigger = 'hover',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const sizes = {
    small: 'max-w-xs',
    medium: 'max-w-sm',
    large: 'max-w-md'
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !isPinned) {
      setIsVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !isPinned) {
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
    }
  }

  const handlePin = () => {
    setIsPinned(!isPinned)
  }

  const handleClose = () => {
    setIsVisible(false)
    setIsPinned(false)
  }

  // Fechar tooltip ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsVisible(false)
        setIsPinned(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-help"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positions[position]} ${sizes[size]}`}
          >
            <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 dark:border-gray-600 p-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Dica</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePin}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                      isPinned 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={isPinned ? 'Desafixar' : 'Fixar'}
                  >
                    📌
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-6 h-6 rounded flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="text-sm leading-relaxed">
                {content}
              </div>

              {/* Arrow */}
              <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border border-gray-700 dark:border-gray-600 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
                'right-full top-1/2 -translate-y-1/2 -mr-1'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContextualTooltip 