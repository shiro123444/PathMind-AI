import type { ReactNode } from 'react'
import { Button, Spinner } from '@heroui/react'
import { motion } from 'framer-motion'
import { variants, easings, durations } from '../../theme/motion'

interface FormButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: 'solid' | 'bordered' | 'light' | 'flat'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  className?: string
  fullWidth?: boolean
  startContent?: ReactNode
  endContent?: ReactNode
}

/**
 * FormButton component wrapping HeroUI Button with loading state
 * Provides consistent button styling with spinner indicator
 * Uses unified animation system for hover/tap feedback (Requirements 4.1-4.5)
 */
export default function FormButton({
  children,
  type = 'button',
  variant = 'solid',
  color = 'primary',
  isLoading = false,
  isDisabled = false,
  onClick,
  className = '',
  fullWidth = false,
  startContent,
  endContent,
}: FormButtonProps) {
  const disabled = isDisabled || isLoading
  
  // Button animation transition using smooth easing and 200ms duration (Requirement 4.3)
  const buttonTransition = {
    duration: durations.fast + 0.05, // 200ms (0.2s)
    ease: easings.smooth,
  }

  return (
    <motion.div
      // Apply hover/tap animations only when not disabled (Requirement 4.5)
      whileHover={!disabled ? variants.button.hover : undefined}
      whileTap={!disabled ? variants.button.tap : undefined}
      transition={buttonTransition}
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto' }}
      data-testid="form-button-wrapper"
      data-disabled={disabled}
    >
      <Button
        type={type}
        variant={variant}
        color={color}
        isLoading={isLoading}
        isDisabled={disabled}
        onClick={onClick}
        className={`font-semibold ${color === 'primary' ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' : ''} ${className}`}
        fullWidth={fullWidth}
        radius="lg"
        spinner={<Spinner size="sm" color="current" />}
        startContent={!isLoading ? startContent : undefined}
        endContent={!isLoading ? endContent : undefined}
        data-testid="form-button"
        data-is-loading={isLoading}
        data-is-disabled={disabled}
      >
        {children}
      </Button>
    </motion.div>
  )
}
