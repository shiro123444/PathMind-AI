import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { label: '已完成测试', value: '3', icon: '📝', color: 'from-purple-500 to-indigo-600' },
  { label: '学习时长', value: '24h', icon: '⏱️', color: 'from-pink-500 to-rose-600' },
  { label: '成就徽章', value: '5', icon: '🏆', color: 'from-orange-500 to-amber-600' },
  { label: '完成课程', value: '12', icon: '📚', color: 'from-cyan-500 to-blue-600' },
]

const quickActions = [
  { icon: '🧠', title: 'MBTI 测试', desc: '完成性格类型评估', link: '/mbti-test', primary: true },
  { icon: '📊', title: '查看结果', desc: '分析你的性格特质', link: '/results', primary: false },
  { icon: '💬', title: 'AI 对话', desc: '获取个性化建议', link: '/ai-advisor', primary: false },
  { icon: '🎯', title: '职业探索', desc: '发现适合的方向', link: '/careers', primary: false },
]

const activities = [
  { title: '完成 MBTI 测试', time: '2 小时前', type: 'test', icon: '📝' },
  { title: '查看结果分析', time: '2 小时前', type: 'view', icon: '👁️' },
  { title: '开始学习计划', time: '1 天前', type: 'learn', icon: '📚' },
  { title: '获得新徽章', time: '3 天前', type: 'badge', icon: '🏆' },
]

export default function DashboardPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            欢迎回来，用户 👋
          </h1>
          <p className="text-gray-600">这是你的个人学习仪表盘</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${stat.color} text-white
              `}
            >
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">
                {stat.icon}
              </div>
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">快速操作</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`
                    group p-6 rounded-2xl transition-all duration-300
                    ${action.primary 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                      <h3 className={`font-bold mb-1 ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm ${action.primary ? 'text-gray-300' : 'text-gray-600'}`}>
                        {action.desc}
                      </p>
                    </div>
                    <span className={`ml-auto text-xl transition-transform group-hover:translate-x-1 ${action.primary ? 'text-white' : 'text-gray-400'}`}>
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">最近活动</h2>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{activity.title}</p>
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
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-black">INTJ</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">建筑师型人格</h3>
                <p className="text-gray-300 mb-4 max-w-xl">
                  富有想象力和战略性的思想家，一切皆在计划之中。你善于分析复杂问题，追求知识和能力的提升。
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    to="/results"
                    className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    查看详细分析 →
                  </Link>
                  <Link
                    to="/careers"
                    className="px-6 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
                  >
                    职业推荐
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
