# 🔗 Integração Real com TTCE/Siscomex

## 🎯 Objetivo
Implementar consultas **reais e diretas** à API oficial do TTCE (Tratamento Tributário do Comércio Exterior) do Siscomex, sem dados simulados.

## 🚀 Implementação

### 1. **Backend (Node.js/Express)**

Crie o endpoint `/api/ttce/consultar` no seu backend:

```javascript
// api/ttce/consultar.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { ncm, codigoPais, dataFatoGerador, tipoOperacao } = req.body

    // URL oficial do Siscomex TTCE
    const ttceUrl = 'https://portalunico.siscomex.gov.br/ttce/api/ext/tratamentos-tributarios/importacao/'

    const payload = {
      ncm: ncm.toString(),
      codigoPais: codigoPais.toString(),
      dataFatoGerador,
      tipoOperacao: tipoOperacao || 'I'
    }

    // Chamada real para a API do Siscomex
    const response = await fetch(ttceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SmartImport-5.0/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({
        error: `Erro TTCE: ${response.status}`,
        details: errorText
      })
    }

    const data = await response.json()
    return res.status(200).json(data)

  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
}
```

### 2. **Frontend (SmartImport)**

O frontend já está configurado para usar `consultarTTCEViaBackend()` que faz a chamada para `/api/ttce/consultar`.

### 3. **Configuração Vercel**

Se estiver usando Vercel, adicione no `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/ttce/consultar",
      "destination": "/api/ttce/consultar.js"
    }
  ]
}
```

## 🔧 Configurações Necessárias

### **Variáveis de Ambiente**
```env
# Backend
TTCE_API_URL=https://portalunico.siscomex.gov.br
TTCE_TIMEOUT=30000
TTCE_RETRY_ATTEMPTS=3
```

### **Headers Necessários**
- `Content-Type: application/json`
- `Accept: application/json`
- `User-Agent: SmartImport-5.0/1.0`

## 📋 Parâmetros da API TTCE

### **Obrigatórios:**
- `ncm`: Código NCM (8 dígitos)
- `codigoPais`: Código do país de origem (ex: 105 para Brasil)
- `dataFatoGerador`: Data do fato gerador (YYYY-MM-DD)

### **Opcionais:**
- `tipoOperacao`: 'I' (importação) ou 'E' (exportação)
- `fundamentosOpcionais`: Array de fundamentos legais

## 🧪 Teste da Integração

### **1. Teste Local**
```bash
# Iniciar backend
npm run dev

# Testar endpoint
curl -X POST http://localhost:3000/api/ttce/consultar \
  -H "Content-Type: application/json" \
  -d '{
    "ncm": "85171200",
    "codigoPais": "105",
    "dataFatoGerador": "2024-01-15",
    "tipoOperacao": "I"
  }'
```

### **2. Teste no Frontend**
1. Digite um NCM válido (ex: `85171200`)
2. Pressione Enter ou Tab
3. Verifique os logs no console
4. Confirme os dados oficiais exibidos

## 🔍 Logs de Debug

### **Frontend:**
```
🚀 Consultando TTCE via backend...
✅ Dados TTCE via backend: { ... }
```

### **Backend:**
```
🚀 Backend: Consultando TTCE real...
📋 Backend: Resposta TTCE status: 200
✅ Backend: Dados TTCE recebidos: { ... }
```

## ⚠️ Considerações Importantes

### **1. Rate Limiting**
- A API do Siscomex pode ter limites de requisições
- Implemente cache para evitar consultas repetidas
- Considere implementar retry com backoff exponencial

### **2. Autenticação**
- Verifique se a API requer autenticação
- Implemente headers de autorização se necessário

### **3. CORS**
- O backend resolve problemas de CORS
- Configure headers adequados no servidor

### **4. Monitoramento**
- Implemente logs detalhados
- Monitore tempo de resposta
- Configure alertas para falhas

## 🚀 Próximos Passos

1. **Implementar cache** para NCMs consultados
2. **Adicionar retry automático** em caso de falha
3. **Implementar rate limiting** para evitar sobrecarga
4. **Adicionar métricas** de performance
5. **Configurar monitoramento** em produção

## 📞 Suporte

Para dúvidas sobre a API TTCE:
- **Documentação oficial**: https://portalunico.siscomex.gov.br
- **Suporte técnico**: suporte@siscomex.gov.br
- **Telefone**: 0800 704 1993 