import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { springs } from '../theme/motion'
import { Home, User, Network, Brain, Target, BookOpen, Bot } from 'lucide-react'
import { ThemeToggle } from '../theme/ThemeContext'

// 导航链接配置
const navLinks = [
  { path: '/', label: '首页', icon: Home },
  { path: '/dashboard', label: '个人中心', icon: User },
  { path: '/graph', label: '知识图谱', icon: Network },
]

// 移动端菜单项
const mobileMenuItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/dashboard', label: '个人中心', icon: User },
  { path: '/mbti-test', label: 'MBTI 测试', icon: Brain },
  { path: '/careers', label: '职业推荐', icon: Target },
  { path: '/learning-path', label: '学习路径', icon: BookOpen },
  { path: '/ai-advisor', label: 'AI 助手', icon: Bot },
  { path: '/graph', label: '知识图谱', icon: Network },
]

// Logo 组件 - 简洁设计
function Logo() {
  return (
    <motion.div 
      className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white rounded-xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white dark:text-black"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

// 磁性导航链接组件
function MagneticNavLink({ 
  path, 
  label, 
  isActive, 
  index 
}: { 
  path: string
  label: string
  isActive: boolean
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <RouterLink
        to={path}
        className={`relative px-4 py-2 text-sm font-medium transition-colors block ${
          isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {/* 悬停背景动画 */}
        <AnimatePresence>
          {isHovered && !isActive && (
            <motion.span
              className="absolute inset-0 bg-bg-hover rounded-full -z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* 激活状态指示器 */}
        {isActive && (
          <motion.span
            className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10"
            layoutId="activeNavIndicator"
            transition={{ type: 'spring', ...springs.slide }}
          />
        )}
        
        <span className={isActive ? 'text-white dark:text-black' : ''}>
          {label}
        </span>
      </RouterLink>
    </motion.div>
  )
}


// 汉堡菜单按钮动画
function HamburgerButton({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean
  onClick: () => void 
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 sm:hidden"
      whileTap={{ scale: 0.9 }}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
    >
      <motion.span
        className="w-6 h-0.5 bg-text-primary rounded-full block"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-text-primary rounded-full block"
        animate={{
          opacity: isOpen ? 0 : 1,
          x: isOpen ? 20 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-text-primary rounded-full block"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 关闭菜单当路由变化
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-card backdrop-blur-xl shadow-lg' 
            : 'bg-bg-card backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* 左侧：Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Logo />
              <div className="flex flex-col">
                <motion.span 
                  className="font-bold text-base leading-tight text-text-primary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  PathMind
                </motion.span>
                <motion.span 
                  className="text-[10px] text-text-muted font-medium hidden sm:block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  智能学习路径
                </motion.span>
              </div>
            </motion.div>

            {/* 中间：导航链接 - 带胶囊滑动效果 */}
            <div className="hidden sm:flex items-center gap-1 bg-bg-hover rounded-full p-1">
              {navLinks.map((link, index) => (
                <MagneticNavLink
                  key={link.path}
                  path={link.path}
                  label={link.label}
                  isActive={isActive(link.path)}
                  index={index}
                />
              ))}
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RouterLink
                  to="/login"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  登录
                </RouterLink>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  size="sm"
                  className="font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-5"
                  endContent={
                    <motion.svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  }
                >
                  开始使用
                </Button>
              </motion.div>

              {/* 移动端菜单按钮 */}
              <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg-secondary pt-20"
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 40px) 32px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 py-8">
              {mobileMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <RouterLink
                    to={item.path}
                    className={`flex items-center gap-4 py-4 text-xl font-medium border-b border-border-primary ${
                      isActive(item.path) ? 'text-text-primary' : 'text-text-secondary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-text-primary rounded-full"
                        layoutId="mobileActiveIndicator"
                      />
                    )}
                  </RouterLink>
                </motion.div>
              ))}
              
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  as={RouterLink}
                  to="/login"
                  fullWidth
                  size="lg"
                  variant="bordered"
                  className="font-semibold border-2 border-text-primary rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录 / 注册
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
