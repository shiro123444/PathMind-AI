import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const stats = [
  { label: '已完成测试', value: '3', icon: '📝' },
  { label: '学习时长', value: '24h', icon: '⏱️' },
  { label: '成就徽章', value: '5', icon: '🏆' },
]

const activities = [
  { title: '完成 MBTI 测试', time: '2 小时前', type: 'test' },
  { title: '查看结果分析', time: '2 小时前', type: 'view' },
  { title: '更新个人资料', time: '1 天前', type: 'profile' },
  { title: '开始学习计划', time: '3 天前', type: 'learn' },
]

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

export default function DashboardPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来，用户</h1>
        <p className="text-gray-600">这是你的个人仪表盘概览</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
          <div className="space-y-3">
            <Link
              to="/mbti-test"
              className="flex items-center gap-4 p-4 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-medium">开始 MBTI 测试</p>
                <p className="text-sm text-gray-300">完成性格类型评估</p>
              </div>
            </Link>

            <Link
              to="/results"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 transition-colors"
            >
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-gray-900">查看测试结果</p>
                <p className="text-sm text-gray-500">分析你的性格特质</p>
              </div>
            </Link>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 transition-colors text-left">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-gray-900">AI 对话</p>
                <p className="text-sm text-gray-500">获取个性化建议</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">最近活动</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {activity.type === 'test' && '📝'}
                  {activity.type === 'view' && '👁️'}
                  {activity.type === 'profile' && '👤'}
                  {activity.type === 'learn' && '📚'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MBTI Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 glass rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">INTJ</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              建筑师型人格
            </h3>
            <p className="text-gray-600 mb-4">
              富有想象力和战略性的思想家，一切皆在计划之中。
            </p>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 text-black font-medium hover:underline"
            >
              查看详细分析
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
