import styled from 'styled-components'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'oauth'
  icon?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  type = 'button',
  fullWidth = false 
}: ButtonProps) => {
  return (
    <StyledButton 
      $variant={variant} 
      $fullWidth={fullWidth}
      onClick={onClick}
      type={type}
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button<{ $variant: string; $fullWidth: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  min-width: 200px;
  height: 48px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  ${props => props.$variant === 'primary' && `
    background-color: #1a1a1a;
    color: #ffffff;
    border: 2px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 #1a1a1a;
    }
    
    &:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 #1a1a1a;
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background-color: #ffffff;
    color: #1a1a1a;
    border: 2px solid #1a1a1a;
    box-shadow: 4px 4px 0 #1a1a1a;
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 #1a1a1a;
    }
    
    &:active {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 #1a1a1a;
    }
  `}

  ${props => props.$variant === 'oauth' && `
    background-color: #ffffff;
    color: #323232;
    border: 2px solid #323232;
    box-shadow: 4px 4px 0 #323232;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background-color: #212121;
      z-index: -1;
      box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
      transition: all 0.25s ease;
    }
    
    &:hover {
      color: #e8e8e8;
      
      &::before {
        width: 100%;
      }
    }
  `}

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
`

export default Button
