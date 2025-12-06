import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { MBTICode, AICareer } from '../types/student'

// AI 职业数据库
const aiCareers: AICareer[] = [
  {
    id: 'ai-researcher',
    name: 'AI 研究员',
    description: '探索前沿算法和深度学习模型，推动人工智能理论发展',
    icon: '🔬',
    category: 'research',
    requiredSkills: [
      { id: 'math-1', name: '高等数学', category: 'math', level: 'advanced', prerequisites: [] },
      { id: 'ml-1', name: '机器学习', category: 'ml', level: 'advanced', prerequisites: ['math-1'] },
      { id: 'dl-1', name: '深度学习', category: 'ml', level: 'advanced', prerequisites: ['ml-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP'],
    salaryRange: '¥30k-80k/月',
    demandLevel: 'high',
    growthPotential: 9,
  },
  {
    id: 'ml-engineer',
    name: 'AI 算法工程师',
    description: '设计和优化机器学习模型，解决实际业务问题',
    icon: '⚙️',
    category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'ml-1', name: '机器学习', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
      { id: 'data-1', name: '数据处理', category: 'data', level: 'intermediate', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP', 'ENTJ'],
    salaryRange: '¥25k-60k/月',
    demandLevel: 'high',
    growthPotential: 8,
  },
  {
    id: 'nlp-engineer',
    name: 'NLP 工程师',
    description: '开发自然语言处理系统，实现语音识别、机器翻译等功能',
    icon: '💬',
    category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'nlp-1', name: 'NLP', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
      { id: 'dl-1', name: '深度学习', category: 'ml', level: 'intermediate', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP', 'ENTP'],
    salaryRange: '¥28k-65k/月',
    demandLevel: 'high',
    growthPotential: 9,
  },
  {
    id: 'cv-engineer',
    name: '计算机视觉工程师',
    description: '开发图像识别、物体检测等视觉系统',
    icon: '👁️',
    category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'cv-1', name: '计算机视觉', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
      { id: 'dl-1', name: '深度学习', category: 'ml', level: 'advanced', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTJ', 'INTP'],
    salaryRange: '¥27k-62k/月',
    demandLevel: 'high',
    growthPotential: 8,
  },
  {
    id: 'ai-pm',
    name: 'AI 产品经理',
    description: '定义 AI 产品方向，连接技术和用户需求',
    icon: '📊',
    category: 'product',
    requiredSkills: [
      { id: 'soft-1', name: '产品思维', category: 'soft', level: 'advanced', prerequisites: [] },
      { id: 'ml-1', name: '机器学习基础', category: 'ml', level: 'intermediate', prerequisites: [] },
      { id: 'soft-2', name: '沟通能力', category: 'soft', level: 'advanced', prerequisites: [] },
    ],
    suitableMBTI: ['ENTJ', 'ENTP', 'ENFJ'],
    salaryRange: '¥20k-50k/月',
    demandLevel: 'medium',
    growthPotential: 7,
  },
  {
    id: 'data-scientist',
    name: '数据科学家',
    description: '分析大数据，挖掘数据价值，构建预测模型',
    icon: '📈',
    category: 'engineering',
    requiredSkills: [
      { id: 'python-1', name: 'Python', category: 'programming', level: 'advanced', prerequisites: [] },
      { id: 'stat-1', name: '统计学', category: 'math', level: 'advanced', prerequisites: [] },
      { id: 'data-1', name: '数据处理', category: 'data', level: 'advanced', prerequisites: ['python-1'] },
    ],
    suitableMBTI: ['INTP', 'INTJ', 'ENTJ'],
    salaryRange: '¥22k-55k/月',
    demandLevel: 'high',
    growthPotential: 8,
  },
  {
    id: 'ai-designer',
    name: 'AI 交互设计师',
    description: '设计 AI 产品的用户界面和交互体验',
    icon: '🎨',
    category: 'design',
    requiredSkills: [
      { id: 'design-1', name: 'UI/UX 设计', category: 'domain', level: 'advanced', prerequisites: [] },
      { id: 'soft-1', name: '产品思维', category: 'soft', level: 'intermediate', prerequisites: [] },
      { id: 'soft-2', name: '沟通能力', category: 'soft', level: 'intermediate', prerequisites: [] },
    ],
    suitableMBTI: ['ENFP', 'INFP', 'ESFP'],
    salaryRange: '¥18k-45k/月',
    demandLevel: 'medium',
    growthPotential: 7,
  },
]

// MBTI 到职业的匹配
const mbtiCareerMap: Record<MBTICode, string[]> = {
  INTJ: ['ai-researcher', 'ml-engineer', 'cv-engineer', 'data-scientist'],
  INTP: ['ai-researcher', 'ml-engineer', 'nlp-engineer', 'data-scientist'],
  ENTJ: ['ai-pm', 'ml-engineer', 'data-scientist'],
  ENTP: ['ai-pm', 'nlp-engineer'],
  INFJ: ['ai-pm'],
  INFP: ['ai-designer'],
  ENFJ: ['ai-pm'],
  ENFP: ['ai-designer'],
  ISTJ: ['data-scientist'],
  ISFJ: ['ai-designer'],
  ESTJ: ['ai-pm'],
  ESFJ: ['ai-designer'],
  ISTP: ['ml-engineer', 'cv-engineer'],
  ISFP: ['ai-designer'],
  ESTP: ['ml-engineer'],
  ESFP: ['ai-designer'],
}

export default function CareerPage() {
  const [searchParams] = useSearchParams()
  const mbtiType = (searchParams.get('type') || 'INTJ') as MBTICode
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)

  const suitableCareers = useMemo(() => {
    const careerIds = mbtiCareerMap[mbtiType] || []
    return aiCareers.filter((c) => careerIds.includes(c.id))
  }, [mbtiType])

  const selectedCareerData = useMemo(
    () => aiCareers.find((c) => c.id === selectedCareer) || suitableCareers[0],
    [selectedCareer, suitableCareers]
  )

  return (
    <div className="w-full">
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          AI 职业探索
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          基于你的 {mbtiType} 型人格，我们为你推荐最适合的 AI 领域职业方向
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 职业列表 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-3xl p-6 sticky top-32">
            <h2 className="text-xl font-bold text-gray-900 mb-4">适合你的职业</h2>
            <div className="space-y-3">
              {suitableCareers.map((career) => (
                <motion.button
                  key={career.id}
                  onClick={() => setSelectedCareer(career.id)}
                  whileHover={{ x: 5 }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                    selectedCareer === career.id || (!selectedCareer && career === suitableCareers[0])
                      ? 'bg-black text-white'
                      : 'bg-white/50 hover:bg-white/80 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{career.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{career.name}</p>
                      <p className="text-xs opacity-70">{career.salaryRange}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 职业详情 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedCareerData && (
            <>
              {/* 职业卡片 */}
              <motion.div
                key={selectedCareerData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="text-6xl">{selectedCareerData.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedCareerData.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{selectedCareerData.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                        {selectedCareerData.demandLevel === 'high'
                          ? '需求旺盛 📈'
                          : selectedCareerData.demandLevel === 'medium'
                          ? '需求中等'
                          : '需求一般'}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-900 text-sm rounded-full">
                        增长潜力: {selectedCareerData.growthPotential}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* 职业信息grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8 pt-8 border-t border-gray-200">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">薪资范围</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCareerData.salaryRange}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">市场需求</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black"
                          style={{
                            width:
                              selectedCareerData.demandLevel === 'high'
                                ? '100%'
                                : selectedCareerData.demandLevel === 'medium'
                                ? '65%'
                                : '40%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">增长潜力</p>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < selectedCareerData.growthPotential ? 'bg-black' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 所需技能 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">核心技能要求</h3>
                <div className="space-y-4">
                  {selectedCareerData.requiredSkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{skill.name}</p>
                        <p className="text-sm text-gray-600">
                          {skill.level === 'advanced'
                            ? '高级'
                            : skill.level === 'intermediate'
                            ? '中级'
                            : '初级'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i <
                              (skill.level === 'advanced'
                                ? 3
                                : skill.level === 'intermediate'
                                ? 2
                                : 1)
                                ? 'bg-black'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 行动按钮 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="flex-1 px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                  ✨ 查看学习路径
                </button>
                <button className="flex-1 px-6 py-4 bg-white/50 text-gray-900 rounded-2xl font-semibold hover:bg-white/80 transition-colors border border-gray-200">
                  💬 咨询 AI 助手
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
