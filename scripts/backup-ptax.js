import { copyFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('💾 Criando backup de segurança...')

// Backup dos arquivos relacionados à PTAX
const filesToBackup = [
  'server.js',
  'src/utils/currency.js',
  'src/components/SimulatorTabs/ValoresTab.tsx'
]

filesToBackup.forEach(file => {
  try {
    const sourcePath = join(__dirname, '..', file)
    const backupPath = join(__dirname, '..', `${file}.backup-${Date.now()}`)
    copyFileSync(sourcePath, backupPath)
    console.log(`✅ Backup criado: ${file}`)
  } catch (error) {
    console.log(`⚠️ Erro no backup de ${file}:`, error.message)
  }
})

console.log('\n🎯 Backup de segurança concluído!')
console.log('📋 Arquivos salvos com timestamp') 