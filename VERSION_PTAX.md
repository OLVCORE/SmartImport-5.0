# PTAX API - Controle de Versões

## Versão Atual: 5.0.1
**Data:** 2025-01-15
**Status:** PRODUÇÃO

### Mecanismo de Fallback Prioritário
- ✅ Implementado
- ✅ Testado
- ✅ Deploy automático

### Configurações
- Máximo de tentativas: 7 dias
- Logs detalhados: NÃO
- Ambiente: production

### Histórico
- 5.0.1 (2025-01-15): Mecanismo de fallback prioritário
- 5.0.0 (2025-01-14): Implementação inicial

### Comandos de Deploy
```bash
# Deploy para Vercel
npm run deploy

# Verificar status
curl https://smartimport-5-0.vercel.app/api/ptax?moeda=USD&data=01-15-2025
```
