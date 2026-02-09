/**
 * 管理后台布局组件
 * 
 * 侧边导航 + 主内容区
 * 使用统一的玻璃态设计
 */

import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BreathingOrb } from '../animations'
import { neutral, primary } from '../../theme/colors'
import { useTheme } from '../../theme/ThemeContext'

// 导航项配置
const navItems = [
  { 
    path: '/admin', 
    label: '概览', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    exact: true,
  },
  { 
    path: '/admin/questions', 
    label: '题目管理', 
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  { 
    path: '/admin/students', 
    label: '学生数据', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
]

// 导航项组件
function NavItem({ 
  item, 
  isActive, 
  isCollapsed 
}: { 
  item: typeof navItems[0]
  isActive: boolean
  isCollapsed: boolean 
}) {
  return (
    <Link
      to={item.path}
      className={`
        relative flex items-center rounded-xl transition-all duration-300 group
        ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3 gap-3'}
        ${isActive 
          ? 'text-white shadow-lg' 
          : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
        }
      `}
      style={isActive ? {
        background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
      } : {}}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="adminActiveIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
          style={{ background: 'rgba(255,255,255,0.5)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      <svg 
        className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${!isActive ? 'group-hover:scale-110' : ''}`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
      </svg>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium tracking-wide whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {isCollapsed && (
        <div 
          className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          style={{ 
            background: neutral[800], 
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {item.label}
          <div 
            className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45"
            style={{ background: neutral[800] }}
          />
        </div>
      )}
    </Link>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 关闭移动端菜单当路由变化
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="min-h-screen w-full relative flex" style={{ background: isDark ? '#0c0c0c' : `linear-gradient(135deg, ${neutral[50]} 0%, #F8FAFC 50%, rgba(241,245,249,0.5) 100%)` }}>
      {/* 背景呼吸光晕 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BreathingOrb 
          color={isDark ? 'rgba(30,30,30,0.4)' : 'rgba(226,232,240,0.4)'}
          size={800}
          position={{ top: '-20%', right: '-15%' }}
          phaseOffset={0}
        />
        <BreathingOrb 
          color={isDark ? 'rgba(20,20,20,0.35)' : 'rgba(241,245,249,0.35)'}
          size={600}
          position={{ bottom: '-15%', left: '10%' }}
          phaseOffset={0.33}
        />
      </div>

      {/* 侧边栏 - 桌面端 */}
      <motion.aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40"
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={isDark ? {
          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        } : {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Logo */}
        <div 
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}
        >
          <Link to="/admin" className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  管理后台
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* 导航项 */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem 
              key={item.path} 
              item={item} 
              isActive={isActive(item)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* 底部：返回前台 + 折叠按钮 */}
        <div className="p-3 space-y-2 border-t border-border-primary">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  返回前台
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ rotate: isCollapsed ? 180 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </motion.svg>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  收起
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* 移动端顶部栏 */}
      <div 
        className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 border-b border-border-primary"
        style={isDark ? {
          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.85) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        } : {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <Link to="/admin" className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>管理后台</span>
        </Link>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-text-secondary"
        >
          <motion.div className="flex flex-col gap-1.5">
            <motion.span 
              className="w-6 h-0.5 rounded-full bg-text-secondary"
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
            />
            <motion.span 
              className="w-6 h-0.5 rounded-full bg-text-secondary"
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="w-6 h-0.5 rounded-full bg-text-secondary"
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
            />
          </motion.div>
        </button>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-30 pt-16"
            style={{
              background: isDark ? 'rgba(12,12,12,0.98)' : `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, ${neutral[50]}F2 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item) ? '' : 'text-text-secondary'}`}
                  style={isActive(item) ? {
                    background: `linear-gradient(135deg, ${primary[100]} 0%, ${primary[50]} 100%)`,
                    color: primary[800],
                  } : {}}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border-primary">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-text-secondary"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">返回前台</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <main
        className="flex-1 min-h-screen pt-16 md:pt-0 relative z-10 transition-all duration-300 overflow-y-auto"
        style={{ marginLeft: isCollapsed ? 72 : 240 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1],
              filter: { duration: 0.4 }
            }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
