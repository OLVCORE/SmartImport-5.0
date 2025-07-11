import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  HelpCircle,
  Mail,
  Phone,
  BookOpen,
  Info,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  UserPlus,
  PlayCircle
} from 'lucide-react'

const faqs = [
  {
    question: 'Como faço uma simulação de importação?',
    answer: 'Acesse a página Simulador, preencha os dados do produto, envie a documentação e siga as etapas. O sistema irá calcular automaticamente os impostos, frete e sugerir o NCM.'
  },
  {
    question: 'Como conectar o SmartImport ao meu ERP?',
    answer: 'Vá em Integrações, selecione Webhooks ou APIs, copie a URL ou chave e configure no seu ERP. Consulte a documentação técnica para detalhes.'
  },
  {
    question: 'Como restaurar um backup?',
    answer: 'Na página de Configurações, clique em Backup e siga as instruções para restaurar os dados do OneDrive.'
  },
  {
    question: 'Como funciona a classificação fiscal por IA?',
    answer: 'O sistema utiliza modelos de IA para sugerir o NCM mais adequado com base na descrição e documentação do produto.'
  },
  {
    question: 'Como exportar relatórios?',
    answer: 'Acesse a página Relatórios, selecione o tipo desejado e clique em Exportar PDF.'
  }
]

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <>
      <Helmet>
        <title>Ajuda e Suporte - SmartImport 5.0</title>
        <meta name="description" content="Central de ajuda, FAQ e suporte ao usuário" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ajuda & Suporte
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tire dúvidas, acesse o FAQ e entre em contato com o suporte
            </p>
          </div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" /> Perguntas Frequentes
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => handleToggle(idx)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-gray-700 dark:text-gray-300"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" /> Fale com o Suporte
          </h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-blue-500" />
              <span className="text-gray-900 dark:text-white">suporte@smartimport.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-green-500" />
              <span className="text-gray-900 dark:text-white">0800 123 4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle size={16} className="text-purple-500" />
              <a
                href="https://wa.me/5508001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                WhatsApp Suporte
                <ExternalLink size={14} className="inline ml-1" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Links Úteis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" /> Links Úteis
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/docs/APIS_INTEGRATION.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                Integração de APIs
                <ExternalLink size={14} className="inline ml-1" />
              </a>
            </li>
            <li>
              <a
                href="/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                Documentação Geral
                <ExternalLink size={14} className="inline ml-1" />
              </a>
            </li>
            <li>
              <a
                href="/docs/APIS_INTEGRATION.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                Guia de Integração ERP
                <ExternalLink size={14} className="inline ml-1" />
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Onboarding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" /> Onboarding Rápido
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Acesse o Simulador e realize sua primeira simulação.</li>
            <li>Conecte suas integrações em Configurações &gt; Integrações.</li>
            <li>Configure backups automáticos no OneDrive.</li>
            <li>Consulte relatórios e histórico para acompanhar resultados.</li>
            <li>Em caso de dúvidas, acesse o FAQ ou entre em contato com o suporte.</li>
          </ol>
          <div className="mt-4 flex items-center space-x-2">
            <PlayCircle size={20} className="text-blue-500" />
            <span className="text-gray-900 dark:text-white">Veja o vídeo de onboarding (em breve)</span>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Help 