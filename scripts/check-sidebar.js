import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔍 Verificando Sidebar...')

// Verificar se o Sidebar.tsx está correto
const sidebarPath = join(__dirname, '..', 'src', 'components', 'Layout', 'Sidebar.tsx')
const sidebarContent = readFileSync(sidebarPath, 'utf8')

// Verificar se tem todos os 10 itens
const navigationItems = [
  'Dashboard', 'Simulador', 'Histórico', 'Relatórios', 
  'SmartFrete', 'SeaFrete', 'OPN IA', 'Integrações', 
  'Configurações', 'Ajuda'
]

let allItemsPresent = true
navigationItems.forEach(item => {
  if (!sidebarContent.includes(`name: '${item}'`)) {
    console.log(`❌ Item faltando: ${item}`)
    allItemsPresent = false
  }
})

if (allItemsPresent) {
  console.log('✅ Todos os 10 itens estão presentes no sidebar')
} else {
  console.log('❌ Alguns itens estão faltando no sidebar')
}

// Verificar se o Layout.tsx está importando corretamente
const layoutPath = join(__dirname, '..', 'src', 'components', 'Layout', 'Layout.tsx')
const layoutContent = readFileSync(layoutPath, 'utf8')

if (layoutContent.includes("import Sidebar from './Sidebar'")) {
  console.log('✅ Layout está importando Sidebar corretamente')
} else {
  console.log('❌ Layout não está importando Sidebar')
}

// Verificar se o App.jsx tem todas as rotas
const appPath = join(__dirname, '..', 'src', 'App.jsx')
const appContent = readFileSync(appPath, 'utf8')

const routes = [
  'dashboard', 'simulator', 'history', 'reports', 
  'smartfrete', 'seafrete', 'opnia', 'integrations', 
  'settings', 'help'
]

let allRoutesPresent = true
routes.forEach(route => {
  if (!appContent.includes(`path="${route}"`)) {
    console.log(`❌ Rota faltando: ${route}`)
    allRoutesPresent = false
  }
})

if (allRoutesPresent) {
  console.log('✅ Todas as rotas estão configuradas no App.jsx')
} else {
  console.log('❌ Algumas rotas estão faltando no App.jsx')
}

console.log('\n🎯 Verificação completa!') 