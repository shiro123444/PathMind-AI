/**
 * FlipText Component
 * 翻转文字组件 - 每个字符像卡片一样 3D 翻转切换
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 4.1
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { flipConfig } from '../../theme/motion'

/**
 * Custom hook to detect prefers-reduced-motion media query
 * Returns true if user prefers reduced motion
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return false
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    return mediaQuery.matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

interface FlipTextProps {
  /** 要轮播的文字数组 */
  texts: string[]
  /** 切换间隔，默认 3000ms */
  interval?: number
  /** 外部样式类 */
  className?: string
  /** 单个字符样式类 */
  charClassName?: string
}

interface FlipCharacterProps {
  char: string
  index: number
  isExiting: boolean
  className: string
  charWidth: number
  reducedMotion: boolean
}

/**
 * 计算字符的预估宽度
 * 用于保持布局稳定，防止翻转时抖动
 */
function getCharWidth(char: string): number {
  // 空格使用固定宽度
  if (char === ' ') return 0.3
  // 窄字符
  if (/[iIlj1!|.,;:'`]/.test(char)) return 0.4
  // 宽字符
  if (/[mwMW@]/.test(char)) return 0.9
  // 中文字符使用固定宽度
  if (/[\u4e00-\u9fa5]/.test(char)) return 1.0
  // 默认宽度
  return 0.6
}

/**
 * 单个翻转字符组件
 * 实现 3D 翻转动画效果
 * 当 reducedMotion 为 true 时，禁用动画直接显示
 */
function FlipCharacter({ 
  char, 
  index, 
  isExiting,
  className,
  charWidth,
  reducedMotion
}: FlipCharacterProps) {
  const { duration, staggerDelay, rotateExit, rotateEnter, ease } = flipConfig

  // 当用户偏好减少动画时，禁用翻转动画
  if (reducedMotion) {
    return (
      <span
        className={`inline-block ${className}`}
        style={{ 
          minWidth: `${charWidth}em`,
          display: 'inline-block',
          textAlign: 'center',
        }}
      >
        <span 
          className="inline-block"
          style={{
            display: 'inline-block',
            width: '100%',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    )
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ 
        perspective: '500px',
        transformStyle: 'preserve-3d',
        minWidth: `${charWidth}em`,
        display: 'inline-block',
        textAlign: 'center',
      }}
      initial={{ rotateX: rotateEnter, opacity: 0 }}
      animate={{ 
        rotateX: 0,
        opacity: 1,
      }}
      exit={{
        rotateX: rotateExit,
        opacity: 0,
      }}
      transition={{
        duration,
        delay: index * staggerDelay,
        ease,
      }}
    >
      <span 
        className="inline-block"
        style={{
          // 翻转时添加阴影增强立体感
          textShadow: isExiting ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
          display: 'inline-block',
          width: '100%',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </motion.span>
  )
}

/**
 * FlipText 翻转文字组件
 * 
 * 实现原理：
 * 1. 每个字符包裹在独立的 3D 容器中
 * 2. 切换时，旧字符绕 X 轴向上翻转消失 (0° → -90°)
 * 3. 新字符从下方翻转进入 (90° → 0°)
 * 4. 使用 stagger 让字符依次翻转，产生波浪效果
 * 5. 预计算字符宽度，保持布局稳定
 * 6. 支持 prefers-reduced-motion，禁用动画直接切换
 */
export function FlipText({ 
  texts, 
  interval = 3000,
  className = '',
  charClassName = ''
}: FlipTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // 计算所有文本中最大宽度，用于保持容器稳定
  const maxWidth = useMemo(() => {
    return Math.max(...texts.map(text => 
      text.split('').reduce((sum, char) => sum + getCharWidth(char), 0)
    ))
  }, [texts])

  // 定时切换
  useEffect(() => {
    if (texts.length <= 1) return

    const timer = setInterval(() => {
      // 当用户偏好减少动画时，直接切换不播放退出动画
      if (prefersReducedMotion) {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      } else {
        setIsExiting(true)
        // 等待退出动画完成后切换文本
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length)
          setIsExiting(false)
        }, flipConfig.duration * 1000)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval, prefersReducedMotion])

  const currentText = texts[currentIndex] || ''
  const characters = currentText.split('')

  // 计算当前文本的字符宽度数组
  const charWidths = useMemo(() => 
    characters.map(char => getCharWidth(char)),
    [currentText]
  )

  // 当用户偏好减少动画时，使用简单的渲染方式
  if (prefersReducedMotion) {
    return (
      <span 
        className={`inline-flex ${className}`}
        style={{ minWidth: `${maxWidth}em` }}
      >
        <span className="inline-flex">
          {characters.map((char, index) => (
            <FlipCharacter
              key={`${currentIndex}-${index}`}
              char={char}
              index={index}
              isExiting={false}
              className={charClassName}
              charWidth={charWidths[index]}
              reducedMotion={true}
            />
          ))}
        </span>
      </span>
    )
  }

  return (
    <span 
      className={`inline-flex ${className}`}
      style={{ minWidth: `${maxWidth}em` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-flex"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {characters.map((char, index) => (
            <FlipCharacter
              key={`${currentIndex}-${index}`}
              char={char}
              index={index}
              isExiting={isExiting}
              className={charClassName}
              charWidth={charWidths[index]}
              reducedMotion={false}
            />
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { usePrefersReducedMotion }
export default FlipText
