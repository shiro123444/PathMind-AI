import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  id?: string
}

const spacingClasses = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-20',
  xl: 'py-20 md:py-28',
}

/**
 * Section component for consistent vertical spacing
 * Provides responsive padding for page sections
 */
export default function Section({
  children,
  className = '',
  spacing = 'lg',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${spacingClasses[spacing]} ${className}`}
      data-section-spacing={spacing}
    >
      {children}
    </section>
  )
}
