import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ErrorFallback'

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
import SmartFrete from './pages/SmartFrete'
import SeaFrete from './pages/SeaFrete'
import OPNIA from './pages/OPNIA'

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
      '/', '/dashboard', '/simulator', '/history', '/reports', '/integrations', '/opnia', '/settings', '/help', '/smartfrete', '/seafrete'
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
              <Route path="opnia" element={<OPNIA />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              <Route path="smartfrete" element={<SmartFrete />} />
              <Route path="seafrete" element={<SeaFrete />} />
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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App 