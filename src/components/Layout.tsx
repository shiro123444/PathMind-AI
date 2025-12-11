import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import EnhancedBackground from './EnhancedBackground'

// 简洁的页面过渡
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 relative flex flex-col">
      {/* Enhanced WebGL Background with Particles */}
      <EnhancedBackground 
        enableParticles={true}
        enableParallax={true}
        enableGrid={true}
        enableOrbs={true}
      />

      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="relative flex-1 pt-20 pb-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
