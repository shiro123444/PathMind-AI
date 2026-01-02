/**
 * GlassButton - 玻璃态按钮组件
 * 
 * 特点：
 * - 玻璃态设计
 * - 支持多种大小（sm, md, lg）
 * - 支持多种颜色主题
 * - 支持 hover 和 active 状态
 * - 支持 loading 状态
 */

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../theme/ThemeContext'

type Size = 'sm' | 'md' | 'lg'
type Color = 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'white' | 'black'

interface GlassButtonProps {
  children: ReactNode
  size?: Size
  color?: Color
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const sizeMap: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
}

const colorMap: Record<Color, { bg: string; text: string; border: string; hover: string }> = {
  white: {
    bg: 'rgba(255,255,255,0.85)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.5)',
    hover: 'rgba(255,255,255,0.95)',
  },
  pink: {
    bg: 'rgba(249,197,235,0.8)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.4)',
    hover: 'rgba(249,197,235,0.9)',
  },
  yellow: {
    bg: 'rgba(254,243,199,0.8)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.4)',
    hover: 'rgba(254,243,199,0.9)',
  },
  blue: {
    bg: 'rgba(219,234,254,0.8)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.4)',
    hover: 'rgba(219,234,254,0.9)',
  },
  green: {
    bg: 'rgba(209,250,229,0.8)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.4)',
    hover: 'rgba(209,250,229,0.9)',
  },
  purple: {
    bg: 'rgba(233,213,255,0.8)',
    text: '#1a1a1a',
    border: 'rgba(255,255,255,0.4)',
    hover: 'rgba(233,213,255,0.9)',
  },
  black: {
    bg: '#1a1a1a',
    text: '#ffffff',
    border: 'rgba(0,0,0,0.2)',
    hover: '#2d2d2d',
  },
}

export function GlassButton({
  children,
  size = 'md',
  color = 'white',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}: GlassButtonProps) {
  const { theme } = useTheme()
  const sizeClass = sizeMap[size]
  const colorStyle = colorMap[color]

  const isLight = theme === 'light'

  if (!isLight) {
    // 暗色主题
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`rounded-full font-semibold transition-all ${sizeClass} ${className}`}
        style={{
          background: color === 'black' ? '#ffffff' : 'rgba(255,255,255,0.1)',
          color: color === 'black' ? '#1a1a1a' : '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
        whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      >
        {loading ? '加载中...' : children}
      </motion.button>
    )
  }

  // 浅色主题使用玻璃态
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-full font-semibold transition-all ${sizeClass} ${className}`}
      style={{
        background: colorStyle.bg,
        color: colorStyle.text,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${colorStyle.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileHover={!disabled && !loading ? { scale: 1.05, backgroundColor: colorStyle.hover } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      {loading ? '加载中...' : children}
    </motion.button>
  )
}
