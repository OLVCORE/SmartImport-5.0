import React, { useState, useEffect } from 'react'

interface LogisticaTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

// Lista de despesas por modal - Estruturada por categorias
const DESPESAS_POR_MODAL = {
  maritime: {
    'Frete Internacional': [
      'Frete internacional marítimo',
      'Surcharges (Bunker, Currency, etc.)',
      'Taxa de congestionamento portuário',
      'Taxa de guerra (quando aplicável)',
    ],
    'Despesas Portuárias': [
      'THC (Terminal Handling Charge)',
      'Capatazia (movimentação portuária)',
      'Armazenagem portuária',
      'Demurrage (sobre-estadia de contêiner)',
      'Detention (atraso na devolução do contêiner vazio)',
      'ISPS (International Ship and Port Facility Security)',
      'Taxa de escaneamento/inspeção',
      'Taxa de conferência de carga',
      'Taxa de liberação de BL (Bill of Lading)',
      'Desova de contêiner',
      'Taxa de utilização de pátio',
      'Taxa de entrega de carga (Delivery Order)',
      'Taxa de emissão de documentos',
      'Taxa de pesagem',
      'Taxa de paletização/despaletização',
      'Taxa de inspeção física',
      'Taxa de escaneamento de contêiner',
      'Taxa de uso de scanner',
      'Taxa de armazenagem de carga perigosa',
      'Taxa de armazenagem frigorificada',
      'Taxa de movimentação de carga especial',
      'Taxa de utilização de berço',
      'Taxa de utilização de guindaste',
    ],
    'Despesas Aduaneiras': [
      'Taxa de utilização do SISCOMEX',
      'Despesas com despachante aduaneiro',
      'Taxa de DTA (Declaração de Trânsito Aduaneiro)',
      'Taxa de armazenagem alfandegada',
      'Taxa de armazenagem retroportuária (zona secundária)',
      'Taxa de liberação aduaneira',
      'Taxa de verificação documental',
      'Taxa de conferência aduaneira',
      'Taxa de inspeção aduaneira',
      'Taxa de utilização de recinto alfandegado',
      'Taxa de controle de carga',
      'Taxa de emissão de guias',
      'Taxa de anuência aduaneira',
    ],
    'Despesas de Fiscalização': [
      'Taxa de fiscalização sanitária (MAPA)',
      'Taxa de fiscalização da Anvisa',
      'Taxa de fiscalização do Ibama',
      'Taxa de fiscalização do Exército',
      'Taxa de fiscalização da Polícia Federal',
      'Taxa de fiscalização da Vigilância Sanitária',
      'Taxa de fiscalização da ANTAQ',
      'Taxa de fiscalização da ANAC',
      'Taxa de fiscalização da ANTT',
      'Taxa de inspeção fitossanitária',
      'Taxa de inspeção zoossanitária',
      'Taxa de inspeção de qualidade',
      'Taxa de inspeção de segurança',
    ],
    'Despesas de Transporte Interno': [
      'Taxa de transporte interno (porto-armazém)',
      'Taxa de transporte para zona secundária',
      'Taxa de transporte para destino final',
      'Taxa de transbordo (quando há troca de modal)',
      'Taxa de movimentação interna',
      'Taxa de carregamento/descarregamento',
      'Taxa de utilização de empilhadeira',
      'Taxa de utilização de carreta',
    ],
    'Despesas Especiais': [
      'Fumigação',
      'Lavagem de contêiner',
      'Taxa de carga especial',
      'Taxa de carga perigosa',
      'Taxa de carga frigorificada',
      'Taxa de carga a granel',
      'Taxa de carga break-bulk',
      'Taxa de carga ro-ro',
      'Taxa de carga project cargo',
      'Taxa de carga out of gauge',
      'Taxa de carga heavy lift',
    ],
  },
  air: {
    'Frete Internacional': [
      'Frete internacional aéreo',
      'Surcharges aéreos (Fuel, Security, etc.)',
      'Taxa de congestionamento aeroportuário',
      'Taxa de guerra (quando aplicável)',
    ],
    'Despesas Aeroportuárias': [
      'Taxa de handling aeroportuário',
      'Armazenagem aeroportuária',
      'Taxa de liberação de AWB (Air Waybill)',
      'Taxa de escaneamento/inspeção',
      'Taxa de conferência de carga',
      'Taxa de utilização de pátio',
      'Taxa de entrega de carga (Delivery Order)',
      'Taxa de emissão de documentos',
      'Taxa de pesagem',
      'Taxa de inspeção física',
      'Taxa de armazenagem frigorificada',
      'Taxa de armazenagem de carga perigosa',
      'Taxa de movimentação de carga especial',
      'Taxa de utilização de ULD (Unit Load Device)',
      'Taxa de utilização de pallet',
    ],
    'Despesas Aduaneiras': [
      'Taxa de utilização do SISCOMEX',
      'Despesas com despachante aduaneiro',
      'Taxa de DTA (Declaração de Trânsito Aduaneiro)',
      'Taxa de armazenagem alfandegada',
      'Taxa de liberação aduaneira',
      'Taxa de verificação documental',
      'Taxa de conferência aduaneira',
      'Taxa de inspeção aduaneira',
      'Taxa de utilização de recinto alfandegado',
      'Taxa de controle de carga',
      'Taxa de emissão de guias',
      'Taxa de anuência aduaneira',
    ],
    'Despesas de Fiscalização': [
      'Taxa de fiscalização sanitária (MAPA)',
      'Taxa de fiscalização da Anvisa',
      'Taxa de fiscalização do Ibama',
      'Taxa de fiscalização do Exército',
      'Taxa de fiscalização da Polícia Federal',
      'Taxa de fiscalização da Vigilância Sanitária',
      'Taxa de fiscalização da ANAC',
      'Taxa de inspeção fitossanitária',
      'Taxa de inspeção zoossanitária',
      'Taxa de inspeção de qualidade',
      'Taxa de inspeção de segurança',
    ],
    'Despesas de Transporte Interno': [
      'Taxa de transporte interno (aeroporto-armazém)',
      'Taxa de transporte para zona secundária',
      'Taxa de transporte para destino final',
      'Taxa de transbordo (quando há troca de modal)',
      'Taxa de movimentação interna',
      'Taxa de carregamento/descarregamento',
      'Taxa de utilização de empilhadeira',
      'Taxa de utilização de carreta',
    ],
    'Despesas Especiais': [
      'Fumigação',
      'Taxa de carga especial',
      'Taxa de carga perigosa',
      'Taxa de carga frigorificada',
      'Taxa de carga express',
      'Taxa de carga charter',
      'Taxa de carga consolidada',
    ],
  },
  land: {
    'Frete Internacional': [
      'Frete internacional rodoviário',
      'Surcharges rodoviários',
      'Taxa de congestionamento fronteiriço',
      'Taxa de guerra (quando aplicável)',
    ],
    'Despesas Fronteiriças/EADI': [
      'Taxa de passagem de fronteira (pedágio internacional)',
      'Taxa de DTA (Declaração de Trânsito Aduaneiro)',
      'Taxa de armazenagem alfandegada (EADI/porto seco)',
      'Taxa de utilização de pátio',
      'Taxa de entrega de carga (Delivery Order)',
      'Taxa de emissão de documentos',
      'Taxa de pesagem',
      'Taxa de escaneamento de carga',
      'Taxa de armazenagem retroportuária (zona secundária)',
      'Taxa de transbordo',
      'Taxa de movimentação interna',
      'Taxa de carregamento/descarregamento',
      'Taxa de utilização de empilhadeira',
      'Taxa de utilização de carreta',
    ],
    'Despesas Aduaneiras': [
      'Taxa de utilização do SISCOMEX',
      'Despesas com despachante aduaneiro',
      'Taxa de liberação aduaneira',
      'Taxa de verificação documental',
      'Taxa de conferência aduaneira',
      'Taxa de inspeção aduaneira',
      'Taxa de utilização de recinto alfandegado',
      'Taxa de controle de carga',
      'Taxa de emissão de guias',
      'Taxa de anuência aduaneira',
    ],
    'Despesas de Fiscalização': [
      'Taxa de fiscalização sanitária (MAPA)',
      'Taxa de fiscalização da Anvisa',
      'Taxa de fiscalização do Ibama',
      'Taxa de fiscalização do Exército',
      'Taxa de fiscalização da Polícia Federal',
      'Taxa de fiscalização da Vigilância Sanitária',
      'Taxa de fiscalização da ANTT',
      'Taxa de inspeção fitossanitária',
      'Taxa de inspeção zoossanitária',
      'Taxa de inspeção de qualidade',
      'Taxa de inspeção de segurança',
    ],
    'Despesas de Transporte Interno': [
      'Taxa de transporte interno (EADI-armazém)',
      'Taxa de transporte para zona secundária',
      'Taxa de transporte para destino final',
      'Taxa de transbordo (quando há troca de modal)',
      'Taxa de movimentação interna',
      'Taxa de carregamento/descarregamento',
      'Taxa de utilização de empilhadeira',
      'Taxa de utilização de carreta',
    ],
    'Despesas Especiais': [
      'Fumigação',
      'Taxa de carga especial',
      'Taxa de carga perigosa',
      'Taxa de carga frigorificada',
      'Taxa de carga a granel',
      'Taxa de carga break-bulk',
      'Taxa de carga project cargo',
      'Taxa de carga out of gauge',
      'Taxa de carga heavy lift',
    ],
  },
}

const LogisticaTab: React.FC<LogisticaTabProps> = ({ data, onChange, onNext, onPrev }) => {
  const [despesasSelecionadas, setDespesasSelecionadas] = useState<string[]>(data.despesasSelecionadas || [])
  const [valoresDespesas, setValoresDespesas] = useState<{[key: string]: string}>(data.valoresDespesas || {})
  const modal = data.modal || 'maritime'

  useEffect(() => {
    // Limpa despesas e valores se mudar o modal
    setDespesasSelecionadas([])
    setValoresDespesas({})
    onChange({ ...data, despesasSelecionadas: [], valoresDespesas: {} })
    // eslint-disable-next-line
  }, [modal])

  const handleToggleDespesa = (despesa: string) => {
    let novasDespesas: string[]
    if (despesasSelecionadas.includes(despesa)) {
      novasDespesas = despesasSelecionadas.filter(d => d !== despesa)
    } else {
      novasDespesas = [...despesasSelecionadas, despesa]
    }
    setDespesasSelecionadas(novasDespesas)
    onChange({ ...data, despesasSelecionadas: novasDespesas })
  }

  const handleValorDespesa = (despesa: string, valor: string) => {
    const novosValores = { ...valoresDespesas, [despesa]: valor }
    setValoresDespesas(novosValores)
    onChange({ ...data, valoresDespesas: novosValores })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modal de Transporte</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.modal || 'maritime'}
          onChange={e => onChange({ modal: e.target.value })}
        >
          <option value="maritime">Marítimo</option>
          <option value="air">Aéreo</option>
          <option value="land">Terrestre</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Despesas do Modal Selecionado</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-2 rounded-md bg-gray-50 dark:bg-gray-800">
          {Object.entries(DESPESAS_POR_MODAL[modal]).map(([categoria, despesas]) => (
            <div key={categoria} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{categoria}</h3>
              {(despesas as string[]).map((despesa) => (
                <div key={despesa} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={despesasSelecionadas.includes(despesa)}
                    onChange={() => handleToggleDespesa(despesa)}
                  />
                  <span>{despesa}</span>
                  {despesasSelecionadas.includes(despesa) && (
                    <input
                      type="number"
                      className="w-24 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
                      placeholder="Valor (R$)"
                      value={valoresDespesas[despesa] || ''}
                      onChange={e => handleValorDespesa(despesa, e.target.value)}
                      min="0"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selecione apenas as despesas realmente aplicáveis ao seu processo.</div>
      </div>
      <div className="flex justify-between">
        <button type="button" className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md" onClick={onPrev}>Voltar</button>
        <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={onNext}>Próxima Etapa</button>
      </div>
    </div>
  )
}

export default LogisticaTab 