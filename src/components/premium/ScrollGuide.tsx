import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { premiumTypography, getDefaultTransition } from '../../theme/premium'

/**
 * ScrollGuide Component
 * 
 * Premium scroll guide with animated arrow and fade-out on scroll.
 * Based on bpco.kr design analysis.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

export interface ScrollGuideProps {
  /** Text to display (default: "PLEASE SCROLL DOWN") */
  text?: string
  /** Scroll threshold to start fading (default: 0) */
  fadeThreshold?: number
  /** Scroll distance over which to complete fade (default: 100) */
  fadeDistance?: number
  /** Whether to hide the guide */
  hidden?: boolean
  /** Callback when guide becomes hidden */
  onHide?: () => void
}

export interface ScrollGuideState {
  /** Current opacity (0-1) */
  opacity: number
  /** Current scroll position */
  scrollY: number
  /** Whether guide is visible */
  isVisible: boolean
}

/**
 * Calculate opacity based on scroll position
 * Property 3: Scroll Guide Visibility
 * For any scroll position > 0, opacity SHALL be <= initial opacity
 * 
 * @param scrollY - Current scroll position
 * @param threshold - Scroll position to start fading
 * @param distance - Distance over which to complete fade
 * @returns Opacity value between 0 and 1
 */
export function calculateScrollOpacity(
  scrollY: number,
  threshold: number = 0,
  distance: number = 100
): number {
  if (scrollY <= threshold) {
    return 1
  }
  
  const scrollPastThreshold = scrollY - threshold
  const opacity = 1 - (scrollPastThreshold / distance)
  
  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, opacity))
}

/**
 * Validate that scroll guide visibility follows the fade rule
 * Property 3: Scroll Guide Visibility
 * For any scroll position > 0, opacity SHALL be <= initial opacity (1)
 */
export function validateScrollGuideVisibility(
  scrollY: number,
  opacity: number,
  initialOpacity: number = 1
): boolean {
  if (scrollY > 0) {
    return opacity <= initialOpacity
  }
  return true
}

export const ScrollGuide: React.FC<ScrollGuideProps> = ({
  text = 'PLEASE SCROLL DOWN',
  fadeThreshold = 0,
  fadeDistance = 100,
  hidden = false,
  onHide,
}) => {
  const [state, setState] = useState<ScrollGuideState>({
    opacity: 1,
    scrollY: 0,
    isVisible: true,
  })

  // Handle scroll events - Requirement 3.4
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset
    const opacity = calculateScrollOpacity(scrollY, fadeThreshold, fadeDistance)
    const isVisible = opacity > 0

    setState({
      opacity,
      scrollY,
      isVisible,
    })

    // Trigger onHide callback when guide becomes hidden
    if (!isVisible && onHide) {
      onHide()
    }
  }, [fadeThreshold, fadeDistance, onHide])

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Don't render if hidden or not visible
  if (hidden || !state.isVisible) {
    return null
  }

  return (
    <ScrollGuideContainer
      data-testid="scroll-guide"
      style={{ opacity: state.opacity }}
      aria-hidden={state.opacity < 0.5}
    >
      {/* Requirement 3.1: Display text at bottom center */}
      <ScrollText data-testid="scroll-guide-text">
        {text}
      </ScrollText>
      
      {/* Requirement 3.2: Animated arrow with pixel elements */}
      <ArrowContainer data-testid="scroll-guide-arrow">
        <PixelArrow>
          <PixelRow>
            <Pixel $delay={0} />
          </PixelRow>
          <PixelRow>
            <Pixel $delay={100} />
            <Pixel $delay={100} />
            <Pixel $delay={100} />
          </PixelRow>
          <PixelRow>
            <Pixel $delay={200} />
            <Pixel $delay={200} />
            <Pixel $delay={200} />
            <Pixel $delay={200} />
            <Pixel $delay={200} />
          </PixelRow>
        </PixelArrow>
      </ArrowContainer>
    </ScrollGuideContainer>
  )
}

// Animation keyframes for pixel elements - Requirement 3.5
const pixelPulse = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

// Styled Components

/**
 * Scroll Guide Container
 * Requirement 3.1: Position at bottom center
 * Requirement 3.3: Apply mix-blend-mode: difference
 * Requirement 3.4: Fade out with opacity transition over 300ms
 */
const ScrollGuideContainer = styled.div`
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 100;
  
  /* Requirement 3.3: Mix blend mode for color inversion */
  mix-blend-mode: difference;
  
  /* Requirement 3.4: Opacity transition over 300ms */
  transition: ${getDefaultTransition('opacity')};
  transition-duration: 300ms;
  
  pointer-events: none;
`

/**
 * Scroll Text
 * Requirement 3.1: Display "PLEASE SCROLL DOWN" text
 */
const ScrollText = styled.span`
  font-family: ${premiumTypography.fontFamily.body};
  font-size: 10px;
  font-weight: ${premiumTypography.fontWeight.normal};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #ffffff;
  -webkit-font-smoothing: ${premiumTypography.fontSmoothing};
`

/**
 * Arrow Container
 * Requirement 3.2: Container for animated arrow
 */
const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

/**
 * Pixel Arrow structure
 * Requirement 3.2: Arrow using pixel-based elements
 */
const PixelArrow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

/**
 * Row of pixels
 */
const PixelRow = styled.div`
  display: flex;
  gap: 2px;
`

/**
 * Individual Pixel element
 * Requirement 3.2: 5px squares
 * Requirement 3.5: Opacity cycling animation
 */
interface PixelProps {
  $delay: number
}

const Pixel = styled.div<PixelProps>`
  width: 5px;
  height: 5px;
  background-color: #ffffff;
  
  /* Requirement 3.5: Opacity cycling animation */
  animation: ${pixelPulse} 1500ms ease-in-out infinite;
  animation-delay: ${props => props.$delay}ms;
`

export default ScrollGuide
