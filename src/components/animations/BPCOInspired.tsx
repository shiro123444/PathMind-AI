/**
 * BPCO-Inspired Animation Components
 * 灵感来源: https://www.bpco.kr/
 * 
 * 特色效果:
 * - 3D 立体文字效果
 * - 滚动视差文字跑马灯
 * - 圆形环绕文字
 * - 大字体排版动画
 * - 纸张褶皱纹理背景
 */

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useAnimationFrame, useMotionValue, useVelocity, AnimatePresence } from 'framer-motion'
import { variants, easings, springs } from '../../theme/motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================
// 1. 滚动视差文字跑马灯 (Parallax Marquee)
// ============================================
interface ParallaxMarqueeProps {
  text: string
  baseVelocity?: number
  className?: string
  textClassName?: string
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function ParallaxMarquee({ 
  text, 
  baseVelocity = 3,
  className = '',
  textClassName = ''
}: ParallaxMarqueeProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)

  const directionFactor = useRef<number>(1)
  
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div 
        style={{ x }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className={`block mr-8 text-[8vw] font-black uppercase tracking-tighter ${textClassName}`}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ============================================
// 2. 大字体滚动显示 (Giant Text Reveal)
// ============================================
interface GiantTextRevealProps {
  words: string[]
  className?: string
}

export function GiantTextReveal({ words, className = '' }: GiantTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  return (
    <div ref={containerRef} className={`relative py-20 ${className}`}>
      {words.map((word, index) => {
        const start = index / words.length
        const end = (index + 1) / words.length
        
        return (
          <GiantWord 
            key={index} 
            word={word} 
            progress={scrollYProgress}
            range={[start, end]}
            index={index}
          />
        )
      })}
    </div>
  )
}

function GiantWord({ 
  word, 
  progress, 
  range,
  index
}: { 
  word: string
  progress: any
  range: [number, number]
  index: number
}) {
  const opacity = useTransform(progress, range, [0.1, 1])
  const x = useTransform(progress, range, [index % 2 === 0 ? -100 : 100, 0])
  const scale = useTransform(progress, range, [0.8, 1])

  return (
    <motion.div 
      style={{ opacity, x, scale }}
      className="text-[12vw] md:text-[10vw] font-black uppercase leading-none tracking-tighter text-gray-900"
    >
      {word}
    </motion.div>
  )
}

// ============================================
// 3. 圆形环绕文字 (Circular Text)
// ============================================
interface CircularTextProps {
  text: string
  radius?: number
  className?: string
  rotationDuration?: number
}

export function CircularText({ 
  text, 
  radius = 100,
  className = '',
  rotationDuration = 20
}: CircularTextProps) {
  const characters = text.split('')
  const angleStep = 360 / characters.length

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: 360 }}
      transition={{ duration: rotationDuration, repeat: Infinity, ease: 'linear' }}
    >
      {characters.map((char, i) => {
        const angle = i * angleStep
        const radian = (angle * Math.PI) / 180
        const x = radius + radius * Math.cos(radian - Math.PI / 2)
        const y = radius + radius * Math.sin(radian - Math.PI / 2)

        return (
          <span
            key={i}
            className="absolute text-sm font-medium text-gray-700"
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {char}
          </span>
        )
      })}
    </motion.div>
  )
}

// ============================================
// 4. 滚动触发文字显示 (Scroll Text Reveal)
// ============================================
interface ScrollTextRevealProps {
  text: string
  className?: string
}

export function ScrollTextReveal({ text, className = '' }: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25']
  })

  const words = text.split(' ')

  return (
    <p ref={containerRef} className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length

        return (
          <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </ScrollWord>
        )
      })}
    </p>
  )
}

function ScrollWord({ 
  children, 
  progress, 
  range 
}: { 
  children: string
  progress: any
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])

  return (
    <span className="relative mr-2 text-2xl md:text-3xl font-medium">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

// ============================================
// 5. 描边文字跑马灯 (Stroke Marquee)
// ============================================
interface StrokeMarqueeProps {
  text: string
  duration?: number
  className?: string
}

export function StrokeMarquee({ 
  text, 
  duration = 20,
  className = ''
}: StrokeMarqueeProps) {
  return (
    <div className={`overflow-hidden py-8 ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ 
          repeat: Infinity, 
          ease: 'linear', 
          duration 
        }}
      >
        {[...Array(4)].map((_, index) => (
          <span
            key={index}
            className="text-[10vw] font-black uppercase px-8 text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(0, 0, 0, 0.15)',
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}


// ============================================
// 6. 3D 立体文字组件 (Three.js)
// ============================================
function Floating3DLetter({ 
  index, 
  total 
}: { 
  index: number
  total: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = (index - total / 2) * 0.8

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5 + index * 0.3) * 0.1
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + index * 0.2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[offset, 0, 0]}>
      <boxGeometry args={[0.6, 0.8, 0.2]} />
      <meshStandardMaterial 
        color="#ffffff" 
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  )
}

export function Floating3DText({ text }: { text: string }) {
  const letters = text.split('')

  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        
        <group>
          {letters.map((_, i) => (
            <Floating3DLetter 
              key={i} 
              index={i} 
              total={letters.length}
            />
          ))}
        </group>
      </Canvas>
    </div>
  )
}

// ============================================
// 7. 纸张褶皱纹理背景 (Paper Texture)
// ============================================
export function PaperTextureBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* 纸张纹理叠加层 */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* 褶皱线条效果 */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 100px,
              rgba(0,0,0,0.03) 100px,
              rgba(0,0,0,0.03) 101px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 150px,
              rgba(0,0,0,0.02) 150px,
              rgba(0,0,0,0.02) 151px
            )
          `
        }}
      />
      
      {children}
    </div>
  )
}

// ============================================
// 8. 交互式悬停卡片 (Hover Card)
// ============================================
interface HoverCardProps {
  children: React.ReactNode
  className?: string
}

export function HoverCard({ children, className = '' }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    setRotateX(-mouseY / 20)
    setRotateY(mouseX / 20)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', ...springs.gentle }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// 9. 文字轮播动画 (Rotating Text)
// ============================================
interface RotatingTextProps {
  texts: string[]
  interval?: number
  className?: string
}

export function RotatingText({ 
  texts, 
  interval = 3000,
  className = ''
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <span className={`inline-block relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          variants={variants.rotatingText}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.4,
            ease: easings.smooth,
          }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ============================================
// 10. 滚动进度指示器 (Scroll Progress)
// ============================================
export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gray-200 rounded-full overflow-hidden z-50"
    >
      <motion.div
        className="w-full bg-black rounded-full origin-top"
        style={{ scaleY, height: '100%' }}
      />
    </motion.div>
  )
}

// 导出所有组件
export default {
  ParallaxMarquee,
  GiantTextReveal,
  CircularText,
  ScrollTextReveal,
  StrokeMarquee,
  Floating3DText,
  PaperTextureBackground,
  HoverCard,
  RotatingText,
  ScrollProgressIndicator,
}
