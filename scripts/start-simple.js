#!/usr/bin/env node

import { spawn } from 'child_process'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 SmartImport 5.0 - Iniciando Sistema...')
console.log('==================================================')

// Iniciar backend
console.log('🔧 Iniciando backend...')
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: join(__dirname, '..')
})

// Aguardar um pouco e iniciar frontend
setTimeout(() => {
  console.log(' Iniciando frontend...')
  const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  })
  
  console.log('\n🎯 Sistema iniciado!')
  console.log('==================================================')
  console.log('🌐 Frontend: http://localhost:3002')
  console.log('🔧 Backend:  http://localhost:3001')
  console.log('📊 PTAX:    http://localhost:3002/api/ptax')
  console.log('🤖 AI:      http://localhost:3002/api/ai/ask')
  console.log('🔍 NCM:     http://localhost:3002/api/ai/suggest-ncm')
  console.log('🏛️ TTCE:    http://localhost:3002/api/ttce/consultar')
  console.log('==================================================')
  
  // Gerenciar encerramento
  process.on('SIGINT', () => {
    console.log('\n Encerrando sistema...')
    backend.kill()
    frontend.kill()
    process.exit(0)
  })
}, 3000) 