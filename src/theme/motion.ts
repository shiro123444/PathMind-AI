/**
 * Motion Configuration
 * Unified animation system for consistent timing and feel across the app
 * Based on Linear/Apple design principles
 */

/**
 * Easing curves for different animation contexts
 * Values are cubic-bezier parameters [x1, y1, x2, y2]
 */
export const easings = {
  // 主要出场动画 - 快速启动，缓慢结束
  smooth: [0.22, 1, 0.36, 1] as const,
  // 入场动画 - 平滑加速
  smoothIn: [0.55, 0, 0.1, 1] as const,
  // 弹性效果 - 轻微过冲
  bounce: [0.34, 1.56, 0.64, 1] as const,
  // 标准缓动
  easeOut: [0.0, 0.0, 0.2, 1] as const,
} as const

/**
 * Spring configurations for interactive elements
 * Used with Framer Motion's spring animations
 */
export const springs = {
  // 温和弹簧 - 用于大面积元素
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  // 灵敏弹簧 - 用于小型交互元素
  snappy: { stiffness: 200, damping: 25, mass: 1 },
  // 滑动弹簧 - 用于导航指示器 (optimized for smooth sliding within valid range)
  slide: { stiffness: 250, damping: 30, mass: 1 },
} as const

/**
 * Duration constants in seconds
 * For use with Framer Motion transitions
 */
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const

/**
 * Pre-configured animation variants
 * Ready-to-use variants for common animation patterns
 */
export const variants = {
  // 标题入场动画
  heroTitle: {
    initial: { 
      opacity: 0, 
      y: 40, 
      scale: 0.97, 
      filter: 'blur(10px)' 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)' 
    },
  },
  // 页面切换
  pageTransition: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
  },
  // 文字轮播
  rotatingText: {
    initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
  },
  // 按钮交互
  button: {
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 },
  },
} as const

/**
 * Transition presets
 * Pre-configured transition objects for common use cases
 */
export const transitions = {
  smooth: { duration: durations.normal, ease: easings.smooth },
  fast: { duration: durations.fast, ease: easings.smooth },
  slow: { duration: durations.slow, ease: easings.smooth },
  spring: { type: 'spring' as const, ...springs.gentle },
  springSnappy: { type: 'spring' as const, ...springs.snappy },
} as const

/**
 * Flip Animation Configuration
 * For FlipText component - 3D card flip effect for text transitions
 * Requirements: 1.2, 1.3, 1.5
 */
export const flipConfig = {
  duration: 0.4,           // 400ms per character
  staggerDelay: 0.05,      // 50ms between characters
  rotateExit: -90,         // Exit rotation (0° → -90°)
  rotateEnter: 90,         // Enter rotation (90° → 0°)
  ease: [0.0, 0.0, 0.2, 1] as const, // ease-out curve
} as const

/**
 * Breathing Animation Configuration
 * For BreathingOrb component - subtle pulsing background effect
 * Requirements: 2.1, 2.2, 2.3
 */
export const breathingConfig = {
  duration: 4,                           // 4 second cycle
  scaleRange: [1, 1.15, 1] as const,     // Scale from 1 → 1.15 → 1
  opacityRange: [0.1, 0.2, 0.1] as const, // Opacity from 0.1 → 0.2 → 0.1
  ease: 'easeInOut' as const,
} as const

/**
 * Hero Section Animation Sequence
 * Choreographed entrance animation timeline
 * Requirements: 3.1, 3.2
 */
export const heroSequence = {
  staggerDelay: 0.2,  // 200ms between sequence items
  sequence: {
    orbs: 0,          // Background orbs start immediately
    newTag: 0.2,      // NEW tag at 0.2s
    mainTitle: 0.4,   // Main title at 0.4s
    aiGradient: 0.6,  // AI gradient text at 0.6s
    flipText: 0.8,    // FlipText at 0.8s
    subtitle: 1.0,    // Subtitle at 1.0s
    ctaButtons: 1.2,  // CTA buttons at 1.2s
  },
  totalDuration: 1.4, // Last element start + animation duration
} as const

export default {
  easings,
  springs,
  durations,
  variants,
  transitions,
  flipConfig,
  breathingConfig,
  heroSequence,
}
