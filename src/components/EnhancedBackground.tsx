import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 粒子系统配置
interface ParticleConfig {
  count: number
  size: { min: number; max: number }
  speed: number
  color: string
  opacity: { min: number; max: number }
}

const defaultParticleConfig: ParticleConfig = {
  count: 80,
  size: { min: 0.3, max: 1.2 },
  speed: 0.15,
  color: '#000000',
  opacity: { min: 0.03, max: 0.12 },
}

// 粒子系统组件
function ParticleSystem({ config = defaultParticleConfig }: { config?: ParticleConfig }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(config.count * 3)
    const sizes = new Float32Array(config.count)
    
    for (let i = 0; i < config.count; i++) {
      // 在视口范围内随机分布
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10
      
      sizes[i] = config.size.min + Math.random() * (config.size.max - config.size.min)
    }
    
    return { positions, sizes }
  }, [config, viewport.width, viewport.height])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    
    const time = clock.elapsedTime * config.speed
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3
      // 柔和的浮动动画
      positionArray[i3 + 1] += Math.sin(time + i * 0.5) * 0.008
      positionArray[i3] += Math.cos(time * 0.7 + i * 0.3) * 0.005
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        color={config.color}
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// 网格线组件
function GridLines() {
  const linesRef = useRef<THREE.Group>(null)

  const { horizontalLines, verticalLines } = useMemo(() => {
    const size = 120
    const divisions = 50
    const step = size / divisions

    const horizontal: THREE.Vector3[][] = []
    const vertical: THREE.Vector3[][] = []

    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const pos = i * step
      horizontal.push([
        new THREE.Vector3(-size / 2, pos, 0),
        new THREE.Vector3(size / 2, pos, 0),
      ])
      vertical.push([
        new THREE.Vector3(pos, -size / 2, 0),
        new THREE.Vector3(pos, size / 2, 0),
      ])
    }

    return { horizontalLines: horizontal, verticalLines: vertical }
  }, [])

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.02) * 0.003
    }
  })

  return (
    <group ref={linesRef}>
      {horizontalLines.map((points, i) => (
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e8e8e8" transparent opacity={0.5} />
        </line>
      ))}
      {verticalLines.map((points, i) => (
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e8e8e8" transparent opacity={0.5} />
        </line>
      ))}
    </group>
  )
}


// 浮动球体组件 - 增强版
function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  const orbs = useMemo(() => {
    const vw = viewport.width
    const vh = viewport.height
    
    return [
      { pos: [-vw * 0.28, vh * 0.25, -8], size: 1.2, speed: 0.8 },
      { pos: [vw * 0.32, -vh * 0.2, -10], size: 1.8, speed: 0.6 },
      { pos: [-vw * 0.2, -vh * 0.28, -6], size: 0.9, speed: 1.0 },
      { pos: [vw * 0.25, vh * 0.32, -9], size: 1.4, speed: 0.7 },
      { pos: [-vw * 0.35, vh * 0.1, -12], size: 2.2, speed: 0.5 },
      { pos: [vw * 0.15, -vh * 0.35, -7], size: 1.1, speed: 0.9 },
      { pos: [-vw * 0.1, vh * 0.35, -8], size: 1.3, speed: 0.75 },
      { pos: [vw * 0.38, vh * 0.02, -11], size: 1.6, speed: 0.65 },
      { pos: [-vw * 0.4, -vh * 0.15, -9], size: 1.0, speed: 0.85 },
      { pos: [vw * 0.05, vh * 0.4, -10], size: 1.5, speed: 0.55 },
    ]
  }, [viewport.width, viewport.height])

  useFrame(({ clock }) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        const offset = i * 0.8
        const speed = orbs[i]?.speed || 0.7
        const time = clock.elapsedTime * 0.1 * speed
        orb.position.y += Math.sin(time + offset) * 0.008
        orb.position.x += Math.cos(time * 0.6 + offset) * 0.005
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos as [number, number, number]}>
          <sphereGeometry args={[orb.size, 64, 64]} />
          <meshStandardMaterial
            color="#f5f5f5"
            transparent
            opacity={0.15 + (i % 3) * 0.03}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// 相机控制器
function CameraController() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
    }
  }, [camera, size])
  
  return null
}

// 视差效果 Hook - Enhanced with smooth scroll support
// Requirements: 8.4, 8.5
function useParallax(enabled: boolean) {
  const [scrollY, setScrollY] = useState(0)
  const lastUpdateRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (!enabled) return
    
    // Requirement 8.5: Update transforms within 16ms (60fps)
    const updateScroll = () => {
      const now = performance.now()
      if (now - lastUpdateRef.current >= 16) {
        lastUpdateRef.current = now
        setScrollY(window.scrollY)
      }
      rafRef.current = requestAnimationFrame(updateScroll)
    }
    
    rafRef.current = requestAnimationFrame(updateScroll)
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled])
  
  return scrollY
}

// Parallax speed constant - Requirement 8.4: 0.3x scroll speed
const PARALLAX_SPEED = 0.3

// 视差层组件 - Requirements: 8.4, 8.5
// Requirement 8.4: Move background layers at 0.3x scroll speed
function ParallaxLayer({ scrollY, children }: { scrollY: number; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      // Requirement 8.4: Apply 0.3x parallax speed
      groupRef.current.position.y = scrollY * PARALLAX_SPEED * 0.01
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

// WebGL 支持检测
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// CSS 降级背景
function CSSFallbackBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(0, 0, 0, 0.03) 39px,
            rgba(0, 0, 0, 0.03) 40px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            rgba(0, 0, 0, 0.03) 39px,
            rgba(0, 0, 0, 0.03) 40px
          )
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

// 背景组件 Props
interface EnhancedBackgroundProps {
  enableParticles?: boolean
  enableParallax?: boolean
  enableGrid?: boolean
  enableOrbs?: boolean
  particleConfig?: ParticleConfig
}

// 主背景组件
export default function EnhancedBackground({
  enableParticles = true,
  enableParallax = true,
  enableGrid = true,
  enableOrbs = true,
  particleConfig = defaultParticleConfig,
}: EnhancedBackgroundProps) {
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [dpr, setDpr] = useState(1)
  const scrollY = useParallax(enableParallax)
  
  useEffect(() => {
    setWebGLSupported(checkWebGLSupport())
    setDpr(Math.min(window.devicePixelRatio, 2))
  }, [])

  // WebGL 不支持时使用 CSS 降级
  if (!webGLSupported) {
    return <CSSFallbackBackground />
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 40], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <CameraController />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />
        
        <ParallaxLayer scrollY={scrollY}>
          {enableGrid && <GridLines />}
          {enableOrbs && <FloatingOrbs />}
          {enableParticles && <ParticleSystem config={particleConfig} />}
        </ParallaxLayer>
      </Canvas>
    </div>
  )
}
