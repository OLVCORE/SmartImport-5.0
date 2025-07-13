import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2 } from 'lucide-react'

const LoadingSpinner = ({ message = "Carregando sistema SERP...", size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400`}
      >
        <Brain className="w-full h-full" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner