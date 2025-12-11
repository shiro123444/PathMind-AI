import type { ReactNode } from 'react'
import { Button, Spinner } from '@heroui/react'

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
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      isLoading={isLoading}
      isDisabled={isDisabled || isLoading}
      onClick={onClick}
      className={`font-semibold ${color === 'primary' ? 'bg-black text-white hover:bg-gray-800' : ''} ${className}`}
      fullWidth={fullWidth}
      radius="lg"
      spinner={<Spinner size="sm" color="current" />}
      startContent={!isLoading ? startContent : undefined}
      endContent={!isLoading ? endContent : undefined}
      data-testid="form-button"
      data-is-loading={isLoading}
      data-is-disabled={isDisabled || isLoading}
    >
      {children}
    </Button>
  )
}
