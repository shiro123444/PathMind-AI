/**
 * Dashboard Page - 专业配色 + 玻璃态设计
 * 
 * 设计特点：
 * - 专业的蓝灰色系
 * - 玻璃态卡片
 * - 低饱和度色彩
 * - 统一的设计系统
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/ui'
import { primary, neutral, secondary, accent } from '../theme/colors'

const stats = [
  { 
    label: '已完成测试', 
    value: '3', 
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'pink' as const
  },
  { 
    label: '学习时长', 
    value: '24h', 
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'blue' as const
  },
  { 
    label: '成就徽章', 
    value: '5', 
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    color: 'yellow' as const
  },
  { 
    label: '完成课程', 
    value: '12', 
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'purple' as const
  },
]

const quickActions = [
  { 
    title: 'MBTI 测试', 
    desc: '完成性格评估', 
    link: '/mbti-test',
    icon: '🧠',
    color: 'pink' as const,
  },
  { 
    title: '结果分析', 
    desc: '深入了解性格', 
    link: '/results',
    icon: '📊',
    color: 'yellow' as const,
  },
  { 
    title: '职业推荐', 
    desc: '探索职业方向', 
    link: '/careers',
    icon: '🎯',
    color: 'blue' as const,
  },
  { 
    title: 'AI 助手', 
    desc: '个性化建议', 
    link: '/ai-advisor',
    icon: '🤖',
    color: 'purple' as const,
  },
]

const recentActivities = [
  { title: '完成 MBTI 测试', time: '2 小时前', icon: '✅', color: 'green' },
  { title: '查看结果分析', time: '2 小时前', icon: '📈', color: 'blue' },
  { title: '开始学习计划', time: '1 天前', icon: '📚', color: 'purple' },
]

export default function DashboardPage() {
  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8 overflow-y-auto"
      style={{ background: `linear-gradient(135deg, ${neutral[50]} 0%, #F8FAFC 50%, ${primary[50]}40 100%)` }}
    >
      {/* 欢迎区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <p className="text-sm mb-1 font-medium" style={{ color: primary[600] }}>个人中心</p>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: neutral[900] }}>
          欢迎回来
        </h1>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard 
              variant="standard"
              color={stat.color}
              className="h-full"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-black" style={{ color: neutral[900] }}>{stat.value}</p>
                  <p className="text-xs mt-1" style={{ color: neutral[500] }}>{stat.label}</p>
                </div>
                <div style={{ opacity: 0.3 }}>
                  <svg className="w-8 h-8" style={{ color: neutral[700] }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* MBTI 卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <GlassCard variant="strong" color="white">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            {/* MBTI 类型徽章 - 使用专业蓝灰色 */}
            <div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
            >
              <span className="text-xl md:text-2xl font-black tracking-wider text-white">INTJ</span>
            </div>
            
            {/* 描述 */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: neutral[900] }}>建筑师型人格</h2>
              <p className="leading-relaxed mb-4 text-sm" style={{ color: neutral[600] }}>
                富有想象力和战略性的思想家，一切皆在计划之中。你善于分析复杂问题，追求知识和能力的提升。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/results"
                  className="px-4 py-2 rounded-full font-semibold text-sm transition-all text-white hover:shadow-lg hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)` }}
                >
                  查看详细分析 →
                </Link>
                <Link
                  to="/careers"
                  className="px-4 py-2 rounded-full font-semibold text-sm transition-colors"
                  style={{ background: neutral[100], color: neutral[800] }}
                >
                  职业推荐
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 快速操作 + 最近活动 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-sm font-medium mb-3" style={{ color: neutral[500] }}>快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <GlassCard 
                  variant="standard"
                  color={action.color}
                  className="h-full hover:scale-[1.02] transition-transform"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{action.icon}</span>
                    <h4 className="font-bold text-sm" style={{ color: neutral[800] }}>{action.title}</h4>
                    <p className="text-xs mt-1" style={{ color: neutral[500] }}>{action.desc}</p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-sm font-medium mb-3" style={{ color: neutral[500] }}>最近活动</h3>
          <GlassCard variant="standard" color="white">
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                  style={{ background: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = neutral[50]}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: neutral[800] }}>{activity.title}</p>
                  </div>
                  <p className="text-xs" style={{ color: neutral[400] }}>{activity.time}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
