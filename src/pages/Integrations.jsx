import React from 'react'
import { Link } from 'react-router-dom'
import { Target, Globe2, BarChart3 } from 'lucide-react'

// Categorias e integrações nacionais
const nationalCategories = [
  {
    name: 'Compliance e Documentação',
    items: [
      {
        key: 'netrin',
        name: 'Netrin API',
        description: 'Validação RNTRC, veículos, OCR CNH/CRLV, compliance de frota.',
        icon: 'https://netrin.com.br/favicon.ico',
        links: { web: 'https://netrin.com.br/', docs: '', api: '' }
      },
      {
        key: 'brasilid',
        name: 'Brasil-ID',
        description: 'Rastreamento nacional por RFID, autenticação e compliance fiscal.',
        icon: 'https://brasilid.com.br/favicon.ico',
        links: { web: 'https://brasilid.com.br/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Despacho Aduaneiro',
    items: [
      {
        key: 'pucomex',
        name: 'PUCOMEX',
        description: 'DU-E, Recintos, Intervenientes, integração com Portal Único.',
        icon: 'https://portalunico.siscomex.gov.br/favicon.ico',
        links: { web: 'https://portalunico.siscomex.gov.br/', docs: '', api: '' }
      },
      {
        key: 'siscomexdi',
        name: 'Siscomex DI',
        description: 'Consulta de declarações de importação e status de despacho.',
        icon: 'https://www.gov.br/receitafederal/favicon.ico',
        links: { web: 'https://www.gov.br/receitafederal/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Logística Nacional',
    items: [
      {
        key: 'qualp',
        name: 'QualP',
        description: 'Cotação e rastreamento de fretes rodoviários nacionais.',
        icon: 'https://qualp.com.br/favicon.ico',
        links: { web: 'https://qualp.com.br/', docs: 'https://api.qualp.com.br/docs', api: 'https://api.qualp.com.br/' }
      },
      {
        key: 'intelipost',
        name: 'Intelipost',
        description: 'Cotação, rastreamento e gestão de fretes para e-commerce.',
        icon: 'https://www.intelipost.com.br/wp-content/uploads/2021/07/cropped-favicon-32x32.png',
        links: { web: 'https://www.intelipost.com.br/', docs: 'https://api.intelipost.com.br/docs', api: 'https://api.intelipost.com.br/' }
      },
      {
        key: 'frete-rapido',
        name: 'Frete Rápido',
        description: 'Cotação, contratação e rastreamento de fretes.',
        icon: 'https://freterapido.com/favicon.ico',
        links: { web: 'https://freterapido.com/', docs: 'https://api.freterapido.com/docs', api: 'https://api.freterapido.com/' }
      },
      {
        key: 'correios',
        name: 'Correios',
        description: 'Cotação, rastreamento e etiquetas para encomendas nacionais.',
        icon: 'https://www.correios.com.br/favicon.ico',
        links: { web: 'https://www.correios.com.br/', docs: 'https://www.correios.com.br/para-voce/correios-de-a-a-z/integracao-de-sistemas', api: 'https://api.correios.com.br/' }
      },
    ]
  },
  {
    name: 'Dados Estatísticos',
    items: [
      {
        key: 'comexstat',
        name: 'ComexStat',
        description: 'Estatísticas de importação/exportação do Brasil.',
        icon: 'https://comexstat.mdic.gov.br/favicon.ico',
        links: { web: 'https://comexstat.mdic.gov.br/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Câmbio',
    items: [
      {
        key: 'bcb',
        name: 'Banco Central',
        description: 'Cotação oficial de moedas (API BC).',
        icon: 'https://www.bcb.gov.br/favicon.ico',
        links: { web: 'https://www.bcb.gov.br/', docs: '', api: '' }
      },
    ]
  },
]

// Categorias e integrações internacionais (SeaRates + globais)
const internationalCategories = [
  {
    name: 'SeaRates (Ecossistema Completo)',
    items: [
      // Adicione 100% das ferramentas da SeaRates, traduzidas
      {
        key: 'logistics-explorer',
        name: 'Calculadora Logística',
        description: 'Calculadora de frete para todos os modais. Compare tarifas globais.',
        icon: 'https://www.searates.com/design/images/apps/tools/logistics-explorer.png',
        links: { web: 'https://www.searates.com/tools/logistics-explorer', docs: 'https://www.searates.com/developers/api/logistics-explorer', api: 'https://www.searates.com/developers/api/logistics-explorer' }
      },
      {
        key: 'tracking-system',
        name: 'Sistema de Rastreamento',
        description: 'Rastreamento em tempo real, eventos logísticos e detalhes de rota.',
        icon: 'https://www.searates.com/design/images/apps/tools/tracking-system.png',
        links: { web: 'https://www.searates.com/tools/tracking', docs: 'https://www.searates.com/developers/api/tracking', api: 'https://www.searates.com/developers/api/tracking' }
      },
      {
        key: 'air-tracking',
        name: 'Rastreamento Aéreo',
        description: 'Rastreamento de cargas aéreas por Air Waybill, 24/7.',
        icon: 'https://www.searates.com/design/images/apps/tools/air-tracking.png',
        links: { web: 'https://www.searates.com/tools/air-tracking', docs: 'https://www.searates.com/developers/api/air-tracking', api: 'https://www.searates.com/developers/api/air-tracking' }
      },
      {
        key: 'rail-tracking',
        name: 'Rastreamento Ferroviário',
        description: 'Monitoramento 24/7 de embarques ferroviários.',
        icon: 'https://www.searates.com/design/images/apps/tools/rail-tracking.png',
        links: { web: 'https://www.searates.com/tools/rail-tracking', docs: 'https://www.searates.com/developers/api/rail-tracking', api: 'https://www.searates.com/developers/api/rail-tracking' }
      },
      {
        key: 'road-tracking',
        name: 'Rastreamento Rodoviário',
        description: 'Atualizações ao vivo e monitoramento de rotas rodoviárias.',
        icon: 'https://www.searates.com/design/images/apps/tools/road-tracking.png',
        links: { web: 'https://www.searates.com/tools/road-tracking', docs: 'https://www.searates.com/developers/api/road-tracking', api: 'https://www.searates.com/developers/api/road-tracking' }
      },
      {
        key: 'parcel-tracking',
        name: 'Rastreamento de Encomendas',
        description: 'Rastreamento global de encomendas em tempo real.',
        icon: 'https://www.searates.com/design/images/apps/tools/parcel-tracking.png',
        links: { web: 'https://www.searates.com/tools/parcel-tracking', docs: 'https://www.searates.com/developers/api/parcel-tracking', api: 'https://www.searates.com/developers/api/parcel-tracking' }
      },
      {
        key: 'distance-time',
        name: 'Distância & Tempo',
        description: 'Otimização de rotas com estimativas instantâneas.',
        icon: 'https://www.searates.com/design/images/apps/tools/distance-time.png',
        links: { web: 'https://www.searates.com/tools/distance-time', docs: 'https://www.searates.com/developers/api/distance-time', api: 'https://www.searates.com/developers/api/distance-time' }
      },
      {
        key: 'shipping-schedules',
        name: 'Agendamento de Embarques',
        description: 'Acesso a horários de navegação por pontos, navios ou portos.',
        icon: 'https://www.searates.com/design/images/apps/tools/shipping-schedules.png',
        links: { web: 'https://www.searates.com/tools/shipping-schedules', docs: 'https://www.searates.com/developers/api/shipping-schedules', api: 'https://www.searates.com/developers/api/shipping-schedules' }
      },
      {
        key: 'load-calculator',
        name: 'Calculadora de Carga',
        description: 'Visualização 3D para otimização de containers e caminhões.',
        icon: 'https://www.searates.com/design/images/apps/tools/load-calculator.png',
        links: { web: 'https://www.searates.com/tools/load-calculator', docs: 'https://www.searates.com/developers/api/load-calculator', api: 'https://www.searates.com/developers/api/load-calculator' }
      },
      {
        key: 'carbon-emission-calculator',
        name: 'Calculadora de Emissão de Carbono',
        description: 'Calcule as emissões de carbono entre dois pontos para diferentes modais de transporte.',
        icon: 'https://www.searates.com/design/images/apps/tools/co2-calculator.png',
        links: {
          web: 'https://www.searates.com/tools/co2-calculator',
          docs: 'https://www.searates.com/developers/api/co2-calculator',
          api: 'https://www.searates.com/developers/api/co2-calculator',
        }
      },
      {
        key: 'global-delivery-calculator',
        name: 'Calculadora de Entrega Global',
        description: 'Consulte tarifas de courier para todos os modais de transporte.',
        icon: 'https://www.searates.com/design/images/apps/tools/global-delivery.png',
        links: {
          web: 'https://www.searates.com/tools/global-delivery',
          docs: 'https://www.searates.com/developers/api/global-delivery',
          api: 'https://www.searates.com/developers/api/global-delivery',
        }
      },
      {
        key: 'freight-index',
        name: 'Índice de Frete',
        description: 'Acesse atualizações diárias e insights sobre tarifas globais de frete de contêineres.',
        icon: 'https://www.searates.com/design/images/apps/tools/freight-index.png',
        links: {
          web: 'https://www.searates.com/tools/freight-index',
          docs: 'https://www.searates.com/developers/api/freight-index',
          api: 'https://www.searates.com/developers/api/freight-index',
        }
      },
      // ...adicione todas as demais ferramentas da SeaRates aqui...
    ]
  },
  {
    name: 'Carrier & Parcel APIs',
    items: [
      {
        key: 'easypost',
        name: 'EasyPost',
        description: 'API para 100+ transportadoras, rastreamento, etiquetas e verificação de endereços.',
        icon: 'https://www.easypost.com/favicon.ico',
        links: { web: 'https://www.easypost.com/', docs: '', api: '' }
      },
      {
        key: 'shippo',
        name: 'Shippo',
        description: 'Multi-carrier, geração de etiquetas, taxas preferenciais e tracking.',
        icon: 'https://goshippo.com/favicon.ico',
        links: { web: 'https://goshippo.com/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Cotação Multimodal',
    items: [
      {
        key: 'freightify',
        name: 'Freightify',
        description: 'Cotações em tempo real para ocean freight, bookings e schedules.',
        icon: 'https://www.freightify.com/favicon.ico',
        links: { web: 'https://www.freightify.com/', docs: '', api: '' }
      },
      {
        key: 'freightcenter',
        name: 'FreightCenter',
        description: 'Cotação de cargas fracionadas (LTL/FTL), EDI/API e bookings.',
        icon: 'https://www.freightcenter.com/favicon.ico',
        links: { web: 'https://www.freightcenter.com/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Rastreamento Global',
    items: [
      {
        key: 'vizion',
        name: 'VIZION API',
        description: 'Tracking marítimo global, contêineres e terminais.',
        icon: 'https://vizionapi.com/favicon.ico',
        links: { web: 'https://vizionapi.com/', docs: '', api: '' }
      },
      {
        key: 'keeptruckin',
        name: 'KeepTruckin',
        description: 'Monitoramento de frota e telemetria.',
        icon: '',
        links: { web: 'https://keeptruckin.com/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Geolocalização & Rotas',
    items: [
      {
        key: 'googlemaps',
        name: 'Google Maps API',
        description: 'Geocoding, roteirização, matriz de distância.',
        icon: 'https://maps.google.com/favicon.ico',
        links: { web: 'https://maps.google.com/', docs: '', api: '' }
      },
      {
        key: 'targomo',
        name: 'Targomo',
        description: 'Otimização de rotas e previsão de entregas.',
        icon: '',
        links: { web: 'https://www.targomo.com/', docs: '', api: '' }
      },
    ]
  },
  {
    name: 'Compliance Internacional',
    items: [
      {
        key: 'descartes',
        name: 'Descartes',
        description: 'Compliance, EDI, manifestos e automação de impostos.',
        icon: 'https://www.cleo.com/favicon.ico',
        links: { web: 'https://www.cleo.com/', docs: '', api: '' }
      },
      {
        key: 'cleo',
        name: 'Cleo',
        description: 'Compliance, integração e automação internacional.',
        icon: 'https://www.cleo.com/favicon.ico',
        links: { web: 'https://www.cleo.com/', docs: '', api: '' }
      },
    ]
  },
]

function IntegrationCard({ item }) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-lg shadow p-3 flex flex-col items-center hover:scale-105 transition w-full max-w-xs mx-auto">
      <img
        src={item.icon}
        alt={item.name}
        className="w-10 h-10 mb-2 object-contain"
        loading="lazy"
        onError={e => { e.target.style.display = 'none'; }}
      />
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 text-center">
        {item.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-2">
        {item.description}
      </p>
      <div className="flex gap-2 mt-auto flex-wrap justify-center">
        {item.links.web && (
          <a href={item.links.web} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-xs">
            Web
          </a>
        )}
        {item.links.docs && (
          <a href={item.links.docs} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs">
            Docs
          </a>
        )}
        {item.links.api && (
          <a href={item.links.api} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium hover:underline text-xs">
            API
          </a>
        )}
      </div>
    </div>
  )
}

function StatCard({ stats }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(stat => (
        <div key={stat.label} className="bg-gradient-to-br from-blue-500/80 to-purple-500/80 dark:from-blue-800/80 dark:to-purple-800/80 rounded-xl p-4 flex flex-col items-center shadow text-white">
          <BarChart3 className="w-6 h-6 mb-1 opacity-80" />
          <span className="text-lg font-bold">{stat.value}</span>
          <span className="text-xs opacity-80">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function GroupCard({ title, icon, color, count, children }) {
  return (
    <div className={`flex-1 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-6 mb-4 border-t-4 ${color} flex flex-col min-w-[320px]`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="rounded-full p-2 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-700 dark:to-purple-800 shadow">
          {icon}
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">{title}</h2>
        <span className="bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-300 rounded-full px-3 py-1 text-xs font-semibold shadow">{count} módulos</span>
      </div>
      {children}
    </div>
  )
}

function MiniCard({ item, status = 'Ativo' }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col items-center hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition w-full max-w-xs mx-auto border border-gray-100 dark:border-gray-700">
      <img
        src={item.icon}
        alt={item.name}
        className="w-8 h-8 mb-1 object-contain"
        loading="lazy"
        onError={e => { e.target.style.display = 'none'; }}
      />
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 text-center">
        {item.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-1 line-clamp-2">
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
        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>{status}</span>
      </div>
    </div>
  )
}

export default function Integrations() {
  // Estatísticas fictícias para exemplo
  const stats = [
    { label: 'Módulos Ativos', value: 18 },
    { label: 'Disponibilidade', value: '99,98%' },
    { label: 'Monitoramento', value: '24/7' },
    { label: 'Latência Média', value: '120ms' },
  ]
  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-300">
        Cockpit de Integrações
      </h1>
      <StatCard stats={stats} />
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Card Nacional */}
        <GroupCard title="Integrações Nacionais" icon={<Target className="w-7 h-7 text-blue-500" />} color="border-blue-400 dark:border-blue-700" count={nationalCategories.reduce((a,cat)=>a+cat.items.length,0)}>
          {nationalCategories.map(cat => (
            <div key={cat.name} className="mb-4">
              <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.items.map(item => (
                  <MiniCard key={item.key} item={item} status="Ativo" />
                ))}
              </div>
            </div>
          ))}
        </GroupCard>
        {/* Card Internacional */}
        <GroupCard title="Integrações Internacionais" icon={<Globe2 className="w-7 h-7 text-green-500" />} color="border-green-400 dark:border-green-700" count={internationalCategories.reduce((a,cat)=>a+cat.items.length,0)}>
          {internationalCategories.map(cat => (
            <div key={cat.name} className="mb-4">
              <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.items.map(item => (
                  <MiniCard key={item.key} item={item} status="Ativo" />
                ))}
              </div>
            </div>
          ))}
        </GroupCard>
      </div>
      <div className="mt-10 text-center text-xs text-gray-400">
        Parceria estratégica com <a href="https://www.searates.com/" className="underline text-primary-600" target="_blank" rel="noopener noreferrer">SeaRates</a> e integrações nacionais para soluções logísticas completas.
      </div>
    </div>
  )
} 