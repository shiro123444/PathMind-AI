import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, cleanup } from '@testing-library/react'
import {
  GlassPanel,
  DEFAULT_GLASS_CONFIG,
  GLASS_VARIANTS,
  calculateRelativeLuminance,
  calculateContrastRatio,
  parseRgba,
  meetsContrastRequirement,
} from '../../components/premium/GlassPanel'

// Cleanup after each test to prevent multiple elements
afterEach(() => {
  cleanup()
})

/**
 * **Feature: premium-visual-experience, Property 8: Glass Effect Configuration**
 * **Validates: Requirements 9.1, 9.2**
 * 
 * For any glass panel element, backdrop-filter blur SHALL be 7px 
 * and background SHALL be rgba(255, 255, 255, 0.4).
 */
describe('GlassPanel - Glass Effect Configuration Property Tests', () => {
  /**
   * Property: Default blur is 7px
   * Requirement 9.1
   */
  it('should have default blur of 7px', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_GLASS_CONFIG.blur).toBe(7)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Default background is rgba(255, 255, 255, 0.4)
   * Requirement 9.2
   */
  it('should have default background of rgba(255, 255, 255, 0.4)', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_GLASS_CONFIG.background).toBe('rgba(255, 255, 255, 0.4)')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Default border is 1px dashed #121212
   * Requirement 9.3
   */
  it('should have default border of 1px dashed #121212', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_GLASS_CONFIG.border).toBe('1px dashed #121212')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Default minimum contrast ratio is 4.5
   * Requirement 9.5
   */
  it('should have default minimum contrast ratio of 4.5', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_GLASS_CONFIG.minContrastRatio).toBe(4.5)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Default variant matches default config
   * Requirements 9.1, 9.2, 9.3
   */
  it('should have default variant matching default config values', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(GLASS_VARIANTS.default.blur).toBe(DEFAULT_GLASS_CONFIG.blur)
          expect(GLASS_VARIANTS.default.background).toBe(DEFAULT_GLASS_CONFIG.background)
          expect(GLASS_VARIANTS.default.border).toBe(DEFAULT_GLASS_CONFIG.border)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: GlassPanel renders with correct test id
   * Requirements 9.1, 9.2
   */
  it('should render glass panel element', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          render(
            <GlassPanel>
              <div>Test Content</div>
            </GlassPanel>
          )
          
          const panel = screen.getByTestId('glass-panel')
          expect(panel).toBeInTheDocument()
        }
      ),
      { numRuns: 1 }
    )
  })

  /**
   * Property: All variants have valid blur values (positive numbers)
   * Requirement 9.1
   */
  it('should have positive blur values for all variants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('default', 'strong', 'subtle') as fc.Arbitrary<keyof typeof GLASS_VARIANTS>,
        (variant) => {
          const config = GLASS_VARIANTS[variant]
          expect(config.blur).toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All variants have valid background values (rgba format)
   * Requirement 9.2
   */
  it('should have valid rgba background for all variants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('default', 'strong', 'subtle') as fc.Arbitrary<keyof typeof GLASS_VARIANTS>,
        (variant) => {
          const config = GLASS_VARIANTS[variant]
          expect(config.background).toMatch(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)/)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Custom blur configuration is accepted
   * Requirement 9.1
   */
  it('should accept custom blur configuration', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (customBlur) => {
          cleanup()
          
          render(
            <GlassPanel config={{ blur: customBlur }}>
              <div>Test Content</div>
            </GlassPanel>
          )
          
          const panel = screen.getByTestId('glass-panel')
          expect(panel).toBeInTheDocument()
        }
      ),
      { numRuns: 10 }
    )
  })
})


/**
 * **Feature: premium-visual-experience, Property 9: Glass Text Contrast**
 * **Validates: Requirements 9.5**
 * 
 * For any text rendered on a glass panel, the contrast ratio 
 * SHALL be at least 4.5:1 for WCAG AA compliance.
 */
describe('GlassPanel - Glass Text Contrast Property Tests', () => {
  /**
   * Property: Relative luminance is always between 0 and 1
   * Requirement 9.5
   */
  it('should calculate relative luminance between 0 and 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r, g, b) => {
          const luminance = calculateRelativeLuminance(r, g, b)
          
          expect(luminance).toBeGreaterThanOrEqual(0)
          expect(luminance).toBeLessThanOrEqual(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Black has luminance of 0
   * Requirement 9.5
   */
  it('should calculate luminance of 0 for black', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const luminance = calculateRelativeLuminance(0, 0, 0)
          expect(luminance).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: White has luminance of 1
   * Requirement 9.5
   */
  it('should calculate luminance of 1 for white', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const luminance = calculateRelativeLuminance(255, 255, 255)
          expect(luminance).toBe(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Contrast ratio is always between 1 and 21
   * Requirement 9.5
   */
  it('should calculate contrast ratio between 1 and 21', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r1, g1, b1, r2, g2, b2) => {
          const ratio = calculateContrastRatio(
            { r: r1, g: g1, b: b1 },
            { r: r2, g: g2, b: b2 }
          )
          
          expect(ratio).toBeGreaterThanOrEqual(1)
          expect(ratio).toBeLessThanOrEqual(21)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Contrast ratio is symmetric
   * Requirement 9.5
   */
  it('should calculate same contrast ratio regardless of order', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r1, g1, b1, r2, g2, b2) => {
          const ratio1 = calculateContrastRatio(
            { r: r1, g: g1, b: b1 },
            { r: r2, g: g2, b: b2 }
          )
          const ratio2 = calculateContrastRatio(
            { r: r2, g: g2, b: b2 },
            { r: r1, g: g1, b: b1 }
          )
          
          expect(ratio1).toBeCloseTo(ratio2, 10)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Black on white has maximum contrast (21:1)
   * Requirement 9.5
   */
  it('should calculate maximum contrast for black on white', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const ratio = calculateContrastRatio(
            { r: 0, g: 0, b: 0 },
            { r: 255, g: 255, b: 255 }
          )
          
          expect(ratio).toBeCloseTo(21, 0)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Same color has minimum contrast (1:1)
   * Requirement 9.5
   */
  it('should calculate minimum contrast for same colors', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r, g, b) => {
          const ratio = calculateContrastRatio(
            { r, g, b },
            { r, g, b }
          )
          
          expect(ratio).toBe(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: parseRgba correctly parses valid rgba strings
   * Requirement 9.5
   */
  it('should parse valid rgba strings', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        // Use integer-based alpha to avoid scientific notation in string representation
        fc.integer({ min: 0, max: 100 }).map(n => n / 100),
        (r, g, b, a) => {
          // Format alpha with fixed decimal places to match practical CSS usage
          const alphaStr = a.toFixed(2)
          const rgbaString = `rgba(${r}, ${g}, ${b}, ${alphaStr})`
          const parsed = parseRgba(rgbaString)
          
          expect(parsed).not.toBeNull()
          expect(parsed?.r).toBe(r)
          expect(parsed?.g).toBe(g)
          expect(parsed?.b).toBe(b)
          expect(parsed?.a).toBeCloseTo(a, 2)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: parseRgba returns null for invalid strings
   * Requirement 9.5
   */
  it('should return null for invalid color strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('invalid', 'not-a-color', '#fff', 'hsl(0, 0%, 0%)'),
        (invalidString) => {
          const parsed = parseRgba(invalidString)
          expect(parsed).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Dark text (#121212) on default glass meets contrast requirement
   * Requirement 9.5
   */
  it('should meet contrast requirement for dark text on default glass', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const darkText = { r: 18, g: 18, b: 18 } // #121212
          const glassBackground = DEFAULT_GLASS_CONFIG.background
          
          const meetsRequirement = meetsContrastRequirement(darkText, glassBackground)
          
          expect(meetsRequirement).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Minimum contrast ratio is 4.5:1 (WCAG AA)
   * Requirement 9.5
   */
  it('should have minimum contrast ratio of 4.5 for WCAG AA compliance', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_GLASS_CONFIG.minContrastRatio).toBe(4.5)
        }
      ),
      { numRuns: 100 }
    )
  })
})
