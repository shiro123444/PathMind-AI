import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 md:py-24 lg:py-32"
      >
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          找到你的
          <span className="block bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
            AI 学习之路
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          通过 MBTI 性格测试了解自己，获取 AI 领域的个性化职业推荐和学习路径，与 AI 助手共同成长
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/mbti-test"
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            开始测试 →
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 glass rounded-full font-semibold text-gray-700 hover:bg-white/80 transition-all duration-200"
          >
            登录已有账户
          </Link>
        </motion.div>
      </motion.section>

      {/* 核心功能展示 */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center text-gray-900 mb-16"
        >
          完整的学习生态系统
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🧠',
              title: 'MBTI 人格测试',
              description: '精准的性格分析，了解你的认知偏好和学习风格',
              link: '/mbti-test',
            },
            {
              icon: '🎯',
              title: 'AI 职业推荐',
              description: '基于性格和市场需求，推荐最适合的 AI 领域职业',
              link: '/careers',
            },
            {
              icon: '📚',
              title: '学习路径规划',
              description: '个性化的课程推荐，从入门到精通的完整学习路线',
              link: '/learning-path',
            },
            {
              icon: '🤖',
              title: 'AI 智能助手',
              description: '24/7 学习顾问，解答问题，提供实时建议',
              link: '/ai-advisor',
            },
            {
              icon: '📊',
              title: '进度追踪',
              description: '可视化学习进度，掌握技能成长的每一步',
              link: '/dashboard',
            },
            {
              icon: '🏆',
              title: '认证与成就',
              description: '完成课程获得认证，赢得徽章和行业认可',
              link: '/dashboard',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="glass rounded-3xl p-8 cursor-pointer group"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center gap-2 text-black font-semibold group-hover:gap-4 transition-all"
              >
                了解更多 →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 用户数据展示 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 md:py-24"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50K+', label: '活跃学生' },
            { value: '16', label: '性格类型' },
            { value: '100+', label: '优质课程' },
            { value: '95%', label: '满意度' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 学生故事 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-16"
        >
          学生成功故事
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              mbti: 'INTJ',
              name: '张同学',
              role: 'AI 算法工程师',
              story:
                '通过系统的学习路径和 AI 助手的个性化指导，从零基础到掌握深度学习，用时 8 个月获得国际认证。',
              avatar: '🎓',
            },
            {
              mbti: 'ENTP',
              name: '李同学',
              role: 'AI 产品经理',
              story:
                '了解自己的性格优势后，专注于产品思维的培养，成功转向 AI 产品方向，现在领导推荐系统团队。',
              avatar: '💼',
            },
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{story.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900">{story.name}</p>
                  <p className="text-sm text-gray-600">{story.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{story.mbti} 型</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{story.story}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          准备好探索你的 AI 之路了吗？
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          无论你是否有编程基础，我们都能帮助你找到适合的学习道路
        </p>
        <Link
          to="/mbti-test"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
        >
          立即开始 →
        </Link>
      </motion.section>
    </div>
  )
}
