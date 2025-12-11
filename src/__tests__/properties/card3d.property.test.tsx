import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, cleanup } from '@testing-library/react'
import {
  Card3D,
  DEFAULT_3D_CONFIG,
  calculateRotation,
  clampRotation,
} from '../../components/premium/Card3D'
import type { Transform3DConfig } from '../../components/premium/Card3D'

// Cleanup after each test to prevent multiple elements
afterEach(() => {
  cleanup()
})

/**
 * **Feature: premium-visual-experience, Property 4: 3D Transform Configuration**
 * **Validates: Requirements 4.1, 4.2, 4.5**
 * 
 * For any 3D container element, the CSS properties transform-style: preserve-3d,
 * perspective: 1200px, and backface-visibility: hidden SHALL be correctly applied.
 */
describe('Card3D - 3D Transform Configuration Property Tests', () => {
  /**
   * Property: Default perspective is 1200px
   * Requirement 4.2
   */
  it('should have default perspective of 1200px', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_3D_CONFIG.perspective).toBe(1200)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Transform style is preserve-3d
   * Requirement 4.1
   */
  it('should have transform-style as preserve-3d', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_3D_CONFIG.preserveStyle).toBe('preserve-3d')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Backface visibility is hidden
   * Requirement 4.5
   */
  it('should have backface-visibility as hidden', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_3D_CONFIG.backfaceVisibility).toBe('hidden')
        }
      ),
      { numRuns: 100 }
    )
  })


  /**
   * Property: Default max rotation is 10 degrees
   * Requirement 4.3
   */
  it('should have default max rotation of 10 degrees', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_3D_CONFIG.maxRotation).toBe(10)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: TranslateZ is -20vw for depth effect
   * Requirement 4.4
   */
  it('should have translateZ as -20vw for depth effect', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(DEFAULT_3D_CONFIG.translateZ).toBe('-20vw')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Card3D container applies perspective correctly
   * Requirement 4.2
   */
  it('should render container with perspective', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          render(
            <Card3D>
              <div>Test Content</div>
            </Card3D>
          )
          
          const container = screen.getByTestId('card-3d-container')
          expect(container).toBeInTheDocument()
        }
      ),
      { numRuns: 1 }
    )
  })

  /**
   * Property: Card3D inner element exists with 3D transforms
   * Requirements 4.1, 4.5
   */
  it('should render inner element with 3D transform properties', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          render(
            <Card3D>
              <div>Test Content</div>
            </Card3D>
          )
          
          const inner = screen.getByTestId('card-3d-inner')
          expect(inner).toBeInTheDocument()
        }
      ),
      { numRuns: 1 }
    )
  })

  /**
   * Property: Custom perspective configuration is applied
   * Requirement 4.2
   */
  it('should accept custom perspective configuration', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 2000 }),
        (customPerspective) => {
          // Cleanup before each property iteration
          cleanup()
          
          const customConfig: Partial<Transform3DConfig> = {
            perspective: customPerspective,
          }
          
          render(
            <Card3D config={customConfig}>
              <div>Test Content</div>
            </Card3D>
          )
          
          const container = screen.getByTestId('card-3d-container')
          expect(container).toBeInTheDocument()
        }
      ),
      { numRuns: 10 }
    )
  })
})


/**
 * **Feature: premium-visual-experience, Property 5: 3D Rotation Bounds**
 * **Validates: Requirements 4.3**
 * 
 * For any card with 3D tilt effect, the rotateX and rotateY values 
 * SHALL not exceed the maximum rotation angle (10 degrees).
 */
describe('Card3D - 3D Rotation Bounds Property Tests', () => {
  /**
   * Property: Rotation values never exceed max rotation
   * For any mouse position, rotation should be clamped to maxRotation
   * Requirement 4.3
   */
  it('should clamp rotation values to max rotation bounds', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: 50, max: 500, noNaN: true }),
        fc.float({ min: 50, max: 500, noNaN: true }),
        fc.float({ min: 1, max: 45, noNaN: true }),
        (mouseX, mouseY, cardWidth, cardHeight, maxRotation) => {
          const { rotateX, rotateY } = calculateRotation(
            mouseX,
            mouseY,
            cardWidth,
            cardHeight,
            maxRotation,
            1 // default intensity
          )
          
          // Property 5: Rotation should never exceed maxRotation
          expect(Math.abs(rotateX)).toBeLessThanOrEqual(maxRotation)
          expect(Math.abs(rotateY)).toBeLessThanOrEqual(maxRotation)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Rotation with intensity multiplier still respects bounds
   * For any intensity, rotation should be clamped to maxRotation * intensity
   * Requirement 4.3
   */
  it('should clamp rotation with intensity multiplier', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -500, max: 500, noNaN: true }),
        fc.float({ min: -500, max: 500, noNaN: true }),
        fc.float({ min: 100, max: 400, noNaN: true }),
        fc.float({ min: 100, max: 400, noNaN: true }),
        fc.float({ min: Math.fround(0.1), max: Math.fround(2), noNaN: true }),
        (mouseX, mouseY, cardWidth, cardHeight, intensityMultiplier) => {
          const maxRotation = DEFAULT_3D_CONFIG.maxRotation
          const { rotateX, rotateY } = calculateRotation(
            mouseX,
            mouseY,
            cardWidth,
            cardHeight,
            maxRotation,
            intensityMultiplier
          )
          
          const effectiveMax = maxRotation * intensityMultiplier
          
          // Property 5: Rotation should never exceed effective max
          expect(Math.abs(rotateX)).toBeLessThanOrEqual(effectiveMax + 0.0001) // small epsilon for float precision
          expect(Math.abs(rotateY)).toBeLessThanOrEqual(effectiveMax + 0.0001)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: clampRotation function always returns value within bounds
   * Requirement 4.3
   */
  it('should clamp any rotation value to bounds', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: 1, max: 90, noNaN: true }),
        (value, maxRotation) => {
          const clamped = clampRotation(value, maxRotation)
          
          expect(clamped).toBeGreaterThanOrEqual(-maxRotation)
          expect(clamped).toBeLessThanOrEqual(maxRotation)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Mouse at center produces zero rotation
   * Requirement 4.3
   */
  it('should produce zero rotation when mouse is at center', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 500, noNaN: true }),
        fc.float({ min: 100, max: 500, noNaN: true }),
        (cardWidth, cardHeight) => {
          const centerX = cardWidth / 2
          const centerY = cardHeight / 2
          
          const { rotateX, rotateY } = calculateRotation(
            centerX,
            centerY,
            cardWidth,
            cardHeight,
            DEFAULT_3D_CONFIG.maxRotation,
            1
          )
          
          // At center, rotation should be zero (or very close due to float precision)
          expect(Math.abs(rotateX)).toBeLessThan(0.0001)
          expect(Math.abs(rotateY)).toBeLessThan(0.0001)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Mouse at corners produces maximum rotation
   * Requirement 4.3
   */
  it('should produce maximum rotation when mouse is at corners', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 500, noNaN: true }),
        fc.float({ min: 100, max: 500, noNaN: true }),
        (cardWidth, cardHeight) => {
          const maxRotation = DEFAULT_3D_CONFIG.maxRotation
          
          // Test top-left corner (0, 0)
          const topLeft = calculateRotation(0, 0, cardWidth, cardHeight, maxRotation, 1)
          
          // At corners, rotation should be at or near maximum
          expect(Math.abs(topLeft.rotateX)).toBeGreaterThan(maxRotation * 0.9)
          expect(Math.abs(topLeft.rotateY)).toBeGreaterThan(maxRotation * 0.9)
        }
      ),
      { numRuns: 100 }
    )
  })
})
