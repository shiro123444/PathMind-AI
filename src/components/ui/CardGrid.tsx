import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Grid from './Grid'

interface CardGridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  stagger?: boolean
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function CardGrid({
  children,
  className = '',
  cols = 3,
  gap = 'lg',
  stagger = true,
}: CardGridProps) {
  const childrenArray = Array.isArray(children) ? children : [children]

  if (stagger) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full ${className}`}
      >
        <Grid cols={cols} gap={gap} className="w-full">
          {childrenArray.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
            >
              {child}
            </motion.div>
          ))}
        </Grid>
      </motion.div>
    )
  }

  return (
    <Grid cols={cols} gap={gap} className={`w-full ${className}`}>
      {children}
    </Grid>
  )
}

export default CardGrid
