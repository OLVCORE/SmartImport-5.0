import React, { useState, useEffect } from 'react'
import aduanas from '../../data/aduanas'
import paises from '../../data/paises'
import estados from '../../data/estados'
import aiService from '../../services/aiService'
import NCMRefinementModal from '../UI/NCMRefinementModal'
import ProductDetailsModal from '../UI/ProductDetailsModal'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Calendar, DollarSign, Euro, PoundSterling, CircleDollarSign } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
import { useUser } from '../../contexts/UserContext';
import { FaCrown, FaEye } from 'react-icons/fa';
import { fetchPTAXRate } from '../../utils/currency'
import PTAXPanel from '../UI/PTAXPanel'
import { getPtaxRateWithFallback, isFutureDate } from '../../services/ptaxService.js'
import { useSimulationStore } from '../../store/simulationStore'
import { getPtax } from '../../utils/ptax.js'

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
  
  // Store PTAX
  const { 
    fetchPtaxRate: storeFetchPtaxRate, 
    updatePtaxManual, 
    ptaxData: storePtaxData, 
    ptaxLoading, 
    ptaxError 
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

  // Adicionar no início do componente EssenciaisTab:
  const [ptax, setPtax] = useState(data.ptax || '')
  // Adicionar estado para data da cotação
  const [ptaxDate, setPtaxDate] = useState(() => {
    // Inicializar com data atual do sistema
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })
  // Adicionar estado para fonte e data da cotação
  const [ptaxInfo, setPtaxInfo] = useState({ dataCotacao: '', fonte: '' })
  // Estado para controlar se o usuário editou manualmente
  const [ptaxManual, setPtaxManual] = useState(false)
  const [ptaxEditable, setPtaxEditable] = useState(false)
  const [showPTAXPanel, setShowPTAXPanel] = useState(false)
  const [localPtaxData, setLocalPtaxData] = useState({})

  // Adicionar apenas os novos estados para modo manual
  const [ptaxMode, setPtaxMode] = useState('auto')
  const [ptaxManualValue, setPtaxManualValue] = useState('')

  // Adicionar a variável que estava faltando
  const [loadingPtax, setLoadingPtax] = useState(false)

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

  // CORREÇÃO 5: useEffect para reação automática
  useEffect(() => {
    if (!data.moeda || !ptaxDate || ptaxManual) return
    
    console.log(`🔄 Auto-fetch PTAX: ${data.moeda} para ${ptaxDate}`)
    
    // Verificar se é data futura
    if (isFutureDate(ptaxDate)) {
      console.log(`⚠️ Data futura detectada: ${ptaxDate}`)
      setPtaxMode('manual')
      setPtaxManualValue('')
      setPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      return
    }
    
    // Buscar PTAX automaticamente
    storeFetchPtaxRate(data.moeda, ptaxDate)
      .then((resultado) => {
        setPtax(resultado.cotacao)
        setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
        onChange({ ...data, ptax: resultado.cotacao })
        console.log(`✅ PTAX automático aplicado:`, resultado)
      })
      .catch((err) => {
        console.error('❌ Erro PTAX automático:', err)
        setPtax('')
        setPtaxInfo({ dataCotacao: '', fonte: '' })
        
        // Se for data futura, forçar modo manual
        if (isFutureDate(ptaxDate)) {
          setPtaxMode('manual')
          setPtaxManualValue('')
        }
      })
  }, [data.moeda, ptaxDate, ptaxManual, storeFetchPtaxRate, onChange])

  // Função para aplicar PTAX manual - ATUALIZADA
  const applyManualPtax = () => {
    const valor = parseFloat(ptaxManualValue.replace(',', '.'))
    if (!isNaN(valor) && valor > 0) {
      setPtax(valor)
      setPtaxInfo({ dataCotacao: ptaxDate, fonte: 'Manual' })
      setPtaxMode('manual')
      
      // Atualizar store
      updatePtaxManual(data.moeda, valor, ptaxDate)
      
      onChange({ ...data, ptax: valor })
      console.log('✅ PTAX manual aplicado:', valor)
      
      toast.success('PTAX manual aplicado com sucesso!')
    } else {
      alert('Por favor, insira um valor válido para o PTAX (ex: 5,50 ou 5.50)')
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
      
      const resultado = await storeFetchPtaxRate(data.moeda, ptaxDate)
      
      setPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxEditable(false)
      onChange({ ...data, ptax: resultado.cotacao })
      
      console.log(`✅ PTAX aplicado:`, resultado)
    } catch (err) {
      setPtax('')
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
      const resultado = await storeFetchPtaxRate(data.moeda, ptaxDate)
      setPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxManual(false) // volta ao modo automático
      onChange({ ...data, ptax: resultado.cotacao })
      console.log(`✅ PTAX manual aplicado:`, resultado)
    } catch (err) {
      setPtax('')
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
      const resultado = await storeFetchPtaxRate(data.moeda, dataEspecifica)
      setPtax(resultado.cotacao)
      setPtaxInfo({ dataCotacao: resultado.dataCotacao, fonte: resultado.fonte })
      setPtaxEditable(false)
      onChange({ ...data, ptax: resultado.cotacao })
      console.log(`✅ PTAX com data aplicado:`, resultado)
    } catch (err) {
      setPtax('')
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
      setPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      toast.info('Data futura selecionada. Use o modo manual para inserir PTAX.')
    } else if (ptaxMode === 'auto' && data.moeda) {
      // Se for data passada/atual e modo automático, buscar PTAX
      buscarCotacaoComData(newDate)
    }
  }

  // Adicionar função resetProcessamento que estava faltando
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

  // ... rest of existing code remains the same ...
}

export default EssenciaisTab 