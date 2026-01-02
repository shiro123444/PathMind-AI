/**
 * Dashboard Layout - 专业光感玻璃设计
 * 
 * 设计原则：
 * - 使用低饱和度的中性色
 * - 微妙的玻璃态效果
 * - 柔和的呼吸光晕
 * - 专业的层次感
 * - 滚动时的模糊过渡效果
 */

import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BreathingOrb } from './animations'
import { neutral, primary } from '../theme/colors'

// 导航项配置
const navItems = [
  { path: '/dashboard', label: '概览', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/results', label: '结果分析', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { path: '/careers', label: '职业推荐', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { path: '/learning-path', label: '学习路径', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
]

const bottomNavItems = [
  { path: '/ai-advisor', label: 'AI 助手', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { path: '/graph', label: '知识图谱', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { path: '/admin', label: '管理后台', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

// 响应式 margin hook
const useResponsiveMargin = (isCollapsed: boolean) => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile ? 0 : (isCollapsed ? 72 : 240)
}

// 光感玻璃导航项组件 - 使用专业的蓝灰色系
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
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
        }
      `}
      style={isActive ? {
        background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
      } : {}}
      title={isCollapsed ? item.label : undefined}
    >
      {/* 激活指示器 - 左侧竖条 */}
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="activeIndicator"
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
      
      {/* Tooltip for collapsed state */}
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

export default function DashboardLayout() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const marginLeft = useResponsiveMargin(isCollapsed)
  
  // 滚动模糊效果 - 用于主内容区
  const mainRef = useRef<HTMLDivElement>(null)

  // 关闭移动端菜单当路由变化
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen w-full relative flex" style={{ background: `linear-gradient(135deg, ${neutral[50]} 0%, #F8FAFC 50%, rgba(241,245,249,0.5) 100%)` }}>
      {/* 背景呼吸光晕 - 使用专业的低饱和度色彩 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BreathingOrb 
          color="rgba(226,232,240,0.4)"
          size={800}
          position={{ top: '-20%', right: '-15%' }}
          phaseOffset={0}
        />
        <BreathingOrb 
          color="rgba(241,245,249,0.35)"
          size={600}
          position={{ bottom: '-15%', left: '10%' }}
          phaseOffset={0.33}
        />
        <BreathingOrb 
          color="rgba(248,250,252,0.3)"
          size={500}
          position={{ top: '40%', left: '60%' }}
          phaseOffset={0.66}
        />
      </div>

      {/* 侧边栏 - 桌面端 - 光感玻璃设计 */}
      <motion.aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40"
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Logo - 使用专业的蓝灰色渐变 */}
        <div 
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <Link to="/" className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold"
                  style={{ color: primary[800] }}
                >
                  EduProfile
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
              isActive={isActive(item.path)}
              isCollapsed={isCollapsed}
            />
          ))}
          
          <div className="my-4" style={{ borderTop: `1px solid ${neutral[200]}` }} />
          
          {bottomNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              item={item} 
              isActive={isActive(item.path)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* 底部：折叠按钮 */}
        <div className="p-3" style={{ borderTop: `1px solid ${neutral[200]}` }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: neutral[500] }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = neutral[800]
              e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = neutral[500]
              e.currentTarget.style.background = 'transparent'
            }}
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

      {/* 移动端顶部栏 - 光感玻璃设计 */}
      <div 
        className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${neutral[200]}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <Link to="/" className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold" style={{ color: primary[800] }}>EduProfile</span>
        </Link>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: neutral[700] }}
        >
          <motion.div className="flex flex-col gap-1.5">
            <motion.span 
              className="w-6 h-0.5 rounded-full"
              style={{ background: neutral[700] }}
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
            />
            <motion.span 
              className="w-6 h-0.5 rounded-full"
              style={{ background: neutral[700] }}
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="w-6 h-0.5 rounded-full"
              style={{ background: neutral[700] }}
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
            />
          </motion.div>
        </button>
      </div>

      {/* 移动端菜单 - 光感玻璃设计 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-30 pt-16"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, ${neutral[50]}F2 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <nav className="p-4 space-y-2">
              {[...navItems, ...bottomNavItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200"
                  style={isActive(item.path) ? {
                    background: `linear-gradient(135deg, ${primary[100]} 0%, ${primary[50]} 100%)`,
                    color: primary[800],
                  } : {
                    color: neutral[600],
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区 - 垂直滚动 + 滚动模糊过渡 */}
      <main
        ref={mainRef}
        className="flex-1 min-h-screen pt-16 md:pt-0 relative z-10 transition-all duration-300 overflow-y-auto"
        style={{ marginLeft }}
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
