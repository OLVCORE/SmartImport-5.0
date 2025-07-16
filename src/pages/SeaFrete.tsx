import React from 'react'

// SVGs personalizados para cada módulo SeaRates (exemplo)
const icons = {
  logisticsExplorer: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="url(#a)"/><path d="M10 22l6-12 6 12H10z" fill="#fff"/><defs><linearGradient id="a" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4F8CFF"/><stop offset="1" stopColor="#7F53FF"/></linearGradient></defs></svg>
  ),
  tracking: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="url(#b)"/><path d="M16 8v8l6 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="b" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00C6FB"/><stop offset="1" stopColor="#005BEA"/></linearGradient></defs></svg>
  ),
  // ...adicione outros SVGs personalizados para cada módulo
}

const modules = [
  {
    key: 'logistics-explorer',
    name: 'Calculadora Logística',
    description: 'Cotação global para todos os modais. Compare tarifas em tempo real.',
    icon: icons.logisticsExplorer,
    link: 'https://www.searates.com/tools/logistics-explorer',
    api: 'https://www.searates.com/developers/api/logistics-explorer',
  },
  {
    key: 'tracking-system',
    name: 'Sistema de Rastreamento',
    description: 'Rastreamento multimodal global, eventos e status em tempo real.',
    icon: icons.tracking,
    link: 'https://www.searates.com/tools/tracking',
    api: 'https://www.searates.com/developers/api/tracking',
  },
  // ...adicione todos os demais módulos SeaRates
]

function StatPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500/80 to-purple-500/80 dark:from-blue-800/80 dark:to-purple-800/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
        <span className="text-2xl font-bold">12</span>
        <span className="text-xs opacity-80">Módulos SeaFrete</span>
      </div>
      <div className="bg-gradient-to-br from-green-400/80 to-blue-500/80 dark:from-green-700/80 dark:to-blue-800/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
        <span className="text-2xl font-bold">99,99%</span>
        <span className="text-xs opacity-80">Disponibilidade</span>
      </div>
      <div className="bg-gradient-to-br from-purple-400/80 to-blue-600/80 dark:from-purple-700/80 dark:to-blue-900/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
        <span className="text-2xl font-bold">24/7</span>
        <span className="text-xs opacity-80">Monitoramento</span>
      </div>
      <div className="bg-gradient-to-br from-blue-400/80 to-green-400/80 dark:from-blue-700/80 dark:to-green-700/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
        <span className="text-2xl font-bold">120ms</span>
        <span className="text-xs opacity-80">Latência Média</span>
      </div>
    </div>
  )
}

function ModuleCard({ mod }: { mod: typeof modules[0] }) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col items-center hover:scale-105 transition w-full max-w-xs mx-auto border border-blue-100 dark:border-blue-800">
      <div className="mb-2">{mod.icon}</div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 text-center">
        {mod.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-2">
        {mod.description}
      </p>
      <div className="flex gap-2 mt-auto flex-wrap justify-center">
        <a href={mod.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-xs">Web</a>
        <a href={mod.api} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium hover:underline text-xs">API</a>
      </div>
    </div>
  )
}

export default function SeaFrete() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-300">
        SeaFrete by SmartImport
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Painel exclusivo com todos os módulos SeaRates integrados ao SmartImport. Cotações, tracking, schedules, CO2, multimodal e muito mais, com design premium e ícones personalizados.
      </p>
      <StatPanel />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {modules.map(mod => (
          <ModuleCard key={mod.key} mod={mod} />
        ))}
      </div>
      <div className="mt-10 text-center text-xs text-gray-400">
        Integração estratégica SmartImport + SeaRates para soluções logísticas globais.
      </div>
    </div>
  )
} 