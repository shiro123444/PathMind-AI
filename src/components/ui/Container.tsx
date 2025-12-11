import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-4 sm:px-6',
  lg: 'px-4 sm:px-6 lg:px-8',
}

/**
 * Container component for consistent max-width and padding
 * Provides responsive padding and configurable max-width
 */
export default function Container({
  children,
  className = '',
  size = 'xl',
  padding = 'lg',
}: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto ${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}
      data-container-size={size}
      data-container-padding={padding}
    >
      {children}
    </div>
  )
}
