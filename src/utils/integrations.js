// SmartImport 5.0 - Integrações Externas
// Utilitários para integração com OneDrive, ClickUp, GitHub e outras APIs

// OneDrive Integration
export class OneDriveIntegration {
  constructor(clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.accessToken = null
  }

  async authenticate() {
    try {
      // Implementar autenticação OAuth2 com Microsoft Graph
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=files.readwrite`
      
      // Abrir popup para autenticação
      const popup = window.open(authUrl, 'onedrive-auth', 'width=500,height=600')
      
      return new Promise((resolve, reject) => {
        window.addEventListener('message', (event) => {
          if (event.data.type === 'onedrive-auth-success') {
            this.accessToken = event.data.accessToken
            resolve(this.accessToken)
          } else if (event.data.type === 'onedrive-auth-error') {
            reject(new Error(event.data.error))
          }
        })
      })
    } catch (error) {
      console.error('OneDrive authentication failed:', error)
      throw error
    }
  }

  async createBackup(data) {
    if (!this.accessToken) {
      throw new Error('OneDrive not authenticated')
    }

    try {
      const backup = {
        timestamp: new Date().toISOString(),
        data: data,
        version: '5.0.0',
        type: 'smartimport-backup'
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/SmartImport/backup.json:/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backup)
      })

      if (!response.ok) {
        throw new Error('Failed to create backup')
      }

      return await response.json()
    } catch (error) {
      console.error('OneDrive backup failed:', error)
      throw error
    }
  }

  async restoreBackup() {
    if (!this.accessToken) {
      throw new Error('OneDrive not authenticated')
    }

    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/SmartImport/backup.json:/content', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Backup not found')
      }

      const backup = await response.json()
      return backup.data
    } catch (error) {
      console.error('OneDrive restore failed:', error)
      throw error
    }
  }
}

// ClickUp Integration
export class ClickUpIntegration {
  constructor(apiToken, spaceId) {
    this.apiToken = apiToken
    this.spaceId = spaceId
    this.baseUrl = 'https://api.clickup.com/api/v2'
  }

  async createTask(simulation) {
    try {
      const task = {
        name: `Simulação: ${simulation.productName}`,
        description: `
**SmartImport 5.0 - Nova Simulação**

**Produto:** ${simulation.productName}
**NCM:** ${simulation.ncmCode}
**Origem:** ${simulation.originCountry}
**Destino:** ${simulation.destinationState}
**Valor:** R$ ${simulation.totalValue.toLocaleString('pt-BR')}
**Status:** ${simulation.status}

**Detalhes:**
- Valor Final: R$ ${simulation.finalValue?.toLocaleString('pt-BR') || 'N/A'}
- Lucratividade: ${simulation.profitability || 'N/A'}%
- Criado em: ${new Date(simulation.createdAt).toLocaleString('pt-BR')}

**Ações Necessárias:**
- [ ] Revisar cálculos
- [ ] Validar NCM
- [ ] Aprovar simulação
        `,
        status: simulation.status === 'completed' ? 'complete' : 'in progress',
        priority: simulation.totalValue > 100000 ? 1 : 3,
        tags: ['smartimport', 'simulacao', simulation.transportMode]
      }

      const response = await fetch(`${this.baseUrl}/space/${this.spaceId}/task`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })

      if (!response.ok) {
        throw new Error('Failed to create ClickUp task')
      }

      return await response.json()
    } catch (error) {
      console.error('ClickUp task creation failed:', error)
      throw error
    }
  }

  async updateTask(taskId, simulation) {
    try {
      const updates = {
        name: `Simulação: ${simulation.productName} (${simulation.status})`,
        status: simulation.status === 'completed' ? 'complete' : 'in progress'
      }

      const response = await fetch(`${this.baseUrl}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': this.apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update ClickUp task')
      }

      return await response.json()
    } catch (error) {
      console.error('ClickUp task update failed:', error)
      throw error
    }
  }

  async createDeploymentNotification(version, url) {
    try {
      const task = {
        name: `🚀 Deploy SmartImport ${version}`,
        description: `
**Deploy Automático Concluído**

**Versão:** ${version}
**URL:** ${url}
**Data:** ${new Date().toLocaleString('pt-BR')}
**Status:** ✅ Sucesso

**Próximos Passos:**
- [ ] Testar funcionalidades principais
- [ ] Verificar integrações
- [ ] Monitorar performance
- [ ] Notificar usuários
        `,
        status: 'complete',
        priority: 1,
        tags: ['deploy', 'smartimport', 'automacao']
      }

      return await this.createTask(task)
    } catch (error) {
      console.error('ClickUp deployment notification failed:', error)
      throw error
    }
  }
}

// GitHub Integration
export class GitHubIntegration {
  constructor(token, owner, repo) {
    this.token = token
    this.owner = owner
    this.repo = repo
    this.baseUrl = 'https://api.github.com'
  }

  async createRelease(version, notes) {
    try {
      const release = {
        tag_name: `v${version}`,
        name: `SmartImport ${version}`,
        body: notes,
        draft: false,
        prerelease: false
      }

      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/releases`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(release)
      })

      if (!response.ok) {
        throw new Error('Failed to create GitHub release')
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub release creation failed:', error)
      throw error
    }
  }

  async createIssue(title, body, labels = []) {
    try {
      const issue = {
        title,
        body,
        labels: ['smartimport', ...labels]
      }

      const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issue)
      })

      if (!response.ok) {
        throw new Error('Failed to create GitHub issue')
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub issue creation failed:', error)
      throw error
    }
  }

  async getCommitHistory(days = 7) {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)

      const response = await fetch(
        `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?since=${since.toISOString()}`,
        {
          headers: {
            'Authorization': `token ${this.token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub commits')
      }

      return await response.json()
    } catch (error) {
      console.error('GitHub commit history fetch failed:', error)
      throw error
    }
  }
}

// Analytics Integration
export class AnalyticsIntegration {
  constructor() {
    this.events = []
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    }

    this.events.push(event)

    // Enviar para analytics (Google Analytics, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('event', eventName, properties)
    }

    // Enviar para backend se necessário
    this.sendToBackend(event)
  }

  trackSimulation(simulation) {
    this.trackEvent('simulation_created', {
      product_name: simulation.productName,
      ncm_code: simulation.ncmCode,
      origin_country: simulation.originCountry,
      destination_state: simulation.destinationState,
      transport_mode: simulation.transportMode,
      total_value: simulation.totalValue,
      final_value: simulation.finalValue,
      profitability: simulation.profitability
    })
  }

  trackError(error, context = {}) {
    this.trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context
    })
  }

  getSessionId() {
    let sessionId = localStorage.getItem('smartimport_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('smartimport_session_id', sessionId)
    }
    return sessionId
  }

  async sendToBackend(event) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to send analytics to backend:', error)
    }
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
  }

  startTimer(name) {
    this.metrics[name] = {
      start: performance.now(),
      end: null,
      duration: null
    }
  }

  endTimer(name) {
    if (this.metrics[name]) {
      this.metrics[name].end = performance.now()
      this.metrics[name].duration = this.metrics[name].end - this.metrics[name].start
      
      // Log performance
      console.log(`⏱️ ${name}: ${this.metrics[name].duration.toFixed(2)}ms`)
      
      // Enviar para analytics
      if (window.analytics) {
        window.analytics.trackEvent('performance_metric', {
          metric_name: name,
          duration_ms: this.metrics[name].duration
        })
      }
    }
  }

  measurePageLoad() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0]
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      
      console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`)
      
      return loadTime
    }
  }

  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory
      console.log(`💾 Memory Usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
      
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
  }
}

// Export instances
export const oneDrive = new OneDriveIntegration(
  import.meta.env.VITE_ONEDRIVE_CLIENT_ID,
  import.meta.env.VITE_ONEDRIVE_CLIENT_SECRET
)

export const clickUp = new ClickUpIntegration(
  import.meta.env.VITE_CLICKUP_API_TOKEN,
  import.meta.env.VITE_CLICKUP_SPACE_ID
)

export const github = new GitHubIntegration(
  import.meta.env.VITE_GITHUB_TOKEN,
  import.meta.env.VITE_GITHUB_OWNER,
  import.meta.env.VITE_GITHUB_REPO
)

export const analytics = new AnalyticsIntegration()
export const performance = new PerformanceMonitor()

// Initialize analytics
if (typeof window !== 'undefined') {
  window.analytics = analytics
  window.performance = performance
} 