import React, { useRef, useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { getDefaultTransition } from '../../theme/premium'

/**
 * Card3D Component
 * 
 * Premium 3D card with perspective transforms and mouse-based tilt effect.
 * Based on bpco.kr design analysis.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

/**
 * 3D Transform Configuration
 * Property 4: 3D Transform Configuration
 * Validates: Requirements 4.1, 4.2, 4.5
 */
export interface Transform3DConfig {
  /** Perspective value in pixels (default: 1200px) - Requirement 4.2 */
  perspective: number
  /** Maximum rotation angle in degrees (default: 10) - Requirement 4.3 */
  maxRotation: number
  /** TranslateZ value for depth effect - Requirement 4.4 */
  translateZ: string
  /** Transform style for 3D space - Requirement 4.1 */
  preserveStyle: 'preserve-3d'
  /** Backface visibility setting - Requirement 4.5 */
  backfaceVisibility: 'hidden'
}

/**
 * Default 3D transform configuration
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */
export const DEFAULT_3D_CONFIG: Transform3DConfig = {
  perspective: 1200,
  maxRotation: 10,
  translateZ: '-20vw',
  preserveStyle: 'preserve-3d',
  backfaceVisibility: 'hidden',
}

export interface Card3DProps {
  /** Child elements to render inside the card */
  children: React.ReactNode
  /** Tilt intensity level */
  intensity?: 'light' | 'medium' | 'strong'
  /** Whether to disable 3D effects */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** Custom 3D configuration override */
  config?: Partial<Transform3DConfig>
  /** Whether to enable spin animation - Requirement 4.4 */
  enableSpin?: boolean
  /** Spin animation duration in ms */
  spinDuration?: number
}

export interface Card3DState {
  /** Current X rotation in degrees */
  rotateX: number
  /** Current Y rotation in degrees */
  rotateY: number
  /** Whether mouse is over the card */
  isHovered: boolean
}

/**
 * Get intensity multiplier based on intensity level
 */
function getIntensityMultiplier(intensity: 'light' | 'medium' | 'strong'): number {
  switch (intensity) {
    case 'light':
      return 0.5
    case 'medium':
      return 1
    case 'strong':
      return 1.5
    default:
      return 1
  }
}


/**
 * Calculate rotation values based on mouse position
 * Property 5: 3D Rotation Bounds - ensures rotation never exceeds maxRotation
 * Validates: Requirements 4.3
 * 
 * @param mouseX - Mouse X position relative to card
 * @param mouseY - Mouse Y position relative to card
 * @param cardWidth - Card width in pixels
 * @param cardHeight - Card height in pixels
 * @param maxRotation - Maximum rotation angle in degrees
 * @param intensityMultiplier - Multiplier for rotation intensity
 */
export function calculateRotation(
  mouseX: number,
  mouseY: number,
  cardWidth: number,
  cardHeight: number,
  maxRotation: number,
  intensityMultiplier: number = 1
): { rotateX: number; rotateY: number } {
  // Calculate center of card
  const centerX = cardWidth / 2
  const centerY = cardHeight / 2

  // Calculate offset from center (-1 to 1)
  const offsetX = (mouseX - centerX) / centerX
  const offsetY = (mouseY - centerY) / centerY

  // Calculate rotation (inverted for natural feel)
  // rotateY is based on X offset, rotateX is based on Y offset (inverted)
  const rawRotateY = offsetX * maxRotation * intensityMultiplier
  const rawRotateX = -offsetY * maxRotation * intensityMultiplier

  // Clamp rotation to max bounds - Property 5: 3D Rotation Bounds
  const effectiveMax = maxRotation * intensityMultiplier
  const rotateX = Math.max(-effectiveMax, Math.min(effectiveMax, rawRotateX))
  const rotateY = Math.max(-effectiveMax, Math.min(effectiveMax, rawRotateY))

  return { rotateX, rotateY }
}

/**
 * Clamp rotation value to bounds
 * Property 5: 3D Rotation Bounds
 */
export function clampRotation(value: number, maxRotation: number): number {
  return Math.max(-maxRotation, Math.min(maxRotation, value))
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  intensity = 'medium',
  disabled = false,
  className,
  config,
  enableSpin = false,
  spinDuration = 2000,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<Card3DState>({
    rotateX: 0,
    rotateY: 0,
    isHovered: false,
  })

  // Merge default config with custom config
  const mergedConfig = useMemo<Transform3DConfig>(() => ({
    ...DEFAULT_3D_CONFIG,
    ...config,
  }), [config])

  const intensityMultiplier = useMemo(
    () => getIntensityMultiplier(intensity),
    [intensity]
  )

  // Handle mouse move for 3D tilt effect - Requirement 4.3
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const { rotateX, rotateY } = calculateRotation(
      mouseX,
      mouseY,
      rect.width,
      rect.height,
      mergedConfig.maxRotation,
      intensityMultiplier
    )

    setState(prev => ({
      ...prev,
      rotateX,
      rotateY,
    }))
  }, [disabled, mergedConfig.maxRotation, intensityMultiplier])

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (disabled) return
    setState(prev => ({ ...prev, isHovered: true }))
  }, [disabled])

  // Handle mouse leave - reset rotation
  const handleMouseLeave = useCallback(() => {
    setState({
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    })
  }, [])

  return (
    <Card3DContainer
      data-testid="card-3d-container"
      $perspective={mergedConfig.perspective}
      className={className}
    >
      <Card3DInner
        ref={cardRef}
        data-testid="card-3d-inner"
        $rotateX={state.rotateX}
        $rotateY={state.rotateY}
        $preserveStyle={mergedConfig.preserveStyle}
        $backfaceVisibility={mergedConfig.backfaceVisibility}
        $disabled={disabled}
        $enableSpin={enableSpin && !state.isHovered}
        $spinDuration={spinDuration}
        $translateZ={mergedConfig.translateZ}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Card3DInner>
    </Card3DContainer>
  )
}


// Styled Components

/**
 * Card3D Container with perspective
 * Requirement 4.2: Apply perspective: 1200px to parent containers
 */
interface Card3DContainerProps {
  $perspective: number
}

const Card3DContainer = styled.div<Card3DContainerProps>`
  perspective: ${props => props.$perspective}px;
  perspective-origin: center center;
`

/**
 * Card3D Inner element with 3D transforms
 * Requirements: 4.1, 4.3, 4.4, 4.5
 */
interface Card3DInnerProps {
  $rotateX: number
  $rotateY: number
  $preserveStyle: 'preserve-3d'
  $backfaceVisibility: 'hidden'
  $disabled: boolean
  $enableSpin: boolean
  $spinDuration: number
  $translateZ: string
}

const Card3DInner = styled.div<Card3DInnerProps>`
  /* Requirement 4.1: Apply transform-style: preserve-3d to container elements */
  transform-style: ${props => props.$preserveStyle};
  
  /* Requirement 4.5: Apply backface-visibility: hidden to prevent rendering artifacts */
  backface-visibility: ${props => props.$backfaceVisibility};
  
  /* Requirement 4.3: Apply rotateX and rotateY transforms based on mouse position */
  transform: ${props => {
    if (props.$enableSpin) {
      // Requirement 4.4: Use translateZ combined with rotateY for depth effect
      return `translateZ(${props.$translateZ}) rotateY(0deg)`
    }
    return `rotateX(${props.$rotateX}deg) rotateY(${props.$rotateY}deg)`
  }};
  
  /* Smooth transition for mouse move - Requirement 4.3 */
  transition: ${props => props.$disabled ? 'none' : getDefaultTransition('transform')};
  
  /* Spin animation - Requirement 4.4 */
  ${props => props.$enableSpin && `
    animation: card3d-spin ${props.$spinDuration}ms linear infinite;
  `}
  
  /* Disable pointer events when disabled */
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
  
  @keyframes card3d-spin {
    from {
      transform: translateZ(${props => props.$translateZ}) rotateY(0deg);
    }
    to {
      transform: translateZ(${props => props.$translateZ}) rotateY(-360deg);
    }
  }
`

export default Card3D
