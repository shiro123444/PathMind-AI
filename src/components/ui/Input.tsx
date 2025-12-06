import styled from 'styled-components'

interface InputProps {
  type?: string
  placeholder?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const Input = ({ 
  type = 'text', 
  placeholder, 
  name, 
  value, 
  onChange,
  required 
}: InputProps) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  )
}

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #323232;
  background-color: #fff;
  box-shadow: 4px 4px 0 #323232;
  font-size: 15px;
  font-weight: 500;
  color: #323232;
  padding: 0 16px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #2d8cf0;
    box-shadow: 4px 4px 0 #2d8cf0;
  }
`

export default Input
