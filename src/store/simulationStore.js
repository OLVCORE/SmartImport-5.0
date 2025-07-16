import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { getPtaxRateWithFallback, isFutureDate } from '../services/ptaxService.js'

// Mock data para demonstração
const mockSimulations = [
  {
    id: 1,
    productName: 'Smartphone Samsung Galaxy S24',
    ncmCode: '8517.12.00',
    originCountry: 'China',
    destinationState: 'SP',
    transportMode: 'maritime',
    totalValue: 25000,
    finalValue: 42500,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    profitability: 70.0,
    taxes: {
      ii: 4000,
      ipi: 2000,
      pis: 525,
      cofins: 2412.5,
      icms: 4500,
      fcp: 500
    },
    details: {
      productValue: 25000,
      freightValue: 3000,
      insuranceValue: 750,
      weight: 0.5,
      containers: 1,
      storageDays: 5
    }
  },
  {
    id: 2,
    productName: 'Máquina Industrial CNC',
    ncmCode: '8457.10.00',
    originCountry: 'Alemanha',
    destinationState: 'RJ',
    transportMode: 'air',
    totalValue: 150000,
    finalValue: 285000,
    status: 'pending',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:10:00Z',
    profitability: 90.0,
    taxes: {
      ii: 24000,
      ipi: 12000,
      pis: 3150,
      cofins: 14475,
      icms: 27000,
      fcp: 3000
    },
    details: {
      productValue: 150000,
      freightValue: 15000,
      insuranceValue: 3750,
      weight: 2.5,
      containers: 2,
      storageDays: 8
    }
  }
]

const mockCustomsRegimes = [
  {
    code: '01',
    name: 'Importação para Consumo',
    description: 'Importação definitiva para consumo interno',
    calculationMethod: 'standard',
    iiRate: 0.16,
    ipiRate: 0.08,
    icmsRate: 0.18,
    fcpRate: 0.02
  },
  {
    code: '02',
    name: 'Importação Temporária',
    description: 'Importação temporária com reexportação',
    calculationMethod: 'temporary',
    iiRate: 0.00,
    ipiRate: 0.00,
    icmsRate: 0.00,
    fcpRate: 0.00
  },
  {
    code: '03',
    name: 'Drawback',
    description: 'Drawback com suspensão de impostos',
    calculationMethod: 'drawback',
    iiRate: 0.00,
    ipiRate: 0.00,
    icmsRate: 0.00,
    fcpRate: 0.00
  },
  {
    code: '04',
    name: 'Reimportação',
    description: 'Reimportação de produtos exportados',
    calculationMethod: 'reimport',
    iiRate: 0.08,
    ipiRate: 0.04,
    icmsRate: 0.18,
    fcpRate: 0.02
  }
]

const mockCustomsLocations = {
  maritime: [
    { code: 'BRSP', name: 'Porto de Santos', state: 'SP' },
    { code: 'BRRJ', name: 'Porto do Rio de Janeiro', state: 'RJ' },
    { code: 'BRPR', name: 'Porto de Paranaguá', state: 'PR' },
    { code: 'BRRS', name: 'Porto de Rio Grande', state: 'RS' }
  ],
  air: [
    { code: 'BRSP', name: 'Aeroporto de Guarulhos', state: 'SP' },
    { code: 'BRRJ', name: 'Aeroporto do Galeão', state: 'RJ' },
    { code: 'BRMG', name: 'Aeroporto de Confins', state: 'MG' },
    { code: 'BRRS', name: 'Aeroporto Salgado Filho', state: 'RS' }
  ],
  land: [
    { code: 'BRRS', name: 'Fronteira Uruguaiana', state: 'RS' },
    { code: 'BRPR', name: 'Fronteira Foz do Iguaçu', state: 'PR' },
    { code: 'BRSC', name: 'Fronteira Dionísio Cerqueira', state: 'SC' }
  ]
}

const mockFiscalIncentives = [
  {
    id: 1,
    name: 'Zona Franca de Manaus',
    description: 'Incentivos fiscais para produtos da ZFM',
    type: 'regional',
    applicableStates: ['AM'],
    taxReduction: {
      ii: 0.88,
      ipi: 0.50,
      icms: 0.00
    }
  },
  {
    id: 2,
    name: 'REIDI',
    description: 'Regime Especial de Incentivos para Desenvolvimento da Infraestrutura',
    type: 'sectorial',
    applicableSectors: ['infrastructure', 'energy', 'transport'],
    taxReduction: {
      ii: 0.00,
      ipi: 0.00,
      icms: 0.00
    }
  }
]

export const useSimulationStore = create(
  persist(
    (set, get) => ({
      // State
      simulations: mockSimulations,
      currentSimulation: null,
      isLoading: false,
      error: null,
      
      // PTAX state
      ptaxData: {},
      ptaxLoading: false,
      ptaxError: null,
      ptaxLastUpdate: null,
      
      // Customs data
      customsRegimes: mockCustomsRegimes,
      customsLocations: mockCustomsLocations,
      fiscalIncentives: mockFiscalIncentives,
      
      // Settings
      settings: {
        theme: 'system',
        notifications: true,
        autoSave: true,
        language: 'pt-BR',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo'
      },

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // PTAX Actions - CORREÇÃO 5: Reação automática
      fetchPtaxRate: async (moeda, data) => {
        set({ ptaxLoading: true, ptaxError: null })
        
        try {
          // Verificar se é data futura
          if (isFutureDate(data)) {
            set({ 
              ptaxLoading: false, 
              ptaxError: 'Data futura - use modo manual' 
            })
            throw new Error('Data futura - use modo manual')
          }
          
          const resultado = await getPtaxRateWithFallback(moeda, data)
          
          set((state) => ({
            ptaxData: {
              ...state.ptaxData,
              [moeda]: resultado
            },
            ptaxLoading: false,
            ptaxLastUpdate: new Date().toISOString()
          }))
          
          // Atualizar simulação atual se existir
          const currentSim = get().currentSimulation
          if (currentSim) {
            set({
              currentSimulation: {
                ...currentSim,
                moeda,
                ptax: resultado.cotacao,
                ptaxData: resultado.dataCotacao
              }
            })
          }
          
          console.log(`✅ PTAX atualizado no store:`, resultado)
          return resultado
          
        } catch (error) {
          set({ 
            ptaxLoading: false, 
            ptaxError: error.message 
          })
          
          console.error(`❌ Erro PTAX no store:`, error)
          toast.error(`Erro ao buscar PTAX: ${error.message}`)
          throw error
        }
      },

      // Atualizar PTAX manual
      updatePtaxManual: (moeda, cotacao, dataCotacao) => {
        const resultado = {
          cotacao: parseFloat(cotacao),
          dataCotacao: dataCotacao || new Date().toISOString().split('T')[0],
          fonte: 'Manual'
        }
        
        set((state) => ({
          ptaxData: {
            ...state.ptaxData,
            [moeda]: resultado
          },
          ptaxLastUpdate: new Date().toISOString()
        }))
        
        // Atualizar simulação atual
        const currentSim = get().currentSimulation
        if (currentSim) {
          set({
            currentSimulation: {
              ...currentSim,
              moeda,
              ptax: resultado.cotacao,
              ptaxData: resultado.dataCotacao
            }
          })
        }
        
        console.log(`✅ PTAX manual atualizado:`, resultado)
      },

      // Limpar PTAX
      clearPtax: () => {
        set({ 
          ptaxData: {}, 
          ptaxError: null, 
          ptaxLastUpdate: null 
        })
      },

      // Simulation actions
      createSimulation: (simulationData) => {
        const newSimulation = {
          id: Date.now(),
          ...simulationData,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set((state) => ({
          simulations: [newSimulation, ...state.simulations],
          currentSimulation: newSimulation
        }))
        
        toast.success('Simulação criada com sucesso!')
        return newSimulation
      },

      updateSimulation: (id, updates) => {
        set((state) => ({
          simulations: state.simulations.map(sim => 
            sim.id === id 
              ? { ...sim, ...updates, updatedAt: new Date().toISOString() }
              : sim
          ),
          currentSimulation: state.currentSimulation?.id === id 
            ? { ...state.currentSimulation, ...updates, updatedAt: new Date().toISOString() }
            : state.currentSimulation
        }))
        
        toast.success('Simulação atualizada!')
      },

      deleteSimulation: (id) => {
        set((state) => ({
          simulations: state.simulations.filter(sim => sim.id !== id),
          currentSimulation: state.currentSimulation?.id === id ? null : state.currentSimulation
        }))
        
        toast.success('Simulação excluída!')
      },

      setCurrentSimulation: (simulation) => set({ currentSimulation: simulation }),

      calculateSimulation: (simulationData) => {
        set({ isLoading: true })
        
        // Simular cálculo
        setTimeout(() => {
          const calculatedSimulation = {
            ...simulationData,
            status: 'completed',
            finalValue: simulationData.totalValue * 1.7, // Mock calculation
            profitability: 70.0,
            taxes: {
              ii: simulationData.totalValue * 0.16,
              ipi: simulationData.totalValue * 0.08,
              pis: simulationData.totalValue * 0.021,
              cofins: simulationData.totalValue * 0.0965,
              icms: simulationData.totalValue * 0.18,
              fcp: simulationData.totalValue * 0.02
            }
          }
          
          set((state) => ({
            simulations: [calculatedSimulation, ...state.simulations],
            currentSimulation: calculatedSimulation,
            isLoading: false
          }))
          
          toast.success('Simulação calculada com sucesso!')
        }, 2000)
      },

      // Data getters
      getSimulations: () => get().simulations,
      
      getSimulationById: (id) => get().simulations.find(sim => sim.id === id),
      
      getCustomsRegimes: () => get().customsRegimes,
      
      getCustomsLocations: () => get().customsLocations,
      
      getFiscalIncentives: () => get().fiscalIncentives,

      // Settings actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
        toast.success('Configurações atualizadas!')
      },

      // Export actions
      exportSimulation: (id, format = 'pdf') => {
        const simulation = get().getSimulationById(id)
        if (!simulation) {
          toast.error('Simulação não encontrada!')
          return
        }
        
        // Mock export
        toast.success(`Simulação exportada em ${format.toUpperCase()}!`)
        return simulation
      },

      exportAllSimulations: (format = 'pdf') => {
        const simulations = get().simulations
        toast.success(`${simulations.length} simulações exportadas em ${format.toUpperCase()}!`)
        return simulations
      },

      // Backup actions
      createBackup: () => {
        const state = get()
        const backup = {
          simulations: state.simulations,
          settings: state.settings,
          timestamp: new Date().toISOString()
        }
        
        // Mock backup to OneDrive
        toast.success('Backup criado no OneDrive!')
        return backup
      },

      restoreBackup: (backup) => {
        set({
          simulations: backup.simulations || [],
          settings: backup.settings || get().settings
        })
        
        toast.success('Backup restaurado com sucesso!')
      },

      // Analytics
      getAnalytics: () => {
        const simulations = get().simulations
        const completed = simulations.filter(s => s.status === 'completed')
        
        return {
          total: simulations.length,
          completed: completed.length,
          totalValue: completed.reduce((sum, sim) => sum + sim.finalValue, 0),
          averageProfitability: completed.length > 0 
            ? completed.reduce((sum, sim) => sum + sim.profitability, 0) / completed.length 
            : 0
        }
      },

      // Search and filter
      searchSimulations: (query) => {
        const simulations = get().simulations
        if (!query) return simulations
        
        return simulations.filter(sim => 
          sim.productName.toLowerCase().includes(query.toLowerCase()) ||
          sim.ncmCode.includes(query) ||
          sim.originCountry.toLowerCase().includes(query.toLowerCase())
        )
      },

      filterSimulations: (filters) => {
        let simulations = get().simulations
        
        if (filters.status && filters.status !== 'all') {
          simulations = simulations.filter(sim => sim.status === filters.status)
        }
        
        if (filters.transportMode && filters.transportMode !== 'all') {
          simulations = simulations.filter(sim => sim.transportMode === filters.transportMode)
        }
        
        if (filters.dateRange && filters.dateRange !== 'all') {
          const now = new Date()
          const daysAgo = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90
          const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
          simulations = simulations.filter(sim => new Date(sim.createdAt) >= cutoffDate)
        }
        
        return simulations
      }
    }),
    {
      name: 'simulation-store',
      partialize: (state) => ({
        simulations: state.simulations,
        currentSimulation: state.currentSimulation,
        settings: state.settings,
        ptaxData: state.ptaxData,
        ptaxLastUpdate: state.ptaxLastUpdate
      })
    }
  )
) 