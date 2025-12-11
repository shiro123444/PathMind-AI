import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as fc from 'fast-check'
import FeatureCard from '../../components/ui/FeatureCard'
import StatCard from '../../components/ui/StatCard'
import Grid from '../../components/ui/Grid'

// Wrapper for components that use Link
function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

/**
 * **Feature: ui-enhancement, Property 7: Card Statistics Typography Hierarchy**
 * **Validates: Requirements 5.3**
 * 
 * WHEN cards contain statistics or metrics 
 * THEN the Card_System SHALL display them with appropriate typography hierarchy
 */
describe('Card System - Typography Hierarchy Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: StatCard value has larger font than label
   * For any stat card, the value should have text-3xl class (larger than label's text-sm)
   */
  it('should have larger font for value than label in StatCard', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.oneof(fc.string({ minLength: 1, maxLength: 10 }), fc.integer({ min: 0, max: 9999 })),
          label: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ value, label }) => {
          render(<StatCard value={value} label={label} />)

          const valueEl = screen.getByTestId('stat-value')
          const labelEl = screen.getByTestId('stat-label')

          // Value should have text-3xl (larger)
          expect(valueEl.className).toContain('text-3xl')
          expect(valueEl.className).toContain('font-bold')

          // Label should have text-sm (smaller)
          expect(labelEl.className).toContain('text-sm')

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: StatCard renders all required elements
   * For any valid props, StatCard should render value and label
   */
  it('should render value and label for any valid props', () => {
    fc.assert(
      fc.property(
        fc.record({
          value: fc.string({ minLength: 1, maxLength: 10 }),
          label: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ value, label }) => {
          render(<StatCard value={value} label={label} />)

          expect(screen.getByTestId('stat-value')).toBeTruthy()
          expect(screen.getByTestId('stat-label')).toBeTruthy()
          expect(screen.getByTestId('stat-value').textContent).toBe(value)
          expect(screen.getByTestId('stat-label').textContent).toBe(label)

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: FeatureCard renders all required elements
   * For any valid props, FeatureCard should render icon, title, and description
   */
  it('should render icon, title, and description for any valid props', () => {
    fc.assert(
      fc.property(
        fc.record({
          icon: fc.constantFrom('🎯', '📚', '🤖', '💡'),
          title: fc.string({ minLength: 1, maxLength: 30 }),
          description: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        ({ icon, title, description }) => {
          renderWithRouter(
            <FeatureCard icon={icon} title={title} description={description} />
          )

          expect(screen.getByTestId('feature-icon')).toBeTruthy()
          expect(screen.getByTestId('feature-title')).toBeTruthy()
          expect(screen.getByTestId('feature-description')).toBeTruthy()
          expect(screen.getByTestId('feature-title').textContent).toBe(title)
          expect(screen.getByTestId('feature-description').textContent).toBe(description)

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: FeatureCard title has appropriate typography
   * Title should have text-xl and font-bold classes
   */
  it('should have appropriate typography for FeatureCard title', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (title) => {
          renderWithRouter(
            <FeatureCard icon="🎯" title={title} description="Test description" />
          )

          const titleEl = screen.getByTestId('feature-title')
          expect(titleEl.className).toContain('text-xl')
          expect(titleEl.className).toContain('font-bold')

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * **Feature: ui-enhancement, Property 8: Grid Gap Consistency**
 * **Validates: Requirements 5.4**
 * 
 * WHEN cards are arranged in a grid 
 * THEN the Card_System SHALL maintain consistent gaps across all breakpoints
 */
describe('Card System - Grid Gap Consistency Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: Grid maintains consistent gap class
   * For any gap value, the grid should have the corresponding gap class
   */
  it('should maintain consistent gap class for card grids', () => {
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
          const { container } = renderWithRouter(
            <Grid gap={gap} cols={3}>
              <FeatureCard icon="🎯" title="Card 1" description="Desc 1" />
              <FeatureCard icon="📚" title="Card 2" description="Desc 2" />
              <FeatureCard icon="🤖" title="Card 3" description="Desc 3" />
            </Grid>
          )

          const gridEl = container.firstChild as HTMLElement
          expect(gridEl.className).toContain(gapToClass[gap])

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: StatCards in grid maintain consistent spacing
   * Multiple StatCards in a grid should all be rendered with consistent gap
   */
  it('should render multiple StatCards with consistent grid gap', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 6 }),
        (cardCount) => {
          const cards = Array.from({ length: cardCount }, (_, i) => (
            <StatCard key={i} value={`${i * 10}`} label={`Stat ${i}`} />
          ))

          const { container } = render(
            <Grid gap="lg" cols={3}>
              {cards}
            </Grid>
          )

          const gridEl = container.firstChild as HTMLElement
          expect(gridEl.className).toContain('gap-8') // lg = gap-8
          expect(gridEl.children.length).toBe(cardCount)

          cleanup()
        }
      ),
      { numRuns: 50 }
    )
  })
})
