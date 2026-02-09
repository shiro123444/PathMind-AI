import { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { premiumTypography } from '../../theme/premium'

/**
 * LoadingExperience Component
 * 
 * Premium loading experience with progress bar, percentage counter, and exit animation.
 * Based on bpco.kr design analysis.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

export interface LoadingExperienceProps {
  /** Callback when loading completes and exit animation finishes */
  onComplete: () => void
  /** Duration of loading in milliseconds (default: 2000) */
  duration?: number
  /** Whether to show company introduction text (default: true) */
  showText?: boolean
  /** Company introduction text to display */
  introText?: string
}

export interface LoadingState {
  /** Current progress value (0-100) */
  progress: number
  /** Whether loading has reached 100% */
  isComplete: boolean
  /** Whether exit animation is playing */
  isExiting: boolean
}

/**
 * Clamp progress value to valid bounds (0-100)
 * Property 1: Loading Progress Bounds - ensures progress is always 0-100
 */
export function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({
  onComplete,
  duration = 2000,
  showText = true,
  introText = 'Crafting Your Experience',
}) => {
  const [state, setState] = useState<LoadingState>({
    progress: 0,
    isComplete: false,
    isExiting: false,
  })

  // Handle exit animation completion
  const handleExitComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  // Progress animation
  useEffect(() => {
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const rawProgress = (elapsed / duration) * 100
      const progress = clampProgress(rawProgress)

      setState(prev => ({
        ...prev,
        progress,
        isComplete: progress >= 100,
      }))

      if (progress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    const animationId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [duration])

  // Trigger exit animation when complete
  useEffect(() => {
    if (state.isComplete && !state.isExiting) {
      // Small delay before exit animation
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, isExiting: true }))
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [state.isComplete, state.isExiting])

  // Handle exit animation end
  useEffect(() => {
    if (state.isExiting) {
      const timer = setTimeout(() => {
        handleExitComplete()
      }, 400) // Exit animation duration

      return () => clearTimeout(timer)
    }
  }, [state.isExiting, handleExitComplete])

  return (
    <LoadingOverlay
      data-testid="loading-overlay"
      $isExiting={state.isExiting}
      aria-live="polite"
      aria-busy={!state.isComplete}
    >
      <LoadingContent>
        {/* Progress Bar - Requirement 1.2 */}
        <ProgressBarContainer data-testid="progress-bar-container">
          <ProgressBarFill
            data-testid="progress-bar-fill"
            style={{ width: `${state.progress}%` }}
          />
        </ProgressBarContainer>

        {/* Percentage Counter - Requirement 1.3 */}
        <PercentageCounter data-testid="percentage-counter">
          {Math.round(state.progress)}%
        </PercentageCounter>
      </LoadingContent>

      {/* Company Introduction Text - Requirement 1.5 */}
      {showText && (
        <IntroText data-testid="intro-text">
          {introText}
        </IntroText>
      )}
    </LoadingOverlay>
  )
}

// Exit animation keyframes - Requirement 1.4
const exitAnimation = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100vh);
  }
`

// Styled Components

/**
 * Full-screen loading overlay
 * Requirement 1.1: Dark background (#000)
 */
const LoadingOverlay = styled.div<{ $isExiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000000;
  animation: ${props => props.$isExiting ? exitAnimation : 'none'} 400ms ease-out forwards;
`

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 300px;
  padding: 0 24px;
`

/**
 * Progress bar container
 * Requirement 1.2: Progress bar styling
 */
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
`

/**
 * Progress bar fill with glow effect
 * Requirement 1.2: White fill with glow effect (box-shadow: 0 0 20px)
 */
const ProgressBarFill = styled.div`
  height: 100%;
  background: #ffffff;
  box-shadow: 0 0 20px 0 #ffffff;
  border-radius: 1px;
  transition: width 16ms linear;
`

/**
 * Percentage counter with monospace font
 * Requirement 1.3: Percentage counter (0-100%) using monospace font
 */
const PercentageCounter = styled.span`
  font-family: ${premiumTypography.fontFamily.mono};
  font-size: 14px;
  font-weight: ${premiumTypography.fontWeight.normal};
  color: #ffffff;
  letter-spacing: 0.1em;
  -webkit-font-smoothing: ${premiumTypography.fontSmoothing};
`

/**
 * Company introduction text at bottom center
 * Requirement 1.5: Company introduction text at bottom center
 */
const IntroText = styled.p`
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${premiumTypography.fontFamily.body};
  font-size: 12px;
  font-weight: ${premiumTypography.fontWeight.normal};
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  -webkit-font-smoothing: ${premiumTypography.fontSmoothing};
`

export default LoadingExperience
