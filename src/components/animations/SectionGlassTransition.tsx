/**
 * SectionGlassTransition Component
 * 
 * 为单个板块添加玻璃过渡效果
 * 当滚动进入/离开这个板块时，自动应用模糊和透明度变化
 * 
 * 使用方式：
 * <SectionGlassTransition>
 *   <YourSectionContent />
 * </SectionGlassTransition>
 */

import { type ReactNode, useRef } from 'react'
import { motion } from 'framer-motion'

interface SectionGlassTransitionProps {
  children: ReactNode
  className?: string
}

// 暂时简化版本 - 不使用滚动过渡效果，避免内容消失问题
export default function SectionGlassTransition({
  children,
  className = '',
}: SectionGlassTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <motion.section
      ref={sectionRef}
      data-section
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  )
}

/**
 * 简化版本：直接在 motion.div 中使用
 * 用于不需要完整 section 标签的情况
 */
export function GlassTransitionWrapper({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      data-section
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  )
}
