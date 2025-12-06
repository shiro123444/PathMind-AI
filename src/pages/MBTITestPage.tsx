import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { mbtiApi } from '../services/api'

// Sample MBTI questions
const questions = [
  {
    id: 1,
    question: '在社交场合中，你通常：',
    options: [
      { text: '主动与他人交谈，享受社交', dimension: 'E' },
      { text: '等待他人来找你交谈', dimension: 'I' },
    ],
  },
  {
    id: 2,
    question: '当你需要做决定时，你更倾向于：',
    options: [
      { text: '依靠逻辑和客观分析', dimension: 'T' },
      { text: '考虑他人感受和价值观', dimension: 'F' },
    ],
  },
  {
    id: 3,
    question: '在处理信息时，你更关注：',
    options: [
      { text: '具体的事实和细节', dimension: 'S' },
      { text: '整体的模式和可能性', dimension: 'N' },
    ],
  },
  {
    id: 4,
    question: '你更喜欢的生活方式是：',
    options: [
      { text: '有计划、有组织的', dimension: 'J' },
      { text: '灵活、随性的', dimension: 'P' },
    ],
  },
  {
    id: 5,
    question: '在团队项目中，你通常：',
    options: [
      { text: '喜欢领导和协调团队', dimension: 'E' },
      { text: '更喜欢独立完成自己的部分', dimension: 'I' },
    ],
  },
  {
    id: 6,
    question: '面对冲突时，你倾向于：',
    options: [
      { text: '直接面对，寻求解决方案', dimension: 'T' },
      { text: '先考虑如何维护关系', dimension: 'F' },
    ],
  },
  {
    id: 7,
    question: '学习新事物时，你更喜欢：',
    options: [
      { text: '按部就班，从基础开始', dimension: 'S' },
      { text: '直接跳到感兴趣的部分', dimension: 'N' },
    ],
  },
  {
    id: 8,
    question: '对于截止日期，你通常：',
    options: [
      { text: '提前完成任务', dimension: 'J' },
      { text: '在最后时刻完成', dimension: 'P' },
    ],
  },
  {
    id: 9,
    question: '周末休息时，你更倾向于：',
    options: [
      { text: '和朋友出去聚会、社交', dimension: 'E' },
      { text: '独处或只和亲密的人在一起', dimension: 'I' },
    ],
  },
  {
    id: 10,
    question: '在学习或工作中，你更重视：',
    options: [
      { text: '掌握实用的技能和方法', dimension: 'S' },
      { text: '理解背后的原理和理论', dimension: 'N' },
    ],
  },
  {
    id: 11,
    question: '当朋友向你倾诉烦恼时，你通常：',
    options: [
      { text: '帮他分析问题，提供解决方案', dimension: 'T' },
      { text: '表示理解和支持，倾听他的感受', dimension: 'F' },
    ],
  },
  {
    id: 12,
    question: '对于旅行，你更喜欢：',
    options: [
      { text: '提前详细规划行程', dimension: 'J' },
      { text: '到了再说，随机应变', dimension: 'P' },
    ],
  },
]

export default function MBTITestPage() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (dimension: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: dimension }))

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 300)
    }
  }

  const calculateMBTI = () => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    Object.values(answers).forEach((dim) => {
      counts[dim as keyof typeof counts]++
    })

    return [
      counts.E >= counts.I ? 'E' : 'I',
      counts.S >= counts.N ? 'S' : 'N',
      counts.T >= counts.F ? 'T' : 'F',
      counts.J >= counts.P ? 'J' : 'P',
    ].join('')
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('请回答所有问题')
      return
    }

    setIsSubmitting(true)
    
    const mbtiType = calculateMBTI()
    
    // 构建答案数组
    const formattedAnswers = Object.entries(answers).map(([questionId, dimension]) => ({
      questionId: parseInt(questionId) + 1,
      answer: questions[parseInt(questionId)].options[0].dimension === dimension ? 'A' : 'B' as 'A' | 'B',
    }))
    
    try {
      // 调用后端 API 保存测试结果
      const result = await mbtiApi.submit({
        studentName: studentName || '匿名学生',
        answers: formattedAnswers,
      })
      
      if (result.success && result.data) {
        // 保存学生信息到 localStorage
        localStorage.setItem('studentId', result.data.studentId)
        localStorage.setItem('studentName', studentName || '匿名学生')
        localStorage.setItem('mbtiCode', result.data.mbtiCode)
        
        // 跳转到结果页面，传递维度数据
        const dimensionParams = new URLSearchParams({
          type: result.data.mbtiCode,
          E: result.data.dimensions.E.toString(),
          I: result.data.dimensions.I.toString(),
          S: result.data.dimensions.S.toString(),
          N: result.data.dimensions.N.toString(),
          T: result.data.dimensions.T.toString(),
          F: result.data.dimensions.F.toString(),
          J: result.data.dimensions.J.toString(),
          P: result.data.dimensions.P.toString(),
        })
        navigate(`/results?${dimensionParams.toString()}`)
      } else {
        // API 失败，使用本地计算的结果
        console.warn('API 调用失败，使用本地结果:', result.error)
        localStorage.setItem('mbtiCode', mbtiType)
        localStorage.setItem('studentName', studentName || '匿名学生')
        navigate(`/results?type=${mbtiType}`)
      }
    } catch (error) {
      console.error('提交测试失败:', error)
      // 后备方案：使用本地计算的结果
      localStorage.setItem('mbtiCode', mbtiType)
      localStorage.setItem('studentName', studentName || '匿名学生')
      navigate(`/results?type=${mbtiType}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const question = questions[currentQuestion]

  // 姓名输入界面
  if (showNameInput) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 md:px-8 py-8 flex flex-col justify-center flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 md:p-10 shadow-lg text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            🎯 MBTI 性格测试
          </h2>
          <p className="text-gray-600 mb-8">
            了解你的性格类型，获取个性化的 AI 学习建议
          </p>
          
          <div className="mb-6">
            <label className="block text-left text-gray-700 font-medium mb-2">
              你的名字
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="请输入你的名字（可选）"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNameInput(false)}
            className="w-full px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            开始测试 →
          </motion.button>
          
          <p className="text-xs text-gray-500 mt-4">
            测试包含 {questions.length} 道问题，大约需要 3-5 分钟
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col justify-center flex-1">
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>问题 {currentQuestion + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-black rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-3xl p-6 md:p-10 shadow-lg"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
            {question.question}
          </h2>

          <div className="flex flex-col gap-4">
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === option.dimension
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.dimension)}
                  className={`w-full p-4 md:p-5 rounded-2xl text-left transition-all duration-200 flex items-center gap-4
                    ${isSelected 
                      ? 'bg-black text-white' 
                      : 'bg-white/60 text-gray-700 border border-gray-200 hover:bg-white/80'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                    ${isSelected ? 'border-white bg-white' : 'border-gray-300'}`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-black" />}
                  </div>
                  <span className="font-medium text-base md:text-lg">{option.text}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-full font-medium transition-colors duration-200
            ${currentQuestion === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900'}`}
        >
          ← 上一题
        </button>

        {currentQuestion === questions.length - 1 ? (
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length < questions.length}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            className={`px-8 py-3 rounded-full font-medium text-white flex items-center gap-2 transition-colors duration-200
              ${isSubmitting || Object.keys(answers).length < questions.length
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                分析中...
              </>
            ) : (
              '提交测试 →'
            )}
          </motion.button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={answers[currentQuestion] === undefined}
            className={`px-6 py-3 rounded-full font-medium transition-colors duration-200
              ${answers[currentQuestion] === undefined 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            下一题 →
          </button>
        )}
      </motion.div>

      {/* Question Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`h-2 rounded-full transition-all duration-200
              ${index === currentQuestion 
                ? 'w-6 bg-black' 
                : answers[index] !== undefined 
                  ? 'w-2 bg-gray-400' 
                  : 'w-2 bg-gray-200'
              }`}
          />
        ))}
      </div>
    </div>
  )
}
