#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🎯 SmartImport 5.0 - Inicialização Automática')
console.log('=' * 50)

// Iniciar o gerenciador de portas
const manager = spawn('node', ['scripts/port-manager.js'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit'
})

manager.on('error', (error) => {
  console.error('❌ Erro ao iniciar:', error)
  process.exit(1)
})

manager.on('close', (code) => {
  console.log(`\n🛑 SmartImport encerrado com código: ${code}`)
  process.exit(code)
}) 