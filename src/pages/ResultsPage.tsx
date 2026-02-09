import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import { GlassCard } from '../components/ui'
import { easings, durations } from '../theme/motion'
import { primary } from '../theme/colors'
import { Sparkles, Target, BookOpen, MessageSquare, RotateCcw } from 'lucide-react'

const mbtiDescriptions: Record<string, { name: string; description: string; careers: string[]; strengths: string[] }> = {
  INTJ: {
    name: '建筑师',
    description: '富有想象力和战略性的思想家，一切皆在计划之中。独立、有决断力，对自己的想法和能力很有信心。',
    careers: ['AI 研究员', '算法工程师', '数据科学家', '系统架构师', '技术顾问'],
    strengths: ['战略思维', '独立自主', '逻辑分析', '追求卓越'],
  },
  INTP: {
    name: '逻辑学家',
    description: '具有创造力的发明家，对知识有着不可抑制的渴望。喜欢分析和解决复杂的问题。',
    careers: ['研究员', '数据科学家', '软件开发', '数学家', 'AI 工程师'],
    strengths: ['逻辑思维', '创新能力', '问题解决', '知识渴求'],
  },
  ENTJ: {
    name: '指挥官',
    description: '大胆、富有想象力且意志强大的领导者，总能找到方法，或者创造方法。',
    careers: ['技术总监', 'AI 产品经理', '创业者', '咨询顾问', '项目经理'],
    strengths: ['领导能力', '决策果断', '目标导向', '高效执行'],
  },
  ENTP: {
    name: '辩论家',
    description: '聪明好奇的思想者，不会放过任何智力上的挑战。喜欢辩论和发现新的可能性。',
    careers: ['产品经理', '创业者', 'AI 顾问', '技术布道师', '解决方案架构师'],
    strengths: ['创新思维', '适应能力', '沟通技巧', '挑战精神'],
  },
  INFJ: {
    name: '提倡者',
    description: '安静而神秘，同时又非常鼓舞人心，是理想主义者。致力于帮助他人实现潜能。',
    careers: ['UX 研究员', 'AI 伦理专家', '教育技术专家', '用户体验设计师'],
    strengths: ['洞察力', '同理心', '创造力', '坚持理想'],
  },
  INFP: {
    name: '调停者',
    description: '诗意、善良的利他主义者，总是热情地为善举提供帮助。富有创造力和想象力。',
    careers: ['内容创作者', 'AI 艺术家', '用户研究员', '技术写作'],
    strengths: ['创造力', '同理心', '适应性', '理想主义'],
  },
  ENFJ: {
    name: '主人公',
    description: '富有魅力且鼓舞人心的领导者，有着迷人的魅力。善于激励他人，关心他人的成长。',
    careers: ['技术培训师', 'AI 产品经理', '团队领导', '开发者关系'],
    strengths: ['领导魅力', '沟通能力', '团队协作', '激励他人'],
  },
  ENFP: {
    name: '竞选者',
    description: '热情、有创造力、善于社交的自由灵魂，总能找到微笑的理由。充满热情和新想法。',
    careers: ['产品设计师', '技术布道师', '创意总监', '社区经理'],
    strengths: ['创造力', '热情', '适应性', '人际交往'],
  },
  ISTJ: { name: '物流师', description: '安静而实际，对可靠性和实用性有着强烈的偏好。', careers: ['数据分析师', '质量工程师', '系统管理员'], strengths: ['可靠性', '组织能力', '注重细节', '责任心'] },
  ISFJ: { name: '守卫者', description: '非常尽职尽责的保护者，随时准备保护他们爱的人。', careers: ['技术支持', '文档工程师', '测试工程师'], strengths: ['可靠性', '耐心', '细心', '奉献精神'] },
  ESTJ: { name: '总经理', description: '出色的管理者，善于管理事务和人员。', careers: ['项目经理', '技术经理', '运维主管'], strengths: ['组织能力', '领导力', '执行力', '责任心'] },
  ESFJ: { name: '执政官', description: '极有同情心、善于社交、受欢迎的人。', careers: ['客户成功经理', '技术培训', '团队协调'], strengths: ['社交能力', '同理心', '组织能力', '合作精神'] },
  ISTP: { name: '鉴赏家', description: '大胆而实际的实验者，善于使用各种工具。', careers: ['DevOps 工程师', '安全工程师', '硬件工程师'], strengths: ['动手能力', '问题解决', '适应性', '冷静'] },
  ISFP: { name: '探险家', description: '灵活而有魅力的艺术家，随时准备探索和体验新事物。', careers: ['UI 设计师', '前端开发', '创意技术'], strengths: ['创造力', '审美', '适应性', '同理心'] },
  ESTP: { name: '企业家', description: '聪明、精力充沛、善于感知的人，真正享受冒险的生活。', careers: ['技术销售', '创业者', '产品运营'], strengths: ['行动力', '适应性', '社交能力', '问题解决'] },
  ESFP: { name: '表演者', description: '自发的、精力充沛的表演者，生活在他们周围永远不会无聊。', careers: ['技术演讲', '社区运营', '用户增长'], strengths: ['热情', '社交能力', '适应性', '乐观'] },
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const mbtiType = searchParams.get('type') || 'INTJ'
  const typeInfo = mbtiDescriptions[mbtiType] || mbtiDescriptions.INTJ

  const dimensions = [
    { name: '外向 E', value: mbtiType.includes('E') ? 75 : 25 },
    { name: '直觉 N', value: mbtiType.includes('N') ? 70 : 30 },
    { name: '思考 T', value: mbtiType.includes('T') ? 80 : 20 },
    { name: '判断 J', value: mbtiType.includes('J') ? 65 : 35 },
  ]

  const dimensionBars = [
    { left: { label: '内向 (I)', value: mbtiType.includes('I') ? 65 : 35 }, right: { label: '外向 (E)', value: mbtiType.includes('E') ? 65 : 35 } },
    { left: { label: '实感 (S)', value: mbtiType.includes('S') ? 60 : 40 }, right: { label: '直觉 (N)', value: mbtiType.includes('N') ? 60 : 40 } },
    { left: { label: '思考 (T)', value: mbtiType.includes('T') ? 70 : 30 }, right: { label: '情感 (F)', value: mbtiType.includes('F') ? 70 : 30 } },
    { left: { label: '判断 (J)', value: mbtiType.includes('J') ? 55 : 45 }, right: { label: '知觉 (P)', value: mbtiType.includes('P') ? 55 : 45 } },
  ]

  // 统一的动画配置
  const smoothTransition = { duration: durations.slow, ease: easings.smooth }

  return (
    <div 
      className="min-h-screen py-12 px-4 overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: durations.slow, ease: easings.smooth }}
            className="inline-block mb-6"
          >
            <div 
              className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
            >
              <span className="text-4xl font-black text-white">{mbtiType}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, ...smoothTransition }}
            className="text-4xl md:text-5xl font-black mb-4 text-text-primary"
          >
            你是 "{typeInfo.name}" 型人格
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ...smoothTransition }}
            className="text-lg max-w-2xl mx-auto text-text-secondary"
          >
            {typeInfo.description}
          </motion.p>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {typeInfo.strengths.map((strength, index) => (
            <GlassCard key={strength} variant="light" color="white" className="px-4 py-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-sm font-medium text-text-secondary"
              >
                <Sparkles className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} />{strength}
              </motion.span>
            </GlassCard>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard variant="standard" color="white" className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center text-text-primary">性格维度雷达图</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={dimensions}>
                  <PolarGrid stroke="var(--border-primary)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="维度" dataKey="value" stroke={primary[600]} fill={primary[500]} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Dimension Bars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard variant="standard" color="white" className="p-6">
              <h3 className="text-lg font-bold mb-6 text-center text-text-primary">维度分布</h3>
              <div className="space-y-6">
                {dimensionBars.map((dim, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ fontWeight: dim.left.value > dim.right.value ? 'bold' : 'normal', color: dim.left.value > dim.right.value ? 'var(--text-primary)' : 'var(--text-muted)'  }}>{dim.left.label}</span>
                      <span style={{ fontWeight: dim.right.value > dim.left.value ? 'bold' : 'normal', color: dim.right.value > dim.left.value ? 'var(--text-primary)' : 'var(--text-muted)'  }}>{dim.right.label}</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-tertiary)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.left.value}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-l-full"
                        style={{ background: `linear-gradient(90deg, ${primary[500]} 0%, ${primary[600]} 100%)` }}
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.right.value}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-r-full"
                        style={{ background: 'var(--border-primary)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Career Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard 
            variant="strong" 
            color="white" 
            className="p-8 mb-8 text-white"
            style={{ background: `linear-gradient(135deg, ${primary[800]} 0%, ${primary[900]} 100%)` }}
          >
            <h3 className="text-2xl font-bold mb-6"><Target className="w-5 h-5 inline-block mr-2 align-text-bottom" strokeWidth={1.5} />推荐 AI 职业方向</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {typeInfo.careers.map((career, index) => (
                <motion.div
                  key={career}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="backdrop-blur rounded-2xl p-4 transition-colors hover:bg-bg-hover"
                  style={{ background: 'rgba(255,255,255,0.1)' }}

                >
                  <span className="font-medium">{career}</span>
                </motion.div>
              ))}
            </div>
            <Link
              to={`/careers?type=${mbtiType}`}
              className="inline-flex items-center gap-2 mt-6 transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.8)' }}

            >
              查看详细职业分析 →
            </Link>
          </GlassCard>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/learning-path"
            className="px-8 py-4 text-white rounded-full font-semibold transition-colors text-center"
            style={{ background: primary[800] }}
          >
            <BookOpen className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} /> 查看学习路径
          </Link>
          <Link
            to="/ai-advisor"
            className="px-8 py-4 bg-bg-secondary rounded-full font-semibold transition-all text-center border-2 border-border-primary text-text-primary"
          >
            <MessageSquare className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} /> 咨询 AI 助手
          </Link>
          <Link
            to="/mbti-test"
            className="px-8 py-4 rounded-full font-semibold transition-colors text-center bg-bg-tertiary text-text-secondary"
          >
            <RotateCcw className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} /> 重新测试
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
