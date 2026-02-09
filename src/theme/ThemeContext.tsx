import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sun, Moon } from 'lucide-react'
import { dark, light } from './colors'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  colors: typeof light
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const colors = theme === 'dark' ? dark : light

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-400"
      style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <span
        className="absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full shadow-sm transition-all duration-300"
        style={{
          left: isDark ? 'calc(100% - 1.625rem)' : '0.125rem',
          background: isDark ? '#1e1e1e' : '#ffffff',
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-blue-300" strokeWidth={2} />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
        )}
      </span>
    </button>
  )
}
