import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { 
  premiumColors, 
  getGlowBoxShadow, 
  getBackgroundGradient, 
  getOverlayBackground 
} from '../../theme/premium'

/**
 * **Feature: premium-visual-experience, Property 2: Color System Consistency**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 * 
 * For any rendered element using the premium color system, the applied colors 
 * SHALL match the defined color palette (primary text: #121212, accent: #fe4534, 
 * background gradient as specified).
 */
describe('Premium Theme - Color System Consistency Property Tests', () => {
  /**
   * Property: Primary text color is always #121212
   * Requirement 2.3
   */
  it('should have primary text color as #121212', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumColors.text.primary).toBe('#121212')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Accent color is always #fe4534
   * Requirement 2.4
   */
  it('should have accent color as #fe4534', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumColors.accent).toBe('#fe4534')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Background gradient matches specification
   * Requirement 2.1
   */
  it('should have correct background gradient', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const expectedGradient = 'linear-gradient(180deg, #e5e5e5, #f3f3f3 79.17%, #e2e2e2)'
          expect(premiumColors.background.primary).toBe(expectedGradient)
          expect(getBackgroundGradient()).toBe(expectedGradient)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Overlay background is semi-transparent white
   * Requirement 2.2
   */
  it('should have correct overlay background', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const expectedOverlay = 'rgba(255, 255, 255, 0.3)'
          expect(premiumColors.background.overlay).toBe(expectedOverlay)
          expect(getOverlayBackground()).toBe(expectedOverlay)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Glow effect uses white color with 20px blur
   * Requirement 2.5
   */
  it('should have correct glow configuration', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumColors.glow.color).toBe('#ffffff')
          expect(premiumColors.glow.blur).toBe(20)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Glow box-shadow generates correct CSS
   * For any intensity multiplier, the blur should scale proportionally
   * Requirement 2.5
   */
  it('should generate correct glow box-shadow for any intensity', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.1), max: Math.fround(5), noNaN: true }),
        (intensity) => {
          const boxShadow = getGlowBoxShadow(intensity)
          const expectedBlur = premiumColors.glow.blur * intensity
          
          // Box shadow should contain the calculated blur value
          expect(boxShadow).toContain(`${expectedBlur}px`)
          // Box shadow should contain the glow color
          expect(boxShadow).toContain(premiumColors.glow.color)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Default glow box-shadow uses 20px blur
   * Requirement 2.5
   */
  it('should generate default glow with 20px blur', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const boxShadow = getGlowBoxShadow()
          expect(boxShadow).toBe('0 0 20px 0 #ffffff')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All color values are valid
   * For any color in the premium palette, it should be a valid color format
   */
  it('should have all valid color formats', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
    const rgbaRegex = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/
    const gradientRegex = /^linear-gradient\(/
    
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // Hex colors
          expect(premiumColors.text.primary).toMatch(hexColorRegex)
          expect(premiumColors.text.secondary).toMatch(hexColorRegex)
          expect(premiumColors.accent).toMatch(hexColorRegex)
          expect(premiumColors.glow.color).toMatch(hexColorRegex)
          expect(premiumColors.background.dark).toMatch(hexColorRegex)
          
          // RGBA colors
          expect(premiumColors.background.overlay).toMatch(rgbaRegex)
          
          // Gradient
          expect(premiumColors.background.primary).toMatch(gradientRegex)
        }
      ),
      { numRuns: 100 }
    )
  })
})


import {
  premiumTypography,
  getBodyTextStyles,
  getHeadingTextStyles,
  getMonospaceTextStyles,
} from '../../theme/premium'

/**
 * **Feature: premium-visual-experience, Property 7: Typography System Consistency**
 * **Validates: Requirements 7.1, 7.4**
 * 
 * For any body text element, the font-family SHALL include "Inter" and 
 * line-height SHALL be between 1.3 and 1.5.
 */
describe('Premium Theme - Typography System Consistency Property Tests', () => {
  /**
   * Property: Body font family includes "Inter"
   * Requirement 7.1
   */
  it('should have body font family including Inter', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.fontFamily.body).toContain('Inter')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Body font family includes "Pretendard"
   * Requirement 7.1
   */
  it('should have body font family including Pretendard', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.fontFamily.body).toContain('Pretendard')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Body line-height is between 1.3 and 1.5
   * Requirement 7.4
   */
  it('should have body line-height between 1.3 and 1.5', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const lineHeight = premiumTypography.lineHeight.body
          expect(lineHeight).toBeGreaterThanOrEqual(1.3)
          expect(lineHeight).toBeLessThanOrEqual(1.5)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Monospace font family includes monospace
   * Requirement 7.2
   */
  it('should have monospace font family', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.fontFamily.mono).toContain('monospace')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Heading font weight is 700 (bold)
   * Requirement 7.3
   */
  it('should have heading font weight as 700', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.fontWeight.bold).toBe(700)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Heading letter spacing is -0.04em
   * Requirement 7.3
   */
  it('should have heading letter spacing as -0.04em', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.letterSpacing.heading).toBe('-0.04em')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Font smoothing is antialiased
   * Requirement 7.5
   */
  it('should have font smoothing as antialiased', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(premiumTypography.fontSmoothing).toBe('antialiased')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Body text styles include correct font family and line height
   * Requirements 7.1, 7.4, 7.5
   */
  it('should generate correct body text styles', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const styles = getBodyTextStyles()
          
          expect(styles.fontFamily).toContain('Inter')
          expect(styles.lineHeight).toBeGreaterThanOrEqual(1.3)
          expect(styles.lineHeight).toBeLessThanOrEqual(1.5)
          expect(styles.WebkitFontSmoothing).toBe('antialiased')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Heading text styles include correct font weight and letter spacing
   * Requirements 7.1, 7.3, 7.5
   */
  it('should generate correct heading text styles', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const styles = getHeadingTextStyles()
          
          expect(styles.fontFamily).toContain('Inter')
          expect(styles.fontWeight).toBe(700)
          expect(styles.letterSpacing).toBe('-0.04em')
          expect(styles.WebkitFontSmoothing).toBe('antialiased')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Monospace text styles include monospace font
   * Requirement 7.2
   */
  it('should generate correct monospace text styles', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const styles = getMonospaceTextStyles()
          
          expect(styles.fontFamily).toContain('monospace')
          expect(styles.WebkitFontSmoothing).toBe('antialiased')
        }
      ),
      { numRuns: 100 }
    )
  })
})
