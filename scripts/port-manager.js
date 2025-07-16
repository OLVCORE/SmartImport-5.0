import { spawn } from 'child_process'
import { createServer } from 'net'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

async function startSystem() {
  console.log('🚀 SmartImport 5.0 - Sistema Automático de Portas')
  console.log('==================================================')
  
  // Verificar porta do backend
  const backendPort = await isPortAvailable(3001) ? 3001 : 3002
  console.log(`✅ Backend: Porta ${backendPort} disponível`)
  
  // Iniciar backend
  console.log(`🚀 Iniciando backend na porta ${backendPort}...`)
  const backend = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: backendPort },
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  })
  
  // Aguardar backend inicializar
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Verificar porta do frontend
  const frontendPort = backendPort === 3001 ? 3002 : 3003
  console.log(` Iniciando frontend na porta ${frontendPort}...`)
  
  // Iniciar frontend usando npm run dev com porta específica
  const frontend = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, VITE_PORT: frontendPort },
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  })
  
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
  
  // Gerenciar encerramento
  process.on('SIGINT', () => {
    console.log('\n Encerrando sistema...')
    backend.kill()
    frontend.kill()
    process.exit(0)
  })
}

startSystem().catch(console.error)