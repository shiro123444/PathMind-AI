import type { ReactNode } from 'react'

interface GridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10',
}

/**
 * Responsive Grid component
 * - Mobile (< 768px): 1 column
 * - Tablet (768px - 1024px): 2 columns
 * - Desktop (> 1024px): specified columns (default 3)
 */
export default function Grid({
  children,
  className = '',
  cols = 3,
  gap = 'lg',
  responsive = true,
}: GridProps) {
  // Build responsive column classes
  const getColClasses = () => {
    if (!responsive) {
      return `grid-cols-${cols}`
    }
    
    // Responsive: 1 col mobile, 2 col tablet, specified cols desktop
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 6:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  return (
    <div
      className={`grid ${getColClasses()} ${gapClasses[gap]} ${className}`}
      data-grid-cols={cols}
      data-grid-gap={gap}
    >
      {children}
    </div>
  )
}
