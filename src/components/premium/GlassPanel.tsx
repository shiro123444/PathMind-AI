import React from 'react'
import styled from 'styled-components'
import { getDefaultTransition } from '../../theme/premium'

/**
 * GlassPanel Component
 * 
 * Premium glassmorphism panel with backdrop blur and semi-transparent background.
 * Based on bpco.kr design analysis.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

/**
 * Glass Effect Configuration Interface
 * Property 8: Glass Effect Configuration
 * Validates: Requirements 9.1, 9.2
 */
export interface GlassEffectConfig {
  /** Backdrop blur value in pixels - Requirement 9.1 */
  blur: number
  /** Background color with transparency - Requirement 9.2 */
  background: string
  /** Border style - Requirement 9.3 */
  border: string
  /** Minimum contrast ratio for text - Requirement 9.5 */
  minContrastRatio: number
}

/**
 * Default Glass Effect Configuration
 * Validates: Requirements 9.1, 9.2, 9.3, 9.5
 */
export const DEFAULT_GLASS_CONFIG: GlassEffectConfig = {
  // Requirement 9.1: backdrop-filter: blur(7px)
  blur: 7,
  // Requirement 9.2: background: rgba(255, 255, 255, 0.4)
  background: 'rgba(255, 255, 255, 0.4)',
  // Requirement 9.3: border: 1px dashed #121212
  border: '1px dashed #121212',
  // Requirement 9.5: minimum 4.5:1 contrast ratio
  minContrastRatio: 4.5,
}

/**
 * Glass panel variant configurations
 */
export const GLASS_VARIANTS = {
  default: {
    blur: 7,
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px dashed #121212',
  },
  strong: {
    blur: 12,
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid #121212',
  },
  subtle: {
    blur: 4,
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px dashed rgba(18, 18, 18, 0.5)',
  },
} as const

export type GlassVariant = keyof typeof GLASS_VARIANTS

export interface GlassPanelProps {
  /** Child elements to render inside the panel */
  children: React.ReactNode
  /** Glass effect variant */
  variant?: GlassVariant
  /** Additional CSS class name */
  className?: string
  /** Custom z-index for layering - Requirement 9.4 */
  zIndex?: number
  /** Custom glass configuration override */
  config?: Partial<GlassEffectConfig>
  /** Whether to use high contrast text for accessibility - Requirement 9.5 */
  highContrast?: boolean
}


/**
 * Calculate relative luminance of a color
 * Used for contrast ratio calculation - Requirement 9.5
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * Property 9: Glass Text Contrast
 * Validates: Requirements 9.5
 * 
 * @param foreground - RGB values of foreground color
 * @param background - RGB values of background color
 * @returns Contrast ratio (1 to 21)
 */
export function calculateContrastRatio(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number }
): number {
  const l1 = calculateRelativeLuminance(foreground.r, foreground.g, foreground.b)
  const l2 = calculateRelativeLuminance(background.r, background.g, background.b)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Parse RGBA color string to RGB values
 */
export function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return null
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1,
  }
}

/**
 * Check if text color meets minimum contrast ratio on glass background
 * Property 9: Glass Text Contrast
 * Validates: Requirements 9.5
 * 
 * @param textColor - RGB values of text color
 * @param glassBackground - RGBA string of glass background
 * @param baseBackground - RGB values of base background behind glass
 * @returns Whether contrast ratio meets minimum (4.5:1)
 */
export function meetsContrastRequirement(
  textColor: { r: number; g: number; b: number },
  glassBackground: string,
  baseBackground: { r: number; g: number; b: number } = { r: 229, g: 229, b: 229 } // #e5e5e5
): boolean {
  const glass = parseRgba(glassBackground)
  if (!glass) return false
  
  // Blend glass color with base background
  const blendedR = Math.round(glass.r * glass.a + baseBackground.r * (1 - glass.a))
  const blendedG = Math.round(glass.g * glass.a + baseBackground.g * (1 - glass.a))
  const blendedB = Math.round(glass.b * glass.a + baseBackground.b * (1 - glass.a))
  
  const contrastRatio = calculateContrastRatio(
    textColor,
    { r: blendedR, g: blendedG, b: blendedB }
  )
  
  return contrastRatio >= DEFAULT_GLASS_CONFIG.minContrastRatio
}

/**
 * Get text color that meets contrast requirements
 * Requirement 9.5: Ensure text remains readable with minimum 4.5:1 contrast ratio
 */
export function getAccessibleTextColor(
  glassBackground: string,
  preferredColor: { r: number; g: number; b: number } = { r: 18, g: 18, b: 18 } // #121212
): string {
  // Check if preferred color meets contrast
  if (meetsContrastRequirement(preferredColor, glassBackground)) {
    return `rgb(${preferredColor.r}, ${preferredColor.g}, ${preferredColor.b})`
  }
  
  // Fallback to darker color for better contrast
  return '#000000'
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = 'default',
  className,
  zIndex,
  config,
  highContrast = false,
}) => {
  const variantConfig = GLASS_VARIANTS[variant]
  
  // Merge variant config with custom config
  const mergedConfig = {
    blur: config?.blur ?? variantConfig.blur,
    background: config?.background ?? variantConfig.background,
    border: config?.border ?? variantConfig.border,
  }

  return (
    <GlassPanelContainer
      data-testid="glass-panel"
      className={className}
      $blur={mergedConfig.blur}
      $background={mergedConfig.background}
      $border={mergedConfig.border}
      $zIndex={zIndex}
      $highContrast={highContrast}
    >
      {children}
    </GlassPanelContainer>
  )
}

// Styled Components

/**
 * Glass Panel Container with glassmorphism effects
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
interface GlassPanelContainerProps {
  $blur: number
  $background: string
  $border: string
  $zIndex?: number
  $highContrast: boolean
}

const GlassPanelContainer = styled.div<GlassPanelContainerProps>`
  /* Requirement 9.1: Apply backdrop-filter: blur(7px) */
  backdrop-filter: blur(${props => props.$blur}px);
  -webkit-backdrop-filter: blur(${props => props.$blur}px);
  
  /* Requirement 9.2: Apply background: rgba(255, 255, 255, 0.4) */
  background: ${props => props.$background};
  
  /* Requirement 9.3: Apply border: 1px dashed #121212 */
  border: ${props => props.$border};
  
  /* Requirement 9.4: Maintain z-index hierarchy for proper layering */
  ${props => props.$zIndex !== undefined && `z-index: ${props.$zIndex};`}
  position: relative;
  
  /* Requirement 9.5: Ensure text remains readable */
  color: ${props => props.$highContrast ? '#000000' : 'var(--text-primary)'};
  
  /* Smooth transitions */
  transition: ${getDefaultTransition('background')}, ${getDefaultTransition('border')};
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(1px)) {
    background: rgba(255, 255, 255, 0.85);
  }
`

export default GlassPanel
