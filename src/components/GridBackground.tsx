import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 网格线组件
function GridLines() {
  const linesRef = useRef<THREE.Group>(null)

  const { horizontalLines, verticalLines } = useMemo(() => {
    const size = 120
    const divisions = 60
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
      linesRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.03) * 0.005
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
          <lineBasicMaterial color="#e5e5e5" transparent opacity={0.6} />
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
          <lineBasicMaterial color="#e5e5e5" transparent opacity={0.6} />
        </line>
      ))}
    </group>
  )
}

// 浮动球体 - 自动适应相机视口
function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // 根据视口计算球体位置，确保球体在可视区域内
  const orbs = useMemo(() => {
    const vw = viewport.width
    const vh = viewport.height
    
    // 调整位置让球体更靠内部，避免边缘裁剪
    return [
      { pos: [-vw * 0.28, vh * 0.25, -8], size: 1.0 },
      { pos: [vw * 0.32, -vh * 0.2, -10], size: 1.5 },
      { pos: [-vw * 0.2, -vh * 0.28, -6], size: 0.7 },
      { pos: [vw * 0.25, vh * 0.32, -9], size: 1.2 },
      { pos: [-vw * 0.35, vh * 0.1, -12], size: 1.8 },
      { pos: [vw * 0.15, -vh * 0.35, -7], size: 0.9 },
      { pos: [-vw * 0.1, vh * 0.35, -8], size: 1.1 },
      { pos: [vw * 0.38, vh * 0.02, -11], size: 1.4 },
    ]
  }, [viewport.width, viewport.height])

  useFrame(({ clock }) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        const offset = i * 0.8
        const time = clock.elapsedTime * 0.12
        orb.position.y += Math.sin(time + offset) * 0.006
        orb.position.x += Math.cos(time * 0.6 + offset) * 0.004
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos as [number, number, number]}>
          <sphereGeometry args={[orb.size, 64, 64]} />
          <meshStandardMaterial
            color="#f0f0f0"
            transparent
            opacity={0.2 + (i % 3) * 0.05}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

// 相机控制器 - 确保正确的宽高比
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

export default function GridBackground() {
  const [dpr, setDpr] = useState(1)
  
  useEffect(() => {
    // 限制 DPR 最大为 2，避免性能问题
    setDpr(Math.min(window.devicePixelRatio, 2))
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
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
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <GridLines />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}