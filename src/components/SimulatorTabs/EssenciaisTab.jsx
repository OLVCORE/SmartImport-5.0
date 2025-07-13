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
    const now = new Date()
    return now.toISOString().slice(0, 10) // yyyy-mm-dd
  })
  // Adicionar estado para fonte e data da cotação
  const [ptaxInfo, setPtaxInfo] = useState({ dataCotacao: '', fonte: '' })
  // Estado para controlar se o usuário editou manualmente
  const [ptaxManual, setPtaxManual] = useState(false)
  const [ptaxEditable, setPtaxEditable] = useState(false)
  const [showPTAXPanel, setShowPTAXPanel] = useState(false)

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

  // Filtrar zonas aduaneiras por UF e modal
  const zonasFiltradas = aduanas.filter(a =>
    (!uf || a.uf === uf) &&
    (!data.modal || (data.modal === 'maritimo' && a.tipo === 'porto') ||
     (data.modal === 'aereo' && a.tipo === 'aeroporto') ||
     (data.modal === 'rodoviario' && (a.tipo === 'fronteira' || a.tipo === 'ead')) ||
     (data.modal === 'ferroviario' && (a.tipo === 'fronteira' || a.tipo === 'ead'))) &&
    (!buscaZona || (
      a.nome.toLowerCase().includes(buscaZona.toLowerCase()) ||
      a.cidade.toLowerCase().includes(buscaZona.toLowerCase()) ||
      a.codigo.toLowerCase().includes(buscaZona.toLowerCase())
    ))
  )

  // Filtrar países para autocomplete
  const paisesFiltrados = paises.filter(p =>
    p.nome.toLowerCase().includes(buscaPais.toLowerCase()) ||
    p.sigla.toLowerCase().includes(buscaPais.toLowerCase())
  ).slice(0, 10)

  // Validar se todos os campos essenciais estão preenchidos
  const isValid = data.paisOrigem && data.ufDesembaraco && data.ufDestino && 
    data.modal && data.moeda && data.zonaAduaneira && produtos.length > 0 &&
    produtos.every(p => p.descricao && p.descricao.trim() !== '' && p.ncm && /^\d{8}$/.test(p.ncm)) &&
    data.valorFob && parseFloat(data.valorFob) > 0 &&
    data.frete !== undefined && data.seguro !== undefined &&
    ptax && parseFloat(ptax) > 0

  // Debug para validação
  const debugValidation = () => {
    console.log('Debug Validação:', {
      paisOrigem: data.paisOrigem,
      ufDesembaraco: data.ufDesembaraco,
      ufDestino: data.ufDestino,
      modal: data.modal,
      moeda: data.moeda,
      zonaAduaneira: data.zonaAduaneira,
      produtosLength: produtos.length,
      isValid: isValid
    })
  }

  // Função para selecionar zona aduaneira
  const selecionarZonaAduaneira = (zona) => {
    console.log('Selecionando zona:', zona)
    onChange({ ...data, zonaAduaneira: zona.codigo })
    setBuscaZona(zona.nome) // Atualizar o campo de busca com o nome selecionado
  }

  // Adicionar novo produto
  const adicionarProduto = () => {
    const novoProduto = {
      id: Date.now(),
      descricao: '',
      ncm: '',
      quantidade: 1,
      valorUnitario: 0
    }
    const novosProdutos = [...produtos, novoProduto]
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Atualizar produto
  const atualizarProduto = async (id, campo, valor) => {
    console.log('🔄 EssenciaisTab - atualizarProduto chamado:', { id, campo, valor })
    
    let novosProdutos = produtos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    )
    
    // Se o campo alterado for NCM e for válido (8 dígitos), consultar TTCE
    if (campo === 'ncm' && typeof valor === 'string') {
      // Aceitar NCM com pontos, hífens ou apenas números
      const ncmClean = valor.replace(/[.\-\s]/g, '') // Remove pontos, hífens e espaços
      const ncmDigits = ncmClean.replace(/\D/g, '') // Remove tudo que não é dígito
      console.log('🔍 EssenciaisTab - Verificando NCM:', { 
        valor, 
        ncmClean, 
        ncmDigits, 
        length: ncmDigits.length,
        isNumeric: /^\d+$/.test(ncmDigits)
      })
      
      if (ncmDigits.length === 8 && /^\d+$/.test(ncmDigits)) {
        console.log('✅ EssenciaisTab - NCM válido (8 dígitos), consultando TTCE...')
        const produto = novosProdutos.find(p => p.id === id)
        if (produto) {
          // Marcar como consultando TTCE
          novosProdutos = novosProdutos.map(p =>
            p.id === id ? { ...p, consultandoTTCE: true } : p
          )
          setProdutos(novosProdutos)
          onChange({ ...data, produtos: novosProdutos })
          
          try {
            console.log('📡 EssenciaisTab - Chamando TTCE com parâmetros:', {
              ncm: ncmDigits,
              codigoPais: data.paisOrigem || '105',
              dataFatoGerador: new Date().toISOString().slice(0, 10),
              tipoOperacao: 'I'
            })
            
            // Chamar TTCE com NCM, país, data e tipo de operação
            const ttceData = await aiService.consultarTTCEViaBackend({
              ncm: ncmDigits,
              codigoPais: data.paisOrigem || '105',
              dataFatoGerador: new Date().toISOString().slice(0, 10),
              tipoOperacao: 'I'
            })
            
            console.log('📋 EssenciaisTab - Resposta TTCE:', ttceData)
            
            // Atualizar produto com dados TTCE e descrição oficial
            novosProdutos = novosProdutos.map(p =>
              p.id === id ? { 
                ...p, 
                ttceData, 
                descricao: ttceData.descricaoOficial || p.descricao, 
                ncmReadOnly: true, 
                descricaoReadOnly: true, 
                consultandoTTCE: false 
              } : p
            )
            // Mostrar mensagem de sucesso
            console.log('✅ EssenciaisTab - NCM validado no TTCE:', ttceData.descricaoOficial)
            if (ttceData.isSimulated) {
              toast.success(`NCM ${ncmDigits} processado com dados simulados. ${ttceData.descricaoOficial}`)
            } else {
              toast.success(`NCM ${ncmDigits} validado no TTCE! ${ttceData.descricaoOficial}`)
            }
          } catch (err) {
            console.error('❌ EssenciaisTab - Erro ao consultar TTCE:', err)
            // Se TTCE falhar, não bloquear o fluxo
            toast.error('⚠️ Erro ao consultar TTCE. NCM será aceito, mas valide com um despachante.')
            // Remover marcação de consultando
            novosProdutos = novosProdutos.map(p =>
              p.id === id ? { ...p, consultandoTTCE: false } : p
            )
          }
        }
      } else if (ncmDigits.length > 0 && ncmDigits.length !== 8) {
        console.log('❌ EssenciaisTab - NCM inválido:', { ncmDigits, length: ncmDigits.length })
        toast.error('❌ NCM deve ter exatamente 8 dígitos numéricos')
        return
      } else {
        console.log('ℹ️ EssenciaisTab - NCM ainda não tem 8 dígitos:', { ncmDigits, length: ncmDigits.length })
      }
    }
    
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Remover produto
  const removerProduto = (id) => {
    const novosProdutos = produtos.filter(p => p.id !== id)
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
  }

  // Função para resetar todos os estados de loading/processamento
  const resetProcessamento = () => {
    setLimiteAtingido(false); // Resetar limite ao resetar
    setProcessingDocument(false);
    setProgressState({
      stage: 'idle',
      currentChunk: 0,
      totalChunks: 0,
      productsFound: 0,
      documentSize: 0,
      message: ''
    });
    setDocumentText('');
    setLargeDocAlert(false);
    setProcessamentoResumo(null);
    setUploadFile(null);
    setIaInvoked(false); // Resetar flag de ação do usuário
  };

  // Limitar processamento inicial a 10 páginas ou 20.000 caracteres na extração de texto do PDF
  const processarDocumentoReal = async (file) => {
    if (!iaInvoked) return; // Só processa IA após ação do usuário
    setProcessingDocument(true);
    setProcessamentoResumo(null);
    setLargeDocAlert(false);
    let resultado = null;
    let isLargeDocument = false;
    
    try {
      // Verificar se é um documento grande (> 5MB)
      isLargeDocument = file.size > 5 * 1024 * 1024;
      setLargeDocAlert(isLargeDocument);
      
      if (isLargeDocument) {
        setProgressState(prev => ({
          ...prev,
          stage: 'extracting',
          message: 'Processando documento grande localmente (sem custo de IA)...'
        }));
        
        // Usar processamento local completo para documentos grandes
        resultado = await aiService.processLargeDocumentLocally(file, (progress) => {
          setProgressState(progress);
        });
        
        setProcessamentoResumo(resultado);
        
        // Adicionar produtos extraídos à lista
        if (resultado && resultado.products && resultado.products.length > 0) {
          const novosProdutos = resultado.products.map((produto, index) => ({
            id: Date.now() + index,
            descricao: produto.descricao || 'Produto extraído',
            ncm: produto.ncm || '',
            quantidade: produto.quantidade || 1,
            valorUnitario: produto.valorUnitario || 0,
            especificacoes: produto.especificacoes || {},
            observacoes: produto.observacoes || '',
            origem: produto.origem || 'extração local'
          }));
          
          setProdutos(prev => [...prev, ...novosProdutos]);
          onChange({ ...data, produtos: [...produtos, ...novosProdutos] });
          
          toast.success(`${novosProdutos.length} produtos extraídos localmente. Documento grande processado sem custo de IA.`);
        } else {
          if (iaInvoked) toast.error('Nenhum produto encontrado no documento');
        }
        
        return;
      }
      
      // Processamento normal para documentos menores
      setProgressState(prev => ({ ...prev, stage: 'extracting', message: 'Extraindo texto do documento...' }));
      
      // Extrair texto do documento
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      let charsCount = 0;
      let pageLimit = Math.min(pdf.numPages, MAX_PAGES);
      
      for (let i = 1; i <= pageLimit; i++) {
        setProgressState(prev => ({ ...prev, currentChunk: i, totalChunks: pageLimit }));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        
        if (charsCount + pageText.length > MAX_CHARS) {
          fullText += pageText.slice(0, MAX_CHARS - charsCount);
          break;
        } else {
          fullText += pageText + '\n';
          charsCount += pageText.length;
        }
      }
      
      setDocumentText(fullText);
      
      setProgressState(prev => ({
        ...prev,
        stage: 'analyzing',
        message: 'Processando documento...'
      }));
      
      // Usar sistema híbrido (local + IA) passando o arquivo
      resultado = await aiService.analyzeDocumentComplete(fullText, (progress) => {
        setProgressState(progress);
      }, user, file);
      
      setProcessamentoResumo(resultado);
      
      // Adicionar produtos extraídos à lista
      if (resultado && resultado.products && resultado.products.length > 0) {
        const novosProdutos = resultado.products.map((produto, index) => ({
          id: Date.now() + index,
          descricao: produto.descricao || 'Produto extraído',
          ncm: produto.ncm || '',
          quantidade: produto.quantidade || 1,
          valorUnitario: produto.valorUnitario || 0,
          especificacoes: produto.especificacoes || {},
          observacoes: produto.observacoes || '',
          origem: produto.origem || 'IA'
        }));
        
        setProdutos(prev => [...prev, ...novosProdutos]);
        onChange({ ...data, produtos: [...produtos, ...novosProdutos] });
        
        // Mostrar feedback do método usado
        const methodMessages = {
          'local_extraction': 'Produtos extraídos via análise local (sem custo de IA)',
          'ai_hybrid': 'Produtos extraídos via IA híbrida (otimizada para custo)',
          'local_fallback': 'Produtos extraídos via análise local (IA indisponível)',
          'local_large_document': 'Documento grande processado localmente (sem custo de IA)'
        };
        
        toast.success(`${novosProdutos.length} produtos adicionados. ${methodMessages[resultado.method] || ''}`);
      } else {
        if (iaInvoked) toast.error('Nenhum produto encontrado no documento');
      }
      
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      
      if (error.message.includes('Limite de uso atingido')) {
        if (iaInvoked) toast.error('Limite de uso de IA atingido. Faça upgrade para continuar.');
        setLimiteAtingido(true);
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        if (iaInvoked) {
          toast.error('Limite de requisições da IA atingido. Usando processamento local como fallback...');
          
          // FALLBACK: Usar processamento local quando IA falha
          try {
            setProgressState(prev => ({
              ...prev,
              stage: 'analyzing',
              message: 'IA indisponível. Processando localmente...'
            }));
            
            // Extrair produtos localmente do texto do documento
            let textoParaAnalise = documentText;
            if (!textoParaAnalise && uploadFile) {
              // Se não temos texto extraído, tentar extrair novamente
              try {
                const arrayBuffer = await uploadFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                let pageLimit = Math.min(pdf.numPages, 5); // Limitar a 5 páginas para fallback
                
                for (let i = 1; i <= pageLimit; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  const pageText = textContent.items.map(item => item.str).join(' ');
                  fullText += pageText + '\n';
                }
                textoParaAnalise = fullText;
              } catch (extractError) {
                console.error('Erro ao extrair texto para fallback:', extractError);
                textoParaAnalise = 'Documento carregado - análise local ativada';
              }
            }
            
            // Extrair produtos usando método local robusto
            const produtosLocais = aiService.extractProductsLocal(textoParaAnalise);
            
            // Se não encontrou produtos, criar um produto genérico
            let novosProdutos = [];
            if (produtosLocais.length > 0) {
              novosProdutos = produtosLocais.map((produto, index) => ({
                id: Date.now() + index,
                descricao: produto.descricao || 'Produto extraído do documento',
                ncm: produto.ncm || '',
                quantidade: produto.quantidade || 1,
                valorUnitario: produto.valorUnitario || 0,
                especificacoes: produto.especificacoes || {},
                observacoes: produto.observacoes || '',
                origem: 'extração local (IA indisponível)'
              }));
            } else {
              // Criar produto genérico se não encontrou nada
              novosProdutos = [{
                id: Date.now(),
                descricao: `Produto do documento: ${uploadFile.name}`,
                ncm: '',
                quantidade: 1,
                valorUnitario: 0,
                especificacoes: {},
                observacoes: 'Produto extraído via processamento local (IA indisponível)',
                origem: 'extração local (IA indisponível)'
              }];
            }
            
            if (novosProdutos.length > 0) {
              setProdutos(prev => [...prev, ...novosProdutos]);
              onChange({ ...data, produtos: [...produtos, ...novosProdutos] });
              toast.success(`${novosProdutos.length} produtos extraídos localmente. IA indisponível, mas processamento local funcionou.`);
            } else {
              toast.error('Nenhum produto encontrado. Tente novamente em alguns minutos.');
            }
          } catch (fallbackError) {
            console.error('Erro no fallback local:', fallbackError);
            toast.error('Erro no processamento. Tente novamente em alguns minutos.');
          }
        }
      } else {
        if (iaInvoked) toast.error(`Erro ao processar documento: ${error.message}`);
      }
    
      setProcessingDocument(false);
      setProgressState({
        stage: 'idle',
        currentChunk: 0,
        totalChunks: 0,
        productsFound: 0,
        documentSize: 0,
        message: ''
      });
    }
  };

  // Sugestão real de NCM por IA
  const handleNcmSuggest = async (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId)
    if (!produto || produto.descricao.length < 50) {
      toast.error('Descrição deve ter pelo menos 50 caracteres para sugestão de NCM')
      return
    }

    toast.loading('Analisando produto com IA...', { id: `ncm-suggest-${produtoId}` })

    try {
      const resultado = await aiService.suggestNCMByDescription(produto.descricao, produto.especificacoes || {})
      
      if (resultado.sugestoes && resultado.sugestoes.length > 0) {
        const novosProdutos = produtos.map(p => 
          p.id === produtoId ? { 
            ...p, 
            ncm: resultado.sugestoes[0].ncm,
            ncmSugestoes: resultado.sugestoes,
            ncmInformacoesAdicionais: resultado.informacoesAdicionais
          } : p
        )
        setProdutos(novosProdutos)
        onChange({ ...data, produtos: novosProdutos })
        
        toast.success(`NCM sugerido: ${resultado.sugestoes[0].ncm}`, { id: `ncm-suggest-${produtoId}` })
      } else {
        toast.error('Não foi possível sugerir NCM para este produto', { id: `ncm-suggest-${produtoId}` })
      }
    } catch (error) {
      console.error('Erro na sugestão de NCM:', error)
      toast.error('Erro ao sugerir NCM. Tente novamente.', { id: `ncm-suggest-${produtoId}` })
    }
  }

  // Análise real de texto específico via IA
  const analisarTextoIA = async (produtoId, texto) => {
    if (!texto || texto.length < 50) {
      toast.error('Texto deve ter pelo menos 50 caracteres para análise da IA')
      return
    }

    toast.loading('Analisando texto com IA...', { id: `text-analysis-${produtoId}` })

    try {
      const resultado = await aiService.analyzeSpecificText(texto)
      
      const novosProdutos = produtos.map(p => 
        p.id === produtoId ? { 
          ...p, 
          ncm: resultado.ncm,
          descricao: resultado.descricao || p.descricao
        } : p
      )
      setProdutos(novosProdutos)
      onChange({ ...data, produtos: novosProdutos })
      
      toast.success(`NCM sugerido: ${resultado.ncm}`, { id: `text-analysis-${produtoId}` })
    } catch (error) {
      console.error('Erro na análise de texto:', error)
      toast.error('Erro ao analisar texto. Tente novamente.', { id: `text-analysis-${produtoId}` })
    }
  }

  // Abrir modal de refino de NCM
  const abrirModalRefinamento = (produtoId) => {
    setSelectedProductForRefinement(produtoId)
    setShowRefinementModal(true)
  }

  // Aplicar NCM refinado
  const aplicarNCMRefinado = (ncmFinal, resultado) => {
    const novosProdutos = produtos.map(p => 
      p.id === selectedProductForRefinement ? { 
        ...p, 
        ncm: ncmFinal,
        ncmRefinamento: resultado
      } : p
    )
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
    toast.success(`NCM refinado aplicado: ${ncmFinal}`)
  }

  // Configuração do dropzone para upload de documentos
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadFile(acceptedFiles[0])
        setLimiteAtingido(false); // Resetar limite ao novo upload
        setIaInvoked(false); // Resetar flag de ação do usuário
        setDocumentText('');
        setProdutos([]);
        setProcessamentoResumo(null);
        setLargeDocAlert(false);
        setProgressState({
          stage: 'idle',
          currentChunk: 0,
          totalChunks: 0,
          productsFound: 0,
          documentSize: 0,
          message: ''
        });
      }
    }
  })

  // Abrir modal de IA para produto específico
  const abrirModalIA = (produtoId) => {
    setSelectedProductForIA(produtoId)
    setShowIAModal(true)
    setIaTextInput('')
  }

  // Análise de documento completo via IA
  const analisarDocumentoCompleto = async () => {
    if (!uploadFile) {
      alert('Selecione um documento primeiro')
      return
    }

    // Simular análise completa do documento
    const produtosExtraidos = [
      {
        id: Date.now(),
        descricao: 'Smartphone Samsung Galaxy S23 - Análise completa do documento',
        ncm: '8517.12.00',
        quantidade: 100,
        valorUnitario: 2500
      },
      {
        id: Date.now() + 1,
        descricao: 'Carregador USB-C - Análise completa do documento',
        ncm: '8504.40.00',
        quantidade: 200,
        valorUnitario: 50
      },
      {
        id: Date.now() + 2,
        descricao: 'Cabo de Dados - Análise completa do documento',
        ncm: '8544.42.00',
        quantidade: 300,
        valorUnitario: 25
      }
    ]

    setProdutos(produtosExtraidos)
    onChange({ ...data, produtos: produtosExtraidos })
    setShowIAModal(false)
  }

  // Análise de texto específico via IA
  const analisarTextoEspecifico = async () => {
    if (!iaTextInput || iaTextInput.length < 50) {
      alert('Texto deve ter pelo menos 50 caracteres')
      return
    }

    if (!selectedProductForIA) return

    // Simular análise de texto específico
    const sugestoes = [
      '8517.12.00',
      '8471.30.12',
      '8528.72.00',
    ]
    
    const novosProdutos = produtos.map(p => 
      p.id === selectedProductForIA ? { ...p, ncm: sugestoes[0] } : p
    )
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
    setShowIAModal(false)
  }

  // Sugestão baseada na descrição do produto
  const sugestaoBaseadaDescricao = async () => {
    if (!selectedProductForIA) return

    const produto = produtos.find(p => p.id === selectedProductForIA)
    if (!produto || produto.descricao.length < 50) {
      alert('Descrição deve ter pelo menos 50 caracteres')
      return
    }

    // Simular sugestão baseada na descrição
    const sugestoes = [
      '8517.12.00',
      '8471.30.12',
      '8528.72.00',
    ]
    
    const novosProdutos = produtos.map(p => 
      p.id === selectedProductForIA ? { ...p, ncm: sugestoes[0] } : p
    )
    setProdutos(novosProdutos)
    onChange({ ...data, produtos: novosProdutos })
    setShowIAModal(false)
  }

  // Funções para controlar o modal de detalhes dos produtos
  const abrirModalDetalhesProdutos = () => {
    setShowProductDetailsModal(true)
  }

  const fecharModalDetalhesProdutos = () => {
    setShowProductDetailsModal(false)
  }

  const salvarProdutosDetalhados = (produtosAtualizados) => {
    setProdutos(produtosAtualizados)
    onChange({ ...data, produtos: produtosAtualizados })
    toast.success('Produtos atualizados com sucesso!')
  }

  const analisarNCMProdutoDetalhado = (produto) => {
    setSelectedProductForDetails(produto)
    // Aqui você pode abrir o modal de análise de NCM ou fazer a análise diretamente
    handleNcmSuggest(produto.id)
  }

  // Exibir saldo/limite no UI
  const renderUsageInfo = () => {
    if (!user) return null
    
    const tokensUsed = user.tokensUsed || 0
    const tokenLimit = user.tokenLimit || 100000
    const usagePercentage = (tokensUsed / tokenLimit) * 100
    const isNearLimit = usagePercentage > 80
    const isAtLimit = usagePercentage >= 100
    
    return (
      <div className={`p-3 rounded-lg mb-4 ${isAtLimit ? 'bg-red-50 border border-red-200' : isNearLimit ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${isAtLimit ? 'text-red-800' : isNearLimit ? 'text-yellow-800' : 'text-blue-800'}`}>
              Uso de IA
            </h4>
            <p className={`text-sm ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'}`}>
              {tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} tokens
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'}`}>
              {usagePercentage.toFixed(1)}%
            </div>
            {isAtLimit && (
              <p className="text-xs text-red-600">Limite atingido</p>
            )}
            {isNearLimit && !isAtLimit && (
              <p className="text-xs text-yellow-600">Próximo do limite</p>
            )}
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        {user.premium && (
          <p className="text-xs text-green-600 mt-1">✓ Plano Premium - Sem limites</p>
        )}
      </div>
    )
  }

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  // TEMPORÁRIO: Permitir uso premium no desenvolvimento
  const isPremium = true; // user?.premium || true;

  // Função premium: analisar com IA (GPT-4, múltiplos NCMs, assertividade)
  const handleAnalisarComIA = async () => {
    // TEMPORÁRIO: Sem verificação de premium no desenvolvimento
    // if (!isPremium) {
    //   setShowUpgradeModal(true);
    //   return;
    // }
    
    if (!uploadFile) {
      toast.error('Selecione um documento primeiro');
      return;
    }
    
    setIaInvoked(true);
    await processarDocumentoReal(uploadFile);
  };

  // Função premium: visualizar documento original
  const handleVisualizarDocumento = () => {
    // TEMPORÁRIO: Sem verificação de premium no desenvolvimento
    // if (!isPremium) {
    //   setShowUpgradeModal(true);
    //   return;
    // }
    
    if (!uploadFile) {
      toast.error('Selecione um documento primeiro');
      return;
    }
    
    setShowDocModal(true);
  };

  // Agrupar aduanas por tipo para exibição separada
  const zonasPrimarias = zonasFiltradas.filter(z => ['porto', 'aeroporto', 'fronteira'].includes(z.tipo))
  const zonasEADI = zonasFiltradas.filter(z => z.tipo === 'ead')

  // Mapeamento de elegibilidade de modais por país
  const getModaisElegiveis = (paisOrigem) => {
    if (!paisOrigem) return modais
    const pais = paisOrigem.toLowerCase()
    // Lista de países latinos elegíveis para rodoviário/ferroviário
    const paisesLatinos = [
      'argentina', 'paraguai', 'uruguai', 'bolivia', 'chile', 'peru', 'colombia', 'venezuela', 'suriname', 'guiana', 'guiana francesa',
      'brasil', 'ecuador', 'guatemala', 'honduras', 'mexico', 'nicaragua', 'panama', 'costa rica', 'el salvador', 'cuba', 'haiti', 'república dominicana', 'porto rico', 'belize', 'guiana', 'trinidad', 'barbados', 'jamaica', 'bahamas', 'dominica', 'granada', 'santa lucia', 'são vicente', 'antigua', 'são cristóvão', 'suriname'
    ]
    const isLatino = paisesLatinos.some(p => pais.includes(p))
    if (isLatino) {
      // Todos os modais habilitados
      return modais.map(m => ({ ...m, disabled: false }))
    }
    // Default: só marítimo e aéreo habilitados
    return modais.map(m => ({ ...m, disabled: m.value === 'rodoviario' || m.value === 'ferroviario' }))
  }

  // Função para selecionar moeda do painel PTAX
  const handleCurrencySelect = (currencyCode, cotacao) => {
    onChange({ ...data, moeda: currencyCode, ptax: cotacao })
    setPtax(cotacao)
    setPtaxInfo({ dataCotacao: ptaxData[currencyCode]?.dataCotacao, fonte: 'PTAX Banco Central' })
    setShowPTAXPanel(false)
  }

  // Função para buscar cotação PTAX
  const buscarCotacao = async () => {
    if (!data.moeda || !ptaxDate) return
    const [yyyy, mm, dd] = ptaxDate.split('-')
    const dataParam = `${mm}-${dd}-${yyyy}`
    try {
      const { cotacao, dataCotacao, fonte } = await fetchPTAXRate(data.moeda, dataParam)
      setPtax(cotacao)
      setPtaxInfo({ dataCotacao, fonte })
      setPtaxEditable(false) // Torna read-only após buscar
      onChange({ ...data, ptax: cotacao })
    } catch (err) {
      setPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      alert('Erro ao buscar PTAX do Banco Central. Verifique sua conexão ou tente novamente mais tarde.')
      console.error('Erro ao buscar PTAX:', err)
    }
  }

  // Buscar PTAX do dia automaticamente ao selecionar moeda ou ao abrir a tela
  useEffect(() => {
    if (!data.moeda || !ptaxDate || ptaxManual) return
    const [yyyy, mm, dd] = ptaxDate.split('-')
    const dataParam = `${mm}-${dd}-${yyyy}`
    fetchPTAXRate(data.moeda, dataParam)
      .then(({ cotacao, dataCotacao, fonte }) => {
        setPtax(cotacao)
        setPtaxInfo({ dataCotacao, fonte })
        onChange({ ...data, ptax: cotacao })
      })
      .catch((err) => {
        setPtax('')
        setPtaxInfo({ dataCotacao: '', fonte: '' })
        alert('Erro ao buscar PTAX do Banco Central. Verifique sua conexão ou tente novamente mais tarde.')
        console.error('Erro ao buscar PTAX:', err)
      })
  }, [data.moeda, ptaxDate, ptaxManual])

  // Função para buscar cotação manualmente (botão)
  const buscarCotacaoManual = async () => {
    if (!data.moeda || !ptaxDate) return
    const [yyyy, mm, dd] = ptaxDate.split('-')
    const dataParam = `${mm}-${dd}-${yyyy}`
    try {
      const { cotacao, dataCotacao, fonte } = await fetchPTAXRate(data.moeda, dataParam)
      setPtax(cotacao)
      setPtaxInfo({ dataCotacao, fonte })
      setPtaxManual(false) // volta ao modo automático
      onChange({ ...data, ptax: cotacao })
    } catch (err) {
      setPtax('')
      setPtaxInfo({ dataCotacao: '', fonte: '' })
      alert('Erro ao buscar PTAX do Banco Central. Verifique sua conexão ou tente novamente mais tarde.')
      console.error('Erro ao buscar PTAX:', err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Dados Essenciais</h2>
      
      {/* Alerta sobre NCMs */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Atenção: Classificação de NCMs
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Os NCMs sugeridos são apenas orientações. A classificação final deve ser validada por um despachante aduaneiro habilitado. Em caso de dúvida, consulte sempre um profissional especializado.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de limite atingido */}
      {limiteAtingido && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Limite de uso de IA atingido
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Você atingiu o limite de tokens para este mês. Faça upgrade para continuar usando a IA.
              </p>
              <div className="mt-3 flex space-x-3">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                    // TODO: Implementar upgrade de plano
                    toast.info('Funcionalidade de upgrade em desenvolvimento');
                  }}
                >
                  Fazer Upgrade
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => setLimiteAtingido(false)}
                >
                  Continuar sem IA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de documento grande */}
      {largeDocAlert && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                📄 Documento Grande Detectado
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Este documento será processado localmente, sem custo de IA. A extração será feita usando filtros específicos para o tipo de documento identificado.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <p>✅ Sem limite de tamanho</p>
                <p>✅ Processamento local gratuito</p>
                <p>✅ IA usada apenas para classificação NCM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {iaInvoked && renderUsageInfo()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="space-y-4">
          {/* País de Origem com Autocomplete */}
          <div className="relative">
            <Tooltip content="País de onde a mercadoria será embarcada e exportada para o Brasil">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                País de Origem
              </label>
            </Tooltip>
            <input 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={buscaPais}
              onChange={e => {
                setBuscaPais(e.target.value)
                setShowPaisDropdown(true)
                if (!e.target.value) {
                  onChange({ ...data, paisOrigem: '' })
                }
              }}
              onFocus={() => setShowPaisDropdown(true)}
              placeholder="Digite o nome ou sigla do país..."
            />
            {showPaisDropdown && buscaPais && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {paisesFiltrados.map(pais => (
                  <button
                    key={pais.codigo}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setBuscaPais(`${pais.nome} (${pais.sigla})`)
                      onChange({ ...data, paisOrigem: pais.nome })
                      setShowPaisDropdown(false)
                    }}
                  >
                    <span className="font-medium">{pais.nome}</span>
                    <span className="ml-2 text-gray-500">({pais.sigla})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* UF de Desembaraço */}
          <div>
            <Tooltip content="Estado brasileiro onde será realizado o desembaraço aduaneiro da mercadoria">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                UF de Desembaraço
              </label>
            </Tooltip>
            <select 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.ufDesembaraco || ''} 
              onChange={e => { 
                setUf(e.target.value)
                onChange({ ...data, ufDesembaraco: e.target.value }) 
              }}
            >
              <option value="">Selecione a UF</option>
              {estados.map(estado => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.sigla} ({estado.nome})
                </option>
              ))}
            </select>
          </div>

          {/* UF de Destino */}
          <div>
            <Tooltip content="Estado brasileiro de destino final da mercadoria após o desembaraço">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                UF de Destino Final
              </label>
            </Tooltip>
            <select 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.ufDestino || ''} 
              onChange={e => { 
                setUfDestino(e.target.value)
                onChange({ ...data, ufDestino: e.target.value }) 
              }}
            >
              <option value="">Selecione a UF</option>
              {estados.map(estado => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.sigla} ({estado.nome})
                </option>
              ))}
            </select>
          </div>

          {/* Modal */}
          <div>
            <Tooltip content="Modal de transporte predominante utilizado na importação">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Modal Principal
              </label>
            </Tooltip>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.modal || ''}
              onChange={e => onChange({ ...data, modal: e.target.value })}
            >
              <option value="">Selecione o modal...</option>
              {getModaisElegiveis(data.paisOrigem).map(m => (
                <option key={m.value} value={m.value} disabled={m.disabled} style={m.disabled ? { color: '#bbb', background: '#f3f4f6' } : {}}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Moeda */}
          <div>
            <Tooltip content="Moeda principal utilizada na negociação da importação">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Moeda
              </label>
            </Tooltip>
            <select 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.moeda || ''} 
              onChange={e => onChange({ ...data, moeda: e.target.value })}
            >
              <option value="">Selecione</option>
              {moedas.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            {/* Bloco de PTAX logo abaixo da seleção de moeda */}
            <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-col mt-2 w-full">
                <label className="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Cotação PTAX</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={ptax}
                    onChange={e => {
                      setPtax(e.target.value)
                      onChange({ ...data, ptax: e.target.value })
                    }}
                    placeholder="Ex: 5.15"
                    required
                    readOnly={!ptaxEditable}
                  />
                  <button
                    type="button"
                    className="ml-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 text-xs"
                    onClick={() => setPtaxEditable(true)}
                    title="Permitir edição manual da cotação PTAX"
                    disabled={ptaxEditable}
                  >Editar</button>
                </div>
                <span className="text-xs text-blue-500">
                  (PTAX do Banco Central - {ptaxEditable ? 'editável' : 'automática'})
                  {ptaxInfo.dataCotacao && (
                    <> | Fonte: {ptaxInfo.fonte} | Data: {ptaxInfo.dataCotacao.split('-').reverse().join('/')}</>
                  )}
                </span>
              </div>
              {/* Campo de seleção de data e botão buscar cotação */}
              <div className="flex flex-col md:flex-row md:items-end items-stretch gap-2 mt-2 w-full">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Data da cotação:</label>
                  <input
                    type="date"
                    className="w-full px-2 py-1 border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-blue-900 dark:text-white"
                    value={ptaxDate}
                    onChange={e => setPtaxDate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <button
                  type="button"
                  className="h-10 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-xs transition-all duration-150 min-w-[120px] self-end md:self-auto"
                  onClick={buscarCotacao}
                  title="Buscar cotação PTAX do Banco Central para a data selecionada"
                >Buscar Cotação</button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          {/* Zona Aduaneira */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Zona Aduaneira
              <span className="ml-1 text-gray-400 cursor-help" title="Selecione o local de desembaraço (Porto, Aeroporto, Fronteira ou EADI)">ⓘ</span>
            </label>
            {/* Indicador de zona selecionada */}
            {data.zonaAduaneira && (
              <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Zona Selecionada: {zonasFiltradas.find(z => z.codigo === data.zonaAduaneira)?.nome || data.zonaAduaneira}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onChange({ ...data, zonaAduaneira: '' })
                      setBuscaZona('')
                    }}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕ Limpar
                  </button>
                </div>
              </div>
            )}
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              type="text"
              placeholder={data.zonaAduaneira ? "Zona selecionada - digite para buscar outras..." : "Buscar por nome, cidade, UF ou código..."}
              value={buscaZona}
              onChange={e => setBuscaZona(e.target.value)}
              disabled={!uf || !data.modal}
            />
            <div className="space-y-2 max-h-56 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800">
              {/* Zonas Primárias */}
              <div>
                <div className="font-bold text-xs text-blue-700 dark:text-blue-300 mb-1 mt-2">Zona Primária (Portos, Aeroportos, Fronteiras)</div>
                {zonasPrimarias.length === 0 && <div className="text-xs text-gray-400">Nenhum encontrado</div>}
                {zonasPrimarias.map(z => (
                  <button
                    key={z.codigo}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition flex items-center gap-2 ${data.zonaAduaneira === z.codigo ? 'bg-blue-100 dark:bg-blue-800 font-semibold border-2 border-blue-500' : ''}`}
                    disabled={!uf || !data.modal}
                    onClick={() => selecionarZonaAduaneira(z)}
                    title={`Nome: ${z.nome}\nTipo: ${z.tipo}\nCidade: ${z.cidade}\nUF: ${z.uf}\nStatus: ${z.status}\n${z.observacoes ? 'Obs: ' + z.observacoes : ''}${z.parceiro ? '\nParceiro SmartImport' : ''}`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${z.tipo === 'porto' ? 'bg-blue-500' : z.tipo === 'aeroporto' ? 'bg-purple-500' : 'bg-yellow-500'}`}></span>
                    <span>{z.nome}</span>
                    <span className="ml-auto text-xs text-gray-500">{z.cidade} - {z.uf}</span>
                    {z.parceiro && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Parceiro</span>}
                    {data.zonaAduaneira === z.codigo && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">✓ Selecionado</span>
                    )}
                  </button>
                ))}
              </div>
              {/* EADIs */}
              <div>
                <div className="font-bold text-xs text-pink-700 dark:text-pink-300 mb-1 mt-2">EADI (Estações Aduaneiras do Interior)</div>
                {zonasEADI.length === 0 && <div className="text-xs text-gray-400">Nenhum EADI encontrado</div>}
                {zonasEADI.map(z => (
                  <button
                    key={z.codigo}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-pink-50 dark:hover:bg-pink-900 transition flex items-center gap-2 ${data.zonaAduaneira === z.codigo ? 'bg-pink-100 dark:bg-pink-800 font-semibold border-2 border-pink-500' : ''}`}
                    disabled={!uf || !data.modal}
                    onClick={() => selecionarZonaAduaneira(z)}
                    title={`Nome: ${z.nome}\nTipo: EADI (Estação Aduaneira do Interior)\nCidade: ${z.cidade}\nUF: ${z.uf}\nStatus: ${z.status}\n${z.observacoes ? 'Obs: ' + z.observacoes : ''}${z.parceiro ? '\nParceiro SmartImport' : ''}`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-2 bg-pink-500"></span>
                    <span>{z.nome}</span>
                    <span className="ml-auto text-xs text-gray-500">{z.cidade} - {z.uf}</span>
                    {z.parceiro && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Parceiro</span>}
                    {data.zonaAduaneira === z.codigo && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded">✓ Selecionado</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {(!uf || !data.modal) && <div className="text-xs text-yellow-600 mt-2">Selecione a UF e o modal para habilitar a escolha.</div>}
          </div>

          {/* Upload de Documento - Destaque */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🚀 Upload Inteligente
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    IA extrai produtos automaticamente
                  </p>
                </div>
              </div>
              <div className="text-xs text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full font-medium shadow-sm">
                ✨ Gratuito
              </div>
            </div>
            
            <div className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✓</span>
                <span>IA extrai produtos automaticamente</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✓</span>
                <span>Sugere códigos NCM com precisão</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Processamento local sem custo</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Suporta: PDF, Imagem, Excel, Word, TXT
              </p>
            </div>
                
            {/* Dropzone */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-gray-600 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {showProgress ? (
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-600 font-medium">Processando documento com IA...</span>
                    </div>
                    <p className="text-sm text-gray-500">Extraindo produtos e classificando NCMs...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {isDragActive ? 'Solte o arquivo aqui' : 'Clique para selecionar ou arraste um arquivo'}
                    </p>
                    <p className="text-sm mb-2">PDF, Imagem, Excel, Word, TXT (máx. 10MB)</p>
                    <p className="text-xs text-blue-600">
                      ✨ IA irá extrair produtos e sugerir NCMs automaticamente
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Arquivo selecionado */}
            {uploadFile && !processingDocument && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">{uploadFile.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕ Remover
                  </button>
                </div>
              </div>
            )}

            {/* Texto extraído (debug) */}
            {documentText && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    📄 Ver texto extraído do documento
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {documentText.substring(0, 1000)}...
                    </pre>
                  </div>
                </details>
              </div>
            )}
            {largeDocAlert && (
              <div className="flex items-center text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mt-2 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Documento grande detectado. O processamento pode demorar mais que o normal.
              </div>
            )}
            {(progressState.stage === 'extracting' || progressState.stage === 'analyzing') && (
              <div className="w-full flex flex-col items-center my-6">
                <div className="mb-4 font-bold text-lg flex items-center gap-3">
                  <div className="relative">
                    <svg className="animate-spin h-8 w-8 text-emerald-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-20 animate-ping"></div>
                  </div>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {progressState.stage === 'extracting'
                      ? '📄 Extraindo texto do documento...'
                      : '🤖 Processando documento com IA...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 max-w-2xl overflow-hidden relative shadow-inner">
                  <div
                    className="h-6 rounded-full flex items-center justify-center text-white text-sm font-bold animate-progress-bar relative"
                    style={{
                      width: `${Math.min(100, Math.round((progressState.currentChunk / (progressState.totalChunks || 1)) * 100))}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    <span className="relative z-10 drop-shadow-sm">
                      {progressState.totalChunks > 0
                        ? `${Math.round((progressState.currentChunk / progressState.totalChunks) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {progressState.stage === 'extracting'
                    ? `📄 Página ${progressState.currentChunk} de ${progressState.totalChunks}`
                    : `🤖 Parte ${progressState.currentChunk} de ${progressState.totalChunks}`}
                </div>
                {progressState.message && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                    {progressState.message}
                  </div>
                )}
              </div>
            )}
            {(progressState.stage === 'extracting' || progressState.stage === 'analyzing') && (
              <button 
                onClick={resetProcessamento} 
                className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar Processamento
              </button>
            )}
            {!processingDocument && documentText && (
              <button 
                onClick={handleExtrairProdutos} 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-bold flex items-center gap-2 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                🚀 Extrair Produtos com IA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resumo do processamento de documento grande */}
      {processamentoResumo && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Resumo do Processamento do Documento</h4>
          <div className="text-sm text-blue-900">
            <div>Total de partes (chunks): <b>{processamentoResumo.totalChunks}</b></div>
            <div>Partes com erro: <b>{processamentoResumo.failedChunks}</b></div>
            <div>Produtos extraídos (originais): <b>{processamentoResumo.produtosOriginais}</b></div>
            <div>Produtos consolidados (únicos): <b>{processamentoResumo.produtosConsolidados}</b></div>
          </div>
          {processamentoResumo.failedChunks > 0 && (
            <div className="mt-2 text-xs text-red-700">Atenção: Algumas partes do documento não puderam ser processadas devido a limitações da IA. O resultado pode estar incompleto.</div>
          )}
        </div>
      )}

      {/* Seção de Produtos */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Produtos e NCMs</h3>
          <div className="flex items-center gap-3">
            {showProductDetailsButton && (
              <button
                onClick={abrirModalDetalhesProdutos}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📋 Ver Detalhes
              </button>
            )}
            <button
              onClick={adicionarProduto}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Adicionar Produto
            </button>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Nenhum produto adicionado. Adicione produtos manualmente ou faça upload de um documento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {produtos.map((produto, index) => (
              <div key={produto.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Produto {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removerProduto(produto.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      ✕ Remover
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Descrição do Produto
                    </label>
                    <textarea
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      value={produto.descricao}
                      onChange={e => atualizarProduto(produto.id, 'descricao', e.target.value)}
                      placeholder="Descrição detalhada do produto (mín. 50 caracteres para IA)"
                    />
                    {produto.descricao && produto.descricao.length < 50 && (
                      <div className="text-xs text-yellow-600 mt-1">
                        {50 - produto.descricao.length} caracteres restantes para sugestão de NCM
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      NCM
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={produto.ncm}
                          onChange={e => atualizarProduto(produto.id, 'ncm', e.target.value)}
                          onBlur={e => {
                            const ncmClean = e.target.value.replace(/[.\-\s]/g, '')
                            const ncmDigits = ncmClean.replace(/\D/g, '')
                            if (ncmDigits.length === 8 && /^\d+$/.test(ncmDigits)) {
                              atualizarProduto(produto.id, 'ncm', e.target.value)
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === 'Tab') {
                              const ncmClean = e.target.value.replace(/[.\-\s]/g, '')
                              const ncmDigits = ncmClean.replace(/\D/g, '')
                              if (ncmDigits.length === 8 && /^\d+$/.test(ncmDigits)) {
                                atualizarProduto(produto.id, 'ncm', e.target.value)
                              }
                            }
                          }}
                          placeholder="Ex: 8517.12.00"
                        />
                        {produto.consultandoTTCE && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleNcmSuggest(produto.id)}
                        className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!produto.descricao || produto.descricao.length < 50}
                        title="Sugestão automática de NCM"
                      >
                        IA
                      </button>
                      {produto.ncm && (
                        <button
                          onClick={() => abrirModalRefinamento(produto.id)}
                          className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          title="Refinar classificação NCM"
                        >
                          🔧
                        </button>
                      )}
                    </div>
                    
                    {/* Sugestões de NCM */}
                    {produto.ncmSugestoes && produto.ncmSugestoes.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Sugestões de NCM:
                        </div>
                        <div className="space-y-1">
                          {produto.ncmSugestoes.slice(0, 3).map((sugestao, idx) => (
                            <div key={idx} className="text-xs text-blue-700 dark:text-blue-300">
                              <span className="font-mono">{sugestao.ncm}</span> - {sugestao.descricao}
                              <span className="ml-2 text-blue-600">
                                ({(sugestao.score * 100).toFixed(0)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informações adicionais necessárias */}
                    {produto.ncmInformacoesAdicionais && produto.ncmInformacoesAdicionais.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                          Informações adicionais que ajudariam na classificação:
                        </div>
                        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                          {produto.ncmInformacoesAdicionais.map((info, idx) => (
                            <li key={idx}>• {info}</li>
                          ))}
                        </ul>
                        <button
                          onClick={() => abrirModalRefinamento(produto.id)}
                          className="mt-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Fornecer Informações
                        </button>
                      </div>
                    )}

                    {/* Resultado do refinamento */}
                    {produto.ncmRefinamento && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                          NCM Refinado:
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          <div className="font-mono">{produto.ncmRefinamento.ncmFinal}</div>
                          <div className="mt-1">{produto.ncmRefinamento.justificativa}</div>
                          <div className="mt-1 text-green-600">
                            Confiança: {(produto.ncmRefinamento.confianca * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dados TTCE */}
                    {produto.ttceData && (
                      <div className={`mt-2 p-2 rounded-lg border ${
                        produto.ttceData.isSimulated 
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      }`}>
                        <div className={`text-xs font-medium mb-1 ${
                          produto.ttceData.isSimulated 
                            ? 'text-yellow-800 dark:text-yellow-200' 
                            : 'text-blue-800 dark:text-blue-200'
                        }`}>
                          {produto.ttceData.isSimulated ? '⚠️ Dados Simulados' : '✅ TTCE - Dados Oficiais'}
                        </div>
                        <div className={`text-xs ${
                          produto.ttceData.isSimulated 
                            ? 'text-yellow-700 dark:text-yellow-300' 
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                          <div className="font-semibold mb-1">{produto.ttceData.descricaoOficial}</div>
                          {produto.ttceData.tratamentos && produto.ttceData.tratamentos.length > 0 && (
                            <div className="mt-1">
                              <div className="font-medium mb-1">Tratamentos Tributários:</div>
                              {produto.ttceData.tratamentos.map((tratamento, idx) => (
                                <div key={idx} className="flex justify-between items-center py-1">
                                  <span>{tratamento.descricao}</span>
                                  <span className="font-mono text-blue-600">{tratamento.aliquota}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {produto.ttceData.observacoes && (
                            <div className="mt-1 text-blue-600 italic">
                              Obs: {produto.ttceData.observacoes}
                            </div>
                          )}
                          {produto.ttceData.isSimulated && (
                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded text-xs">
                              <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                ⚠️ Dados Simulados
                              </div>
                              <div className="text-yellow-700 dark:text-yellow-300">
                                A API do Siscomex não está acessível no momento. 
                                Estes dados são apenas para demonstração.
                                <br />
                                <strong>Consulte um despachante para validação oficial.</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={produto.quantidade}
                      onChange={e => atualizarProduto(produto.id, 'quantidade', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Valor Unitário ({data.moeda || 'USD'})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={produto.valorUnitario}
                      onChange={e => atualizarProduto(produto.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Botão Adicionar Produto abaixo de cada item */}
                {index === produtos.length - 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={adicionarProduto}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600"
                    >
                      + Adicionar Próximo Produto
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // TODO: Implementar carregamento de dados de exemplo
              console.log('Carregar dados de exemplo')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Dados de Exemplo
          </button>
          
          {/* Debug info */}
          <div className="text-xs text-gray-500">
            <button onClick={debugValidation} className="text-blue-600 hover:text-blue-800">
              Debug Validação
            </button>
          </div>
        </div>
        
        <button 
          className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 transform ${
            isValid 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => {
            debugValidation()
            if (!isValid) {
              alert('❌ Campos obrigatórios não preenchidos. Verifique todos os campos antes de prosseguir.')
              return
            }
            onNext()
          }} 
          disabled={!isValid}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          {isValid ? '🚀 Iniciar Simulação' : '⏳ Preencha todos os campos'}
        </button>
      </div>

      {/* Indicadores de validação */}
      <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Status dos Campos Obrigatórios
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.paisOrigem 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.paisOrigem ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.paisOrigem ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              País de Origem
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.ufDesembaraco 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.ufDesembaraco ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.ufDesembaraco ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              UF Desembaraço
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.ufDestino 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.ufDestino ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.ufDestino ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              UF Destino
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.modal 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.modal ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.modal ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              Modal
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.moeda 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.moeda ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.moeda ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              Moeda
            </span>
            {data.moeda && (
              <span className="ml-2 text-xs text-blue-700 dark:text-blue-300 font-bold">{data.moeda}</span>
            )}
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            data.zonaAduaneira 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${data.zonaAduaneira ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${data.zonaAduaneira ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              Zona Aduaneira
            </span>
          </div>
          <div className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            produtos.length > 0 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={`w-3 h-3 rounded-full mr-3 ${produtos.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${produtos.length > 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              Produtos ({produtos.length})
            </span>
          </div>
        </div>
        {isValid && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-700 dark:text-green-300 font-medium">Todos os campos obrigatórios foram preenchidos!</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de IA */}
      {showIAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Análise Inteligente de NCM
              </h3>
              <button
                onClick={() => setShowIAModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escolha o tipo de análise:
                </h4>
                
                {/* Opção 1: Análise de documento completo */}
                <button
                  onClick={analisarDocumentoCompleto}
                  className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-2"
                >
                  <div className="font-medium text-gray-900 dark:text-white">📄 Análise Completa do Documento</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    IA analisa todo o documento e extrai todos os produtos automaticamente
                  </div>
                </button>

                {/* Opção 2: Sugestão baseada na descrição */}
                <button
                  onClick={sugestaoBaseadaDescricao}
                  className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-2"
                >
                  <div className="font-medium text-gray-900 dark:text-white">🤖 Sugestão por Descrição</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    IA analisa a descrição do produto e sugere o melhor NCM
                  </div>
                </button>

                {/* Opção 3: Análise de texto específico */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">✍️ Análise de Texto Específico</div>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Cole aqui o texto específico para análise (mín. 50 caracteres)..."
                    value={iaTextInput}
                    onChange={e => setIaTextInput(e.target.value)}
                  />
                  <button
                    onClick={analisarTextoIA}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!iaTextInput || iaTextInput.length < 50}
                  >
                    Analisar Texto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Refinamento de NCM */}
      {showRefinementModal && selectedProductForRefinement !== null && (
        <NCMRefinementModal
          isOpen={showRefinementModal}
          onClose={() => setShowRefinementModal(false)}
          produto={produtos.find(p => p.id === selectedProductForRefinement)}
          onNCMRefined={aplicarNCMRefinado}
          ncmSugerido={produtos.find(p => p.id === selectedProductForRefinement)?.ncm || ''}
        />
      )}

      {/* Modal de Detalhes dos Produtos */}
      {showProductDetailsModal && (
        <ProductDetailsModal
          isOpen={showProductDetailsModal}
          onClose={fecharModalDetalhesProdutos}
          products={produtos}
          onSave={salvarProdutosDetalhados}
          onAnalyzeNCM={analisarNCMProdutoDetalhado}
        />
      )}

      {/* Botões de ação premium - Elegantes e Profissionais */}
      {uploadFile && !processingDocument && (
        <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-800/50 dark:via-gray-800/50 dark:to-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm animate-fade-in-up shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 dark:from-slate-300 dark:to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
              <FaCrown className="text-amber-500 animate-pulse-subtle" />
              Recursos Premium
            </h4>
            <span className="text-xs text-white bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 rounded-full font-medium shadow-sm">
              ⭐ Premium
            </span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleAnalisarComIA}
              className="premium-button premium-gradient flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105"
              title="Análise avançada com IA - Extrai produtos e sugere NCMs com alta precisão"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analisar com IA
            </button>
            <button
              onClick={handleVisualizarDocumento}
              className="premium-button glass-button flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105"
              title="Visualizar documento original completo"
            >
              <FaEye className="w-4 h-4" />
              Visualizar Documento
            </button>
          </div>
          
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600">✨</span>
              <span>Análise inteligente extrai produtos automaticamente</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600">🎯</span>
              <span>Sugere NCMs com alta precisão e assertividade</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">📊</span>
              <span>Visualização completa do documento original</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de upgrade premium - Elegante */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full relative p-6">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
              onClick={() => setShowUpgradeModal(false)}
            >
              ✕
            </button>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-2xl text-slate-600 dark:text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Recurso Premium</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Este recurso está disponível apenas para assinantes Pro/Premium.<br/>
                Faça upgrade para liberar análise avançada com IA e visualização completa de documentos.
              </p>
              <div className="space-y-3">
                <a 
                  href="/upgrade" 
                  className="inline-block w-full px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Fazer Upgrade
                </a>
                <button 
                  onClick={() => setShowUpgradeModal(false)} 
                  className="w-full px-6 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualização do documento original - Elegante */}
      {showDocModal && uploadFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full relative p-6">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
              onClick={() => setShowDocModal(false)}
            >
              ✕
            </button>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FaEye className="text-slate-500" />
                  Documento Original
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  Visualização
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{uploadFile?.name}</p>
                    <p className="text-xs text-slate-500">{(uploadFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
              {/* Visualização do documento */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {uploadFile.type === 'application/pdf' ? (
                  <iframe 
                    src={URL.createObjectURL(uploadFile)} 
                    className="w-full h-96" 
                    title="Documento Original"
                    style={{ border: 'none' }}
                  />
                ) : uploadFile.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="w-full max-h-96 object-contain mx-auto" />
                ) : uploadFile.type === 'text/plain' ? (
                  <pre className="p-4 text-xs overflow-x-auto max-h-96 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">{documentText || 'Texto extraído será exibido aqui.'}</pre>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Visualização não suportada para este tipo de arquivo.<br/>Baixe para visualizar: <a href={URL.createObjectURL(uploadFile)} download={uploadFile.name} className="underline text-blue-600">Download</a></p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setShowDocModal(false)} 
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data de Cotação PTAX */}
      <div>
        <Tooltip content="Data de referência para a cotação PTAX do Banco Central">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Data de Cotação PTAX
          </label>
        </Tooltip>
        <div className="flex space-x-2">
          <input
            type="date"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 h-11 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={ptaxDate || ''}
            onChange={e => setPtaxDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <button
            type="button"
            onClick={() => setShowPTAXPanel(!showPTAXPanel)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Ver Cotações</span>
          </button>
        </div>
      </div>

      {/* Painel PTAX */}
      {showPTAXPanel && (
        <div className="col-span-full mt-4">
          <PTAXPanel
            selectedDate={ptaxDate}
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={data.moeda}
          />
        </div>
      )}

      {/* Moeda */}
      <div>
        <Tooltip content="Moeda principal utilizada na negociação da importação">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Moeda Selecionada
          </label>
        </Tooltip>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            {data.moeda === 'USD' && <DollarSign className="w-5 h-5 text-green-600" />}
            {data.moeda === 'EUR' && <Euro className="w-5 h-5 text-blue-600" />}
            {data.moeda === 'GBP' && <PoundSterling className="w-5 h-5 text-purple-600" />}
            {data.moeda === 'JPY' && <CircleDollarSign className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.moeda || 'Não selecionada'}
            </span>
          </div>
          {data.ptax && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              PTAX: R$ {parseFloat(data.ptax).toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EssenciaisTab 