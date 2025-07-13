#!/bin/bash

echo "🔧 Corrigindo configuração da API..."

# 1. Mover pasta api para evitar conflito
if [ -d "api" ]; then
    echo "📁 Movendo pasta api para api_backup..."
    mv api api_backup
fi

# 2. Instalar dependências necessárias
echo "📦 Instalando dependências..."
npm install dotenv

# 3. Verificar se vite está instalado
if ! npm list vite > /dev/null 2>&1; then
    echo "📦 Instalando vite..."
    npm install --save-dev vite
fi

echo "✅ Configuração corrigida!"
echo "🚀 Para iniciar:"
echo "   Terminal 1: npm run server"
echo "   Terminal 2: npm run dev"
```

**5. Instruções finais:**

Agora execute os seguintes comandos no PowerShell:

```powershell
# 1. Mover a pasta api para evitar conflito
Move-Item api api_backup

# 2. Instalar dependência dotenv
npm install dotenv

# 3. Iniciar o servidor backend
npm run server

# 4. Em outro terminal, iniciar o frontend
npm run dev
```

**Resumo das correções feitas:**

1. ✅ **Adicionado proxy no vite.config.js** - `/api` → `http://localhost:3001`
2. ✅ **Atualizado server.js** - Incluídas todas as rotas da pasta api (PTAX, AI, TTCE)
3. ✅ **Adicionado dotenv** - Para variáveis de ambiente
4. ✅ **Adicionado script server** - `npm run server`
5. ✅ **Instruções para mover pasta api** - Evitar conflito com proxy

**Agora o sistema deve funcionar corretamente:**
- Backend Express rodando na porta 3001
- Frontend Vite rodando na porta 3000 (ou próxima disponível)
- Proxy configurado para encaminhar `/api` para o backend
- Pasta api movida para evitar conflito

Execute `npm run server` e depois `npm run dev` em terminais separados. 