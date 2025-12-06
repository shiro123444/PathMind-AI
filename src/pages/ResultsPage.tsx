import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

const mbtiDescriptions: Record<
  string,
  { name: string; description: string; careers: string[] }
> = {
  INTJ: {
    name: '建筑师',
    description:
      '富有想象力和战略性的思想家，一切皆在计划之中。独立、有决断力，对自己的想法和能力很有信心。',
    careers: ['科学家', '工程师', '投资分析师', '项目经理', '软件架构师'],
  },
  INTP: {
    name: '逻辑学家',
    description:
      '具有创造力的发明家，对知识有着不可抑制的渴望。喜欢分析和解决复杂的问题。',
    careers: ['研究员', '数据科学家', '哲学家', '软件开发', '数学家'],
  },
  ENTJ: {
    name: '指挥官',
    description:
      '大胆、富有想象力且意志强大的领导者，总能找到方法，或者创造方法。',
    careers: ['企业高管', '律师', '企业家', '咨询顾问', '政治家'],
  },
  ENTP: {
    name: '辩论家',
    description:
      '聪明好奇的思想者，不会放过任何智力上的挑战。喜欢辩论和发现新的可能性。',
    careers: ['创业者', '营销经理', '产品经理', '记者', '演员'],
  },
  INFJ: {
    name: '提倡者',
    description:
      '安静而神秘，同时又非常鼓舞人心，是理想主义者。致力于帮助他人实现潜能。',
    careers: ['心理咨询师', '作家', '教师', '社工', '人力资源'],
  },
  INFP: {
    name: '调停者',
    description:
      '诗意、善良的利他主义者，总是热情地为善举提供帮助。富有创造力和想象力。',
    careers: ['作家', '艺术家', '心理治疗师', '图书管理员', '社会工作者'],
  },
  ENFJ: {
    name: '主人公',
    description:
      '富有魅力且鼓舞人心的领导者，有着迷人的魅力。善于激励他人，关心他人的成长。',
    careers: ['教师', '培训师', '人力资源经理', '销售经理', '政治家'],
  },
  ENFP: {
    name: '竞选者',
    description:
      '热情、有创造力、善于社交的自由灵魂，总能找到微笑的理由。充满热情和新想法。',
    careers: ['记者', '演员', '顾问', '营销专员', '公关'],
  },
  ISTJ: {
    name: '物流师',
    description:
      '安静而实际，对可靠性和实用性有着强烈的偏好。勤奋、可靠、有责任心。',
    careers: ['会计', '审计师', '军官', '项目经理', '数据分析师'],
  },
  ISFJ: {
    name: '守卫者',
    description:
      '非常尽职尽责的保护者，随时准备保护他们爱的人。温暖、细心、有奉献精神。',
    careers: ['护士', '行政助理', '教师', '客户服务', '社工'],
  },
  ESTJ: {
    name: '总经理',
    description:
      '出色的管理者，善于管理事务和人员。注重秩序、传统和安全。',
    careers: ['银行经理', '法官', '项目经理', '军官', '销售经理'],
  },
  ESFJ: {
    name: '执政官',
    description:
      '极有同情心、善于社交、受欢迎的人，总是热心帮助他人。重视和谐与合作。',
    careers: ['护士', '教师', '销售', '活动策划', '人力资源'],
  },
  ISTP: {
    name: '鉴赏家',
    description:
      '大胆而实际的实验者，善于使用各种工具。喜欢动手解决问题。',
    careers: ['工程师', '技术员', '飞行员', '警察', '运动员'],
  },
  ISFP: {
    name: '探险家',
    description:
      '灵活而有魅力的艺术家，随时准备探索和体验新事物。温和、敏感、有帮助。',
    careers: ['艺术家', '音乐家', '设计师', '兽医', '厨师'],
  },
  ESTP: {
    name: '企业家',
    description:
      '聪明、精力充沛、善于感知的人，真正享受冒险的生活。行动力强，注重实际。',
    careers: ['销售', '企业家', '运动员', '演员', '消防员'],
  },
  ESFP: {
    name: '表演者',
    description:
      '自发的、精力充沛的表演者，生活在他们周围永远不会无聊。热爱生活，乐于分享。',
    careers: ['演员', '活动策划', '销售', '导游', '公关'],
  },
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const mbtiType = searchParams.get('type') || 'INTJ'

  const typeInfo = mbtiDescriptions[mbtiType] || mbtiDescriptions.INTJ

  // Generate radar chart data
  const dimensions = [
    { name: '外向 E', value: mbtiType.includes('E') ? 75 : 25 },
    { name: '直觉 N', value: mbtiType.includes('N') ? 70 : 30 },
    { name: '思考 T', value: mbtiType.includes('T') ? 80 : 20 },
    { name: '判断 J', value: mbtiType.includes('J') ? 65 : 35 },
  ]

  const dimensionBars = [
    {
      left: { label: '内向 (I)', value: mbtiType.includes('I') ? 65 : 35 },
      right: { label: '外向 (E)', value: mbtiType.includes('E') ? 65 : 35 },
    },
    {
      left: { label: '实感 (S)', value: mbtiType.includes('S') ? 60 : 40 },
      right: { label: '直觉 (N)', value: mbtiType.includes('N') ? 60 : 40 },
    },
    {
      left: { label: '思考 (T)', value: mbtiType.includes('T') ? 70 : 30 },
      right: { label: '情感 (F)', value: mbtiType.includes('F') ? 70 : 30 },
    },
    {
      left: { label: '判断 (J)', value: mbtiType.includes('J') ? 55 : 45 },
      right: { label: '知觉 (P)', value: mbtiType.includes('P') ? 55 : 45 },
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">{mbtiType}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          你是 "{typeInfo.name}" 型人格
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          {typeInfo.description}
        </motion.p>
      </motion.div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            性格维度雷达图
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={dimensions}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar
                name="维度"
                dataKey="value"
                stroke="#000"
                fill="#000"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Dimension Bars */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            维度分布
          </h3>
          <div className="space-y-6">
            {dimensionBars.map((dim, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{dim.left.label}</span>
                  <span className="text-gray-600">{dim.right.label}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.left.value}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-black rounded-l-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.right.value}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gray-400 rounded-r-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Career Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass rounded-3xl p-8 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">推荐职业方向</h3>
        <div className="flex flex-wrap gap-3">
          {typeInfo.careers.map((career, index) => (
            <motion.span
              key={career}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
            >
              {career}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/mbti-test"
          className="px-8 py-3 glass rounded-full font-medium text-gray-700 hover:bg-white/80 transition-colors text-center"
        >
          重新测试
        </Link>
        <Link
          to="/dashboard"
          className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-center"
        >
          返回仪表盘
        </Link>
      </motion.div>
    </div>
  )
}
