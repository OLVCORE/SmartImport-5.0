import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

// Layout Components
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Pages
import Dashboard from './pages/Dashboard'
import Simulator from './pages/Simulator'
import History from './pages/History'
import Reports from './pages/Reports'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Help from './pages/Help'

// Hooks
import { useSERPStore } from './store/serpStore'

function AppContent() {
  const { theme } = useTheme()
  const { initializeSERP } = useSERPStore()

  useEffect(() => {
    // Initialize SERP System
    initializeSERP()
    
    console.log('🎯 SERP System initialized with theme:', theme)
    console.log('🎯 App routes configured:', [
      '/', '/dashboard', '/simulator', '/history', '/reports', '/integrations', '/settings', '/help'
    ])
  }, [theme, initializeSERP])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="simulator" element={<Simulator />} />
              <Route path="history" element={<History />} />
              <Route path="reports" element={<Reports />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App 