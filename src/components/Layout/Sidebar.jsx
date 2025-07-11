import React from 'react'
import { Home, FileText, History, BarChart2, Menu, X, Settings, User, Bell, Shield, Palette, Globe, DollarSign, Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Simulador', icon: BarChart2, href: '/simulator' },
  { label: 'Histórico', icon: History, href: '/history' },
  { label: 'Relatórios', icon: FileText, href: '/reports' },
]

const tools = [
  { label: 'Classificação NCM', icon: FileText, href: '/ncm' },
  { label: 'Cálculo Tributário', icon: DollarSign, href: '/tax' },
  { label: 'Análise Logística', icon: BarChart2, href: '/logistics' },
  { label: 'Câmbio e Moedas', icon: Globe, href: '/exchange' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  // Fecha o drawer ao clicar fora
  const handleOverlayClick = () => setOpen(false)

  return (
    <>
      {/* Botão hamburguer flutuante no canto inferior esquerdo (mobile) */}
      <button
        className="fixed bottom-4 left-4 z-50 sm:hidden bg-white/80 dark:bg-gray-900/80 rounded-full p-3 shadow-lg border border-primary-200 dark:border-primary-800 hover:scale-110 transition"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Botões flutuantes no canto inferior direito (mobile) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 sm:hidden">
        <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition">
          <svg viewBox="0 0 32 32" width="24" height="24"><path fill="currentColor" d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.236C13.416 27.168 15.615 28 18 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-2.021 0-3.938-.627-5.527-1.701l-.393-.262-4.66 1.332 1.332-4.66-.262-.393C5.627 18.938 5 17.021 5 15c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11zm5.293-7.293l-2.586-2.586a1 1 0 00-1.414 0l-1.293 1.293a8.001 8.001 0 01-3.293-3.293l1.293-1.293a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0l-1.293 1.293A10.001 10.001 0 0016 25a10.001 10.001 0 0010-10c0-2.021-.627-3.938-1.701-5.527l-1.293 1.293a1 1 0 000 1.414z"/></svg>
        </a>
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 3C7.03 3 3 7.03 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9zm1 14.93c-2.83.48-5.48-1.17-6.36-3.93H5v-2h1.64c.13-.32.29-.62.47-.91l-1.13-1.13 1.41-1.41 1.13 1.13c.29-.18.59-.34.91-.47V5h2v1.64c.32.13.62.29.91.47l1.13-1.13 1.41 1.41-1.13 1.13c.18.29.34.59.47.91H19v2h-1.64c-.13.32-.29.62-.47.91l1.13 1.13-1.41 1.41-1.13-1.13c-.29.18-.59.34-.91.47V19h-2v-1.64z"/></svg>
        </button>
      </div>

      {/* Overlay escurecido */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar fixa no desktop, drawer no mobile */}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          sm:translate-x-0 sm:static sm:block
        `}
        style={{ minHeight: '100vh' }}
      >
        {/* Botão fechar no mobile */}
        <div className="flex items-center justify-between sm:hidden p-4">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">NAVEGAÇÃO</div>
          {menuItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <nav className="mt-8 space-y-2 px-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">FERRAMENTAS</div>
          {tools.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
} 