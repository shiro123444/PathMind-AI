import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { useState } from 'react'

// 简化的导航 - 只保留核心入口
const navLinks = [
  { path: '/', label: '首页' },
  { path: '/dashboard', label: '个人中心' },
  { path: '/graph', label: '知识图谱' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <NavWrapper
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <NavContainer>
        {/* Logo */}
        <Logo to="/">
          <LogoIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LogoIcon>
          <LogoText>
            <span className="brand">EduProfile</span>
            <span className="tagline">学生画像平台</span>
          </LogoText>
        </Logo>

        {/* Center Navigation */}
        <NavCenter>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <NavItem key={link.path}>
                <NavLink to={link.path} $isActive={isActive}>
                  <span className="label">{link.label}</span>
                  {isActive && (
                    <ActiveDot
                      layoutId="nav-dot"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </NavLink>
              </NavItem>
            )
          })}
        </NavCenter>

        {/* Right Actions */}
        <NavActions>
          <ActionLink to="/login">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>登录</span>
          </ActionLink>
          <PrimaryButton to="/dashboard">
            开始使用
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PrimaryButton>
        </NavActions>

        {/* Mobile Menu Button */}
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className={mobileMenuOpen ? 'open' : ''} />
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <MobileNavLink 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}
            <MobileDivider />
            <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
              登录 / 注册
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavWrapper>
  )
}

const NavWrapper = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 12px 20px;
`

const NavContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1a1a1a;
`

const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border-radius: 10px;
  color: white;
  
  svg {
    width: 18px;
    height: 18px;
  }
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  
  .brand {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  
  .tagline {
    font-size: 10px;
    color: #888;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 640px) {
    .tagline {
      display: none;
    }
  }
`

const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.div`
  position: relative;
`

const NavLink = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  text-decoration: none;
  color: ${props => props.$isActive ? '#1a1a1a' : '#666'};
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #1a1a1a;
  }
`

const ActiveDot = styled(motion.div)`
  width: 4px;
  height: 4px;
  background: #1a1a1a;
  border-radius: 50%;
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  text-decoration: none;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #1a1a1a;
    background: rgba(0, 0, 0, 0.04);
  }
`

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  text-decoration: none;
  color: #fff;
  background: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
`

const MobileMenuButton = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    display: block;
    width: 18px;
    height: 2px;
    background: #1a1a1a;
    border-radius: 1px;
    position: relative;
    transition: all 0.2s ease;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 2px;
      background: #1a1a1a;
      border-radius: 1px;
      left: 0;
      transition: all 0.2s ease;
    }
    
    &::before {
      top: -6px;
    }
    
    &::after {
      top: 6px;
    }
    
    &.open {
      background: transparent;
      
      &::before {
        top: 0;
        transform: rotate(45deg);
      }
      
      &::after {
        top: 0;
        transform: rotate(-45deg);
      }
    }
  }
`

const MobileMenu = styled(motion.div)`
  display: none;
  flex-direction: column;
  margin-top: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileNavLink = styled(Link)`
  padding: 12px 16px;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 8px 0;
`
