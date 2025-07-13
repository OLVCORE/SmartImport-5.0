import React, { useEffect, useState } from 'react'
import aduanas from '../../data/aduanas'

interface AduanaTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

// Repertório completo de despesas por modal
const DESPESAS_POR_MODAL = {
  maritimo: [
    'Capatazia', 'THC', 'Armazenagem', 'Demurrage', 'Sobrestadia', 'ISPS', 'BL', 'Draft Survey', 'Despachante', 'SISCOMEX', 'Outros'
  ],
  aereo: [
    'Handling', 'Armazenagem', 'Taxa de aeroporto', 'Seguro', 'Despachante', 'SISCOMEX', 'Outros'
  ],
  rodoviario: [
    'Pedágio', 'Escolta', 'Seguro', 'Taxa de trânsito', 'Armazenagem', 'Despachante', 'SISCOMEX', 'Outros'
  ],
  ferroviario: [
    'Armazenagem', 'Frete', 'Seguro', 'Despachante', 'SISCOMEX', 'Outros'
  ],
  cabotagem: [
    'Capatazia', 'Armazenagem', 'Frete', 'Seguro', 'Despachante', 'SISCOMEX', 'Outros'
  ]
}

const AduanaTab: React.FC<AduanaTabProps> = ({ data, onChange, onNext, onPrev }) => {
  const [despesas, setDespesas] = useState(data.despesas || [])
  const [novaDespesa, setNovaDespesa] = useState('')
  const [valorDespesa, setValorDespesa] = useState('')
  const modal = data.modal || 'maritimo'
  const opcoes = DESPESAS_POR_MODAL[modal] || []

  // Filtrar zonas aduaneiras por UF e modal
  const zonasFiltradas = aduanas.filter(a =>
    (!data.ufDesembaraco || a.uf === data.ufDesembaraco) &&
    (!data.modal || (data.modal === 'maritimo' && a.tipo === 'porto') ||
     (data.modal === 'aereo' && a.tipo === 'aeroporto') ||
     (data.modal === 'rodoviario' && (a.tipo === 'fronteira' || a.tipo === 'ead')) ||
     (data.modal === 'ferroviario' && (a.tipo === 'fronteira' || a.tipo === 'ead')))
  )

  useEffect(() => {
    setDespesas(data.despesas || [])
  }, [data.despesas])

  const adicionarDespesa = () => {
    if (!novaDespesa || !valorDespesa) return
    const nova = { tipo: novaDespesa, valor: parseFloat(valorDespesa), origem: 'manual' }
    const atualizadas = [...despesas, nova]
    setDespesas(atualizadas)
    onChange({ ...data, despesas: atualizadas })
    setNovaDespesa('')
    setValorDespesa('')
  }

  const removerDespesa = idx => {
    const atualizadas = despesas.filter((_, i) => i !== idx)
    setDespesas(atualizadas)
    onChange({ ...data, despesas: atualizadas })
  }

  const total = despesas.reduce((acc, d) => acc + (d.valor || 0), 0)

  return (
    <div className="space-y-6">
      {/* Seleção de Zona Aduaneira */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Zona Aduaneira</h3>
        <select
          className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.zonaAduaneira || ''}
          onChange={e => onChange({ ...data, zonaAduaneira: e.target.value })}
        >
          <option value="">Selecione a zona aduaneira...</option>
          {zonasFiltradas.map(z => (
            <option key={z.codigo} value={z.codigo}>{z.nome} - {z.cidade} ({z.uf})</option>
          ))}
        </select>
      </div>
      {/* Informações da Aduana - apenas conferência */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Informações da Aduana
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              UF de Desembaraço
            </label>
            <div className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white">
              {data.ufDesembaraco}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Modal
            </label>
            <div className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white">
              {data.modal}
            </div>
          </div>
        </div>
      </div>

      {/* Despesas Aduaneiras */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Despesas Aduaneiras</h3>
        <div className="flex gap-2 mb-4">
          <select
            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={novaDespesa}
            onChange={e => setNovaDespesa(e.target.value)}
          >
            <option value="">Selecione a despesa...</option>
            {opcoes.filter(opt => !despesas.some(d => d.tipo === opt)).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="number"
            className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Valor (R$)"
            value={valorDespesa}
            onChange={e => setValorDespesa(e.target.value)}
            min="0"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={adicionarDespesa}
            disabled={!novaDespesa || !valorDespesa}
          >Adicionar</button>
        </div>
        <div className="space-y-2">
          {despesas.length === 0 && <div className="text-gray-500 dark:text-gray-400">Nenhuma despesa adicionada.</div>}
          {despesas.map((d, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
              <span>{d.tipo}</span>
              <span>R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <button className="text-red-600 hover:text-red-800 ml-2" onClick={() => removerDespesa(idx)} title="Remover">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg flex justify-between items-center">
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Total Despesas Aduaneiras:</span>
          <span className="text-lg font-semibold text-green-900 dark:text-green-100">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Informações Importantes
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>• As despesas podem variar conforme a aduana e complexidade da operação</li>
          <li>• Armazenagem é cobrada por dia de permanência no recinto</li>
          <li>• Honorários do despachante podem variar de R$ 500 a R$ 1.500</li>
          <li>• Em caso de verificação física, podem haver custos adicionais</li>
        </ul>
      </div>

      {/* Estrutura para upload de invoice/fatura (OCR/IA) */}
      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mt-6">
        <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Upload de Invoice/Fatura (Reconhecimento Automático)</h4>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" className="mb-2" />
        <div className="text-xs text-yellow-800 dark:text-yellow-200 mt-2">Em breve: extração automática de despesas via OCR/IA. Faça upload do arquivo e aguarde a próxima atualização.</div>
      </div>
      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={onNext}>Próxima Etapa</button>
      </div>
    </div>
  )
}

export default AduanaTab 