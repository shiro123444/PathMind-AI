import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import Container from '../../components/ui/Container'
import Grid from '../../components/ui/Grid'
import Section from '../../components/ui/Section'

/**
 * **Feature: ui-enhancement, Property 3: Consistent Layout Spacing**
 * **Validates: Requirements 3.1**
 * 
 * WHEN any page loads 
 * THEN the Layout_System SHALL apply consistent maximum width constraints and padding values
 */
describe('Layout System - Spacing Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: Container applies correct max-width based on size prop
   * For any size value, the container should have the corresponding max-width class
   */
  it('should apply correct max-width class for any size', () => {
    const sizeToClass: Record<string, string> = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    }

    fc.assert(
      fc.property(
        fc.constantFrom('sm', 'md', 'lg', 'xl', 'full') as fc.Arbitrary<'sm' | 'md' | 'lg' | 'xl' | 'full'>,
        (size) => {
          const { container } = render(
            <Container size={size}>
              <div>Content</div>
            </Container>
          )

          const containerEl = container.firstChild as HTMLElement
          expect(containerEl.className).toContain(sizeToClass[size])
          expect(containerEl.getAttribute('data-container-size')).toBe(size)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Container applies correct padding based on padding prop
   * For any padding value, the container should have responsive padding classes
   */
  it('should apply correct padding class for any padding value', () => {
    const paddingToClass: Record<string, string> = {
      none: '',
      sm: 'px-4',
      md: 'px-4',
      lg: 'px-4',
    }

    fc.assert(
      fc.property(
        fc.constantFrom('none', 'sm', 'md', 'lg') as fc.Arbitrary<'none' | 'sm' | 'md' | 'lg'>,
        (padding) => {
          const { container } = render(
            <Container padding={padding}>
              <div>Content</div>
            </Container>
          )

          const containerEl = container.firstChild as HTMLElement
          if (padding !== 'none') {
            expect(containerEl.className).toContain(paddingToClass[padding])
          }
          expect(containerEl.getAttribute('data-container-padding')).toBe(padding)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Section applies correct vertical spacing
   * For any spacing value, the section should have the corresponding padding classes
   */
  it('should apply correct vertical spacing for any spacing value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sm', 'md', 'lg', 'xl') as fc.Arbitrary<'sm' | 'md' | 'lg' | 'xl'>,
        (spacing) => {
          const { container } = render(
            <Section spacing={spacing}>
              <div>Content</div>
            </Section>
          )

          const sectionEl = container.firstChild as HTMLElement
          expect(sectionEl.tagName).toBe('SECTION')
          expect(sectionEl.getAttribute('data-section-spacing')).toBe(spacing)
          // Should have py- class for vertical padding
          expect(sectionEl.className).toMatch(/py-\d+/)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * **Feature: ui-enhancement, Property 4: Responsive Grid Columns**
 * **Validates: Requirements 3.3**
 * 
 * WHEN the viewport changes size 
 * THEN the Layout_System SHALL responsively adjust grid columns
 */
describe('Layout System - Grid Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: Grid applies correct column classes based on cols prop
   * For any cols value, the grid should have responsive column classes
   */
  it('should apply correct column classes for any cols value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(1, 2, 3, 4, 6) as fc.Arbitrary<1 | 2 | 3 | 4 | 6>,
        (cols) => {
          const { container } = render(
            <Grid cols={cols}>
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
            </Grid>
          )

          const gridEl = container.firstChild as HTMLElement
          expect(gridEl.className).toContain('grid')
          expect(gridEl.getAttribute('data-grid-cols')).toBe(String(cols))
          
          // Should have grid-cols class
          expect(gridEl.className).toMatch(/grid-cols-\d+/)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Grid applies correct gap classes based on gap prop
   * For any gap value, the grid should have the corresponding gap class
   */
  it('should apply correct gap class for any gap value', () => {
    const gapToClass: Record<string, string> = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    }

    fc.assert(
      fc.property(
        fc.constantFrom('sm', 'md', 'lg', 'xl') as fc.Arbitrary<'sm' | 'md' | 'lg' | 'xl'>,
        (gap) => {
          const { container } = render(
            <Grid gap={gap}>
              <div>Item 1</div>
              <div>Item 2</div>
            </Grid>
          )

          const gridEl = container.firstChild as HTMLElement
          expect(gridEl.className).toContain(gapToClass[gap])
          expect(gridEl.getAttribute('data-grid-gap')).toBe(gap)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Grid renders all children
   * For any number of children, all should be rendered
   */
  it('should render all children in grid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        (childCount) => {
          const children = Array.from({ length: childCount }, (_, i) => (
            <div key={i} data-testid={`item-${i}`}>Item {i}</div>
          ))

          const { container } = render(
            <Grid cols={3}>
              {children}
            </Grid>
          )

          const gridEl = container.firstChild as HTMLElement
          expect(gridEl.children.length).toBe(childCount)
          
          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })
})
