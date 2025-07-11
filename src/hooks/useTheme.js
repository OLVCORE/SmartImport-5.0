import { useState, useEffect } from 'react'

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Verificar se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('smartimport-theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    // Tema padrão
    return 'light'
  })

  useEffect(() => {
    // Salvar tema no localStorage
    localStorage.setItem('smartimport-theme', theme)
    
    // Aplicar tema ao documento
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Atualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const setLightTheme = () => {
    setTheme('light')
  }

  const setDarkTheme = () => {
    setTheme('dark')
  }

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }
}

export { useTheme } 