/**
 * 主题系统 - 明暗模式切换
 * 
 * 莫兰迪配色方案：
 * - 暗色模式：深色背景 + 莫兰迪色点缀
 * - 亮色模式：浅色背景 + 莫兰迪色点缀
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  colors: typeof darkColors
}

// 暗色主题配色
const darkColors = {
  // 背景
  bg: {
    primary: '#0c0c0c',
    secondary: '#141414',
    card: 'rgba(255,255,255,0.05)',
    cardHover: 'rgba(255,255,255,0.08)',
  },
  // 文字
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },
  // 边框
  border: {
    primary: 'rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.2)',
  },
  // 莫兰迪色
  morandi: {
    sage: '#9CAF88',
    dustyRose: '#C9A9A6',
    slate: '#8E9AAF',
    taupe: '#B8A99A',
  },
  // 渐变
  gradient: {
    sage: 'from-[#9CAF88]/20 to-[#9CAF88]/5',
    dustyRose: 'from-[#C9A9A6]/20 to-[#C9A9A6]/5',
    slate: 'from-[#8E9AAF]/20 to-[#8E9AAF]/5',
    taupe: 'from-[#B8A99A]/20 to-[#B8A99A]/5',
  },
  // 网格
  grid: {
    color: '#1a1a1a',
    opacity: 0.3,
  },
}

// 亮色主题配色
const lightColors = {
  // 背景
  bg: {
    primary: '#fafafa',
    secondary: '#ffffff',
    card: 'rgba(255,255,255,0.75)',
    cardHover: 'rgba(255,255,255,0.85)',
  },
  // 文字
  text: {
    primary: '#1a1a1a',
    secondary: '#6b7280',
    muted: '#9ca3af',
  },
  // 边框
  border: {
    primary: 'rgba(0,0,0,0.08)',
    hover: 'rgba(0,0,0,0.12)',
  },
  // 莫兰迪色（亮色模式稍微深一点）
  morandi: {
    sage: '#7d9a6a',
    dustyRose: '#b8918e',
    slate: '#7a869e',
    taupe: '#a69485',
  },
  // 淡雅色彩系统
  pastel: {
    pink: '#f9c5eb',
    yellow: '#fef3c7',
    blue: '#dbeafe',
    green: '#d1fae5',
    purple: '#e9d5ff',
  },
  // 玻璃态设计
  glass: {
    standard: 'rgba(255,255,255,0.75)',
    strong: 'rgba(255,255,255,0.85)',
    light: 'rgba(255,255,255,0.6)',
    blur: 'blur(12px)',
    border: 'rgba(255,255,255,0.4)',
    borderStrong: 'rgba(255,255,255,0.5)',
    borderLight: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
    shadowStrong: '0 8px 32px rgba(0,0,0,0.1)',
    shadowLight: '0 8px 32px rgba(0,0,0,0.06)',
  },
  // 渐变
  gradient: {
    sage: 'from-[#9CAF88]/15 to-[#9CAF88]/5',
    dustyRose: 'from-[#C9A9A6]/15 to-[#C9A9A6]/5',
    slate: 'from-[#8E9AAF]/15 to-[#8E9AAF]/5',
    taupe: 'from-[#B8A99A]/15 to-[#B8A99A]/5',
  },
  // 网格
  grid: {
    color: '#e5e5e5',
    opacity: 0.5,
  },
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

  const colors = theme === 'dark' ? darkColors : lightColors

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

// 主题切换按钮组件
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  )
}
