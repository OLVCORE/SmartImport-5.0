import React, { useState, useEffect } from 'react'
import { isValidFileSize } from '../../utils/validation'
import aiService from '../../services/aiService'

interface Produto {
  id: number
  descricao: string
  ncm: string
  quantidade: number
  valorUnitario: number
  ttceData?: any // Adicionado para armazenar dados do TTCE
  ncmReadOnly?: boolean // Adicionado para controlar a leitura do NCM
  descricaoReadOnly?: boolean // Adicionado para controlar a leitura da descrição
  consultandoTTCE?: boolean // Adicionado para indicar carregamento TTCE
}

interface ProdutoTabProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
}

const ProdutoTab: React.FC<ProdutoTabProps> = ({ data, onChange, onNext }) => {
  const [produtos, setProdutos] = useState<Produto[]>(data.produtos || [])
  const [ncmSuggestions, setNcmSuggestions] = useState<string[]>([])
  const [ocrStatus, setOcrStatus] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  // Carregar produtos da aba essenciais quando a aba for aberta
  useEffect(() => {
    if (data.produtos && data.produtos.length > 0) {
      setProdutos(data.produtos)
    } else {
      // Se não há produtos, criar um produto de teste para facilitar o teste
      console.log('📝 Criando produto de teste para facilitar o teste TTCE')
      const produtoTeste: Produto = {
        id: Date.now(),
        descricao: 'Produto de teste',
        ncm: '',
        quantidade: 1,
        valorUnitario: 100
      }
      setProdutos([produtoTeste])
      onChange({ ...data, produtos: [produtoTeste] })
    }
  }, [data.produtos])

  // Função para simular sugestão de NCM por IA (real: integrar com OpenAI ou API de classificação)
  const handleNcmSuggest = async (produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId)
    if (!produto || produto.descricao.length < 100) {
      alert('Descrição deve ter pelo menos 100 caracteres para sugestão de NCM')
      return
    }

    // Aqui você pode integrar com a API real de IA
    const sugestoes = [
      '8517.12.00',
      '8471.30.12',
      '8528.72.00',
    ]
    setNcmSuggestions(sugestoes)
    
    // Atualizar o NCM do produto com a primeira sugestão
    const novosProdutos = produtos.map(p => 
      p.id === produtoId ? { ...p, ncm: sugestoes[0] } : p
    )
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Função para upload e processamento real de arquivo
  const handleOcr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tamanho
    if (!isValidFileSize(file, 10)) {
      setOcrStatus('Erro: Arquivo excede o limite de 10MB.')
      return
    }
    setOcrStatus('Extraindo texto do documento...')
    try {
      const texto = await aiService.extractTextFromDocument(file)
      setOcrStatus('Texto extraído com sucesso!')
      // Adicionar produto extraído do OCR (exemplo, pode ser adaptado para múltiplos produtos)
      const novoProduto: Produto = {
        id: Date.now(),
        descricao: texto.slice(0, 500), // Exemplo: primeiros 500 caracteres
        ncm: '',
        quantidade: 1,
        valorUnitario: 0
      }
      const novosProdutos = [...produtos, novoProduto]
      setProdutos(novosProdutos)
      onChange({ ...data, produtos: novosProdutos })
    } catch (err: any) {
      setOcrStatus('Erro ao processar o arquivo: ' + (err?.message || 'Erro desconhecido'))
    }
  }

  // Adicionar novo produto
  const adicionarProduto = () => {
    const novoProduto: Produto = {
      id: Date.now(),
      descricao: '',
      ncm: '',
      quantidade: 1,
      valorUnitario: 0
    }
    console.log('➕ Adicionando novo produto:', novoProduto)
    const novosProdutos = [...produtos, novoProduto]
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Atualizar produto
  const atualizarProduto = async (id: number, campo: keyof Produto, valor: string | number) => {
    console.log('🔄 atualizarProduto chamado:', { id, campo, valor })
    
    let novosProdutos = produtos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    )
    // Se o campo alterado for NCM e for válido (8 dígitos), consultar TTCE
    if (campo === 'ncm' && typeof valor === 'string') {
      // Aceitar NCM com pontos, hífens ou apenas números
      const ncmClean = valor.replace(/[.\-\s]/g, '') // Remove pontos, hífens e espaços
      const ncmDigits = ncmClean.replace(/\D/g, '') // Remove tudo que não é dígito
      console.log('🔍 Verificando NCM:', { 
        valor, 
        ncmClean, 
        ncmDigits, 
        length: ncmDigits.length,
        isNumeric: /^\d+$/.test(ncmDigits)
      })
      
      if (ncmDigits.length === 8 && /^\d+$/.test(ncmDigits)) {
        console.log('✅ NCM válido (8 dígitos), consultando TTCE...')
        const produto = novosProdutos.find(p => p.id === id)
        if (produto) {
          // Marcar como consultando TTCE
          novosProdutos = novosProdutos.map(p =>
            p.id === id ? { ...p, consultandoTTCE: true } : p
          )
          setProdutos(novosProdutos)
          onChange({ ...data, produtos: novosProdutos })
          
          try {
            console.log('📡 Chamando TTCE com parâmetros:', {
              ncm: ncmDigits,
              codigoPais: data.paisOrigem || '105',
              dataFatoGerador: new Date().toISOString().slice(0, 10),
              tipoOperacao: 'I'
            })
            
            // Chamar TTCE com NCM, país, data e tipo de operação
            const ttceData = await aiService.consultarTTCE({
              ncm: ncmDigits,
              codigoPais: data.paisOrigem || '105',
              dataFatoGerador: new Date().toISOString().slice(0, 10),
              tipoOperacao: 'I'
            })
            
            console.log('📋 Resposta TTCE:', ttceData)
            
            // Atualizar produto com dados TTCE e descrição oficial
            novosProdutos = novosProdutos.map(p =>
              p.id === id ? { ...p, ttceData, descricao: ttceData.descricaoOficial || p.descricao, ncmReadOnly: true, descricaoReadOnly: true, consultandoTTCE: false } : p
            )
            // Mostrar mensagem de sucesso
            console.log('✅ NCM validado no TTCE:', ttceData.descricaoOficial)
          } catch (err) {
            console.error('❌ Erro ao consultar TTCE:', err)
            // Se TTCE falhar, não bloquear o fluxo
            alert('⚠️ Erro ao consultar TTCE. NCM será aceito, mas valide com um despachante.')
            // Remover marcação de consultando
            novosProdutos = novosProdutos.map(p =>
              p.id === id ? { ...p, consultandoTTCE: false } : p
            )
          }
        }
      } else if (ncmDigits.length > 0 && ncmDigits.length !== 8) {
        console.log('❌ NCM inválido:', { ncmDigits, length: ncmDigits.length })
        alert('❌ NCM deve ter exatamente 8 dígitos numéricos')
        return
      } else {
        console.log('ℹ️ NCM ainda não tem 8 dígitos:', { ncmDigits, length: ncmDigits.length })
      }
    }
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Remover produto
  const removerProduto = (id: number) => {
    const novosProdutos = produtos.filter(p => p.id !== id)
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Calcular total dos produtos
  const totalProdutos = produtos.reduce((acc, produto) => {
    return acc + (produto.quantidade * produto.valorUnitario)
  }, 0)

  // Exibir produtos apenas para conferência, sem edição manual
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Produtos Cadastrados</h3>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="inline-flex items-center cursor-pointer bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-lg px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 transition" title="Adicionar produto manualmente">
          <span className="material-icons mr-2 text-blue-600">add_circle</span>
          <button type="button" className="text-blue-700 font-medium" onClick={adicionarProduto}>Adicionar Produto</button>
        </label>
        <label className="inline-flex items-center cursor-pointer bg-green-50 dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-lg px-4 py-2 hover:bg-green-100 dark:hover:bg-gray-800 transition" title="Adicionar via OCR/IA">
          <span className="material-icons mr-2 text-green-600">cloud_upload</span>
          <input type="file" accept="application/pdf,image/*,.doc,.docx" className="hidden" onChange={handleOcr} />
          <span className="text-green-700 font-medium">Importar Nota/Documento</span>
        </label>
        {ocrStatus && <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">{ocrStatus}</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map(produto => (
          <div key={produto.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 relative group">
            <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100 transition">
              <button
                type="button"
                className="p-1 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
                title="Editar produto"
                onClick={() => setProdutos(produtos.map(p => p.id === produto.id ? { ...p, ncmReadOnly: false, descricaoReadOnly: false } : p))}
              >
                <span className="material-icons text-blue-600">edit</span>
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-gray-700"
                title="Remover produto"
                onClick={() => removerProduto(produto.id)}
              >
                <span className="material-icons text-red-600">delete</span>
              </button>
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Descrição</span>
              {produto.descricaoReadOnly ? (
                <div className="font-medium text-gray-900 dark:text-white">{produto.descricao}</div>
              ) : (
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring focus:border-blue-400"
                  value={produto.descricao}
                  onChange={e => atualizarProduto(produto.id, 'descricao', e.target.value)}
                  disabled={produto.descricaoReadOnly}
                  maxLength={500}
                  placeholder="Descrição detalhada do produto"
                  title="Descrição oficial do produto conforme TTCE"
                />
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500 dark:text-gray-400">NCM</span>
              {produto.ncmReadOnly ? (
                <div className="font-mono text-blue-700 dark:text-blue-300">{produto.ncm}</div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 font-mono text-blue-700 dark:text-blue-300 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring focus:border-blue-400"
                    value={produto.ncm}
                    onChange={e => atualizarProduto(produto.id, 'ncm', e.target.value)}
                    onBlur={e => {
                      const target = e.target as HTMLInputElement
                      const ncmDigits = target.value.replace(/\D/g, '')
                      if (ncmDigits.length === 8) {
                        atualizarProduto(produto.id, 'ncm', target.value)
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === 'Tab') {
                        const target = e.target as HTMLInputElement
                        const ncmDigits = target.value.replace(/\D/g, '')
                        if (ncmDigits.length === 8) {
                          atualizarProduto(produto.id, 'ncm', target.value)
                        }
                      }
                    }}
                    disabled={produto.ncmReadOnly}
                    maxLength={14}
                    placeholder="Digite o NCM (8 dígitos)"
                    title="Digite o NCM correto para validação instantânea no TTCE"
                  />
                  {produto.consultandoTTCE && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Quantidade</span>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-400"
                value={produto.quantidade}
                min={1}
                onChange={e => atualizarProduto(produto.id, 'quantidade', Number(e.target.value))}
                disabled={produto.ncmReadOnly}
                title="Quantidade do produto"
              />
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Valor Unitário ({data.moeda || 'USD'})</span>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-400"
                value={produto.valorUnitario}
                min={0}
                step={0.01}
                onChange={e => atualizarProduto(produto.id, 'valorUnitario', Number(e.target.value))}
                disabled={produto.ncmReadOnly}
                title={`Valor unitário do produto em ${data.moeda || 'USD'}`}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Valor Total:</span> {(produto.quantidade * produto.valorUnitario).toFixed(2)} {data.moeda || 'USD'}
            </div>
            {produto.ttceData && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded text-xs text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700" title="Dados oficiais TTCE">
                <span className="font-semibold">TTCE:</span> {produto.ttceData.descricaoOficial || 'N/A'}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            // Validar se todos os produtos têm descrição e NCM
            const produtosInvalidos = produtos.filter(p => !p.descricao || !p.descricao.trim() || !p.ncm || !p.ncm.trim())
            if (produtosInvalidos.length > 0) {
              alert('❌ Todos os produtos devem ter descrição e NCM preenchidos')
              return
            }
            onNext()
          }}
          disabled={produtos.length === 0}
        >
          Próxima Etapa
        </button>
      </div>
    </div>
  )
}

export default ProdutoTab 