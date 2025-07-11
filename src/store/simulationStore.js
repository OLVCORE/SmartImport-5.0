import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { 
  customsRegimes, 
  customsLocations, 
  fiscalIncentives, 
  customsExpenses, 
  extraExpenses, 
  requiredLicenses,
  icmsRates,
  fcpRates,
  getCustomsLocation,
  getRequiredLicenses,
  getApplicableIncentives,
  calculateICMSInterestadual
} from '../data/importData'

console.log('[SmartImport] simulationStore carregado')

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Função para buscar dados da API com fallback
const fetchFromAPI = async (endpoint, fallbackData) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`)
    return response.data
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using fallback data:`, error.message)
    return fallbackData
  }
}

// Função para calcular impostos baseada no regime aduaneiro
const calculateTaxesByRegime = (regime, baseCalculo, ncmCode, originState, destinationState) => {
  const regimeData = customsRegimes.find(r => r.code === regime)
  
  if (!regimeData) {
    return { ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, fcp: 0 }
  }

  // Buscar alíquotas da API ou usar fallback
  const ncmData = {
    ii: 16.0, // 16% padrão
    ipi: 8.0,  // 8% padrão
    pis: 2.1,  // 2.1% padrão
    cofins: 9.65 // 9.65% padrão
  }

  let ii = 0
  let ipi = 0
  let pis = 0
  let cofins = 0
  let icms = 0
  let fcp = 0

  // Aplicar lógica específica por regime
  switch (regimeData.calculationMethod) {
    case 'standard':
      ii = (baseCalculo * ncmData.ii) / 100
      ipi = (baseCalculo * ncmData.ipi) / 100
      pis = (baseCalculo * ncmData.pis) / 100
      cofins = (baseCalculo * ncmData.cofins) / 100
      
      // Calcular ICMS interestadual
      const icmsCalc = calculateICMSInterestadual(originState, destinationState, baseCalculo)
      icms = icmsCalc.icmsInterestadual
      fcp = icmsCalc.fcp
      break
      
    case 'temporary':
      // Admissão temporária - impostos suspensos
      ii = 0
      ipi = 0
      pis = 0
      cofins = 0
      icms = 0
      fcp = 0
      break
      
    case 'drawback':
      // Drawback - impostos suspensos
      ii = 0
      ipi = 0
      pis = 0
      cofins = 0
      icms = 0
      fcp = 0
      break
      
    case 'reimport':
      // Reimportação - impostos reduzidos
      ii = (baseCalculo * ncmData.ii * 0.5) / 100
      ipi = (baseCalculo * ncmData.ipi * 0.5) / 100
      pis = (baseCalculo * ncmData.pis) / 100
      cofins = (baseCalculo * ncmData.cofins) / 100
      
      const icmsCalcReimport = calculateICMSInterestadual(originState, destinationState, baseCalculo)
      icms = icmsCalcReimport.icmsInterestadual
      fcp = icmsCalcReimport.fcp
      break
      
    default:
      ii = (baseCalculo * ncmData.ii) / 100
      ipi = (baseCalculo * ncmData.ipi) / 100
      pis = (baseCalculo * ncmData.pis) / 100
      cofins = (baseCalculo * ncmData.cofins) / 100
      
      const icmsCalcDefault = calculateICMSInterestadual(originState, destinationState, baseCalculo)
      icms = icmsCalcDefault.icmsInterestadual
      fcp = icmsCalcDefault.fcp
  }

  return { ii, ipi, pis, cofins, icms, fcp }
}

// Função para calcular despesas aduaneiras
const calculateCustomsExpenses = (transportMode, locationCode, weight, containers, days) => {
  const location = getCustomsLocation(locationCode)
  if (!location) return { total: 0, details: [] }

  const expenses = customsExpenses[transportMode] || []
  let total = 0
  const details = []

  expenses.forEach(expense => {
    let amount = 0
    
    switch (expense.calculationMethod) {
      case 'per_ton':
        amount = expense.rate * weight
        break
      case 'per_container':
        amount = expense.rate * containers
        break
      case 'per_day':
        amount = expense.rate * days
        break
      default:
        amount = expense.rate
    }

    total += amount
    details.push({
      code: expense.code,
      name: expense.name,
      amount: amount,
      rate: expense.rate,
      calculationMethod: expense.calculationMethod
    })
  })

  return { total, details }
}

// Função para calcular despesas extras
const calculateExtraExpenses = (baseCalculo, selectedExpenses) => {
  let total = 0
  const details = []

  selectedExpenses.forEach(expenseCode => {
    const expense = extraExpenses.find(e => e.code === expenseCode)
    if (expense) {
      let amount = 0
      
      if (expense.calculationMethod === 'percentage') {
        amount = (baseCalculo * expense.rate) / 100
      } else {
        amount = expense.rate
      }

      total += amount
      details.push({
        code: expense.code,
        name: expense.name,
        amount: amount,
        rate: expense.rate,
        calculationMethod: expense.calculationMethod
      })
    }
  })

  return { total, details }
}

// Função para calcular incentivos fiscais
const calculateFiscalIncentives = (baseCalculo, originState, destinationState, locationCode, ncmCode) => {
  const applicableIncentives = getApplicableIncentives(destinationState, locationCode, ncmCode)
  let totalSavings = 0
  const details = []

  applicableIncentives.forEach(incentive => {
    let savings = 0
    
    if (incentive.calculationMethod === 'percentage') {
      savings = (baseCalculo * incentive.rate) / 100
    } else if (incentive.calculationMethod === 'exemption') {
      // Para ZFM, calcular economia baseada nos impostos que seriam cobrados
      const standardTaxes = calculateTaxesByRegime('06', baseCalculo, ncmCode, originState, destinationState)
      savings = standardTaxes.ii + standardTaxes.ipi
    }

    totalSavings += savings
    details.push({
      code: incentive.code,
      name: incentive.name,
      savings: savings,
      rate: incentive.rate,
      calculationMethod: incentive.calculationMethod
    })
  })

  return { totalSavings, details }
}

// Função para verificar licenças obrigatórias
const checkRequiredLicenses = (ncmCode) => {
  return getRequiredLicenses(ncmCode)
}

// Função para gerar simulações mockadas robustas
function generateMockSimulations() {
  // Exemplo: 10 simulações variadas
  const products = [
    'Smartphone iPhone 15', 'Notebook Dell XPS', 'Tablet Samsung Galaxy',
    'Smart TV LG OLED', 'Fone de Ouvido Sony', 'Câmera Canon EOS',
    'Drone DJI Mavic', 'Console PlayStation 5', 'Smartwatch Apple Watch',
    'Monitor Dell UltraSharp'
  ]
  const regimes = ['01', '02', '03', '04', '05', '06']
  const modes = ['maritime', 'air', 'land']
  const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'CE', 'GO', 'MT']
  const mockSimulations = []
  for (let i = 0; i < 10; i++) {
    const productValue = Math.random() * 5000 + 500
    const freightValue = Math.random() * 800 + 200
    const insuranceValue = productValue * 0.02
    const baseCalculo = productValue + freightValue + insuranceValue
    mockSimulations.push({
      id: `sim_${i + 1}`,
      productName: products[Math.floor(Math.random() * products.length)],
      ncmCode: `${Math.floor(Math.random() * 99) + 1}.${Math.floor(Math.random() * 99) + 1}.${Math.floor(Math.random() * 99) + 1}`,
      originCountry: 'Brasil',
      originState: states[Math.floor(Math.random() * states.length)],
      destinationState: states[Math.floor(Math.random() * states.length)],
      transportMode: modes[Math.floor(Math.random() * modes.length)],
      customsRegime: regimes[Math.floor(Math.random() * regimes.length)],
      customsLocation: 'BRSSZ',
      productValue,
      freightValue,
      insuranceValue,
      weight: Math.random() * 10 + 1,
      containers: Math.floor(Math.random() * 3) + 1,
      storageDays: Math.floor(Math.random() * 10) + 3,
      calculatedTaxes: { ii: 160, ipi: 80, pis: 21, cofins: 96.5, icms: 180, fcp: 20 },
      calculatedExpenses: { customs: { total: 100 }, extra: { total: 0 } },
      calculatedIncentives: { totalSavings: 0 },
      requiredLicenses: [],
      totalCost: baseCalculo + 160 + 80 + 21 + 96.5 + 180 + 20 + 100,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'calculated'
    })
  }
  return mockSimulations
}

export const useSimulationStore = create(
  persist(
    (set, get) => ({
      // Estado da simulação
      simulation: {
        // Dados básicos
        productName: '',
        ncmCode: '',
        originCountry: '',
        destinationState: '',
        originState: '',
        
        // Modal e regime
        transportMode: 'maritime',
        customsRegime: '06',
        customsLocation: '',
        
        // Valores
        productValue: 0,
        freightValue: 0,
        insuranceValue: 0,
        
        // Dimensões
        weight: 0,
        containers: 1,
        storageDays: 5,
        
        // Despesas extras selecionadas
        selectedExtraExpenses: [],
        
        // Resultados calculados
        calculatedTaxes: {},
        calculatedExpenses: {},
        calculatedIncentives: {},
        requiredLicenses: [],
        totalCost: 0,
        
        // Estados
        isLoading: false,
        error: null,
        lastCalculated: null
      },

      // Ações
      setSimulationData: (data) => {
        set((state) => ({
          simulation: { ...state.simulation, ...data }
        }))
      },

      // Calcular simulação completa
      calculateSimulation: async () => {
        const state = get()
        const sim = state.simulation
        
        set((state) => ({
          simulation: { ...state.simulation, isLoading: true, error: null }
        }))

        try {
          // Base de cálculo
          const baseCalculo = sim.productValue + sim.freightValue + sim.insuranceValue
          
          // Calcular impostos baseado no regime
          const taxes = calculateTaxesByRegime(
            sim.customsRegime,
            baseCalculo,
            sim.ncmCode,
            sim.originState,
            sim.destinationState
          )
          
          // Calcular despesas aduaneiras
          const customsExpenses = calculateCustomsExpenses(
            sim.transportMode,
            sim.customsLocation,
            sim.weight,
            sim.containers,
            sim.storageDays
          )
          
          // Calcular despesas extras
          const extraExpenses = calculateExtraExpenses(baseCalculo, sim.selectedExtraExpenses)
          
          // Calcular incentivos fiscais
          const incentives = calculateFiscalIncentives(
            baseCalculo,
            sim.originState,
            sim.destinationState,
            sim.customsLocation,
            sim.ncmCode
          )
          
          // Verificar licenças obrigatórias
          const licenses = checkRequiredLicenses(sim.ncmCode)
          
          // Calcular custo total
          const totalTaxes = taxes.ii + taxes.ipi + taxes.pis + taxes.cofins + taxes.icms + taxes.fcp
          const totalExpenses = customsExpenses.total + extraExpenses.total
          const totalCost = baseCalculo + totalTaxes + totalExpenses - incentives.totalSavings
          
          set((state) => ({
            simulation: {
              ...state.simulation,
              calculatedTaxes: taxes,
              calculatedExpenses: {
                customs: customsExpenses,
                extra: extraExpenses
              },
              calculatedIncentives: incentives,
              requiredLicenses: licenses,
              totalCost: totalCost,
              isLoading: false,
              lastCalculated: new Date().toISOString()
            }
          }))

        } catch (error) {
          set((state) => ({
            simulation: {
              ...state.simulation,
              isLoading: false,
              error: error.message
            }
          }))
        }
      },

      // Buscar dados da API
      fetchNCMData: async (ncmCode) => {
        try {
          const data = await fetchFromAPI(`/ncm/${ncmCode}`, {
            code: ncmCode,
            description: 'Produto não encontrado',
            ii: 16.0,
            ipi: 8.0,
            pis: 2.1,
            cofins: 9.65
          })
          return data
        } catch (error) {
          console.error('Error fetching NCM data:', error)
          return null
        }
      },

      fetchFreightData: async (origin, destination, mode, weight) => {
        try {
          const data = await fetchFromAPI(`/freight?origin=${origin}&destination=${destination}&mode=${mode}&weight=${weight}`, {
            freight: 1500.00,
            insurance: 75.00,
            transitTime: 15
          })
          return data
        } catch (error) {
          console.error('Error fetching freight data:', error)
          return null
        }
      },

      // Salvar simulação
      saveSimulation: async () => {
        const state = get()
        const sim = state.simulation
        
        set((state) => ({
          simulation: { ...state.simulation, isLoading: true }
        }))

        try {
          const response = await axios.post(`${API_BASE_URL}/simulations`, {
            ...sim,
            createdAt: new Date().toISOString()
          })
          
          set((state) => ({
            simulation: { ...state.simulation, isLoading: false }
          }))
          
          return response.data
        } catch (error) {
          set((state) => ({
            simulation: { ...state.simulation, isLoading: false, error: error.message }
          }))
          throw error
        }
      },

      // Buscar simulações salvas
      fetchSimulations: async () => {
        try {
          // Em produção, sempre retorna mock
          if (import.meta.env.PROD) {
            console.log('[SmartImport] Usando dados mockados em produção (Vercel)')
            return generateMockSimulations()
          }
          // Em dev, tenta API, senão mock
          const response = await axios.get(`${API_BASE_URL}/simulations`)
          return response.data
        } catch (error) {
          console.warn('[SmartImport] Erro ao buscar API, usando mock:', error)
          return generateMockSimulations()
        }
      },

      // Limpar simulação
      clearSimulation: () => {
        set((state) => ({
          simulation: {
            ...state.simulation,
            productName: '',
            ncmCode: '',
            originCountry: '',
            destinationState: '',
            originState: '',
            transportMode: 'maritime',
            customsRegime: '06',
            customsLocation: '',
            productValue: 0,
            freightValue: 0,
            insuranceValue: 0,
            weight: 0,
            containers: 1,
            storageDays: 5,
            selectedExtraExpenses: [],
            calculatedTaxes: {},
            calculatedExpenses: {},
            calculatedIncentives: {},
            requiredLicenses: [],
            totalCost: 0,
            isLoading: false,
            error: null,
            lastCalculated: null
          }
        }))
      },

      // Dados estáticos para uso nos componentes
      getCustomsRegimes: () => customsRegimes || [],
      getCustomsLocations: () => customsLocations || {},
      getFiscalIncentives: () => fiscalIncentives || [],
      getCustomsExpenses: () => customsExpenses,
      getExtraExpenses: () => extraExpenses,
      getRequiredLicenses: () => requiredLicenses || [],
      getICMSRates: () => icmsRates,
      getFCPRates: () => fcpRates
    }),
    {
      name: 'simulation-storage',
      partialize: (state) => ({
        simulation: {
          productName: state.simulation.productName,
          ncmCode: state.simulation.ncmCode,
          originCountry: state.simulation.originCountry,
          destinationState: state.simulation.destinationState,
          originState: state.simulation.originState,
          transportMode: state.simulation.transportMode,
          customsRegime: state.simulation.customsRegime,
          customsLocation: state.simulation.customsLocation,
          productValue: state.simulation.productValue,
          freightValue: state.simulation.freightValue,
          insuranceValue: state.simulation.insuranceValue,
          weight: state.simulation.weight,
          containers: state.simulation.containers,
          storageDays: state.simulation.storageDays,
          selectedExtraExpenses: state.simulation.selectedExtraExpenses
        }
      })
    }
  )
) 