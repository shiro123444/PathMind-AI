/**
 * MBTI 测试选择器 - Claude 风格左右分栏布局
 * 
 * 左侧：测试类型卡片列表
 * 右侧：Lottie 动画 + 引导文案
 */

import { motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Link } from 'react-router-dom'
import { testCategories, difficultyLabels, difficultyColors } from '../../data/testCategories'
import type { TestCategory, TestProgress } from '../../types/mbti'
import { primary, neutral } from '../../theme/colors'

interface TestSelectorProps {
  onSelectTest: (categoryId: string) => void
  savedProgress?: TestProgress | null
}

// 测试卡片组件
function TestCard({ 
  category, 
  index, 
  onSelect,
  hasProgress,
}: { 
  category: TestCategory
  index: number
  onSelect: () => void
  hasProgress?: boolean
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onSelect}
      className="w-full text-left group"
    >
      <div 
        className="relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          borderColor: neutral[200],
        }}
      >
        {/* 进度标记 */}
        {hasProgress && (
          <div 
            className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ background: primary[600] }}
          >
            继续
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* 图标 */}
          <motion.span 
            className="text-3xl"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {category.icon}
          </motion.span>

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 
              className="text-lg font-bold mb-1"
              style={{ color: neutral[900] }}
            >
              {category.name}
            </h3>

            {/* 描述 */}
            <p 
              className="text-sm mb-3 line-clamp-2"
              style={{ color: neutral[600] }}
            >
              {category.description}
            </p>

            {/* 元信息 */}
            <div className="flex items-center gap-4 text-xs">
              <span 
                className="flex items-center gap-1"
                style={{ color: neutral[500] }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {category.questionCount} 题
              </span>
              <span 
                className="flex items-center gap-1"
                style={{ color: neutral[500] }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                约 {category.estimatedMinutes} 分钟
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  background: `${difficultyColors[category.difficulty]}20`,
                  color: difficultyColors[category.difficulty],
                }}
              >
                {difficultyLabels[category.difficulty]}
              </span>
            </div>
          </div>

          {/* 箭头 */}
          <motion.div 
            className="flex-shrink-0 mt-1"
            style={{ color: neutral[400] }}
            whileHover={{ x: 4 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.button>
  )
}

export default function TestSelector({ onSelectTest, savedProgress }: TestSelectorProps) {
  return (
    <div className="min-h-screen flex items-center py-12 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 左侧：测试选择 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 返回链接 */}
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 mb-8 transition-colors"
              style={{ color: neutral[500] }}
              onMouseEnter={(e) => e.currentTarget.style.color = neutral[800]}
              onMouseLeave={(e) => e.currentTarget.style.color = neutral[500]}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              返回概览
            </Link>

            {/* 标题 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl md:text-4xl font-black mb-3"
              style={{ color: neutral[900] }}
            >
              选择测试类型
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base mb-8"
              style={{ color: neutral[600] }}
            >
              发现最适合你的 AI 学习路径
            </motion.p>

            {/* 测试卡片列表 */}
            <div className="space-y-4">
              {testCategories.map((category, index) => (
                <TestCard
                  key={category.id}
                  category={category}
                  index={index}
                  onSelect={() => onSelectTest(category.id)}
                  hasProgress={savedProgress?.testCategoryId === category.id}
                />
              ))}
            </div>

            {/* 已有进度提示 */}
            {savedProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 rounded-xl"
                style={{ 
                  background: `${primary[50]}`,
                  border: `1px solid ${primary[200]}`,
                }}
              >
                <p className="text-sm" style={{ color: primary[700] }}>
                  💡 你有一个未完成的测试，点击对应卡片可以继续
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* 右侧：Lottie 动画区域 */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Lottie 容器 */}
            <div 
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: '1/1',
                background: `linear-gradient(135deg, ${neutral[50]}80 0%, white 50%, ${primary[50]}40 100%)`,
                boxShadow: `0 25px 80px -20px ${primary[900]}15, 0 10px 40px -15px ${primary[800]}10`,
              }}
            >
              <DotLottieReact
                src="/animations/ball-playing.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />

              {/* 浮动装饰 */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: primary[700],
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                🧠 了解自己
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-6 left-6 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: primary[700],
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                🎯 发现方向
              </motion.div>
            </div>

            {/* 引导文案 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 text-lg font-medium"
              style={{ color: neutral[600] }}
            >
              "了解自己是成长的第一步"
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
