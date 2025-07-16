import { unlink, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Lista de arquivos duplicados para remover
const filesToRemove = [
  'src/App.tsx',
  'src/components/Layout/Sidebar.jsx',
  'src/components/Layout/Layout.jsx',
  'src/components/Layout/Header.jsx'
]

// Configuração do Vite corrigida
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3002,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})`

async function fixSystem() {
  console.log('�� Iniciando correção do sistema SmartImport 5.0...')
  
  try {
    // 1. Remover arquivos duplicados
    console.log('🗑️ Removendo arquivos duplicados...')
    for (const file of filesToRemove) {
      try {
        await unlink(join(__dirname, '..', file))
        console.log(`✅ Removido: ${file}`)
      } catch (error) {
        console.log(`⚠️ Arquivo não encontrado: ${file}`)
      }
    }
    
    // 2. Corrigir vite.config.js
    console.log('⚙️ Corrigindo configuração do Vite...')
    writeFileSync(join(__dirname, '..', 'vite.config.js'), viteConfig)
    console.log('✅ vite.config.js corrigido')
    
    // 3. Criar script de inicialização melhorado
    const startScript = `import { spawn } from 'child_process'
import { createServer } from 'net'

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
  console.log(\`✅ Backend: Porta \${backendPort} disponível\`)
  
  // Iniciar backend
  console.log(\`🚀 Iniciando backend na porta \${backendPort}...\`)
  const backend = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: backendPort },
    stdio: 'inherit'
  })
  
  // Aguardar backend inicializar
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Verificar porta do frontend
  const frontendPort = backendPort === 3001 ? 3002 : 3003
  console.log(\`�� Iniciando frontend na porta \${frontendPort}...\`)
  
  // Iniciar frontend
  const frontend = spawn('npx', ['vite', '--port', frontendPort.toString()], {
    stdio: 'inherit'
  })
  
  console.log('\\n�� SmartImport 5.0 Iniciado com Sucesso!')
  console.log('==================================================')
  console.log(\`🌐 Frontend: http://localhost:\${frontendPort}\`)
  console.log(\`🔧 Backend:  http://localhost:\${backendPort}\`)
  console.log(\`📊 PTAX:    http://localhost:\${frontendPort}/api/ptax\`)
  console.log(\`🤖 AI:      http://localhost:\${frontendPort}/api/ai/ask\`)
  console.log(\`🔍 NCM:     http://localhost:\${frontendPort}/api/ai/suggest-ncm\`)
  console.log(\`🏛️ TTCE:    http://localhost:\${frontendPort}/api/ttce/consultar\`)
  console.log('==================================================')
  console.log('💡 Dica: Acesse o frontend para usar o sistema completo!')
  
  // Gerenciar encerramento
  process.on('SIGINT', () => {
    console.log('\\n�� Encerrando sistema...')
    backend.kill()
    frontend.kill()
    process.exit(0)
  })
}

startSystem().catch(console.error)`
    
    writeFileSync(join(__dirname, 'port-manager.js'), startScript)
    console.log('✅ Script de inicialização melhorado')
    
    console.log('\\n🎯 Sistema corrigido com sucesso!')
    console.log('==================================================')
    console.log('📋 Próximos passos:')
    console.log('1. Execute: npm run start')
    console.log('2. Acesse: http://localhost:3002')
    console.log('3. Verifique se o sidebar está completo')
    console.log('4. Teste as APIs: http://localhost:3002/api/ptax')
    console.log('==================================================')
    
  } catch (error) {
    console.error('❌ Erro durante a correção:', error)
  }
}

fixSystem() 