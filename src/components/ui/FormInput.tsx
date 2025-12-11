import { Input } from '@heroui/react'

interface FormInputProps {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired?: boolean
  className?: string
  autoFocus?: boolean
}

/**
 * FormInput component wrapping HeroUI Input with custom styling
 * Provides consistent form input styling with error handling
 */
export default function FormInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  isRequired = false,
  className = '',
  autoFocus = false,
}: FormInputProps) {
  return (
    <Input
      label={label}
      placeholder={placeholder}
      type={type}
      value={value}
      onValueChange={onChange}
      isRequired={isRequired}
      isInvalid={!!error}
      errorMessage={error}
      autoFocus={autoFocus}
      variant="bordered"
      radius="lg"
      classNames={{
        base: className,
        inputWrapper: [
          'border-2',
          'border-gray-200',
          'hover:border-gray-300',
          'focus-within:border-black',
          'transition-colors',
        ],
        input: 'text-gray-900',
        label: 'text-gray-700 font-medium',
        errorMessage: 'text-red-500 text-sm mt-1',
      }}
      data-testid="form-input"
      data-has-error={!!error}
    />
  )
}
