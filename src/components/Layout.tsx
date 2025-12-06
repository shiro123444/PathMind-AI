import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import GridBackground from './GridBackground'

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 relative flex flex-col">
      {/* WebGL Grid Background */}
      <GridBackground />

      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="relative flex-1 pt-20 pb-8 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
