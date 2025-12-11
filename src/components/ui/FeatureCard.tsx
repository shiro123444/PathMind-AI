import type { ReactNode } from 'react'
import { Card, CardBody, CardFooter } from '@heroui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface FeatureCardProps {
  icon: string | ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  variant?: 'default' | 'glass' | 'bordered'
  className?: string
}

const variantClasses = {
  default: 'bg-white shadow-sm hover:shadow-md',
  glass: 'glass',
  bordered: 'bg-white border-2 border-gray-200',
}

/**
 * FeatureCard component for displaying features with icon, title, description
 * Supports hover effects and optional link
 */
export default function FeatureCard({
  icon,
  title,
  description,
  link,
  linkText = '了解更多 →',
  variant = 'glass',
  className = '',
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        className={`p-6 rounded-3xl cursor-pointer group transition-all duration-200 ${variantClasses[variant]}`}
        data-card-variant={variant}
      >
        <CardBody className="p-0 gap-4">
          {/* Icon */}
          <div className="text-5xl" data-testid="feature-icon">
            {typeof icon === 'string' ? icon : icon}
          </div>
          
          {/* Title */}
          <h3 
            className="text-xl font-bold text-gray-900"
            data-testid="feature-title"
          >
            {title}
          </h3>
          
          {/* Description */}
          <p 
            className="text-gray-600 leading-relaxed"
            data-testid="feature-description"
          >
            {description}
          </p>
        </CardBody>
        
        {link && (
          <CardFooter className="p-0 pt-4">
            <Link
              to={link}
              className="inline-flex items-center gap-2 text-black font-semibold group-hover:gap-4 transition-all"
              data-testid="feature-link"
            >
              {linkText}
            </Link>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
