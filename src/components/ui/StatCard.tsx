import type { ReactNode } from 'react'
import { Card, CardBody } from '@heroui/react'
import { motion } from 'framer-motion'

interface StatCardProps {
  value: string | number
  label: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

const trendColors = {
  up: 'text-green-500',
  down: 'text-red-500',
  neutral: 'text-text-muted',
}

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

/**
 * StatCard component for displaying statistics with value, label, and optional icon
 * Supports trend indicators and hover effects
 */
export default function StatCard({
  value,
  label,
  icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        className="glass rounded-2xl p-6"
        data-testid="stat-card"
      >
        <CardBody className="p-0">
          <div className="flex items-center justify-between">
            <div>
              {/* Label - smaller font */}
              <p 
                className="text-text-muted text-sm mb-1"
                data-testid="stat-label"
              >
                {label}
              </p>
              
              {/* Value - larger font with trend */}
              <div className="flex items-center gap-2">
                <p 
                  className="text-3xl font-bold text-text-primary"
                  data-testid="stat-value"
                >
                  {value}
                </p>
                
                {trend && (
                  <span 
                    className={`text-sm font-medium ${trendColors[trend]}`}
                    data-testid="stat-trend"
                  >
                    {trendIcons[trend]}
                  </span>
                )}
              </div>
            </div>
            
            {/* Icon */}
            {icon && (
              <div 
                className="text-4xl"
                data-testid="stat-icon"
              >
                {icon}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
