# Guia de Deploy - SmartImport 4.0

## 🚀 Deploy na Vercel (Recomendado)

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Repositório Git configurado

### Passos para Deploy

1. **Conectar com Vercel**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Fazer login
   vercel login
   ```

2. **Deploy Automático**
   - Conecte seu repositório GitHub/GitLab na Vercel
   - A Vercel detectará automaticamente que é um projeto Vite
   - Configure as variáveis de ambiente se necessário

3. **Deploy Manual**
   ```bash
   # Build do projeto
   npm run build
   
   # Deploy
   vercel --prod
   ```

### Configuração de Variáveis de Ambiente
```env
VITE_API_BASE_URL=https://api.exceltta.com
VITE_ENABLE_OCR=true
VITE_ENABLE_AI_CLASSIFICATION=true
```

## 🌐 Deploy no Railway

### Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório Git configurado

### Passos
1. Conecte seu repositório no Railway
2. Configure o comando de build: `npm run build`
3. Configure o comando de start: `npm run preview`
4. Configure as variáveis de ambiente

## 📦 Deploy Manual (VPS/Server)

### Build para Produção
```bash
# Instalar dependências
npm install

# Build
npm run build

# Preview local
npm run preview
```

### Configuração do Nginx
```nginx
server {
    listen 80;
    server_name smartimport.exceltta.com;
    root /var/www/smartimport/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Configuração do Apache
```apache
<VirtualHost *:80>
    ServerName smartimport.exceltta.com
    DocumentRoot /var/www/smartimport/dist
    
    <Directory /var/www/smartimport/dist>
        AllowOverride All
        Require all granted
    </Directory>
    
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
</VirtualHost>
```

## 🔧 Configurações de Produção

### Otimizações de Performance
- ✅ Compressão Gzip/Brotli habilitada
- ✅ Cache de assets estáticos
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ PWA configurado

### Segurança
- ✅ Headers de segurança configurados
- ✅ CSP (Content Security Policy)
- ✅ HTTPS obrigatório
- ✅ Proteção contra XSS

### Monitoramento
- ✅ Error tracking (configurar Sentry)
- ✅ Analytics (configurar Google Analytics)
- ✅ Performance monitoring

## 📱 PWA (Progressive Web App)

### Instalação
O SmartImport 4.0 é uma PWA completa que pode ser instalada em:
- Chrome/Edge (Desktop)
- Safari (iOS)
- Chrome (Android)

### Recursos PWA
- ✅ Offline support
- ✅ Push notifications (configurar)
- ✅ App-like experience
- ✅ Fast loading

## 🔄 CI/CD

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro 404 em rotas**
   - Verificar configuração de SPA routing
   - Configurar fallback para index.html

2. **Assets não carregam**
   - Verificar base path no vite.config.js
   - Verificar configuração de CDN

3. **PWA não funciona**
   - Verificar manifest.json
   - Verificar service worker
   - Testar em HTTPS

4. **Performance lenta**
   - Verificar compressão
   - Verificar cache
   - Otimizar imagens

## 📞 Suporte

Para suporte técnico:
- Email: suporte@exceltta.com
- WhatsApp: +55 11 99999-9999
- Documentação: https://docs.smartimport.exceltta.com

## 🔄 Atualizações

### Processo de Atualização
1. Desenvolver em branch feature
2. Testar localmente
3. Fazer PR para main
4. Deploy automático via CI/CD
5. Monitorar produção

### Rollback
```bash
# Vercel
vercel rollback

# Railway
railway rollback

# Manual
git checkout <commit-hash>
npm run build
# redeploy
``` 