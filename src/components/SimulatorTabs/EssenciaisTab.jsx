import React, { useState, useEffect } from 'react'
import aduanas from '../../data/aduanas'
import paises from '../../data/paises'
import estados from '../../data/estados'
import aiService from '../../services/aiService'
import NCMRefinementModal from '../UI/NCMRefinementModal'
import ProductDetailsModal from '../UI/ProductDetailsModal'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Calendar, DollarSign, Euro, PoundSterling, CircleDollarSign, Edit3, RotateCcw, Upload, FileText, Search, Plus, Trash2, Eye, Crown } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
import { useUser } from '../../contexts/UserContext';
import { FaCrown, FaEye } from 'react-icons/fa';
import { fetchPTAXRate } from '../../utils/currency'
import PTAXPanel from '../UI/PTAXPanel'
import { fetchPtax, isFutureDate } from '../../services/ptaxService.js'
import { useSimulationStore } from '../../store/simulationStore'

const modais = [
  { value: 'maritimo', label: 'Marítimo', description: 'Transporte por navio - ideal para grandes volumes' },
  { value: 'aereo', label: 'Aéreo', description: 'Transporte por avião - ideal para urgências e produtos perecíveis' },
  { value: 'rodoviario', label: 'Rodoviário', description: 'Transporte por caminhão - ideal para distâncias médias' },
  { value: 'ferroviario', label: 'Ferroviário', description: 'Transporte por trem - ideal para grandes volumes terrestres' },
]

const moedas = [
  { value: 'USD', label: 'USD - Dólar Americano', description: 'Moeda mais utilizada no comércio internacional' },
  { value: 'EUR', label: 'EUR - Euro', description: 'Moeda da União Europeia' },
  { value: 'JPY', label: 'JPY - Iene Japonês', description: 'Moeda do Japão' },
  { value: 'GBP', label: 'GBP - Libra Esterlina', description: 'Moeda do Reino Unido' },
  { value: 'ARS', label: 'ARS - Peso Argentino', description: 'Moeda da Argentina' },
  { value: 'CNY', label: 'CNY - Yuan Chinês', description: 'Moeda da China' },
  { value: 'CHF', label: 'CHF - Franco Suíço', description: 'Moeda da Suíça' },
  { value: 'CAD', label: 'CAD - Dólar Canadense', description: 'Moeda do Canadá' },
  { value: 'AUD', label: 'AUD - Dólar Australiano', description: 'Moeda da Austrália' },
  { value: 'BRL', label: 'BRL - Real Brasileiro', description: 'Moeda nacional do Brasil' },
]

// Limite de páginas e caracteres para processamento inicial
const MAX_PAGES = 10
const MAX_CHARS = 20000

// Componente Tooltip
const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]} transition-opacity duration-200`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2' :
            'right-full top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  )
}

const EssenciaisTab = ({ data, onChange, onNext }) => {
  const userContext = useUser();
  const user = userContext?.user;
  const setUser = userContext?.setUser;
  
  // SUA ABORDAGEM: Store PTAX
  const { 
    ptax: storePtax, 
    ptaxDate: storePtaxDate, 
    ptaxLoading, 
    ptaxError,
    manualPtax,
    setPtax,
    setPtaxDate,
    setPtaxError,
    setManualPtax,
    fetchPtaxRate,
    clearPtax
  } = useSimulationStore()
  
  const [uf, setUf] = useState(data.ufDesembaraco || '')
  const [ufDestino, setUfDestino] = useState(data.ufDestino || '')
  const [buscaZona, setBuscaZona] = useState('')
  const [buscaPais, setBuscaPais] = useState('')
  const [produtos, setProdutos] = useState(data.produtos || [])
  const [uploadFile, setUploadFile] = useState(null)
  const [showPaisDropdown, setShowPaisDropdown] = useState(false)
  const [showIAModal, setShowIAModal] = useState(false)
  const [selectedProductForIA, setSelectedProductForIA] = useState(null)
  const [iaTextInput, setIaTextInput] = useState('')
  const [showRefinementModal, setShowRefinementModal] = useState(false)
  const [selectedProductForRefinement, setSelectedProductForRefinement] = useState(null)
  const [processingDocument, setProcessingDocument] = useState(false)
  const [documentText, setDocumentText] = useState('')
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false)
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null)
  const [processamentoResumo, setProcessamentoResumo] = useState(null)
  const [progressState, setProgressState] = useState({
    stage: 'extracting',
    currentChunk: 0,
    totalChunks: 0,
    productsFound: 0,
    documentSize: 0,
    message: ''
  })
  const [largeDocAlert, setLargeDocAlert] = useState(false)

  // Exemplo de alerta de limite atingido
  const [limiteAtingido, setLimiteAtingido] = useState(false);

  // SUA ABORDAGEM: Estados PTAX
  const [ptax, setLocalPtax] = useState(data.ptax || '')
  const [ptaxDate, setPtaxDate] = useState(() => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })
  const [ptaxInfo, setPtaxInfo] = useState({ dataCotacao: '', fonte: '' })
  const [ptaxManual, setPtaxManual] = useState(false)
  const [ptaxEditable, setPtaxEditable] = useState(false)
  const [showPTAXPanel, setShowPTAXPanel] = useState(false)
  const [ptaxData, setPtaxData] = useState({})

  // SUA ABORDAGEM: Estados para modo manual
  const [ptaxMode, setPtaxMode] = useState('auto')
  const [ptaxManualValue, setPtaxManualValue] = useState('')
  const [loadingPtax, setLoadingPtax] = useState(false)

  // SUA ABORDAGEM: Cotação final (manual ou automática)
  const cotacao = manualPtax ?? storePtax ?? ptax

  // SUA ABORDAGEM: useEffect para reação automática
  useEffect(() => {
    if (!data.moeda || !ptaxDate || ptaxManual) return
    
    console.log(`🔄 Auto-fetch PTAX: ${data.moeda} para ${ptaxDate}`)
    
    // Verificar se é data futura
    if (isFutureDate(ptaxDate)) {
      console.log(`⚠️ Data futura detectada: ${ptaxDate}`)
      setPtaxMode('manual')
      setPtaxManualValue('')
      setLocalPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      return
    }
    
    // Buscar PTAX automaticamente
    fetchPtaxRate(data.moeda, ptaxDate)
      .then((resultado) => {
        setLocalPtax(resultado.cotacao)
        setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
        onChange({ ...data, ptax: resultado.cotacao })
        console.log(`✅ PTAX automático aplicado:`, resultado)
      })
      .catch((err) => {
        console.error('❌ Erro PTAX automático:', err)
        setLocalPtax('')
        setPtaxInfo({ dataCotacao: '', fonte: '' })
        
        if (isFutureDate(ptaxDate)) {
          setPtaxMode('manual')
          setPtaxManualValue('')
        }
      })
  }, [data.moeda, ptaxDate, ptaxManual, fetchPtaxRate, onChange])

  // SUA ABORDAGEM: Função para aplicar PTAX manual
  const applyManualPtax = () => {
    const valor = parseFloat(ptaxManualValue.replace(',', '.'))
    if (!isNaN(valor) && valor > 0) {
      setManualPtax(valor) // SUA ABORDAGEM: usar store
      setLocalPtax(valor)
      setPtaxInfo({ dataCotacao: ptaxDate, fonte: 'Manual' })
      setPtaxMode('manual')
      onChange({ ...data, ptax: valor })
      console.log('✅ PTAX manual aplicado:', valor)
      toast.success('PTAX manual aplicado com sucesso!')
    } else {
      alert('Por favor, insira um valor válido para o PTAX (ex: 5,50 ou 5.50)')
    }
  }

  // SUA ABORDAGEM: Função para resetar PTAX manual
  const resetManualPtax = () => {
    setManualPtax(null)
    setPtaxManualValue('')
    setPtaxMode('auto')
    if (storePtax) {
      setLocalPtax(storePtax)
      onChange({ ...data, ptax: storePtax })
    }
    toast.info('PTAX manual removido, usando valor automático')
  }

  // SUA ABORDAGEM: Função para recarregar PTAX
  const reloadPtax = async () => {
    if (!data.moeda || !ptaxDate) return
    
    setLoadingPtax(true)
    try {
      const resultado = await fetchPtaxRate(data.moeda, ptaxDate)
      setLocalPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setManualPtax(null) // Remove override manual
      onChange({ ...data, ptax: resultado.cotacao })
      toast.success('PTAX atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar PTAX')
    } finally {
      setLoadingPtax(false)
    }
  }

  // Função para alternar modo PTAX
  const togglePtaxMode = () => {
    const newMode = ptaxMode === 'auto' ? 'manual' : 'auto'
    setPtaxMode(newMode)
    
    if (newMode === 'manual') {
      setPtaxManualValue(data.ptax || '')
    } else {
      buscarCotacao()
    }
  }

  // NOVO: Resetar estados ao montar/desmontar
  useEffect(() => {
    resetProcessamento()
    // eslint-disable-next-line
  }, [])

  // NOVO: Só mostrar progresso/spinner/cancelar se houver uploadFile e processingDocument
  const showProgress = uploadFile && processingDocument

  // NOVO: Só mostrar botão de detalhes se houver produtos
  const showProductDetailsButton = produtos.length > 0

  // NOVO: Mensagem de uso de IA só após ação do usuário
  const [iaInvoked, setIaInvoked] = useState(false)
  const handleExtrairProdutos = async () => {
    setIaInvoked(true)
    await processarDocumentoReal(uploadFile)
  }

  // Filtrar zonas aduaneiras por UF e modal - CORRIGIDO
  const zonasFiltradas = aduanas.filter(a =>
    (!data.ufDesembaraco || a.uf === data.ufDesembaraco) &&
    (!data.modal || (data.modal === 'maritimo' && a.tipo === 'porto') ||
     (data.modal === 'aereo' && a.tipo === 'aeroporto') ||
     (data.modal === 'rodoviario' && (a.tipo === 'fronteira' || a.tipo === 'ead')) ||
     (data.modal === 'ferroviario' && (a.tipo === 'fronteira' || a.tipo === 'ead'))) &&
    (!buscaZona || (
      a.nome.toLowerCase().includes(buscaZona.toLowerCase()) ||
      a.cidade.toLowerCase().includes(buscaZona.toLowerCase()) ||
      a.uf.toLowerCase().includes(buscaZona.toLowerCase())
    ))
  )

  // Filtrar países
  const paisesFiltrados = paises.filter(p =>
    p.nome.toLowerCase().includes(buscaPais.toLowerCase()) ||
    p.codigo.toLowerCase().includes(buscaPais.toLowerCase())
  )

  // Função para buscar cotação PTAX - ATUALIZADA
  const buscarCotacao = async () => {
    if (!data.moeda || !ptaxDate) return
    
    setLoadingPtax(true)
    
    try {
      console.log(`🔍 Buscando PTAX: ${data.moeda} para ${ptaxDate}`)
      
      const resultado = await fetchPtaxRate(data.moeda, ptaxDate)
      
      setLocalPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxEditable(false)
      onChange({ ...data, ptax: resultado.cotacao })
      
      console.log(`✅ PTAX aplicado:`, resultado)
    } catch (err) {
      setLocalPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      console.error('❌ Erro ao buscar PTAX:', err)
      
      // Se for data futura, permitir entrada manual
      if (isFutureDate(ptaxDate)) {
        setPtaxMode('manual')
        setPtaxManualValue('')
        alert('Data futura detectada. Use o modo manual para inserir PTAX.')
      } else {
        alert('Erro ao buscar PTAX do Banco Central. Verifique sua conexão ou tente novamente mais tarde.')
      }
    } finally {
      setLoadingPtax(false)
    }
  }

  // Função para buscar cotação manualmente (botão) - ATUALIZADA
  const buscarCotacaoManual = async () => {
    if (!data.moeda || !ptaxDate) return
    
    try {
      const resultado = await fetchPtaxRate(data.moeda, ptaxDate)
      setLocalPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxManual(false) // volta ao modo automático
      onChange({ ...data, ptax: resultado.cotacao })
      console.log(`✅ PTAX manual aplicado:`, resultado)
    } catch (err) {
      setLocalPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      console.error('❌ Erro PTAX manual:', err)
      alert('Erro ao buscar PTAX do Banco Central. Verifique sua conexão ou tente novamente mais tarde.')
    }
  }

  // Função para verificar se data é futura
  const isFutureDateLocal = (dateString) => {
    const selectedDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset para início do dia
    return selectedDate > today
  }

  // Função para atualizar data automaticamente
  const updateToCurrentDate = () => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const currentDate = `${yyyy}-${mm}-${dd}`
    
    setPtaxDate(currentDate)
    
    // Se estiver em modo automático, buscar PTAX automaticamente
    if (ptaxMode === 'auto' && data.moeda) {
      buscarCotacaoComData(currentDate)
    }
  }

  // Função para buscar PTAX com data específica - ATUALIZADA
  const buscarCotacaoComData = async (dataEspecifica) => {
    if (!data.moeda || !dataEspecifica) return
    
    setLoadingPtax(true)
    
    try {
      const resultado = await fetchPtaxRate(data.moeda, dataEspecifica)
      setLocalPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxEditable(false)
      onChange({ ...data, ptax: resultado.cotacao })
      console.log(`✅ PTAX com data aplicado:`, resultado)
    } catch (err) {
      setLocalPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      console.error('❌ Erro PTAX com data:', err)
    } finally {
      setLoadingPtax(false)
    }
  }

  // Função para lidar com mudança de data - ATUALIZADA
  const handleDateChange = (newDate) => {
    setPtaxDate(newDate)
    
    // Se for data futura, forçar modo manual
    if (isFutureDate(newDate)) {
      setPtaxMode('manual')
      setPtaxManualValue('')
      setLocalPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      toast.info('Data futura selecionada. Use o modo manual para inserir PTAX.')
    } else if (ptaxMode === 'auto' && data.moeda) {
      // Se for data passada/atual e modo automático, buscar PTAX
      buscarCotacaoComData(newDate)
    }
  }

  // Função resetProcessamento que estava faltando
  const resetProcessamento = () => {
    setProcessingDocument(false)
    setDocumentText('')
    setProcessamentoResumo(null)
    setProgressState({
      stage: 'extracting',
      currentChunk: 0,
      totalChunks: 0,
      productsFound: 0,
      documentSize: 0,
      message: ''
    })
  }

  // Função para validar campos obrigatórios
  const debugValidation = () => {
    const requiredFields = ['paisOrigem', 'modal', 'ufDesembaraco', 'zonaAduaneira', 'moeda', 'ptax']
    const missing = requiredFields.filter(field => !data[field])
    
    if (missing.length > 0) {
      console.log('❌ Campos obrigatórios faltando:', missing)
      alert(`Campos obrigatórios não preenchidos: ${missing.join(', ')}`)
      return false
    }
    
    console.log('✅ Todos os campos obrigatórios preenchidos')
    return true
  }

  // Função para selecionar zona aduaneira
  const selecionarZonaAduaneira = (zona) => {
    onChange({ ...data, zonaAduaneira: zona.codigo })
    setBuscaZona(zona.nome)
  }

  // Função para adicionar produto
  const adicionarProduto = () => {
    const novoProduto = {
      id: Date.now(),
      descricao: '',
      ncm: '',
      valor: '',
      peso: '',
      quantidade: 1,
      unidade: 'UN'
    }
    
    const produtosAtualizados = [...produtos, novoProduto]
    setProdutos(produtosAtualizados)
    onChange({ ...data, produtos: produtosAtualizados })
  }

  // Função para atualizar produto
  const atualizarProduto = async (id, campo, valor) => {
    const produtosAtualizados = produtos.map(produto => {
      if (produto.id === id) {
        const produtoAtualizado = { ...produto, [campo]: valor }
        
        // Se atualizou descrição, tentar sugerir NCM
        if (campo === 'descricao' && valor && !produto.ncm) {
          handleNcmSuggest(produtoAtualizado.id)
        }
        
        return produtoAtualizado
      }
      return produto
    })
    
    setProdutos(produtosAtualizados)
    onChange({ ...data, produtos: produtosAtualizados })
  }

  // Função para remover produto
  const removerProduto = (id) => {
    const produtosAtualizados = produtos.filter(produto => produto.id !== id)
    setProdutos(produtosAtualizados)
    onChange({ ...data, produtos: produtosAtualizados })
  }

  // Função para processar documento real
  const processarDocumentoReal = async (file) => {
    if (!file) return
    
    setProcessingDocument(true)
    setProgressState({
      stage: 'extracting',
      currentChunk: 0,
      totalChunks: 0,
      productsFound: 0,
      documentSize: file.size,
      message: 'Iniciando extração...'
    })
    
    try {
      const text = await extractTextFromFile(file)
      setDocumentText(text)
      
      if (text.length > MAX_CHARS) {
        setLargeDocAlert(true)
        setProgressState(prev => ({
          ...prev,
          message: 'Documento muito grande, processando em partes...'
        }))
      }
      
      // Processar com IA
      const resultado = await aiService.analisarDocumento(text)
      
      if (resultado.produtos && resultado.produtos.length > 0) {
        const produtosComIds = resultado.produtos.map((produto, index) => ({
          id: Date.now() + index,
          descricao: produto.descricao || '',
          ncm: produto.ncm || '',
          valor: produto.valor || '',
          peso: produto.peso || '',
          quantidade: produto.quantidade || 1,
          unidade: produto.unidade || 'UN'
        }))
        
        setProdutos(produtosComIds)
        onChange({ ...data, produtos: produtosComIds })
        
        setProcessamentoResumo({
          totalProdutos: produtosComIds.length,
          produtosComNCM: produtosComIds.filter(p => p.ncm).length,
          produtosSemNCM: produtosComIds.filter(p => !p.ncm).length
        })
        
        toast.success(`${produtosComIds.length} produtos extraídos com sucesso!`)
      } else {
        toast.error('Nenhum produto encontrado no documento')
      }
      
    } catch (error) {
      console.error('Erro ao processar documento:', error)
      toast.error('Erro ao processar documento. Tente novamente.')
    } finally {
      setProcessingDocument(false)
    }
  }

  // Função para extrair texto do arquivo
  const extractTextFromFile = async (file) => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let text = ''
      for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        text += textContent.items.map(item => item.str).join(' ') + '\n'
      }
      
      return text
    } else {
      return await file.text()
    }
  }

  // Função para sugerir NCM
  const handleNcmSuggest = async (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId)
    if (!produto || !produto.descricao) return
    
    try {
      const sugestao = await aiService.sugerirNCM(produto.descricao)
      if (sugestao) {
        atualizarProduto(produtoId, 'ncm', sugestao)
        toast.success('NCM sugerido com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao sugerir NCM:', error)
    }
  }

  // Função para analisar texto com IA
  const analisarTextoIA = async (produtoId, texto) => {
    try {
      const resultado = await aiService.analisarTexto(texto)
      if (resultado.ncm) {
        atualizarProduto(produtoId, 'ncm', resultado.ncm)
        toast.success('Análise IA concluída!')
      }
    } catch (error) {
      console.error('Erro na análise IA:', error)
      toast.error('Erro na análise IA')
    }
  }

  // Função para abrir modal de refinamento
  const abrirModalRefinamento = (produtoId) => {
    setSelectedProductForRefinement(produtoId)
    setShowRefinementModal(true)
  }

  // Função para aplicar NCM refinado
  const aplicarNCMRefinado = (ncmFinal, resultado) => {
    if (selectedProductForRefinement) {
      atualizarProduto(selectedProductForRefinement, 'ncm', ncmFinal)
      setShowRefinementModal(false)
      setSelectedProductForRefinement(null)
      toast.success('NCM refinado aplicado com sucesso!')
    }
  }

  // Função para abrir modal IA
  const abrirModalIA = (produtoId) => {
    setSelectedProductForIA(produtoId)
    setShowIAModal(true)
  }

  // Função para analisar documento completo
  const analisarDocumentoCompleto = async () => {
    if (!documentText) {
      toast.error('Nenhum documento carregado')
      return
    }
    
    try {
      const resultado = await aiService.analisarDocumento(documentText)
      if (resultado.produtos) {
        const produtosComIds = resultado.produtos.map((produto, index) => ({
          id: Date.now() + index,
          descricao: produto.descricao || '',
          ncm: produto.ncm || '',
          valor: produto.valor || '',
          peso: produto.peso || '',
          quantidade: produto.quantidade || 1,
          unidade: produto.unidade || 'UN'
        }))
        
        setProdutos(produtosComIds)
        onChange({ ...data, produtos: produtosComIds })
        toast.success('Análise completa concluída!')
      }
    } catch (error) {
      console.error('Erro na análise completa:', error)
      toast.error('Erro na análise completa')
    }
  }

  // Função para analisar texto específico
  const analisarTextoEspecifico = async () => {
    if (!iaTextInput.trim()) {
      toast.error('Digite um texto para análise')
      return
    }
    
    try {
      const resultado = await aiService.analisarTexto(iaTextInput)
      if (resultado.ncm) {
        toast.success(`NCM sugerido: ${resultado.ncm}`)
      }
    } catch (error) {
      console.error('Erro na análise de texto:', error)
      toast.error('Erro na análise de texto')
    }
  }

  // Função para sugestão baseada em descrição
  const sugestaoBaseadaDescricao = async () => {
    if (!iaTextInput.trim()) {
      toast.error('Digite uma descrição para sugestão')
      return
    }
    
    try {
      const sugestao = await aiService.sugerirNCM(iaTextInput)
      if (sugestao) {
        toast.success(`NCM sugerido: ${sugestao}`)
      }
    } catch (error) {
      console.error('Erro na sugestão:', error)
      toast.error('Erro na sugestão de NCM')
    }
  }

  // Função para abrir modal de detalhes dos produtos
  const abrirModalDetalhesProdutos = () => {
    setShowProductDetailsModal(true)
  }

  // Função para fechar modal de detalhes dos produtos
  const fecharModalDetalhesProdutos = () => {
    setShowProductDetailsModal(false)
  }

  // Função para salvar produtos detalhados
  const salvarProdutosDetalhados = (produtosAtualizados) => {
    setProdutos(produtosAtualizados)
    onChange({ ...data, produtos: produtosAtualizados })
    setShowProductDetailsModal(false)
    toast.success('Produtos atualizados com sucesso!')
  }

  // Função para analisar NCM de produto detalhado
  const analisarNCMProdutoDetalhado = (produto) => {
    if (produto.descricao) {
      handleNcmSuggest(produto.id)
    }
  }

  // Função para renderizar informações de uso
  const renderUsageInfo = () => {
    if (!iaInvoked) return null
    
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Inteligência Artificial Ativa
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>• Extração automática de produtos de documentos</p>
              <p>• Sugestão inteligente de códigos NCM</p>
              <p>• Análise avançada de descrições</p>
              <p>• Refinamento de classificações</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Função para analisar com IA
  const handleAnalisarComIA = async () => {
    if (!documentText) {
      toast.error('Nenhum documento carregado para análise')
      return
    }
    
    try {
      await analisarDocumentoCompleto()
    } catch (error) {
      console.error('Erro na análise IA:', error)
      toast.error('Erro na análise com IA')
    }
  }

  // Função para visualizar documento
  const handleVisualizarDocumento = () => {
    if (!documentText) {
      toast.error('Nenhum documento carregado')
      return
    }
    
    // Aqui você pode implementar a visualização do documento
    console.log('Visualizando documento:', documentText.substring(0, 500) + '...')
    toast.info('Visualização do documento implementada')
  }

  // Função para obter modais elegíveis
  const getModaisElegiveis = (paisOrigem) => {
    if (!paisOrigem) return modais
    
    // Lógica para filtrar modais baseado no país de origem
    // Por exemplo, países sem litoral não podem usar modal marítimo
    const paisesSemLitoral = ['BOL', 'PAR', 'BOL']
    
    if (paisesSemLitoral.includes(paisOrigem)) {
      return modais.filter(modal => modal.value !== 'maritimo')
    }
    
    return modais
  }

  // Função para selecionar moeda
  const handleCurrencySelect = (currencyCode, cotacao) => {
    onChange({ ...data, moeda: currencyCode, ptax: cotacao })
  }

  // Configuração do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadFile(acceptedFiles[0])
      }
    }
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        Dados Essenciais
      </h2>
      
      {/* Alerta sobre NCMs - Melhorado */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 dark:border-amber-500 p-6 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Atenção: Classificação NCM e LI/LP
            </h3>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
              A classificação correta do NCM é fundamental para o cálculo preciso dos tributos. 
              Recomendamos sempre validar com um despachante aduaneiro habilitado.
            </p>
          </div>
        </div>
      </div>

      {/* Informações de uso IA */}
      {renderUsageInfo()}

      {/* Grid Principal - Melhorado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna 1: Dados Básicos */}
        <div className="space-y-6">
          {/* Dados Essenciais - Card Elegante */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* País de Origem */}
              <div className="space-y-2">
                <Tooltip content="País de origem da mercadoria">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    País de Origem
                  </label>
                </Tooltip>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite o nome ou sigla do país..."
                    value={buscaPais || data.paisOrigem || ''}
                    onChange={e => {
                      setBuscaPais(e.target.value)
                      setShowPaisDropdown(true)
                      if (!e.target.value) {
                        onChange({ ...data, paisOrigem: '' })
                      }
                    }}
                    onFocus={() => setShowPaisDropdown(true)}
                  />
                  {showPaisDropdown && buscaPais && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {paisesFiltrados.map(pais => (
                        <button
                          key={pais.codigo}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-3"
                          onClick={() => {
                            onChange({ ...data, paisOrigem: pais.codigo })
                            setBuscaPais(pais.nome)
                            setShowPaisDropdown(false)
                          }}
                        >
                          <span className="text-lg">{pais.bandeira}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{pais.nome}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{pais.codigo}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal de Transporte */}
              <div className="space-y-2">
                <Tooltip content="Modal de transporte utilizado">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Modal de Transporte
                  </label>
                </Tooltip>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={data.modal || ''}
                  onChange={e => onChange({ ...data, modal: e.target.value })}
                >
                  <option value="">Selecione o modal...</option>
                  {getModaisElegiveis(data.paisOrigem).map(modal => (
                    <option key={modal.value} value={modal.value}>
                      {modal.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* UF de Desembaraço */}
              <div className="space-y-2">
                <Tooltip content="UF onde será realizado o desembaraço aduaneiro">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    UF de Desembaraço
                  </label>
                </Tooltip>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={uf}
                  onChange={e => {
                    setUf(e.target.value)
                    onChange({ ...data, ufDesembaraco: e.target.value })
                  }}
                >
                  <option value="">Selecione a UF...</option>
                  {estados.map(estado => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla} - {estado.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zona Aduaneira */}
              <div className="space-y-2">
                <Tooltip content="Zona aduaneira onde será realizado o desembaraço">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Zona Aduaneira
                  </label>
                </Tooltip>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Buscar zona aduaneira..."
                    value={buscaZona}
                    onChange={e => setBuscaZona(e.target.value)}
                    onFocus={() => setShowPaisDropdown(false)}
                  />
                  {buscaZona && zonasFiltradas.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {zonasFiltradas.map(zona => (
                        <button
                          key={zona.codigo}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => selecionarZonaAduaneira(zona)}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{zona.nome}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{zona.cidade} - {zona.uf}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SUA ABORDAGEM: Seção PTAX Melhorada */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              Cotação PTAX
            </h3>
            
            <div className="space-y-4">
              {/* Moeda */}
              <div className="space-y-2">
                <Tooltip content="Moeda da operação">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Moeda
                  </label>
                </Tooltip>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={data.moeda || ''}
                  onChange={e => onChange({ ...data, moeda: e.target.value })}
                >
                  <option value="">Selecione a moeda...</option>
                  {moedas.map(moeda => (
                    <option key={moeda.value} value={moeda.value}>
                      {moeda.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data da Cotação */}
              <div className="space-y-2">
                <Tooltip content="Data da cotação PTAX">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data da Cotação
                  </label>
                </Tooltip>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={ptaxDate}
                    onChange={e => handleDateChange(e.target.value)}
                  />
                  <button
                    onClick={updateToCurrentDate}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Usar data atual"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SUA ABORDAGEM: Campo PTAX com override manual */}
              <div className="space-y-2">
                <Tooltip content="Cotação PTAX (automática ou manual)">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Cotacao PTAX</span>
                    <div className="flex items-center space-x-2">
                      {manualPtax !== null && (
                        <button
                          onClick={resetManualPtax}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                          title="Remover override manual"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Auto
                        </button>
                      )}
                      <button
                        onClick={reloadPtax}
                        disabled={loadingPtax || !data.moeda || !ptaxDate}
                        className="text-xs text-green-600 hover:text-green-700 disabled:opacity-50 flex items-center"
                        title="Atualizar cotação"
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${loadingPtax ? 'animate-spin' : ''}`} />
                        Atualizar
                      </button>
                    </div>
                  </label>
                </Tooltip>
                
                <div className="flex space-x-2">
                  {manualPtax !== null ? (
                    // SUA ABORDAGEM: Campo editável para override manual
                    <input
                      type="text"
                      className="flex-1 border border-blue-300 dark:border-blue-600 rounded-lg px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={ptaxManualValue}
                      onChange={e => setPtaxManualValue(e.target.value)}
                      placeholder="Digite o valor manual..."
                    />
                  ) : (
                    // SUA ABORDAGEM: Exibição do valor automático
                    <div className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                      {cotacao ? `R$ ${parseFloat(cotacao).toFixed(4)}` : 'N/A'}
                    </div>
                  )}
                  
                  <button
                    onClick={manualPtax !== null ? applyManualPtax : () => setManualPtax('')}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                    title={manualPtax !== null ? "Aplicar valor manual" : "Editar manualmente"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* SUA ABORDAGEM: Informações da cotação */}
                {ptaxInfo.dataCotacao && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Base: {ptaxInfo.dataCotacao} | Fonte: {ptaxInfo.fonte}
                  </div>
                )}
                
                {ptaxError && (
                  <div className="text-xs text-red-500">
                    Erro: {ptaxError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Produtos e Documentos */}
        <div className="space-y-6">
          {/* Upload de Documentos */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              Upload de Documentos
            </h3>
            
            <div className="space-y-4">
              {/* Área de Drop */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste um arquivo ou clique para selecionar'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  PDF, DOCX, TXT (máx. 10MB)
                </p>
              </div>

              {/* Arquivo selecionado */}
              {uploadFile && (
                <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{uploadFile.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex space-x-3">
                <button
                  onClick={handleExtrairProdutos}
                  disabled={!uploadFile || processingDocument}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {processingDocument ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Extrair Produtos</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleAnalisarComIA}
                  disabled={!documentText}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>IA</span>
                </button>
              </div>

              {/* Progresso */}
              {showProgress && (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {progressState.stage === 'extracting' ? 'Extraindo texto...' : 'Processando...'}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {progressState.currentChunk}/{progressState.totalChunks}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: progressState.totalChunks > 0
                          ? `${(progressState.currentChunk / progressState.totalChunks) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {progressState.message}
                  </p>
                </div>
              )}

              {/* Resumo do processamento */}
              {processamentoResumo && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Processamento Concluído
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-green-600 dark:text-green-400">Total</p>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        {processamentoResumo.totalProdutos}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-600 dark:text-green-400">Com NCM</p>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        {processamentoResumo.produtosComNCM}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-600 dark:text-green-400">Sem NCM</p>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        {processamentoResumo.produtosSemNCM}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Produtos ({produtos.length})
              </h3>
              
              <div className="flex space-x-2">
                {showProductDetailsButton && (
                  <button
                    onClick={abrirModalDetalhesProdutos}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detalhes</span>
                  </button>
                )}
                
                <button
                  onClick={adicionarProduto}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {produtos.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-slate-500 dark:text-slate-400">
                    Nenhum produto adicionado. Faça upload de um documento ou adicione manualmente.
                  </p>
                </div>
              ) : (
                produtos.map((produto, index) => (
                  <div
                    key={produto.id}
                    className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Descrição */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Descrição
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={produto.descricao}
                          onChange={e => atualizarProduto(produto.id, 'descricao', e.target.value)}
                          placeholder="Descrição do produto"
                        />
                      </div>

                      {/* NCM */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          NCM
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={produto.ncm}
                            onChange={e => atualizarProduto(produto.id, 'ncm', e.target.value)}
                            placeholder="Código NCM"
                          />
                          <button
                            onClick={() => handleNcmSuggest(produto.id)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Sugerir NCM"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Valor ({data.moeda || 'USD'})
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={produto.valor}
                          onChange={e => atualizarProduto(produto.id, 'valor', e.target.value)}
                          placeholder="0,00"
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Peso (kg)
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={produto.peso}
                          onChange={e => atualizarProduto(produto.id, 'peso', e.target.value)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    {/* Ações do produto */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-slate-700 dark:text-slate-300">Qtd:</label>
                          <input
                            type="number"
                            className="w-16 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={produto.quantidade}
                            onChange={e => atualizarProduto(produto.id, 'quantidade', parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        
                        <select
                          className="border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={produto.unidade}
                          onChange={e => atualizarProduto(produto.id, 'unidade', e.target.value)}
                        >
                          <option value="UN">UN</option>
                          <option value="KG">KG</option>
                          <option value="M">M</option>
                          <option value="M2">M²</option>
                          <option value="M3">M³</option>
                          <option value="L">L</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => abrirModalIA(produto.id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
                          title="Analisar com IA"
                        >
                          <Crown className="w-3 h-3" />
                          <span>IA</span>
                        </button>
                        
                        <button
                          onClick={() => abrirModalRefinamento(produto.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                          title="Refinar NCM"
                        >
                          Refinar
                        </button>
                        
                        <button
                          onClick={() => removerProduto(produto.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Remover produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão Próximo */}
      <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            if (debugValidation()) {
              onNext()
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>Próximo</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Modais */}
      {showIAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Análise com IA
            </h3>
            <textarea
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-4"
              rows="4"
              placeholder="Digite o texto para análise..."
              value={iaTextInput}
              onChange={e => setIaTextInput(e.target.value)}
            />
            <div className="flex space-x-3">
              <button
                onClick={analisarTextoEspecifico}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Analisar Texto
              </button>
              <button
                onClick={sugestaoBaseadaDescricao}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sugerir NCM
              </button>
              <button
                onClick={() => setShowIAModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Refinamento NCM */}
      {showRefinementModal && (
        <NCMRefinementModal
          isOpen={showRefinementModal}
          onClose={() => setShowRefinementModal(false)}
          onApply={aplicarNCMRefinado}
          produtoId={selectedProductForRefinement}
          produtos={produtos}
        />
      )}

      {/* Modal de Detalhes dos Produtos */}
      {showProductDetailsModal && (
        <ProductDetailsModal
          isOpen={showProductDetailsModal}
          onClose={fecharModalDetalhesProdutos}
          onSave={salvarProdutosDetalhados}
          produtos={produtos}
          onAnalyzeNCM={analisarNCMProdutoDetalhado}
        />
      )}

      {/* Alerta de documento grande */}
      {largeDocAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Documento Grande
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              O documento é muito grande e será processado em partes. Isso pode levar mais tempo.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setLargeDocAlert(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  setLargeDocAlert(false)
                  setUploadFile(null)
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EssenciaisTab