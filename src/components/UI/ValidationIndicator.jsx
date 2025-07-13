import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const ValidationIndicator = ({ 
  type = 'info', 
  message, 
  show = false,
  className = ''
}) => {
  if (!show || !message) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300'
      case 'error':
        return 'text-red-700 dark:text-red-300'
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300'
      default:
        return 'text-blue-700 dark:text-blue-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 text-sm ${getColors()} ${className}`}
    >
      {getIcon()}
      <span>{message}</span>
    </motion.div>
  )
}

export default ValidationIndicator 