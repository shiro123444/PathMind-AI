import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import FormButton from '../../components/ui/FormButton'
import FormInput from '../../components/ui/FormInput'

/**
 * **Feature: ui-enhancement, Property 5: Form Loading State Display**
 * **Validates: Requirements 4.3**
 * 
 * WHEN a form submission is in progress 
 * THEN the Form_System SHALL display a loading spinner on the submit button and disable user interaction
 */
describe('Form System - Loading State Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: FormButton displays loading spinner when isLoading is true
   * For any button configuration with isLoading=true, a spinner should be visible
   */
  it('should display loading spinner when isLoading is true', () => {
    const buttonVariants = ['solid', 'bordered', 'light', 'flat'] as const
    const buttonColors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const
    
    fc.assert(
      fc.property(
        fc.record({
          variant: fc.constantFrom(...buttonVariants),
          color: fc.constantFrom(...buttonColors),
          text: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ variant, color, text }) => {
          const { container } = render(
            <FormButton 
              variant={variant} 
              color={color} 
              isLoading={true}
            >
              {text}
            </FormButton>
          )
          
          const button = container.querySelector('[data-testid="form-button"]')
          expect(button).toBeTruthy()
          
          // Button should have data-is-loading attribute set to true
          expect(button?.getAttribute('data-is-loading')).toBe('true')
          
          // Button should be disabled when loading
          expect(button?.getAttribute('data-is-disabled')).toBe('true')
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: FormButton is disabled when isLoading is true
   * For any button with isLoading=true, the button should be disabled
   */
  it('should disable button when isLoading is true regardless of isDisabled prop', () => {
    fc.assert(
      fc.property(
        fc.record({
          isDisabled: fc.boolean(),
          text: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ isDisabled, text }) => {
          const { container } = render(
            <FormButton 
              isLoading={true}
              isDisabled={isDisabled}
            >
              {text}
            </FormButton>
          )
          
          const button = container.querySelector('[data-testid="form-button"]')
          expect(button).toBeTruthy()
          
          // Button should always be disabled when loading, regardless of isDisabled prop
          expect(button?.getAttribute('data-is-disabled')).toBe('true')
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: FormButton is not loading when isLoading is false
   * For any button with isLoading=false, no loading indicator should be shown
   */
  it('should not show loading state when isLoading is false', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        (text) => {
          const { container } = render(
            <FormButton isLoading={false}>
              {text}
            </FormButton>
          )
          
          const button = container.querySelector('[data-testid="form-button"]')
          expect(button).toBeTruthy()
          
          // Button should not have loading state
          expect(button?.getAttribute('data-is-loading')).toBe('false')
          
          // Button should not be disabled (unless explicitly set)
          expect(button?.getAttribute('data-is-disabled')).toBe('false')
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: ui-enhancement, Property 6: Form Validation Error Display**
 * **Validates: Requirements 4.4**
 * 
 * WHEN a form field contains invalid input 
 * THEN the Form_System SHALL display an error message adjacent to the field with appropriate visual styling
 */
describe('Form System - Validation Error Property Tests', () => {
  afterEach(() => {
    cleanup()
  })

  /**
   * Property: FormInput displays error message when error prop is provided
   * For any input with an error message, the error should be visible
   */
  it('should display error message when error prop is provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ maxLength: 50 }),
          error: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        ({ label, value, error }) => {
          const { container } = render(
            <FormInput 
              label={label}
              value={value}
              onChange={() => {}}
              error={error}
            />
          )
          
          const input = container.querySelector('[data-testid="form-input"]')
          expect(input).toBeTruthy()
          
          // Input should have error state
          expect(input?.getAttribute('data-has-error')).toBe('true')
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: FormInput does not show error when error prop is undefined
   * For any input without an error, no error styling should be applied
   */
  it('should not show error state when error prop is undefined', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ maxLength: 50 }),
        }),
        ({ label, value }) => {
          const { container } = render(
            <FormInput 
              label={label}
              value={value}
              onChange={() => {}}
            />
          )
          
          const input = container.querySelector('[data-testid="form-input"]')
          expect(input).toBeTruthy()
          
          // Input should not have error state
          expect(input?.getAttribute('data-has-error')).toBe('false')
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: FormInput error state is consistent with error prop presence
   * For any input, the error state should match whether an error message is provided
   */
  it('should have consistent error state based on error prop presence', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ maxLength: 50 }),
          hasError: fc.boolean(),
          errorMessage: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        ({ label, value, hasError, errorMessage }) => {
          const error = hasError ? errorMessage : undefined
          
          const { container } = render(
            <FormInput 
              label={label}
              value={value}
              onChange={() => {}}
              error={error}
            />
          )
          
          const input = container.querySelector('[data-testid="form-input"]')
          expect(input).toBeTruthy()
          
          // Error state should match whether error prop is provided
          const expectedErrorState = hasError ? 'true' : 'false'
          expect(input?.getAttribute('data-has-error')).toBe(expectedErrorState)
          
          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })
})
