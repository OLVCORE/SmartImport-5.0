import React from 'react'
import { Target, Globe2, BarChart3, Sparkles, Zap } from 'lucide-react'

// Tipos para as integrações
interface IntegrationLink {
  web: string
  docs: string
  api: string
}

interface IntegrationItem {
  key: string
  name: string
  description: string
  icon: string
  links: IntegrationLink
  status?: string
  premium?: boolean
}

interface IntegrationCategory {
  name: string
  items: IntegrationItem[]
}

// Categorias e integrações nacionais
const nationalCategories: IntegrationCategory[] = [
  // ... (conteúdo conforme fornecido pelo usuário)
]

// Categorias e integrações internacionais (globais)
const internationalCategories: IntegrationCategory[] = [
  // ... (conteúdo conforme fornecido pelo usuário)
]

function StatCard({ stats }: { stats: { label: string; value: string | number; icon: React.ReactNode }[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
      {stats.map(stat => (
        <div key={stat.label} className="bg-gradient-to-br from-blue-500/90 to-purple-600/90 dark:from-blue-800/90 dark:to-purple-800/90 rounded-2xl p-6 flex flex-col items-center shadow-xl text-white scale-100 hover:scale-105 transition-transform duration-300">
          <div className="mb-2">{stat.icon}</div>
          <span className="text-2xl font-extrabold">{stat.value}</span>
          <span className="text-xs opacity-80 font-medium mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function GroupCard({ title, icon, color, count, children }: { title: string; icon: React.ReactNode; color: string; count: number; children: React.ReactNode }) {
  return (
    <div className={`flex-1 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 mb-6 border-t-4 ${color} flex flex-col min-w-[320px] animate-fade-in`}> 
      <div className="flex items-center gap-3 mb-6">
        <span className="rounded-full p-3 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-700 dark:to-purple-800 shadow-lg">
          {icon}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{title}</h2>
        <span className="bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-300 rounded-full px-4 py-1 text-sm font-semibold shadow">{count} módulos</span>
      </div>
      {children}
    </div>
  )
}

function MiniCard({ item }: { item: IntegrationItem }) {
  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col items-center hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition w-full max-w-xs mx-auto border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 relative animate-fade-in`}> 
      <img
        src={item.icon}
        alt={item.name}
        className="w-10 h-10 mb-2 object-contain drop-shadow-lg"
        loading="lazy"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 text-center">
        {item.name}
        {item.premium && <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow">Premium</span>}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-2 line-clamp-2">
        {item.description}
      </p>
      <div className="flex gap-1 mt-auto flex-wrap justify-center items-center">
        {item.links.web && (
          <a href={item.links.web} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-xs">Web</a>
        )}
        {item.links.docs && (
          <a href={item.links.docs} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs">Docs</a>
        )}
        {item.links.api && (
          <a href={item.links.api} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium hover:underline text-xs">API</a>
        )}
        {item.status && (
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>{item.status}</span>
        )}
      </div>
      <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition" title={item.premium ? 'Integração premium, recursos avançados e inteligência SmartImport.' : 'Integração padrão.'}>
        {item.premium ? <Sparkles className="w-5 h-5 text-yellow-400" /> : <Zap className="w-4 h-4 text-blue-400" />}
      </div>
    </div>
  )
}

export default function Integrations() {
  // Estatísticas fictícias para exemplo
  const stats = [
    { label: 'Módulos Ativos', value: 18, icon: <BarChart3 className="w-7 h-7" /> },
    { label: 'Disponibilidade', value: '99,98%', icon: <Sparkles className="w-7 h-7" /> },
    { label: 'Monitoramento', value: '24/7', icon: <Zap className="w-7 h-7" /> },
    { label: 'Latência Média', value: '120ms', icon: <Target className="w-7 h-7" /> },
  ]
  return (
    <div className="max-w-7xl mx-auto py-10 px-2 md:px-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-primary-700 dark:text-primary-300 tracking-tight">
        Cockpit de Integrações <span className="text-lg font-bold">by SmartImport | OLV Internacional</span>
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-lg font-medium">
        Conecte, automatize e potencialize sua logística com integrações inteligentes e recursos premium.
      </p>
      <StatCard stats={stats} />
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 mt-8">
        {/* Card Nacional */}
        <GroupCard title="Integrações Nacionais" icon={<Target className="w-8 h-8 text-blue-500" />} color="border-blue-400 dark:border-blue-700" count={nationalCategories.reduce((a,cat)=>a+cat.items.length,0)}>
          {nationalCategories.map(cat => (
            <div key={cat.name} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cat.items.map(item => (
                  <MiniCard key={item.key} item={item} />
                ))}
              </div>
            </div>
          ))}
        </GroupCard>
        {/* Card Internacional */}
        <GroupCard title="Integrações Internacionais" icon={<Globe2 className="w-8 h-8 text-green-500" />} color="border-green-400 dark:border-green-700" count={internationalCategories.reduce((a,cat)=>a+cat.items.length,0)}>
          {internationalCategories.map(cat => (
            <div key={cat.name} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cat.items.map(item => (
                  <MiniCard key={item.key} item={item} />
                ))}
              </div>
            </div>
          ))}
        </GroupCard>
      </div>
      <div className="mt-12 text-center text-xs text-gray-400 font-semibold">
        Selo de Inteligência SmartImport – OLV Internacional. Integrações premium, automação e inovação para sua logística.
      </div>
      <div className="mt-8 text-center">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold shadow-lg animate-fade-in">Em breve: integrações exclusivas, IA e automação avançada</span>
      </div>
    </div>
  )
} 