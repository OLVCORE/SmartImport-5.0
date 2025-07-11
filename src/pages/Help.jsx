import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Calculator,
  Upload,
  Brain
} from 'lucide-react'

const Help = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const sections = [
    { id: 'getting-started', name: 'Primeiros Passos', icon: Play },
    { id: 'simulator', name: 'Simulador', icon: Calculator },
    { id: 'ocr', name: 'OCR e IA', icon: Brain },
    { id: 'reports', name: 'Relatórios', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: HelpCircle }
  ]

  const faqs = [
    {
      question: 'Como funciona o simulador de importação?',
      answer: 'O simulador permite calcular todos os custos envolvidos em uma operação de importação, incluindo impostos, frete, seguro e custos logísticos. Basta inserir os dados do produto e o sistema calculará automaticamente a viabilidade da operação.'
    },
    {
      question: 'O que é classificação NCM?',
      answer: 'A classificação NCM (Nomenclatura Comum do Mercosul) é um código que identifica o produto para fins de tributação. O SmartImport usa IA para sugerir automaticamente o código NCM correto baseado na descrição do produto.'
    },
    {
      question: 'Como funciona o OCR?',
      answer: 'O OCR (Reconhecimento Óptico de Caracteres) extrai automaticamente o texto de documentos PDF como editais e catálogos técnicos, facilitando a inserção de dados no simulador.'
    },
    {
      question: 'Quais impostos são calculados?',
      answer: 'O sistema calcula II (Imposto de Importação), IPI (Imposto sobre Produtos Industrializados), ICMS, PIS e COFINS, além de custos logísticos como AFRMM, THC, armazenagem e movimentação.'
    },
    {
      question: 'Posso exportar os resultados?',
      answer: 'Sim! Você pode exportar os resultados em PDF e Excel, incluindo relatórios detalhados com análises de viabilidade e breakdown de custos.'
    },
    {
      question: 'Os dados são seguros?',
      answer: 'Sim, todos os dados são armazenados localmente no seu navegador e não são compartilhados com terceiros. Suas simulações ficam privadas e seguras.'
    }
  ]

  const tutorials = [
    {
      title: 'Criando sua primeira simulação',
      description: 'Aprenda os passos básicos para criar uma simulação de importação',
      duration: '5 min',
      icon: Play
    },
    {
      title: 'Usando OCR para extrair dados',
      description: 'Como usar o OCR para processar documentos automaticamente',
      duration: '3 min',
      icon: Upload
    },
    {
      title: 'Interpretando os resultados',
      description: 'Entenda os números e indicadores de viabilidade',
      duration: '7 min',
      icon: Calculator
    },
    {
      title: 'Gerando relatórios',
      description: 'Como exportar e compartilhar seus relatórios',
      duration: '4 min',
      icon: FileText
    }
  ]

  return (
    <>
      <Helmet>
        <title>Ajuda - SmartImport 4.0</title>
        <meta name="description" content="Central de ajuda e documentação do SmartImport" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Central de Ajuda
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Encontre respostas para suas dúvidas e aprenda a usar o SmartImport
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suporte Online
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Entre em contato com nossa equipe de suporte
            </p>
            <button className="btn-primary w-full">
              Abrir Chat
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email de Suporte
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Envie suas dúvidas por email
            </p>
            <a 
              href="mailto:suporte@exceltta.com"
              className="btn-outline w-full text-center"
            >
              Enviar Email
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Telefone
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Fale diretamente conosco
            </p>
            <a 
              href="tel:+5511999999999"
              className="btn-outline w-full text-center"
            >
              (11) 99999-9999
            </a>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <nav className="p-4 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Getting Started */}
                    {activeSection === 'getting-started' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Primeiros Passos
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              Bem-vindo ao SmartImport 4.0!
                            </h3>
                            <p className="text-blue-800 dark:text-blue-200">
                              O SmartImport é um simulador inteligente que ajuda você a calcular todos os custos 
                              envolvidos em operações de importação, desde impostos até custos logísticos.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tutorials.map((tutorial, index) => (
                              <motion.div
                                key={tutorial.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <tutorial.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                      {tutorial.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {tutorial.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {tutorial.duration}
                                      </span>
                                      <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                                        Assistir
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Simulator Guide */}
                    {activeSection === 'simulator' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Guia do Simulador
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="prose dark:prose-invert max-w-none">
                            <h3>Como usar o simulador</h3>
                            <ol>
                              <li><strong>Descrição do Produto:</strong> Insira a descrição detalhada do produto que deseja importar</li>
                              <li><strong>Upload de Documento:</strong> Faça upload de PDFs para extração automática de dados</li>
                              <li><strong>Classificação NCM:</strong> Use a IA para classificar automaticamente o produto</li>
                              <li><strong>Valores e Moedas:</strong> Insira valores FOB, frete, seguro e taxa de câmbio</li>
                              <li><strong>Logística:</strong> Configure origem, destino, modal e custos adicionais</li>
                              <li><strong>Tributos:</strong> Verifique e ajuste as alíquotas tributárias</li>
                              <li><strong>Cálculo:</strong> Execute a simulação para ver os resultados</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OCR and AI */}
                    {activeSection === 'ocr' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          OCR e Inteligência Artificial
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Tecnologias Avançadas
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  OCR (Reconhecimento Óptico)
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  Extrai automaticamente texto de documentos PDF, incluindo editais, 
                                  catálogos técnicos e especificações de produtos.
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  IA para Classificação NCM
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  Usa inteligência artificial para sugerir automaticamente o código NCM 
                                  correto baseado na descrição do produto.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reports */}
                    {activeSection === 'reports' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Relatórios e Exportação
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="prose dark:prose-invert max-w-none">
                            <h3>Tipos de Relatório</h3>
                            <ul>
                              <li><strong>Relatório Financeiro:</strong> Análise detalhada de custos e rentabilidade</li>
                              <li><strong>Análise Tributária:</strong> Breakdown completo de impostos e alíquotas</li>
                              <li><strong>Custos Logísticos:</strong> Detalhamento de frete, seguro e custos portuários</li>
                              <li><strong>Análise Comparativa:</strong> Comparação entre diferentes simulações</li>
                            </ul>
                            
                            <h3>Formatos de Exportação</h3>
                            <ul>
                              <li><strong>PDF:</strong> Relatórios formatados para impressão e compartilhamento</li>
                              <li><strong>Excel:</strong> Dados estruturados para análise avançada</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FAQ */}
                    {activeSection === 'faq' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Perguntas Frequentes
                        </h2>
                        
                        <div className="space-y-4">
                          {faqs.map((faq, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {faq.question}
                                </span>
                                {expandedFaq === index ? (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              
                              {expandedFaq === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-6 pb-4"
                                >
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                  </p>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Help 