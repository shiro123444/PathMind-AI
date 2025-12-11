import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { MBTICode, AICareer } from '../types/student'

const aiCareers: AICareer[] = [
  {
    id: 'ai-researcher', name: 'AI 研究员', description: '探索前沿算法和深度学习模型，推动人工智能理论发展',
    icon: '🔬', category: 'research',
    requiredSkills: [
      { id: 'math-1', name: '高等数学', category: 'math', level: 'advanced', prerequisites: [] },
      { id: 'ml-1', name: '机器学习', category: 'ml', level: 'advanced', prerequisites: ['math-1'] },
      { id: 'dl-1', name: '深度学习', category: 'ml', level: 'advanced', prerequisites: ['ml-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP'], salaryRange: '¥30k-80k/月', demandLevel: 'high', growthPotential: 9,
  },
  {
    id: 'ml-engineer', name: 'AI 算法工程师', description: '设计和优化机器学习模型，解决实际业务问题',
    icon: '⚙️', category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'ml-1', name: '机器学习', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP', 'ENTJ'], salaryRange: '¥25k-60k/月', demandLevel: 'high', growthPotential: 8,
  },
  {
    id: 'nlp-engineer', name: 'NLP 工程师', description: '开发自然语言处理系统，实现语音识别、机器翻译等功能',
    icon: '💬', category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'nlp-1', name: 'NLP', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP', 'ENTP'], salaryRange: '¥28k-65k/月', demandLevel: 'high', growthPotential: 9,
  },
  {
    id: 'cv-engineer', name: '计算机视觉工程师', description: '开发图像识别、物体检测等视觉系统',
    icon: '👁️', category: 'engineering',
    requiredSkills: [
      { id: 'cv-1', name: '计算机视觉', category: 'ml', level: 'advanced', prerequisites: [] },
    ],
    suitableMBTI: ['INTJ', 'INTP'], salaryRange: '¥27k-62k/月', demandLevel: 'high', growthPotential: 8,
  },
  {
    id: 'ai-pm', name: 'AI 产品经理', description: '定义 AI 产品方向，连接技术和用户需求',
    icon: '📊', category: 'product',
    requiredSkills: [
      { id: 'soft-1', name: '产品思维', category: 'soft', level: 'advanced', prerequisites: [] },
    ],
    suitableMBTI: ['ENTJ', 'ENTP', 'ENFJ'], salaryRange: '¥20k-50k/月', demandLevel: 'medium', growthPotential: 7,
  },
  {
    id: 'data-scientist', name: '数据科学家', description: '分析大数据，挖掘数据价值，构建预测模型',
    icon: '📈', category: 'engineering',
    requiredSkills: [
      { id: 'stat-1', name: '统计学', category: 'math', level: 'advanced', prerequisites: [] },
    ],
    suitableMBTI: ['INTP', 'INTJ', 'ENTJ'], salaryRange: '¥22k-55k/月', demandLevel: 'high', growthPotential: 8,
  },
]

const mbtiCareerMap: Record<MBTICode, string[]> = {
  INTJ: ['ai-researcher', 'ml-engineer', 'cv-engineer', 'data-scientist'],
  INTP: ['ai-researcher', 'ml-engineer', 'nlp-engineer', 'data-scientist'],
  ENTJ: ['ai-pm', 'ml-engineer', 'data-scientist'],
  ENTP: ['ai-pm', 'nlp-engineer'],
  INFJ: ['ai-pm'], INFP: ['ai-pm'], ENFJ: ['ai-pm'], ENFP: ['ai-pm'],
  ISTJ: ['data-scientist'], ISFJ: ['ai-pm'], ESTJ: ['ai-pm'], ESFJ: ['ai-pm'],
  ISTP: ['ml-engineer', 'cv-engineer'], ISFP: ['ai-pm'], ESTP: ['ml-engineer'], ESFP: ['ai-pm'],
}

export default function CareerPage() {
  const [searchParams] = useSearchParams()
  const mbtiType = (searchParams.get('type') || 'INTJ') as MBTICode
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const suitableCareers = useMemo(() => {
    const careerIds = mbtiCareerMap[mbtiType] || []
    return aiCareers.filter((c) => careerIds.includes(c.id))
  }, [mbtiType])

  const selectedCareerData = useMemo(
    () => aiCareers.find((c) => c.id === selectedCareer) || suitableCareers[0],
    [selectedCareer, suitableCareers]
  )

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
              {mbtiType}
            </span>
            <span className="text-gray-500">型人格推荐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            AI 职业探索
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            基于你的性格特质，我们为你推荐最适合的 AI 领域职业方向
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">适合你的职业</h2>
              <div className="space-y-3">
                {suitableCareers.map((career) => (
                  <motion.button
                    key={career.id}
                    onClick={() => setSelectedCareer(career.id)}
                    whileHover={{ x: 5 }}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                      selectedCareer === career.id || (!selectedCareer && career === suitableCareers[0])
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{career.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{career.name}</p>
                        <p className="text-xs opacity-70">{career.salaryRange}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Career Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedCareerData && (
              <>
                {/* Main Card */}
                <motion.div
                  key={selectedCareerData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
                      {selectedCareerData.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {selectedCareerData.name}
                      </h2>
                      <p className="text-gray-600 mb-4">{selectedCareerData.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          {selectedCareerData.demandLevel === 'high' ? '🔥 需求旺盛' : '需求中等'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          增长潜力 {selectedCareerData.growthPotential}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">薪资范围</p>
                      <p className="text-xl font-bold text-gray-900">{selectedCareerData.salaryRange}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">市场需求</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: selectedCareerData.demandLevel === 'high' ? '100%' : '65%' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">增长潜力</p>
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < selectedCareerData.growthPotential ? 'bg-purple-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">核心技能要求</h3>
                  <div className="space-y-4">
                    {selectedCareerData.requiredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{skill.name}</p>
                          <p className="text-sm text-gray-500">
                            {skill.level === 'advanced' ? '高级' : skill.level === 'intermediate' ? '中级' : '初级'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1)
                                  ? 'bg-purple-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/learning-path"
                    className="flex-1 px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors text-center"
                  >
                    ✨ 查看学习路径
                  </Link>
                  <Link
                    to="/ai-advisor"
                    className="flex-1 px-6 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 text-center"
                  >
                    💬 咨询 AI 助手
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
