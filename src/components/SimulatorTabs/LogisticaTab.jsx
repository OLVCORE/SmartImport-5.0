import React, { useState } from 'react'
import aduanas from '../../data/aduanas'

const tipos = {
  porto: 'Porto',
  aeroporto: 'Aeroporto',
  ead: 'EAD',
  fronteira: 'Fronteira',
}

const ufs = Array.from(new Set(aduanas.map(a => a.uf))).sort()

const LogisticaTab = ({ data, onChange, onNext, onPrev }) => {
  const [uf, setUf] = useState('')
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('')

  // Filtra aduanas por UF, tipo e busca
  const aduanasFiltradas = aduanas.filter(a =>
    (!uf || a.uf === uf) &&
    (!tipo || a.tipo === tipo) &&
    (!busca || (
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      a.codigo.toLowerCase().includes(busca.toLowerCase())
    ))
  )

  // Agrupa por tipo
  const agrupadas = Object.keys(tipos).map(t => ({
    tipo: t,
    label: tipos[t],
    aduanas: aduanasFiltradas.filter(a => a.tipo === t),
  }))

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-semibold mb-1">UF de Desembaraço</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={uf}
          onChange={e => setUf(e.target.value)}
        >
          <option value="">Selecione a UF</option>
          {ufs.map(ufOpt => (
            <option key={ufOpt} value={ufOpt}>{ufOpt}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Buscar Porto/Aeroporto/EAD/Fronteira</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="text"
          placeholder="Digite nome, cidade ou código..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Tipo</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          <option value="">Todos</option>
          {Object.entries(tipos).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Zonas Aduaneiras Disponíveis</label>
        <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-white dark:bg-gray-800">
          {agrupadas.map(grupo => (
            <div key={grupo.tipo}>
              <div className="font-bold text-sm text-blue-700 dark:text-blue-300 mb-1 mt-2">{grupo.label}</div>
              {grupo.aduanas.length === 0 && <div className="text-xs text-gray-400">Nenhum encontrado</div>}
              {grupo.aduanas.map(a => (
                <button
                  key={a.codigo}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition flex items-center gap-2 ${data.zonaSelecionada === a.codigo ? 'bg-blue-100 dark:bg-blue-800 font-semibold' : ''}`}
                  disabled={!uf}
                  onClick={() => onChange({ ...data, zonaSelecionada: a.codigo })}
                  title={`Cidade: ${a.cidade}\nCódigo: ${a.codigo}\n${a.observacoes || ''}`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: a.parceiro ? '#22c55e' : '#64748b' }}></span>
                  <span>{a.nome}</span>
                  <span className="ml-auto text-xs text-gray-500">{a.cidade} - {a.uf}</span>
                  {a.parceiro && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Parceiro</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        {!uf && <div className="text-xs text-yellow-600 mt-2">Selecione a UF para habilitar a escolha.</div>}
      </div>
      <div className="flex justify-between mt-6">
        <button className="btn" onClick={onPrev}>Voltar</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!data.zonaSelecionada}>Próxima Etapa</button>
      </div>
    </div>
  )
}

export default LogisticaTab 