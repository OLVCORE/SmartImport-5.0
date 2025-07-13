#!/bin/bash

echo "🚀 Deployando SmartImport 5.0 para produção..."

# Build do projeto
npm run build

# Deploy para Vercel
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://smartimport-5-0.vercel.app" 