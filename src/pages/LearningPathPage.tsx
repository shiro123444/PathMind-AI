import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Course } from '../types/student'

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
    id: 'ml-engineer-path', name: 'AI 算法工程师路径', description: '成为能够开发和优化机器学习模型的工程师', estimatedDuration: '6-8个月', icon: '⚙️', color: 'from-purple-500 to-indigo-600',
    courses: [
      { courseId: 'python-basics', order: 1, isOptional: false, estimatedWeeks: 4 },
      { courseId: 'math-linear-algebra', order: 2, isOptional: false, estimatedWeeks: 5 },
      { courseId: 'ml-fundamentals', order: 3, isOptional: false, estimatedWeeks: 8 },
      { courseId: 'dl-deeplearning', order: 4, isOptional: false, estimatedWeeks: 12 },
      { courseId: 'pytorch-advanced', order: 5, isOptional: true, estimatedWeeks: 10 },
    ],
  },
  {
    id: 'nlp-specialist-path', name: 'NLP 工程师路径', description: '专注于自然语言处理领域的专家', estimatedDuration: '7-9个月', icon: '💬', color: 'from-pink-500 to-rose-600',
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

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            个性化学习路径
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            根据你的职业目标，定制化的学习计划帮助你高效成长
          </p>
        </motion.div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {learningPaths.map((path, index) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPathId(path.id)}
              className={`
                text-left p-6 rounded-2xl transition-all duration-300
                ${selectedPathId === path.id
                  ? `bg-gradient-to-br ${path.color} text-white shadow-xl scale-[1.02]`
                  : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{path.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${selectedPathId === path.id ? 'text-white' : 'text-gray-900'}`}>
                    {path.name}
                  </h3>
                  <p className={`text-sm mb-2 ${selectedPathId === path.id ? 'text-white/80' : 'text-gray-600'}`}>
                    {path.description}
                  </p>
                  <span className={`text-xs font-medium ${selectedPathId === path.id ? 'text-white/70' : 'text-gray-500'}`}>
                    预计 {path.estimatedDuration}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">学习进度</h3>
              <p className="text-gray-600">
                已完成 {completedHours} / {totalHours} 小时
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-4xl font-black text-gray-900">{progress}%</p>
                <p className="text-sm text-gray-500">完成度</p>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 3.52} 352`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course List */}
        <div className="space-y-4">
          {pathCourses.map((course, index) => {
            const isCompleted = completedCourses.includes(course.id)
            const pathCourse = selectedPath.courses.find((pc) => pc.courseId === course.id)!

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`
                  bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300
                  ${isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:shadow-lg hover:border-gray-200'}
                `}
              >
                <div className="flex items-start gap-6">
                  {/* Order Number */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }
                  `}>
                    {isCompleted ? '✓' : pathCourse.order}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        ⏱️ {course.duration}
                      </span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        📚 {course.provider}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                      </div>
                      {pathCourse.isOptional && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
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
                        className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        开始学习
                      </button>
                    ) : (
                      <span className="px-5 py-2.5 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">
                        已完成 ✓
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completion Card */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center"
          >
            <span className="text-5xl mb-4 block">🎉</span>
            <h3 className="text-2xl font-bold mb-4">恭喜完成学习路径！</h3>
            <p className="mb-6 text-white/80">你已经掌握了成为 AI 工程师所需的核心技能</p>
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              申请认证证书
            </button>
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
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-center"
          >
            💬 咨询 AI 助手
          </Link>
          <Link
            to="/careers"
            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold hover:border-gray-300 hover:shadow-lg transition-all text-center"
          >
            🎯 查看职业推荐
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
