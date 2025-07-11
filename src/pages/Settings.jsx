import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Globe,
  DollarSign,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'

import { useTheme } from '../hooks/useTheme'
import { AnimatePresence } from 'framer-motion'

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    language: 'pt-BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo'
  })

  const tabs = [
    { id: 'general', name: 'Geral', icon: SettingsIcon },
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'security', name: 'Segurança', icon: Shield }
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Mock de salvamento
    console.log('Configurações salvas:', settings)
  }

  return (
    <>
      <Helmet>
        <title>Configurações - SmartImport 4.0</title>
        <meta name="description" content="Configurações do SmartImport" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Personalize sua experiência no SmartImport
            </p>
          </div>
          
          <button 
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
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
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* General Settings */}
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Configurações Gerais
                        </h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Idioma
                            </label>
                            <select
                              value={settings.language}
                              onChange={(e) => handleSettingChange('language', e.target.value)}
                              className="input-field"
                            >
                              <option value="pt-BR">Português (Brasil)</option>
                              <option value="en-US">English (US)</option>
                              <option value="es-ES">Español</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Moeda Padrão
                            </label>
                            <select
                              value={settings.currency}
                              onChange={(e) => handleSettingChange('currency', e.target.value)}
                              className="input-field"
                            >
                              <option value="BRL">Real Brasileiro (R$)</option>
                              <option value="USD">Dólar Americano ($)</option>
                              <option value="EUR">Euro (€)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Fuso Horário
                            </label>
                            <select
                              value={settings.timezone}
                              onChange={(e) => handleSettingChange('timezone', e.target.value)}
                              className="input-field"
                            >
                              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                              <option value="America/Manaus">Manaus (GMT-4)</option>
                              <option value="America/Belem">Belém (GMT-3)</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Salvar Automaticamente
                              </label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Salvar simulações automaticamente enquanto você trabalha
                              </p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                settings.autoSave ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Perfil do Usuário
                        </h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Nome Completo
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Seu nome completo"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              className="input-field"
                              placeholder="seu@email.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Empresa
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Nome da sua empresa"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Cargo
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Seu cargo na empresa"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Notificações
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notificações por Email
                              </label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receber notificações por email
                              </p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('notifications', !settings.notifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                settings.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notificações do Sistema
                              </label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Mostrar notificações no navegador
                              </p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('systemNotifications', !settings.systemNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                settings.systemNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  settings.systemNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Aparência
                        </h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tema
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                              <button
                                onClick={() => toggleTheme()}
                                className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 ${
                                  theme === 'light'
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <Sun className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Claro</span>
                              </button>
                              
                              <button
                                onClick={() => toggleTheme()}
                                className={`p-4 border-2 rounded-lg text-center transition-colors duration-200 ${
                                  theme === 'dark'
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <Moon className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Escuro</span>
                              </button>
                              
                              <button
                                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center transition-colors duration-200"
                              >
                                <Monitor className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Sistema</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Segurança
                        </h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Senha Atual
                            </label>
                            <input
                              type="password"
                              className="input-field"
                              placeholder="Digite sua senha atual"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Nova Senha
                            </label>
                            <input
                              type="password"
                              className="input-field"
                              placeholder="Digite a nova senha"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirmar Nova Senha
                            </label>
                            <input
                              type="password"
                              className="input-field"
                              placeholder="Confirme a nova senha"
                            />
                          </div>
                          
                          <button className="btn-primary">
                            Alterar Senha
                          </button>
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

export default SettingsPage 