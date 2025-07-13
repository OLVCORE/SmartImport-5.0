import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import Breadcrumbs from '../UI/Breadcrumbs'

const SIDEBAR_WIDTH = 64 // largura em px quando colapsada (w-16)
const SIDEBAR_WIDTH_EXPANDED = 224 // largura em px quando expandida (w-56)

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fixo no topo */}
      <header className="w-full z-40 shadow-sm">
        <Header onSidebarToggle={() => setSidebarCollapsed((c) => !c)} />
      </header>
      {/* Breadcrumbs e título principal */}
      <div className="w-full bg-transparent px-2 md:px-6 pt-4 pb-2">
        <Breadcrumbs />
      </div>
      {/* Conteúdo principal com sidebar e página */}
      <div className="flex flex-1 h-full">
        {/* Sidebar fixa à esquerda, alinhada ao início do conteúdo principal */}
        <aside
          className={`flex flex-col h-full transition-all duration-200 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg group ${sidebarCollapsed ? 'w-16' : 'w-56'}`}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
          style={{ marginTop: 0 }}
        >
          <Sidebar isOpen={!sidebarCollapsed} onClose={() => setSidebarCollapsed(true)} />
        </aside>
        {/* Conteúdo principal */}
        <main className={`flex-1 min-w-0 transition-all duration-200 px-2 md:px-6 pt-6`} style={{ marginLeft: 0 }}>
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default Layout 