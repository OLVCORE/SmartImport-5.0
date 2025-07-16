#!/usr/bin/env node

// Script para corrigir duplicações no EssenciaisTab.jsx
// Uso: node scripts/fix-duplicates.js

import fs from 'fs'
import path from 'path'

console.log('🔧 Corrigindo duplicações no EssenciaisTab.jsx...')

const filePath = 'src/components/SimulatorTabs/EssenciaisTab.jsx'

try {
  // Ler o arquivo atual
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Remover importação duplicada
  content = content.replace(
    /import { getPtaxRateWithFallback } from '\.\.\/\.\.\/services\/ptaxService\.js'\s+import { useSimulationStore } from '\.\.\/\.\.\/store\/simulationStore'\s+import { getPtaxRateWithFallback, isFutureDate } from '\.\.\/\.\.\/services\/ptaxService\.js'/g,
    `import { getPtaxRateWithFallback, isFutureDate } from '../../services/ptaxService.js'
import { useSimulationStore } from '../../store/simulationStore'`
  )
  
  // Renomear variável duplicada ptaxData
  content = content.replace(
    /const \[ptaxData, setPtaxData\] = useState\(\{\}\)/g,
    'const [localPtaxData, setLocalPtaxData] = useState({})'
  )
  
  // Renomear função do store para evitar conflito
  content = content.replace(
    /const \{ \s*fetchPtaxRate, \s*updatePtaxManual, \s*ptaxData, \s*ptaxLoading, \s*ptaxError \s*\} = useSimulationStore\(\)/g,
    `const { 
    fetchPtaxRate: storeFetchPtaxRate, 
    updatePtaxManual, 
    ptaxData: storePtaxData, 
    ptaxLoading, 
    ptaxError 
  } = useSimulationStore()`
  )
  
  // Atualizar chamadas para usar o nome correto
  content = content.replace(/fetchPtaxRate\(/g, 'storeFetchPtaxRate(')
  
  // Escrever o arquivo corrigido
  fs.writeFileSync(filePath, content)
  
  console.log('✅ Duplicações corrigidas com sucesso!')
  console.log('📋 Próximos passos:')
  console.log('   1. git add .')
  console.log('   2. git commit -m "fix: Remove duplicações no EssenciaisTab.jsx"')
  console.log('   3. git push origin main')
  console.log('   4. Vercel fará deploy automático')
  
} catch (error) {
  console.error('❌ Erro ao corrigir duplicações:', error.message)
  process.exit(1)
} 