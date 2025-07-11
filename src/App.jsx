import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'

// Layout Components
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import ErrorFallback from './components/ErrorFallback'

// Pages
import Dashboard from './pages/Dashboard'
import Simulator from './pages/Simulator'
import History from './pages/History'
import Reports from './pages/Reports'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Help from './pages/Help'

// Hooks
import { useTheme } from './hooks/useTheme'

// Store
import { useSimulationStore } from './store/simulationStore'

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

console.log('[SmartImport 5.0] App.jsx montando com roteamento completo')

function App() {
  const { theme } = useTheme()
  const { initializeStore } = useSimulationStore()

  useEffect(() => {
    // Initialize store with default data
    initializeStore()
    
    // Set theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark')
    
    console.log('[SmartImport 5.0] App inicializado com tema:', theme)
  }, [theme, initializeStore])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className={`min-h-screen transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-50 text-gray-900'
            }`}>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/simulator" element={<Simulator />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </Layout>
              
              {/* Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                    border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App 