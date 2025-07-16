import { createServer } from 'net'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Função para verificar se uma porta está disponível
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer()
    server.listen(port, () => {
      server.once('close', () => resolve(true))
      server.close()
    })
    server.on('error', () => resolve(false))
  })
}

// Função para encontrar porta disponível
async function findAvailablePort(startPort) {
  let port = startPort
  while (!(await isPortAvailable(port))) {
    port++
  }
  return port
}

// Função para iniciar backend
async function startBackend(port) {
  console.log(`🚀 Iniciando backend na porta ${port}...`)
  
  const backend = spawn('node', ['server.js'], {
    cwd: join(__dirname, '..'),
    env: { ...process.env, PORT: port.toString() },
    stdio: 'inherit'
  })
  
  backend.on('error', (error) => {
    console.error('❌ Erro ao iniciar backend:', error)
  })
  
  return backend
}

// Função para iniciar frontend
async function startFrontend(backendPort) {
  const frontendPort = await findAvailablePort(3000)
  console.log(` Iniciando frontend na porta ${frontendPort}...`)
  
  // Usar npm run dev em vez de npx vite diretamente
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: join(__dirname, '..'),
    env: { ...process.env, VITE_BACKEND_PORT: backendPort.toString() },
    stdio: 'inherit'
  })
  
  frontend.on('error', (error) => {
    console.error('❌ Erro ao iniciar frontend:', error)
  })
  
  return { frontend, port: frontendPort }
}

// Função principal
async function startSmartImport() {
  console.log('🎯 SmartImport 5.0 - Sistema Automático de Portas')
  console.log('==================================================')
  
  try {
    // Encontrar porta para backend
    const backendPort = await findAvailablePort(3001)
    console.log(`✅ Backend: Porta ${backendPort} disponível`)
    
    // Iniciar backend
    const backend = await startBackend(backendPort)
    
    // Aguardar backend inicializar
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Iniciar frontend
    const { frontend, port: frontendPort } = await startFrontend(backendPort)
    
    console.log('\n SmartImport 5.0 Iniciado com Sucesso!')
    console.log('==================================================')
    console.log(`🌐 Frontend: http://localhost:${frontendPort}`)
    console.log(`🔧 Backend:  http://localhost:${backendPort}`)
    console.log(`📊 PTAX:    http://localhost:${frontendPort}/api/ptax`)
    console.log(`🤖 AI:      http://localhost:${frontendPort}/api/ai/ask`)
    console.log(`🔍 NCM:     http://localhost:${frontendPort}/api/ai/suggest-ncm`)
    console.log(`🏛️ TTCE:    http://localhost:${frontendPort}/api/ttce/consultar`)
    console.log('==================================================')
    console.log('💡 Dica: Acesse o frontend para usar o sistema completo!')
    
    // Salvar configuração de portas
    const config = {
      backendPort,
      frontendPort,
      timestamp: new Date().toISOString()
    }
    
    // Criar arquivo de configuração temporário
    writeFileSync(join(__dirname, '..', '.port-config.json'), JSON.stringify(config, null, 2))
    
    // Gerenciar encerramento
    process.on('SIGINT', () => {
      console.log('\n🛑 Encerrando SmartImport 5.0...')
      backend.kill()
      frontend.kill()
      process.exit(0)
    })
    
  } catch (error) {
    console.error('❌ Erro ao iniciar SmartImport:', error)
    process.exit(1)
  }
}

// Executar se chamado diretamente
startSmartImport() 