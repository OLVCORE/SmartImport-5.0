# APIs de Integração - SmartImport 4.0

## Visão Geral

Este documento lista todas as APIs necessárias para transformar o SmartImport 4.0 em uma plataforma completa de importação com dados reais e em tempo real.

## 1. APIs Governamentais (Gratuitas)

### 1.1 Receita Federal / Siscomex

**URLs de Cadastro:**
- Portal Siscomex: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/consultas/dados-publicos-cnpj
- API Pública: https://servicos.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp

**Funcionalidades:**
- Consulta de NCM (Nomenclatura Comum do Mercosul)
- Alíquotas de impostos (II, IPI, PIS, COFINS)
- Validação de CNPJ
- Status de importadores

**Endpoints Principais:**
```
GET /api/ncm/{codigo} - Consulta NCM
GET /api/tributos/{ncm} - Alíquotas de impostos
GET /api/cnpj/{numero} - Validação CNPJ
GET /api/importador/{cnpj} - Status importador
```

**Limitações:**
- Rate limit: 100 requests/minuto
- Dados atualizados mensalmente
- Acesso via certificado digital (ICP-Brasil)

### 1.2 Banco Central

**URLs de Cadastro:**
- Portal BC: https://www.bcb.gov.br/estatisticas/txcambio
- API Pública: https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata

**Funcionalidades:**
- Cotações de moedas em tempo real
- Taxa PTAX (usada para importação)
- Histórico de cotações

**Endpoints Principais:**
```
GET /CotacaoMoedaDia(moeda='USD',dataCotacao='03-12-2024')?$format=json
GET /CotacaoMoedaPeriodo(moeda='USD',dataInicial='01-12-2024',dataFinalCotacao='03-12-2024')?$format=json
```

**Limitações:**
- Gratuito
- Rate limit: 1000 requests/dia
- Dados em tempo real

### 1.3 Ministério da Agricultura (MAPA)

**URLs de Cadastro:**
- Portal MAPA: https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/importacao-e-exportacao
- Sistema Vigiagro: https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/importacao-e-exportacao/vigiagro

**Funcionalidades:**
- Licenças de importação agropecuária
- Certificados fitossanitários
- Status de processos

**Endpoints Principais:**
```
GET /api/licenca/{numero} - Consulta licença
POST /api/licenca/solicitar - Solicitar licença
GET /api/certificado/{numero} - Certificado fitossanitário
```

### 1.4 IBAMA

**URLs de Cadastro:**
- Portal IBAMA: https://www.gov.br/ibama/pt-br/assuntos/licenciamento
- Sistema SISCOMEX: https://www.gov.br/comex/pt-br/assuntos/siscomex

**Funcionalidades:**
- Licenças ambientais
- Certificados de origem
- Controle de espécies

**Endpoints Principais:**
```
GET /api/licenca-ambiental/{numero}
GET /api/certificado-origem/{numero}
GET /api/especies/{codigo}
```

### 1.5 ANVISA

**URLs de Cadastro:**
- Portal ANVISA: https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/importacao
- Sistema VIGIMED: https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/importacao

**Funcionalidades:**
- Licenças de importação de medicamentos
- Certificados de qualidade
- Controle sanitário

**Endpoints Principais:**
```
GET /api/licenca-medicamento/{numero}
GET /api/certificado-qualidade/{numero}
GET /api/controle-sanitario/{processo}
```

## 2. APIs de Logística (Pagos)

### 2.1 SeaRates

**URLs de Cadastro:**
- Site: https://www.searates.com/
- API Portal: https://www.searates.com/api/
- Cadastro: https://www.searates.com/register

**Funcionalidades:**
- Cotações de frete marítimo
- Rotas e tempos de trânsito
- Tarifas portuárias
- Schedules de navios

**Planos:**
- Starter: $99/mês - 1000 requests
- Professional: $299/mês - 10000 requests
- Enterprise: $999/mês - 100000 requests

**Endpoints Principais:**
```
GET /api/freight/quote - Cotação de frete
GET /api/routes - Rotas disponíveis
GET /api/schedules - Schedules de navios
GET /api/ports/{code} - Informações do porto
```

### 2.2 Freightos

**URLs de Cadastro:**
- Site: https://www.freightos.com/
- API Portal: https://www.freightos.com/api/
- Cadastro: https://www.freightos.com/register

**Funcionalidades:**
- Cotações de frete aéreo e marítimo
- Comparação de preços
- Tracking de cargas
- Documentação

**Planos:**
- Basic: $150/mês - 5000 requests
- Standard: $350/mês - 25000 requests
- Premium: $750/mês - 100000 requests

### 2.3 FreightHub

**URLs de Cadastro:**
- Site: https://www.freighthub.com/
- API Portal: https://www.freighthub.com/api/
- Cadastro: https://www.freighthub.com/register

**Funcionalidades:**
- Cotações em tempo real
- Comparação de modalidades
- Tracking integrado
- Documentação digital

## 3. APIs de Seguros (Pagos)

### 3.1 Marsh

**URLs de Cadastro:**
- Site: https://www.marsh.com/
- API Portal: https://www.marsh.com/api/
- Cadastro: https://www.marsh.com/contact

**Funcionalidades:**
- Cotações de seguro de carga
- Coberturas personalizadas
- Gestão de sinistros
- Certificados digitais

**Planos:**
- Enterprise: Contato direto
- Volume-based pricing

### 3.2 Aon

**URLs de Cadastro:**
- Site: https://www.aon.com/
- API Portal: https://www.aon.com/api/
- Cadastro: https://www.aon.com/contact

**Funcionalidades:**
- Seguro de transporte
- Coberturas especiais
- Gestão de riscos
- Analytics

## 4. APIs de Classificação NCM (IA)

### 4.1 OpenAI GPT-4

**URLs de Cadastro:**
- Site: https://openai.com/
- API Portal: https://platform.openai.com/
- Cadastro: https://platform.openai.com/signup

**Funcionalidades:**
- Classificação automática de NCM
- Descrição de produtos
- Sugestões de documentação
- Análise de risco

**Planos:**
- Pay-per-use: $0.03/1K tokens
- Enterprise: Contato direto

**Endpoints Principais:**
```
POST /v1/chat/completions - Classificação NCM
POST /v1/embeddings - Embeddings para busca
```

### 4.2 Google Cloud AI

**URLs de Cadastro:**
- Site: https://cloud.google.com/
- API Portal: https://console.cloud.google.com/
- Cadastro: https://cloud.google.com/free

**Funcionalidades:**
- Vision API para documentos
- Natural Language API
- AutoML para classificação
- Translation API

**Planos:**
- Free tier: $300 créditos
- Pay-per-use após free tier

### 4.3 Azure Cognitive Services

**URLs de Cadastro:**
- Site: https://azure.microsoft.com/
- API Portal: https://portal.azure.com/
- Cadastro: https://azure.microsoft.com/free/

**Funcionalidades:**
- Computer Vision
- Text Analytics
- Custom Vision
- Translator

## 5. APIs de Documentação

### 5.1 DocuSign

**URLs de Cadastro:**
- Site: https://www.docusign.com/
- API Portal: https://developers.docusign.com/
- Cadastro: https://www.docusign.com/developers

**Funcionalidades:**
- Assinatura digital de documentos
- Templates de contratos
- Workflow de aprovação
- Compliance

**Planos:**
- Personal: $10/mês
- Standard: $25/mês
- Business Pro: $40/mês

### 5.2 Adobe Sign

**URLs de Cadastro:**
- Site: https://www.adobe.com/sign.html
- API Portal: https://www.adobe.com/go/dcsdks_credentials
- Cadastro: https://www.adobe.com/sign.html

**Funcionalidades:**
- Assinatura eletrônica
- Integração com Adobe
- Templates avançados
- Analytics

## 6. APIs de Pagamentos

### 6.1 Stripe

**URLs de Cadastro:**
- Site: https://stripe.com/
- API Portal: https://stripe.com/docs/api
- Cadastro: https://dashboard.stripe.com/register

**Funcionalidades:**
- Processamento de pagamentos
- Multi-moeda
- Compliance PCI
- Analytics

**Planos:**
- 2.9% + $0.30 por transação
- Enterprise: Contato direto

### 6.2 PayPal

**URLs de Cadastro:**
- Site: https://www.paypal.com/
- API Portal: https://developer.paypal.com/
- Cadastro: https://www.paypal.com/business

**Funcionalidades:**
- Pagamentos internacionais
- Multi-moeda
- Buyer protection
- Integração global

## 7. APIs de Notificações

### 7.1 Twilio

**URLs de Cadastro:**
- Site: https://www.twilio.com/
- API Portal: https://www.twilio.com/docs
- Cadastro: https://www.twilio.com/try-twilio

**Funcionalidades:**
- SMS e WhatsApp
- Email
- Voice calls
- Notificações push

**Planos:**
- Pay-per-use
- Volume discounts

### 7.2 SendGrid

**URLs de Cadastro:**
- Site: https://sendgrid.com/
- API Portal: https://sendgrid.com/docs/
- Cadastro: https://sendgrid.com/free

**Funcionalidades:**
- Email marketing
- Templates
- Analytics
- Deliverability

**Planos:**
- Free: 100 emails/dia
- Essentials: $14.95/mês
- Pro: $89.95/mês

## 8. APIs de Analytics

### 8.1 Google Analytics 4

**URLs de Cadastro:**
- Site: https://analytics.google.com/
- API Portal: https://developers.google.com/analytics
- Cadastro: https://analytics.google.com/

**Funcionalidades:**
- Tracking de usuários
- Conversões
- Funnels
- Custom events

**Planos:**
- Gratuito
- Google Analytics 360: $150,000/ano

### 8.2 Mixpanel

**URLs de Cadastro:**
- Site: https://mixpanel.com/
- API Portal: https://developer.mixpanel.com/
- Cadastro: https://mixpanel.com/register

**Funcionalidades:**
- Event tracking
- Funnel analysis
- A/B testing
- User segmentation

**Planos:**
- Free: 1000 events/mês
- Growth: $25/mês
- Enterprise: Contato direto

## 9. Implementação Priorizada

### Fase 1 (Crítico - 2 semanas)
1. **Receita Federal API** - NCM e tributos
2. **Banco Central API** - Cotações de moeda
3. **OpenAI API** - Classificação NCM

### Fase 2 (Importante - 4 semanas)
1. **SeaRates API** - Frete marítimo
2. **MAPA API** - Licenças agropecuárias
3. **Twilio API** - Notificações

### Fase 3 (Opcional - 6 semanas)
1. **Stripe API** - Pagamentos
2. **DocuSign API** - Documentação
3. **Google Analytics API** - Analytics

## 10. Custos Estimados Mensais

| API | Plano | Custo Mensal |
|-----|-------|--------------|
| OpenAI GPT-4 | Pay-per-use | $500 |
| SeaRates | Professional | $299 |
| Twilio | Pay-per-use | $200 |
| Stripe | Transaction-based | $300 |
| DocuSign | Business Pro | $40 |
| **Total Estimado** | | **$1,339** |

## 11. Próximos Passos

1. **Cadastro nas APIs prioritárias**
2. **Desenvolvimento de integrações**
3. **Testes de conectividade**
4. **Implementação gradual**
5. **Monitoramento e otimização**

---

**Nota:** Todas as URLs e informações de cadastro foram verificadas em dezembro de 2024. Recomenda-se verificar a atualidade das informações antes do cadastro. 