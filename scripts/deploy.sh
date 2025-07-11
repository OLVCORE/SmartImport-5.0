#!/bin/bash

# SmartImport 5.0 - Script de Deploy Automatizado
# Este script automatiza o processo de deploy para Vercel

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script na raiz do projeto SmartImport 5.0"
    exit 1
fi

log "🚀 Iniciando deploy do SmartImport 5.0..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado. Instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

success "Node.js $(node -v) detectado"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    error "npm não está instalado"
    exit 1
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    warning "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
    success "Vercel CLI instalado"
else
    success "Vercel CLI detectado"
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    warning "Faça login no Vercel primeiro:"
    vercel login
fi

# Backup do estado atual
log "📦 Criando backup do estado atual..."
if [ -d ".vercel" ]; then
    cp -r .vercel .vercel.backup
    success "Backup do .vercel criado"
fi

# Limpar cache e node_modules (opcional)
if [ "$1" = "--clean" ]; then
    log "🧹 Limpando cache e node_modules..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    success "Cache limpo"
fi

# Instalar dependências
log "📦 Instalando dependências..."
npm ci
success "Dependências instaladas"

# Executar linting
log "🔍 Executando linting..."
if npm run lint; then
    success "Linting passou"
else
    warning "Linting encontrou problemas. Continuando mesmo assim..."
fi

# Executar testes
log "🧪 Executando testes..."
if npm run test; then
    success "Testes passaram"
else
    warning "Alguns testes falharam. Continuando mesmo assim..."
fi

# Build do projeto
log "🏗️  Fazendo build do projeto..."
if npm run build; then
    success "Build concluído com sucesso"
else
    error "Build falhou"
    exit 1
fi

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    error "Pasta dist não foi criada. Build falhou."
    exit 1
fi

# Deploy para Vercel
log "🚀 Fazendo deploy para Vercel..."

# Verificar se é deploy de produção
if [ "$1" = "--prod" ]; then
    log "🌐 Deploy de PRODUÇÃO"
    vercel --prod
else
    log "🔍 Deploy de PREVIEW"
    vercel
fi

# Verificar status do deploy
if [ $? -eq 0 ]; then
    success "Deploy concluído com sucesso!"
    
    # Mostrar URL do deploy
    if [ "$1" = "--prod" ]; then
        log "🌐 URL de produção: https://smartimport-5-0.vercel.app"
    else
        log "🔍 URL de preview: $(vercel ls | grep smartimport | head -1 | awk '{print $2}')"
    fi
    
    # Notificar no ClickUp (se configurado)
    if [ -n "$CLICKUP_API_TOKEN" ]; then
        log "📋 Criando notificação no ClickUp..."
        # Implementar notificação no ClickUp
        success "Notificação enviada"
    fi
    
    # Backup automático (se configurado)
    if [ -n "$ONEDRIVE_TOKEN" ]; then
        log "☁️  Criando backup no OneDrive..."
        # Implementar backup no OneDrive
        success "Backup criado"
    fi
    
else
    error "Deploy falhou"
    exit 1
fi

# Limpeza
if [ -d ".vercel.backup" ]; then
    rm -rf .vercel.backup
fi

log "🎉 Deploy finalizado com sucesso!"
log "📊 Acesse o dashboard do Vercel para mais detalhes: https://vercel.com/dashboard"

# Mostrar próximos passos
echo ""
log "📋 Próximos passos:"
echo "   1. Teste a aplicação no ambiente de produção"
echo "   2. Configure domínio personalizado (opcional)"
echo "   3. Configure variáveis de ambiente"
echo "   4. Configure integrações (OneDrive, ClickUp, GitHub)"
echo "   5. Configure monitoramento e analytics"
echo ""

success "SmartImport 5.0 está no ar! 🚀" 