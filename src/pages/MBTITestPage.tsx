import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Progress } from '@heroui/react'
import { mbtiApi } from '../services/api'

const questions = [
  { id: 1, question: '在社交场合中，你通常：', options: [
    { text: '主动与他人交谈，享受社交', dimension: 'E' },
    { text: '等待他人来找你交谈', dimension: 'I' },
  ]},
  { id: 2, question: '当你需要做决定时，你更倾向于：', options: [
    { text: '依靠逻辑和客观分析', dimension: 'T' },
    { text: '考虑他人感受和价值观', dimension: 'F' },
  ]},
  { id: 3, question: '在处理信息时，你更关注：', options: [
    { text: '具体的事实和细节', dimension: 'S' },
    { text: '整体的模式和可能性', dimension: 'N' },
  ]},
  { id: 4, question: '你更喜欢的生活方式是：', options: [
    { text: '有计划、有组织的', dimension: 'J' },
    { text: '灵活、随性的', dimension: 'P' },
  ]},
  { id: 5, question: '在团队项目中，你通常：', options: [
    { text: '喜欢领导和协调团队', dimension: 'E' },
    { text: '更喜欢独立完成自己的部分', dimension: 'I' },
  ]},
  { id: 6, question: '面对冲突时，你倾向于：', options: [
    { text: '直接面对，寻求解决方案', dimension: 'T' },
    { text: '先考虑如何维护关系', dimension: 'F' },
  ]},
  { id: 7, question: '学习新事物时，你更喜欢：', options: [
    { text: '按部就班，从基础开始', dimension: 'S' },
    { text: '直接跳到感兴趣的部分', dimension: 'N' },
  ]},
  { id: 8, question: '对于截止日期，你通常：', options: [
    { text: '提前完成任务', dimension: 'J' },
    { text: '在最后时刻完成', dimension: 'P' },
  ]},
  { id: 9, question: '周末休息时，你更倾向于：', options: [
    { text: '和朋友出去聚会、社交', dimension: 'E' },
    { text: '独处或只和亲密的人在一起', dimension: 'I' },
  ]},
  { id: 10, question: '在学习或工作中，你更重视：', options: [
    { text: '掌握实用的技能和方法', dimension: 'S' },
    { text: '理解背后的原理和理论', dimension: 'N' },
  ]},
  { id: 11, question: '当朋友向你倾诉烦恼时，你通常：', options: [
    { text: '帮他分析问题，提供解决方案', dimension: 'T' },
    { text: '表示理解和支持，倾听他的感受', dimension: 'F' },
  ]},
  { id: 12, question: '对于旅行，你更喜欢：', options: [
    { text: '提前详细规划行程', dimension: 'J' },
    { text: '到了再说，随机应变', dimension: 'P' },
  ]},
]

export default function MBTITestPage() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  const handleAnswer = (dimension: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: dimension }))
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300)
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
    const formattedAnswers = Object.entries(answers).map(([questionId, dimension]) => ({
      questionId: parseInt(questionId) + 1,
      answer: questions[parseInt(questionId)].options[0].dimension === dimension ? 'A' : 'B' as 'A' | 'B',
    }))

    try {
      const result = await mbtiApi.submit({
        studentName: studentName || '匿名学生',
        answers: formattedAnswers,
      })

      if (result.success && result.data) {
        localStorage.setItem('studentId', result.data.studentId)
        localStorage.setItem('studentName', studentName || '匿名学生')
        localStorage.setItem('mbtiCode', result.data.mbtiCode)
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
        localStorage.setItem('mbtiCode', mbtiType)
        localStorage.setItem('studentName', studentName || '匿名学生')
        navigate(`/results?type=${mbtiType}`)
      }
    } catch {
      localStorage.setItem('mbtiCode', mbtiType)
      localStorage.setItem('studentName', studentName || '匿名学生')
      navigate(`/results?type=${mbtiType}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 姓名输入界面
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {/* 装饰 */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">🧠</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 text-center mb-2">
              MBTI 性格测试
            </h1>
            <p className="text-gray-600 text-center mb-8">
              了解你的性格类型，获取个性化的 AI 学习建议
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  你的名字（可选）
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="请输入你的名字"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <Button
                fullWidth
                size="lg"
                className="bg-black text-white font-semibold h-14 text-base"
                onPress={() => setShowNameInput(false)}
              >
                开始测试 →
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <span>📝</span> {questions.length} 道问题
                </span>
                <span className="flex items-center gap-2">
                  <span>⏱️</span> 约 3-5 分钟
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              ← 返回首页
            </Link>
          </p>
        </motion.div>
      </div>
    )
  }

  // 测试界面
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              ← 退出
            </Link>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress
            value={progress}
            size="sm"
            radius="full"
            classNames={{
              indicator: 'bg-gradient-to-r from-purple-500 to-pink-500',
              track: 'bg-gray-200',
            }}
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === option.dimension
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.dimension)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full p-5 rounded-2xl text-left transition-all duration-200
                      flex items-center gap-4
                      ${isSelected 
                        ? 'bg-black text-white shadow-lg' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'border-white bg-white' : 'border-gray-300'}
                    `}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-black" />}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="light"
            isDisabled={currentQuestion === 0}
            onPress={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            className="font-medium"
          >
            ← 上一题
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              isLoading={isSubmitting}
              isDisabled={Object.keys(answers).length < questions.length}
              onPress={handleSubmit}
              className="bg-black text-white font-semibold px-8"
            >
              提交测试 →
            </Button>
          ) : (
            <Button
              variant="light"
              isDisabled={answers[currentQuestion] === undefined}
              onPress={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
              className="font-medium"
            >
              下一题 →
            </Button>
          )}
        </div>

        {/* Question Dots */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {questions.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`跳转到问题 ${index + 1}`}
              onClick={() => setCurrentQuestion(index)}
              className={`
                h-2 rounded-full transition-all duration-200
                ${index === currentQuestion
                  ? 'w-6 bg-black'
                  : answers[index] !== undefined
                    ? 'w-2 bg-purple-400'
                    : 'w-2 bg-gray-300'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
