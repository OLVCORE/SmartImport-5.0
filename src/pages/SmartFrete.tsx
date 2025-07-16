import React from 'react'
import { useState } from 'react'

// SVGs personalizados para cada módulo (exemplo)
const icons = {
  tracking: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="url(#a)"/><path d="M16 8v8l6 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="a" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00C6FB"/><stop offset="1" stopColor="#005BEA"/></linearGradient></defs></svg>
  ),
  quotation: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="url(#b)"/><path d="M10 22l6-12 6 12H10z" fill="#fff"/><defs><linearGradient id="b" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4F8CFF"/><stop offset="1" stopColor="#7F53FF"/></linearGradient></defs></svg>
  ),
  loadContainer: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="url(#c)"/><rect x="8" y="12" width="16" height="8" rx="2" fill="#fff"/><defs><linearGradient id="c" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00E1D6"/><stop offset="1" stopColor="#0072FF"/></linearGradient></defs></svg>
  ),
  schedules: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="url(#d)"/><rect x="10" y="10" width="12" height="12" rx="3" fill="#fff"/><defs><linearGradient id="d" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#FFB347"/><stop offset="1" stopColor="#FF5E62"/></linearGradient></defs></svg>
  ),
  co2: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="url(#e)"/><path d="M12 20a4 4 0 118 0" stroke="#fff" strokeWidth="2"/><defs><linearGradient id="e" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#43E97B"/><stop offset="1" stopColor="#38F9D7"/></linearGradient></defs></svg>
  ),
  express: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="16" fill="url(#f)"/><path d="M10 16h12M16 10l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="f" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#FF512F"/><stop offset="1" stopColor="#DD2476"/></linearGradient></defs></svg>
  ),
}

const modules = [
  {
    key: 'tracking',
    name: 'Tracking Multimodal',
    description: 'Rastreamento global em tempo real para containers, cargas aéreas, rodoviárias e ferroviárias.',
    icon: icons.tracking,
    tooltip: 'Acompanhe sua carga em qualquer modal, com inteligência e precisão.'
  },
  {
    key: 'quotation',
    name: 'Cotação Global',
    description: 'Cotações instantâneas para frete marítimo, aéreo, rodoviário e multimodal.',
    icon: icons.quotation,
    tooltip: 'Compare tarifas, simule rotas e feche negócios em segundos.'
  },
  {
    key: 'loadContainer',
    name: 'Otimização de Containers',
    description: 'Simule o carregamento 3D e maximize o aproveitamento de espaço.',
    icon: icons.loadContainer,
    tooltip: 'Visualização inteligente para redução de custos logísticos.'
  },
  {
    key: 'schedules',
    name: 'Schedules & Rotas',
    description: 'Consulte horários, rotas e conexões para todos os modais.',
    icon: icons.schedules,
    tooltip: 'Planejamento logístico com dados em tempo real.'
  },
  {
    key: 'co2',
    name: 'Cálculo de Emissão CO₂',
    description: 'Calcule e otimize a pegada de carbono das suas operações.',
    icon: icons.co2,
    tooltip: 'Sustentabilidade integrada à sua logística.'
  },
  {
    key: 'express',
    name: 'Entregas Express',
    description: 'Cotações e tracking para entregas rápidas e courier.',
    icon: icons.express,
    tooltip: 'Agilidade e rastreabilidade para encomendas urgentes.'
  },
]

function StatPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500/80 to-purple-500/80 dark:from-blue-800/80 dark:to-purple-800/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
        <span className="text-2xl font-bold">6</span>
        <span className="text-xs opacity-80">Módulos Inteligentes</span>
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
    <div className="group bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col items-center hover:scale-105 transition w-full max-w-xs mx-auto border border-blue-100 dark:border-blue-800 relative">
      <div className="mb-2">{mod.icon}</div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 text-center">
        {mod.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-2">
        {mod.description}
      </p>
      <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition" title={mod.tooltip}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#e0e7ef"/><text x="12" y="17" textAnchor="middle" fontSize="14" fill="#4F8CFF" fontWeight="bold">i</text></svg>
      </div>
      <div className="flex gap-2 mt-auto flex-wrap justify-center">
        <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xs font-semibold shadow hover:scale-105 transition">Simular Agora</button>
      </div>
    </div>
  )
}

function QuotationForm({ onSubmit }: { onSubmit: (params: any) => void }) {
  const [form, setForm] = useState({
    origem: '',
    destino: '',
    modal: '',
    tipoCarga: '',
    peso: '',
    volume: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.origem || !form.destino || !form.modal || !form.tipoCarga || !form.peso) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto flex flex-col gap-4 border border-blue-100 dark:border-blue-800">
      <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Cotação Global</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origem *</label>
          <input name="origem" value={form.origem} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="Ex: Shanghai, CN" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Destino *</label>
          <input name="destino" value={form.destino} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="Ex: Santos, BR" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modal *</label>
          <select name="modal" value={form.modal} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <option value="">Selecione</option>
            <option value="maritimo">Marítimo</option>
            <option value="aereo">Aéreo</option>
            <option value="rodoviario">Rodoviário</option>
            <option value="ferroviario">Ferroviário</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Carga *</label>
          <input name="tipoCarga" value={form.tipoCarga} onChange={handleChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="Ex: Container 20', Pallet, Granel..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
          <input name="peso" value={form.peso} onChange={handleChange} type="number" min="0" className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="Ex: 1000" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Volume (m³)</label>
          <input name="volume" value={form.volume} onChange={handleChange} type="number" min="0" className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" placeholder="Ex: 10" />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button type="submit" className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow hover:scale-105 transition">Consultar Cotação</button>
    </form>
  )
}

export default function SmartFrete() {
  const [quotationResult, setQuotationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleQuotation = async (params: any) => {
    setLoading(true)
    setQuotationResult(null)
    // Aqui será feita a chamada ao backend/API futuramente
    setTimeout(() => {
      setQuotationResult({
        tarifa: 'US$ 1.250,00',
        tempo: '23 dias',
        rota: `${params.origem} → ${params.destino}`,
        modal: params.modal,
        detalhes: 'Tarifa simulada para demonstração.'
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-6">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-primary-700 dark:text-primary-300">
        SmartFrete – Cockpit Global <span className="text-lg font-bold">by SmartImport | OLV Internacional</span>
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-lg font-medium">
        Tracking, cotações, otimização e inteligência logística em um só lugar. Sua logística, sem limites.
      </p>
      <StatPanel />
      <QuotationForm onSubmit={handleQuotation} />
      {loading && <div className="text-center text-blue-600 dark:text-blue-300 font-semibold mt-4 animate-pulse">Consultando cotação...</div>}
      {quotationResult && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-6 max-w-xl mx-auto border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">Resultado da Cotação</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div><strong>Rota:</strong> {quotationResult.rota}</div>
            <div><strong>Modal:</strong> {quotationResult.modal}</div>
            <div><strong>Tarifa:</strong> {quotationResult.tarifa}</div>
            <div><strong>Tempo estimado:</strong> {quotationResult.tempo}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-2">{quotationResult.detalhes}</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
        {modules.map(mod => (
          <ModuleCard key={mod.key} mod={mod} />
        ))}
      </div>
      <div className="mt-10 text-center text-xs text-gray-400 font-semibold">
        Powered by SmartImport – OLV Internacional. O futuro da logística, agora.
      </div>
    </div>
  )
} 