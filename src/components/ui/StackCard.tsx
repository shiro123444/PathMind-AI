import styled from 'styled-components'
import { motion } from 'framer-motion'

interface StackCardProps {
  children: React.ReactNode
  className?: string
}

const StackCard = ({ children, className }: StackCardProps) => {
  return (
    <StyledWrapper className={className}>
      <motion.div 
        className="stack"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.25 }}
      >
        <div className="card">
          {children}
        </div>
      </motion.div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .stack {
    width: 100%;
    max-width: 400px;
    transition: 0.25s ease;
    
    &:hover {
      .card:before {
        transform: translatey(-2%) rotate(-4deg);
      }
      .card:after {
        transform: translatey(2%) rotate(4deg);
      }
    }
  }

  .card {
    aspect-ratio: 3 / 2;
    border: 3px solid #1a1a1a;
    background-color: #fff;
    position: relative;
    transition: 0.15s ease;
    cursor: pointer;
    padding: 1.5rem;
    border-radius: 8px;
    
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      border: 3px solid #1a1a1a;
      background-color: #fff;
      transform-origin: center center;
      z-index: -1;
      transition: 0.15s ease;
      top: 0;
      left: 0;
      border-radius: 8px;
    }

    &:before {
      transform: translatey(-2%) rotate(-6deg);
    }

    &:after {
      transform: translatey(2%) rotate(6deg);
    }
  }
`

export default StackCard
