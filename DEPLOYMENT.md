# SmartImport 5.0 - Guia de Deploy

## 🚀 Deploy Automático

### Vercel (Frontend - Recomendado)

1. **Conectar ao GitHub:**
   ```bash
   # Faça push do código para o GitHub
   git add .
   git commit -m "SmartImport 5.0 - Versão inicial"
   git push origin main
   ```

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe o repositório `SmartImport-5.0`
   - Configure as variáveis de ambiente:
     ```
     VITE_APP_NAME=SmartImport 5.0
     VITE_APP_VERSION=5.0.0
     VITE_API_URL=https://smartimport-api.railway.app
     ```

3. **Configurações do Projeto:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Railway (Backend - Opcional)

1. **Preparar Backend:**
   ```bash
   # Criar pasta backend
   mkdir backend
   cd backend
   
   # Inicializar projeto Node.js
   npm init -y
   npm install express cors helmet morgan dotenv
   ```

2. **Deploy no Railway:**
   - Acesse [railway.app](https://railway.app)
   - Conecte sua conta GitHub
   - Deploy do repositório backend
   - Configure variáveis de ambiente:
     ```
     NODE_ENV=production
     PORT=3000
     CORS_ORIGIN=https://smartimport-5-0.vercel.app
     ```

## 🔧 Configurações de Integração

### GitHub Integration

1. **Webhook para Deploy Automático:**
   ```bash
   # Configurar webhook no GitHub
   # Settings > Webhooks > Add webhook
   # Payload URL: https://vercel.com/api/webhooks/github
   # Content type: application/json
   # Events: Push, Pull Request
   ```

2. **GitHub Actions (CI/CD):**
   ```yaml
   # .github/workflows/deploy.yml
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
         - run: npm run test
   ```

### OneDrive Backup

1. **Configurar Backup Automático:**
   ```javascript
   // src/utils/backup.js
   export const backupToOneDrive = async (data) => {
     const backup = {
       timestamp: new Date().toISOString(),
       data: data,
       version: '5.0.0'
     }
     
     // Implementar integração com Microsoft Graph API
     // ou usar OneDrive Web API
   }
   ```

2. **Agendar Backups:**
   ```javascript
   // Configurar backup diário às 02:00
   setInterval(() => {
     const store = useSimulationStore.getState()
     backupToOneDrive(store)
   }, 24 * 60 * 60 * 1000)
   ```

### ClickUp Integration

1. **Configurar Webhook:**
   ```javascript
   // src/utils/clickup.js
   export const createClickUpTask = async (simulation) => {
     const task = {
       name: `Simulação: ${simulation.productName}`,
       description: `NCM: ${simulation.ncmCode}\nValor: ${simulation.totalValue}`,
       status: simulation.status === 'completed' ? 'complete' : 'in_progress'
     }
     
     // Implementar integração com ClickUp API
   }
   ```

2. **Automatizar Criação de Tasks:**
   ```javascript
   // No store, após criar simulação
   createSimulation: (data) => {
     // ... lógica existente
     createClickUpTask(newSimulation)
   }
   ```

## 📊 Monitoramento e Analytics

### Vercel Analytics
```javascript
// src/main.jsx
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
)
```

### Error Tracking
```javascript
// src/utils/errorTracking.js
export const trackError = (error, context) => {
  // Integrar com Sentry ou similar
  console.error('Error tracked:', error, context)
}
```

## 🔒 Segurança

### Variáveis de Ambiente
```bash
# .env.production
VITE_API_URL=https://api.smartimport.com
VITE_APP_ENV=production
VITE_SENTRY_DSN=your-sentry-dsn
```

### CORS Configuration
```javascript
// Backend
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
```

## 📱 PWA Configuration

### Manifest
```json
{
  "name": "SmartImport 5.0",
  "short_name": "SmartImport",
  "description": "Simulador de Importação Inteligente",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6"
}
```

### Service Worker
```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('smartimport-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ])
    })
  )
})
```

## 🚀 Performance Optimization

### Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

### Image Optimization
```javascript
// Usar Vite Image Plugin
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [ViteImageOptimizer()]
})
```

## 📈 Monitoring Setup

### Health Checks
```javascript
// src/utils/healthCheck.js
export const healthCheck = async () => {
  try {
    const response = await fetch('/api/health')
    return response.ok
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}
```

### Performance Monitoring
```javascript
// src/utils/performance.js
export const trackPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0]
    console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart)
  }
}
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
name: Deploy SmartImport
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📋 Checklist de Deploy

- [ ] Código testado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção testado localmente
- [ ] Integrações (GitHub, OneDrive, ClickUp) configuradas
- [ ] Monitoramento e analytics ativos
- [ ] Backup automático configurado
- [ ] Documentação atualizada
- [ ] Testes de performance realizados
- [ ] SSL/HTTPS configurado
- [ ] CORS configurado corretamente

## 🆘 Troubleshooting

### Problemas Comuns

1. **Build falha no Vercel:**
   - Verificar dependências no package.json
   - Testar build local: `npm run build`
   - Verificar logs no Vercel

2. **CORS errors:**
   - Verificar configuração de CORS no backend
   - Confirmar URLs permitidas

3. **Performance lenta:**
   - Otimizar bundle size
   - Implementar lazy loading
   - Usar CDN para assets

### Logs e Debugging
```bash
# Verificar logs do Vercel
vercel logs

# Debug local
npm run dev -- --debug

# Testar build
npm run build && npm run preview
```

## 📞 Suporte

Para suporte técnico:
- Email: suporte@smartimport.com
- WhatsApp: +55 11 99999-9999
- Documentação: [docs.smartimport.com](https://docs.smartimport.com)

---

**SmartImport 5.0** - Deploy automatizado e integrado com as melhores práticas de desenvolvimento moderno. 