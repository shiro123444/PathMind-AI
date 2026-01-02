import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Course } from '../types/student'
import { GlassCard } from '../components/ui'
import { easings, durations } from '../theme/motion'
import { primary, neutral, secondary } from '../theme/colors'

const courses: Course[] = [
  { id: 'python-basics', name: 'Python 编程基础', description: '学习 Python 基础语法、数据结构和面向对象编程', provider: 'Coursera', duration: '40小时', difficulty: 'beginner', skills: ['python-1'], prerequisites: [], rating: 4.8, tags: ['编程', '初级'], type: 'video' },
  { id: 'math-linear-algebra', name: '线性代数', description: '深入学习线性代数，为机器学习奠定数学基础', provider: '3Blue1Brown', duration: '50小时', difficulty: 'intermediate', skills: ['math-1'], prerequisites: [], rating: 4.9, tags: ['数学', '中级'], type: 'video' },
  { id: 'ml-fundamentals', name: '机器学习基础', description: '系统学习机器学习核心概念、算法和应用', provider: 'Stanford', duration: '80小时', difficulty: 'intermediate', skills: ['ml-1'], prerequisites: ['python-basics', 'math-linear-algebra'], rating: 4.7, tags: ['机器学习', '中级'], type: 'video' },
  { id: 'dl-deeplearning', name: '深度学习专项', description: '掌握神经网络、CNN、RNN 等深度学习技术', provider: 'Andrew Ng', duration: '120小时', difficulty: 'advanced', skills: ['dl-1'], prerequisites: ['ml-fundamentals'], rating: 4.8, tags: ['深度学习', '高级'], type: 'video' },
  { id: 'nlp-intro', name: 'NLP 自然语言处理入门', description: '学习文本处理、词向量和 NLP 基础模型', provider: 'fast.ai', duration: '60小时', difficulty: 'intermediate', skills: ['nlp-1'], prerequisites: ['ml-fundamentals'], rating: 4.6, tags: ['NLP', '中级'], type: 'video' },
  { id: 'pytorch-advanced', name: 'PyTorch 深度框架进阶', description: '掌握 PyTorch，构建生产级别的深度学习应用', provider: 'PyTorch Official', duration: '100小时', difficulty: 'advanced', skills: ['dl-1', 'python-1'], prerequisites: ['dl-deeplearning'], rating: 4.8, tags: ['框架', '高级'], type: 'interactive' },
]

const learningPaths = [
  {
    id: 'ml-engineer-path', name: 'AI 算法工程师路径', description: '成为能够开发和优化机器学习模型的工程师', estimatedDuration: '6-8个月', icon: '⚙️', color: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
    courses: [
      { courseId: 'python-basics', order: 1, isOptional: false, estimatedWeeks: 4 },
      { courseId: 'math-linear-algebra', order: 2, isOptional: false, estimatedWeeks: 5 },
      { courseId: 'ml-fundamentals', order: 3, isOptional: false, estimatedWeeks: 8 },
      { courseId: 'dl-deeplearning', order: 4, isOptional: false, estimatedWeeks: 12 },
      { courseId: 'pytorch-advanced', order: 5, isOptional: true, estimatedWeeks: 10 },
    ],
  },
  {
    id: 'nlp-specialist-path', name: 'NLP 工程师路径', description: '专注于自然语言处理领域的专家', estimatedDuration: '7-9个月', icon: '💬', color: `linear-gradient(135deg, ${secondary[500]} 0%, ${secondary[700]} 100%)`,
    courses: [
      { courseId: 'python-basics', order: 1, isOptional: false, estimatedWeeks: 4 },
      { courseId: 'math-linear-algebra', order: 2, isOptional: false, estimatedWeeks: 5 },
      { courseId: 'ml-fundamentals', order: 3, isOptional: false, estimatedWeeks: 8 },
      { courseId: 'dl-deeplearning', order: 4, isOptional: false, estimatedWeeks: 12 },
      { courseId: 'nlp-intro', order: 5, isOptional: false, estimatedWeeks: 6 },
    ],
  },
]

export default function LearningPathPage() {
  const [selectedPathId, setSelectedPathId] = useState(learningPaths[0].id)
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const selectedPath = learningPaths.find((p) => p.id === selectedPathId)!
  const pathCourses = selectedPath.courses
    .sort((a, b) => a.order - b.order)
    .map((pc) => courses.find((c) => c.id === pc.courseId)!)

  const extractHours = (duration: string): number => {
    const match = duration.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  const totalHours = selectedPath.courses.reduce((sum, pc) => {
    const course = courses.find((c) => c.id === pc.courseId)
    return sum + (course ? extractHours(course.duration) : 0)
  }, 0)

  const completedHours = completedCourses.reduce((sum, cid) => {
    const course = courses.find((c) => c.id === cid)
    return sum + (course ? extractHours(course.duration) : 0)
  }, 0)

  const progress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0

  // 统一的动画配置
  const smoothTransition = { duration: durations.slow, ease: easings.smooth }

  return (
    <div 
      ref={ref} 
      className="min-h-screen py-8 px-4 md:px-8 overflow-y-auto"
      style={{ background: neutral[50] }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={smoothTransition}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: neutral[900] }}>
            个性化学习路径
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: neutral[600] }}>
            根据你的职业目标，定制化的学习计划帮助你高效成长
          </p>
        </motion.div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {learningPaths.map((path, index) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ delay: 0.1 + index * 0.1, duration: durations.slow, ease: easings.smooth }}
              onClick={() => setSelectedPathId(path.id)}
              className="text-left p-6 rounded-2xl transition-all duration-300"
              style={selectedPathId === path.id ? {
                background: path.color,
                color: 'white',
                boxShadow: '0 12px 40px rgba(71, 85, 105, 0.25)',
                transform: 'scale(1.02)',
              } : {
                background: 'white',
                border: `1px solid ${neutral[200]}`,
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{path.icon}</span>
                <div className="flex-1">
                  <h3 
                    className="font-bold text-lg mb-1"
                    style={{ color: selectedPathId === path.id ? 'white' : neutral[900] }}
                  >
                    {path.name}
                  </h3>
                  <p 
                    className="text-sm mb-2"
                    style={{ color: selectedPathId === path.id ? 'rgba(255,255,255,0.8)' : neutral[600] }}
                  >
                    {path.description}
                  </p>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: selectedPathId === path.id ? 'rgba(255,255,255,0.7)' : neutral[500] }}
                  >
                    预计 {path.estimatedDuration}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ delay: 0.3, duration: durations.slow, ease: easings.smooth }}
        >
          <GlassCard variant="standard" color="white" className="p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: neutral[900] }}>学习进度</h3>
                <p style={{ color: neutral[600] }}>
                  已完成 {completedHours} / {totalHours} 小时
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-4xl font-black" style={{ color: neutral[900] }}>{progress}%</p>
                  <p className="text-sm" style={{ color: neutral[500] }}>完成度</p>
                </div>
                <div className="w-32 h-32 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke={neutral[200]} strokeWidth="8" fill="none" />
                    <circle
                      cx="64" cy="64" r="56"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 3.52} 352`}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={primary[500]} />
                        <stop offset="100%" stopColor={primary[700]} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Course List */}
        <div className="space-y-4">
          {pathCourses.map((course, index) => {
            const isCompleted = completedCourses.includes(course.id)
            const pathCourse = selectedPath.courses.find((pc) => pc.courseId === course.id)!

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ delay: 0.4 + index * 0.08, duration: durations.normal, ease: easings.smooth }}
              >
                <GlassCard
                  variant={isCompleted ? 'light' : 'standard'}
                  color="white"
                  className="p-6 transition-all duration-300"
                  style={isCompleted ? { 
                    borderColor: secondary[200], 
                    background: `${secondary[50]}80` 
                  } : { 
                    borderColor: neutral[100] 
                  }}
                >
                  <div className="flex items-start gap-6">
                    {/* Order Number */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                      style={isCompleted ? {
                        background: secondary[500],
                        color: 'white',
                      } : {
                        background: neutral[100],
                        color: neutral[900],
                      }}
                    >
                      {isCompleted ? '✓' : pathCourse.order}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="text-lg font-bold" style={{ color: neutral[900] }}>{course.name}</h4>
                          <p className="text-sm mt-1" style={{ color: neutral[600] }}>{course.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span 
                          className="text-sm px-3 py-1 rounded-full"
                          style={{ background: neutral[100], color: neutral[700] }}
                        >
                          ⏱️ {course.duration}
                        </span>
                        <span 
                          className="text-sm px-3 py-1 rounded-full"
                          style={{ background: neutral[100], color: neutral[700] }}
                        >
                          📚 {course.provider}
                        </span>
                        <div className="flex items-center gap-1">
                          <span style={{ color: '#F59E0B' }}>★</span>
                          <span className="text-sm font-semibold" style={{ color: neutral[700] }}>{course.rating}</span>
                        </div>
                        {pathCourse.isOptional && (
                          <span 
                            className="text-sm px-3 py-1 rounded-full"
                            style={{ background: primary[100], color: primary[700] }}
                          >
                            可选
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {!isCompleted ? (
                        <button
                          onClick={() => setCompletedCourses([...completedCourses, course.id])}
                          className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                          style={{ background: primary[800] }}
                        >
                          开始学习
                        </button>
                      ) : (
                        <span 
                          className="px-5 py-2.5 text-sm font-semibold rounded-xl"
                          style={{ background: secondary[100], color: secondary[700] }}
                        >
                          已完成 ✓
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Completion Card */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8"
          >
            <GlassCard 
              variant="strong" 
              color="white" 
              className="p-8 text-white text-center"
              style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
            >
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold mb-4">恭喜完成学习路径！</h3>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>你已经掌握了成为 AI 工程师所需的核心技能</p>
              <button 
                className="px-8 py-3 bg-white rounded-full font-semibold transition-colors"
                style={{ color: primary[600] }}
              >
                申请认证证书
              </button>
            </GlassCard>
          </motion.div>
        )}

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/ai-advisor"
            className="px-8 py-4 text-white rounded-full font-semibold transition-colors text-center"
            style={{ background: primary[800] }}
          >
            💬 咨询 AI 助手
          </Link>
          <Link
            to="/careers"
            className="px-8 py-4 bg-white rounded-full font-semibold transition-all text-center"
            style={{ border: `2px solid ${neutral[200]}`, color: neutral[900] }}
          >
            🎯 查看职业推荐
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
