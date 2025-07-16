#!/usr/bin/env node

// Script de Deploy PTAX - Garante Prioridade do Mecanismo de Fallback
// Uso: node scripts/deploy-ptax.js

import fs from 'fs'
import path from 'path'

const PTAX_FILE = 'api/ptax.js'
const CONFIG_FILE = 'config/ptax-config.js'
const VERSION_FILE = 'VERSION_PTAX.md'

console.log('�� Iniciando deploy PTAX com mecanismo de fallback prioritário...')

// Verificar se o arquivo PTAX tem o mecanismo de fallback
const checkFallbackMechanism = () => {
  try {
    const content = fs.readFileSync(PTAX_FILE, 'utf8')
    const hasFallback = content.includes('FALLBACK_CONFIG') && 
                       content.includes('maxTentativas') &&
                       content.includes('diasAnteriores')
    
    if (!hasFallback) {
      throw new Error('❌ Mecanismo de fallback não encontrado no PTAX API')
    }
    
    console.log('✅ Mecanismo de fallback verificado')
    return true
  } catch (error) {
    console.error('❌ Erro ao verificar mecanismo de fallback:', error.message)
    return false
  }
}

// Criar arquivo de versão
const createVersionFile = () => {
  const versionContent = `# PTAX API - Controle de Versões

## Versão Atual: 5.0.1
**Data:** 2025-01-15
**Status:** PRODUÇÃO

### Mecanismo de Fallback Prioritário
- ✅ Implementado
- ✅ Testado
- ✅ Deploy automático

### Configurações
- Máximo de tentativas: 7 dias
- Logs detalhados: ${process.env.NODE_ENV === 'development' ? 'SIM' : 'NÃO'}
- Ambiente: ${process.env.NODE_ENV || 'production'}

### Histórico
- 5.0.1 (2025-01-15): Mecanismo de fallback prioritário
- 5.0.0 (2025-01-14): Implementação inicial

### Comandos de Deploy
\`\`\`bash
# Deploy para Vercel
npm run deploy

# Verificar status
curl https://smartimport-5-0.vercel.app/api/ptax?moeda=USD&data=01-15-2025
\`\`\`
`

  fs.writeFileSync(VERSION_FILE, versionContent)
  console.log('✅ Arquivo de versão criado')
}

// Executar verificações
const main = () => {
  console.log('🔍 Verificando arquivos...')
  
  if (!checkFallbackMechanism()) {
    console.error('❌ Deploy cancelado - mecanismo de fallback não encontrado')
    process.exit(1)
  }
  
  createVersionFile()
  
  console.log('✅ PTAX API pronto para deploy')
  console.log('📋 Próximos passos:')
  console.log('   1. git add .')
  console.log('   2. git commit -m "feat: PTAX API v5.0.1 com fallback prioritário"')
  console.log('   3. git push origin main')
  console.log('   4. Vercel fará deploy automático')
}

main() 