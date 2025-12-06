import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Course } from '../types/student'

// 课程数据库
const courses: Course[] = [
  {
    id: 'python-basics',
    name: 'Python 编程基础',
    description: '学习 Python 基础语法、数据结构和面向对象编程',
    provider: 'Coursera',
    duration: '40小时',
    difficulty: 'beginner',
    skills: ['python-1'],
    prerequisites: [],
    rating: 4.8,
    tags: ['编程', '初级'],
    type: 'video',
  },
  {
    id: 'math-linear-algebra',
    name: '线性代数',
    description: '深入学习线性代数，为机器学习奠定数学基础',
    provider: '3Blue1Brown',
    duration: '50小时',
    difficulty: 'intermediate',
    skills: ['math-1'],
    prerequisites: [],
    rating: 4.9,
    tags: ['数学', '中级'],
    type: 'video',
  },
  {
    id: 'ml-fundamentals',
    name: '机器学习基础',
    description: '系统学习机器学习核心概念、算法和应用',
    provider: 'Stanford',
    duration: '80小时',
    difficulty: 'intermediate',
    skills: ['ml-1'],
    prerequisites: ['python-basics', 'math-linear-algebra'],
    rating: 4.7,
    tags: ['机器学习', '中级'],
    type: 'video',
  },
  {
    id: 'dl-deeplearning',
    name: '深度学习专项',
    description: '掌握神经网络、CNN、RNN 等深度学习技术',
    provider: 'Andrew Ng',
    duration: '120小时',
    difficulty: 'advanced',
    skills: ['dl-1'],
    prerequisites: ['ml-fundamentals'],
    rating: 4.8,
    tags: ['深度学习', '高级'],
    type: 'video',
  },
  {
    id: 'nlp-intro',
    name: 'NLP 自然语言处理入门',
    description: '学习文本处理、词向量和 NLP 基础模型',
    provider: 'fast.ai',
    duration: '60小时',
    difficulty: 'intermediate',
    skills: ['nlp-1'],
    prerequisites: ['ml-fundamentals'],
    rating: 4.6,
    tags: ['NLP', '中级'],
    type: 'video',
  },
  {
    id: 'cv-basics',
    name: '计算机视觉基础',
    description: '图像处理、特征提取和视觉识别基础',
    provider: 'OpenCV',
    duration: '70小时',
    difficulty: 'intermediate',
    skills: ['cv-1'],
    prerequisites: ['ml-fundamentals', 'math-linear-algebra'],
    rating: 4.7,
    tags: ['计算机视觉', '中级'],
    type: 'interactive',
  },
  {
    id: 'pytorch-advanced',
    name: 'PyTorch 深度框架进阶',
    description: '掌握 PyTorch，构建生产级别的深度学习应用',
    provider: 'PyTorch Official',
    duration: '100小时',
    difficulty: 'advanced',
    skills: ['dl-1', 'python-1'],
    prerequisites: ['dl-deeplearning'],
    rating: 4.8,
    tags: ['框架', '高级'],
    type: 'interactive',
  },
  {
    id: 'ml-systems',
    name: '机器学习系统设计',
    description: '学习如何设计、构建和部署大规模机器学习系统',
    provider: 'MLOps.community',
    duration: '90小时',
    difficulty: 'advanced',
    skills: ['ml-1', 'data-1'],
    prerequisites: ['ml-fundamentals'],
    rating: 4.7,
    tags: ['系统设计', '高级'],
    type: 'project',
  },
]

// 学习路径定义
const learningPaths = [
  {
    id: 'ml-engineer-path',
    name: 'AI 算法工程师路径',
    description: '成为能够开发和优化机器学习模型的工程师',
    estimatedDuration: '6-8个月',
    courses: [
      { courseId: 'python-basics', order: 1, isOptional: false, estimatedWeeks: 4 },
      { courseId: 'math-linear-algebra', order: 2, isOptional: false, estimatedWeeks: 5 },
      { courseId: 'ml-fundamentals', order: 3, isOptional: false, estimatedWeeks: 8 },
      { courseId: 'dl-deeplearning', order: 4, isOptional: false, estimatedWeeks: 12 },
      { courseId: 'pytorch-advanced', order: 5, isOptional: true, estimatedWeeks: 10 },
      { courseId: 'ml-systems', order: 6, isOptional: true, estimatedWeeks: 9 },
    ],
  },
  {
    id: 'nlp-specialist-path',
    name: 'NLP 工程师路径',
    description: '专注于自然语言处理领域的专家',
    estimatedDuration: '7-9个月',
    courses: [
      { courseId: 'python-basics', order: 1, isOptional: false, estimatedWeeks: 4 },
      { courseId: 'math-linear-algebra', order: 2, isOptional: false, estimatedWeeks: 5 },
      { courseId: 'ml-fundamentals', order: 3, isOptional: false, estimatedWeeks: 8 },
      { courseId: 'dl-deeplearning', order: 4, isOptional: false, estimatedWeeks: 12 },
      { courseId: 'nlp-intro', order: 5, isOptional: false, estimatedWeeks: 6 },
      { courseId: 'pytorch-advanced', order: 6, isOptional: true, estimatedWeeks: 10 },
    ],
  },
]

export default function LearningPathPage() {
  const [selectedPathId, setSelectedPathId] = useState(learningPaths[0].id)
  const [completedCourses, setCompletedCourses] = useState<string[]>([])

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
    <div className="w-full">
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          个性化学习路径
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          根据你的职业目标，定制化的学习计划帮助你高效成长
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 路径选择 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-3xl p-6 sticky top-32">
            <h2 className="text-lg font-bold text-gray-900 mb-4">学习路径</h2>
            <div className="space-y-3">
              {learningPaths.map((path) => (
                <motion.button
                  key={path.id}
                  onClick={() => setSelectedPathId(path.id)}
                  whileHover={{ x: 5 }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                    selectedPathId === path.id
                      ? 'bg-black text-white'
                      : 'bg-white/50 hover:bg-white/80 text-gray-900'
                  }`}
                >
                  <p className="font-semibold text-sm">{path.name}</p>
                  <p className="text-xs opacity-70">{path.estimatedDuration}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 学习路径详情 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* 进度卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">学习进度</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">总进度</p>
                  <p className="text-3xl font-bold text-gray-900">{progress}%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-2">学习时长</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedHours} / {totalHours}h
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-black to-gray-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>

          {/* 课程列表 */}
          <div className="space-y-4">
            {pathCourses.map((course, index) => {
              const isCompleted = completedCourses.includes(course.id)
              const pathCourse = selectedPath.courses.find((pc) => pc.courseId === course.id)!

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-3xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-6">
                    {/* 课程顺序 */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          isCompleted
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isCompleted ? '✓' : pathCourse.order}
                      </div>
                    </div>

                    {/* 课程信息 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {course.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
                        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {course.duration}
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {course.provider}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {course.rating}
                          </span>
                        </div>
                      </div>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-black/5 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {!isCompleted ? (
                        <>
                          <button
                            onClick={() => setCompletedCourses([...completedCourses, course.id])}
                            className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
                          >
                            开始学习
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
                            预览
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-xl whitespace-nowrap text-center">
                          已完成 ✓
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 完成路径按钮 */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-8 bg-gradient-to-r from-black to-gray-800 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">🎉 恭喜完成学习路径！</h3>
              <p className="mb-6">你已经掌握了成为 AI 工程师所需的核心技能</p>
              <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors">
                申请认证证书
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
