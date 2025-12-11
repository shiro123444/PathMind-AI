/**
 * Theme Configuration
 * Centralized theme values for the application
 */

export const colors = {
  // Primary colors
  primary: {
    50: '#f5f5f5',
    100: '#e5e5e5',
    200: '#cccccc',
    300: '#b3b3b3',
    400: '#808080',
    500: '#000000',
    600: '#000000',
    700: '#000000',
    800: '#000000',
    900: '#000000',
    DEFAULT: '#000000',
  },
  
  // Secondary colors
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    DEFAULT: '#6b7280',
  },
  
  // Semantic colors
  success: '#17c964',
  warning: '#f5a524',
  danger: '#f31260',
  
  // Background colors
  background: '#ffffff',
  foreground: '#11181C',
  
  // Content layers
  content1: '#ffffff',
  content2: '#f4f4f5',
  content3: '#e4e4e7',
  content4: '#d4d4d8',
}

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Consolas", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
}

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
}

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
}

export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: { stiffness: 300, damping: 30 },
  },
}

// WCAG AA contrast ratio requirements
export const accessibility = {
  minContrastNormal: 4.5,  // For normal text
  minContrastLarge: 3.0,   // For large text (18px+ or 14px+ bold)
}

/**
 * Calculate relative luminance of a color
 * @param hex - Hex color string (e.g., '#ffffff')
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First hex color
 * @param color2 - Second hex color
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast meets WCAG AA standards
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const minRatio = isLargeText ? accessibility.minContrastLarge : accessibility.minContrastNormal
  return ratio >= minRatio
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  animation,
  accessibility,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
}
