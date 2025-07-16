import { unlink } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('�� Removendo arquivos conflitantes...')

const filesToRemove = [
  'src/components/Layout/Sidebar.jsx',
  'src/components/Layout/Layout.jsx', 
  'src/components/Layout/Header.jsx'
]

async function cleanConflicts() {
  for (const file of filesToRemove) {
    try {
      await unlink(join(__dirname, '..', file))
      console.log(`✅ Removido: ${file}`)
    } catch (error) {
      console.log(`⚠️ Arquivo não encontrado: ${file}`)
    }
  }
  
  console.log('\\n�� Limpeza concluída!')
  console.log('📋 Próximos passos:')
  console.log('1. Reiniciar o frontend: npm run dev')
  console.log('2. Acessar: http://localhost:3003')
  console.log('3. Verificar se o sidebar tem 10 itens')
}

cleanConflicts() 