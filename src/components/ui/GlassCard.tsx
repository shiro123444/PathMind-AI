/**
 * GlassCard - 玻璃态卡片组件
 * 
 * 特点：
 * - 半透明背景 + 背景模糊
 * - 支持多种变体（standard, strong, light）
 * - 支持多种颜色主题（pink, yellow, blue, green, purple, white）
 * - 支持 hover 效果
 * - 支持自定义 className 和 style
 */

import type { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../theme/ThemeContext'

type Variant = 'standard' | 'strong' | 'light'
type Color = 'pink' | 'yellow' | 'blue' | 'green' | 'purple' | 'white'

interface GlassCardProps {
  children: ReactNode
  variant?: Variant
  color?: Color
  className?: string
  style?: CSSProperties
  onClick?: () => void
  hover?: boolean
}

const colorMap: Record<Color, { bg: string; border: string; shadow: string }> = {
  white: {
    bg: 'rgba(255,255,255,0.75)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  pink: {
    bg: 'linear-gradient(135deg, rgba(249,197,235,0.7) 0%, rgba(255,255,255,0.3) 100%)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(249,197,235,0.15)',
  },
  yellow: {
    bg: 'linear-gradient(135deg, rgba(254,243,199,0.7) 0%, rgba(255,255,255,0.3) 100%)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(254,243,199,0.15)',
  },
  blue: {
    bg: 'linear-gradient(135deg, rgba(219,234,254,0.7) 0%, rgba(255,255,255,0.3) 100%)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(219,234,254,0.15)',
  },
  green: {
    bg: 'linear-gradient(135deg, rgba(209,250,229,0.7) 0%, rgba(255,255,255,0.3) 100%)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(209,250,229,0.15)',
  },
  purple: {
    bg: 'linear-gradient(135deg, rgba(233,213,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(233,213,255,0.15)',
  },
}

const variantMap: Record<Variant, { bg?: string; blur: string; border: string; shadow: string }> = {
  standard: {
    blur: 'blur(12px)',
    border: 'rgba(255,255,255,0.4)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  strong: {
    blur: 'blur(8px)',
    border: 'rgba(255,255,255,0.5)',
    shadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  light: {
    blur: 'blur(16px)',
    border: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 32px rgba(0,0,0,0.06)',
  },
}

export function GlassCard({
  children,
  variant = 'standard',
  color = 'white',
  className = '',
  style,
  onClick,
  hover = true,
}: GlassCardProps) {
  const { theme } = useTheme()
  const colorStyle = colorMap[color]
  const variantStyle = variantMap[variant]

  // 浅色主题下使用玻璃态，暗色主题下使用原有样式
  const isLight = theme === 'light'

  if (!isLight) {
    // 暗色主题保持原有样式
    return (
      <motion.div
        className={`rounded-2xl p-6 backdrop-blur-xl border transition-all ${className}`}
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
          ...style,
        }}
        whileHover={hover ? { scale: 1.02, y: -4 } : {}}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  // 浅色主题使用玻璃态
  return (
    <motion.div
      className={`rounded-2xl p-6 border transition-all ${className}`}
      style={{
        background: colorStyle.bg,
        backdropFilter: variantStyle.blur,
        WebkitBackdropFilter: variantStyle.blur,
        borderColor: variantStyle.border,
        boxShadow: variantStyle.shadow,
        ...style,
      }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  )
}
