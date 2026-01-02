/**
 * GlassContainer - 玻璃态容器组件
 * 
 * 特点：
 * - 玻璃态背景
 * - 支持不同的布局（flex, grid）
 * - 支持不同的背景颜色
 * - 支持自定义样式
 */

import type { ReactNode } from 'react'
import { useTheme } from '../../theme/ThemeContext'

type Layout = 'flex' | 'grid'
type Direction = 'row' | 'col'

interface GlassContainerProps {
  children: ReactNode
  layout?: Layout
  direction?: Direction
  columns?: number
  gap?: number
  className?: string
  variant?: 'standard' | 'strong' | 'light'
}

export function GlassContainer({
  children,
  layout = 'grid',
  direction = 'row',
  columns = 4,
  gap = 4,
  className = '',
  variant = 'standard',
}: GlassContainerProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const layoutClass = layout === 'grid' 
    ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-${gap}`
    : `flex flex-${direction} gap-${gap}`

  const glassStyle = {
    standard: {
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    },
    strong: {
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    },
    light: {
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    },
  }

  const darkStyle = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  const style = isLight ? glassStyle[variant] : darkStyle

  return (
    <div
      className={`rounded-2xl p-6 ${layoutClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
