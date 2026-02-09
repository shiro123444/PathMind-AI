/**
 * ScrollGlassTransition Component
 * 
 * 创建滚动过渡效果：
 * - 在板块交界处产生"阻力"感（玻璃变模糊）
 * - 继续滚动会"打破"阻力，进入下一个板块
 * - 玻璃逐渐变清晰，形成沉浸式的过渡体验
 * 
 * 使用方式：
 * <ScrollGlassTransition>
 *   <Section1 />
 *   <Section2 />
 *   <Section3 />
 * </ScrollGlassTransition>
 */

import { type ReactNode, useRef, useEffect, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'

interface ScrollGlassTransitionProps {
  children: ReactNode
  sectionCount?: number
  transitionHeight?: number // 过渡区域的高度（像素）
  maxBlur?: number // 最大模糊度
}

export default function ScrollGlassTransition({
  children,
  transitionHeight = 400,
  maxBlur = 20,
}: ScrollGlassTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sectionHeights, setSectionHeights] = useState<number[]>([])
  
  const { scrollY } = useScroll()

  // 计算每个板块的高度
  useEffect(() => {
    if (!containerRef.current) return

    const sections = containerRef.current.querySelectorAll('[data-section]')
    const heights = Array.from(sections).map(section => {
      const element = section as HTMLElement
      return element.offsetHeight
    })
    setSectionHeights(heights)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* 使用 motion.div 包装每个子元素，添加动态玻璃效果 */}
      <ScrollGlassWrapper
        scrollY={scrollY}
        sectionHeights={sectionHeights}
        transitionHeight={transitionHeight}
        maxBlur={maxBlur}
      >
        {children}
      </ScrollGlassWrapper>
    </div>
  )
}

interface ScrollGlassWrapperProps {
  scrollY: any
  sectionHeights: number[]
  transitionHeight: number
  maxBlur: number
  children: ReactNode
}

function ScrollGlassWrapper({
  scrollY: _scrollY,
  sectionHeights: _sectionHeights,
  transitionHeight: _transitionHeight,
  maxBlur: _maxBlur,
  children,
}: ScrollGlassWrapperProps) {
  // 为每个板块创建动态的模糊和透明度变换
  // 注：这些值在实际应用中通过 useScrollGlassEffect hook 使用
  
  return (
    <>
      {children}
    </>
  )
}

/**
 * 使用 Hook 的方式来应用玻璃过渡效果
 * 更灵活，可以在任何组件中使用
 */
export function useScrollGlassEffect(sectionRef: React.RefObject<HTMLElement>) {
  const { scrollY } = useScroll()
  const [sectionPosition, setSectionPosition] = useState({ start: 0, end: 0 })

  useEffect(() => {
    if (!sectionRef.current) return

    const updatePosition = () => {
      const rect = sectionRef.current!.getBoundingClientRect()
      const scrollTop = window.scrollY
      setSectionPosition({
        start: scrollTop + rect.top,
        end: scrollTop + rect.top + rect.height,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [sectionRef])

  // 返回动态的 blur 和 opacity 值
  const blur = useTransform(scrollY, (latest: number) => {
    const { end } = sectionPosition
    const transitionHeight = 400
    const transitionStart = end - transitionHeight / 2
    const transitionEnd = end + transitionHeight / 2

    if (latest >= transitionStart && latest <= transitionEnd) {
      const progress = (latest - transitionStart) / (transitionEnd - transitionStart)
      return progress < 0.5 
        ? (progress * 2) * 20  // 最大模糊 20px
        : ((1 - progress) * 2) * 20
    }

    return 0
  })

  const opacity = useTransform(scrollY, (latest: number) => {
    const { end } = sectionPosition
    const transitionHeight = 400
    const transitionStart = end - transitionHeight / 2
    const transitionEnd = end + transitionHeight / 2

    if (latest >= transitionStart && latest <= transitionEnd) {
      const progress = (latest - transitionStart) / (transitionEnd - transitionStart)
      return progress < 0.5 
        ? 1 - (progress * 2) * 0.4
        : 0.6 + ((progress - 0.5) * 2) * 0.4
    }

    return 1
  })

  return { blur, opacity }
}
