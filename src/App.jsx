import React from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './pages/Dashboard'

console.log('[SmartImport] App.jsx montando (Header + Sidebar + Dashboard)')

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App 