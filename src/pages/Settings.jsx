import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  User,
  Lock,
  Bell,
  Cloud,
  Database,
  Settings as SettingsIcon,
  LogOut,
  Save,
  RefreshCw,
  Sun,
  Moon,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const [theme, setTheme] = useState('system')
  const [backupStatus, setBackupStatus] = useState('idle')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('user@smartimport.com')
  const [name, setName] = useState('Usuário SmartImport')
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [oneDriveConnected, setOneDriveConnected] = useState(true)
  const [githubConnected, setGithubConnected] = useState(true)
  const [clickupConnected, setClickupConnected] = useState(false)

  const handleThemeChange = (value) => {
    setTheme(value)
    toast.success('Tema atualizado!')
  }

  const handleBackup = () => {
    setBackupStatus('loading')
    setTimeout(() => {
      setBackupStatus('success')
      toast.success('Backup realizado com sucesso no OneDrive!')
      setTimeout(() => setBackupStatus('idle'), 2000)
    }, 2000)
  }

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!')
  }

  const handlePasswordChange = () => {
    toast.success('Senha alterada com sucesso!')
    setPassword('')
  }

  const handleConnectOneDrive = () => {
    setOneDriveConnected(true)
    toast.success('OneDrive conectado!')
  }

  const handleDisconnectOneDrive = () => {
    setOneDriveConnected(false)
    toast('OneDrive desconectado.', { icon: '⚠️' })
  }

  const handleConnectGithub = () => {
    setGithubConnected(true)
    toast.success('GitHub conectado!')
  }

  const handleDisconnectGithub = () => {
    setGithubConnected(false)
    toast('GitHub desconectado.', { icon: '⚠️' })
  }

  const handleConnectClickup = () => {
    setClickupConnected(true)
    toast.success('ClickUp conectado!')
  }

  const handleDisconnectClickup = () => {
    setClickupConnected(false)
    toast('ClickUp desconectado.', { icon: '⚠️' })
  }

  return (
    <>
      <Helmet>
        <title>Configurações - SmartImport 5.0</title>
        <meta name="description" content="Configurações de conta, preferências e integrações" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie sua conta, preferências e integrações
            </p>
          </div>
        </div>

        {/* Perfil do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" /> Perfil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Save size={16} />
              <span>Salvar Perfil</span>
            </button>
          </div>
        </motion.div>

        {/* Senha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" /> Alterar Senha
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nova Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={handlePasswordChange}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Save size={16} />
              <span>Alterar Senha</span>
            </button>
          </div>
        </motion.div>

        {/* Preferências */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" /> Preferências
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema</label>
              <select
                value={theme}
                onChange={e => handleThemeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="system">Automático (Sistema)</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-6 md:mt-0">
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
                id="notifications"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700 dark:text-gray-300">
                Receber notificações por email
              </label>
            </div>
          </div>
        </motion.div>

        {/* Integrações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Cloud className="w-5 h-5 mr-2" /> Integrações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* OneDrive */}
            <div className="flex flex-col items-start space-y-2">
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <Cloud className="w-4 h-4 mr-1" /> OneDrive
              </span>
              {oneDriveConnected ? (
                <button
                  onClick={handleDisconnectOneDrive}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleConnectOneDrive}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                >
                  Conectar
                </button>
              )}
            </div>
            {/* GitHub */}
            <div className="flex flex-col items-start space-y-2">
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <Cloud className="w-4 h-4 mr-1" /> GitHub
              </span>
              {githubConnected ? (
                <button
                  onClick={handleDisconnectGithub}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleConnectGithub}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                >
                  Conectar
                </button>
              )}
            </div>
            {/* ClickUp */}
            <div className="flex flex-col items-start space-y-2">
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <Cloud className="w-4 h-4 mr-1" /> ClickUp
              </span>
              {clickupConnected ? (
                <button
                  onClick={handleDisconnectClickup}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleConnectClickup}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Backup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" /> Backup e Restauração
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackup}
              disabled={backupStatus === 'loading'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              <Cloud size={16} className={backupStatus === 'loading' ? 'animate-spin' : ''} />
              <span>{backupStatus === 'loading' ? 'Realizando backup...' : 'Backup no OneDrive'}</span>
            </button>
            {backupStatus === 'success' && (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle size={16} className="mr-1" /> Backup realizado!
              </span>
            )}
          </div>
        </motion.div>

        {/* Sair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            <span>Sair da Conta</span>
          </button>
        </motion.div>
      </div>
    </>
  )
}

export default Settings 