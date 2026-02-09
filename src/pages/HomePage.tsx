import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Button } from '@heroui/react'
import { Brain, Target, BookOpen, Bot, BarChart3, Trophy, GraduationCap, Briefcase } from 'lucide-react'

// 滚动视差 Section 组件
function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.5 
}: { 
  children: React.ReactNode
  className?: string
  speed?: number 
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// 滚动淡入组件
function FadeInOnScroll({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 滚动缩放组件
function ScaleOnScroll({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  })
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  )
}

// 数字动画组件
function AnimatedNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="inline-block"
    >
      {value}{suffix}
    </motion.span>
  )
}

const features = [
  { icon: Brain, title: 'MBTI 人格测试', description: '精准的性格分析，了解你的认知偏好和学习风格', link: '/mbti-test' },
  { icon: Target, title: 'AI 职业推荐', description: '基于性格和市场需求，推荐最适合的 AI 领域职业', link: '/careers' },
  { icon: BookOpen, title: '学习路径规划', description: '个性化的课程推荐，从入门到精通的完整学习路线', link: '/learning-path' },
  { icon: Bot, title: 'AI 智能助手', description: '24/7 学习顾问，解答问题，提供实时建议', link: '/ai-advisor' },
  { icon: BarChart3, title: '进度追踪', description: '可视化学习进度，掌握技能成长的每一步', link: '/dashboard' },
  { icon: Trophy, title: '认证与成就', description: '完成课程获得认证，赢得徽章和行业认可', link: '/dashboard' },
]

const stats = [
  { value: '50K+', label: '活跃学生' },
  { value: '16', label: '性格类型' },
  { value: '100+', label: '优质课程' },
  { value: '95%', label: '满意度' },
]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  // Hero 区域的视差效果
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.95])

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section - 带视差效果 */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
              找到你的
              <motion.span 
                className="block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              >
                AI 学习之路
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            通过 MBTI 性格测试了解自己，获取 AI 领域的个性化职业推荐和学习路径
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              as={Link}
              to="/mbti-test"
              size="lg"
              radius="full"
              className="bg-black text-white font-semibold px-8 hover:bg-gray-800 hover:scale-105 transition-transform"
            >
              开始测试 →
            </Button>
            <Button
              as={Link}
              to="/login"
              size="lg"
              radius="full"
              variant="bordered"
              className="font-semibold px-8 border-border-primary hover:bg-bg-hover"
            >
              登录已有账户
            </Button>
          </motion.div>
          
          {/* 滚动提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-text-muted rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* 功能展示 - 交错滚动动画 */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInOnScroll className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              完整的学习生态系统
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              从性格测试到职业规划，我们提供全方位的 AI 学习支持
            </p>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInOnScroll
                key={index}
                delay={index * 0.1}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group"
                >
                  <Link
                    to={feature.link}
                    className="block glass rounded-3xl p-8 h-full hover:shadow-xl transition-shadow"
                  >
                    <motion.div 
                      className="mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <feature.icon className="w-10 h-10" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary mb-4">{feature.description}</p>
                    <span className="inline-flex items-center gap-2 text-text-primary font-semibold group-hover:gap-4 transition-all">
                      了解更多 
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </Link>
                </motion.div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 数据统计 - 视差滚动 */}
      <section className="py-24 relative overflow-hidden">
        <ParallaxSection speed={0.3} className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />
        </ParallaxSection>
        
        <div className="max-w-6xl mx-auto px-4">
          <ScaleOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <FadeInOnScroll key={index} delay={index * 0.15} direction="up">
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-2">
                      <AnimatedNumber value={stat.value} />
                    </p>
                    <p className="text-text-secondary font-medium">{stat.label}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </ScaleOnScroll>
        </div>
      </section>

      {/* 学生故事 - 交替视差 */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInOnScroll className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              学生成功故事
            </h2>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                mbti: 'INTJ',
                name: '张同学',
                role: 'AI 算法工程师',
                story: '通过系统的学习路径和 AI 助手的个性化指导，从零基础到掌握深度学习，用时 8 个月获得国际认证。',
                avatar: GraduationCap,
              },
              {
                mbti: 'ENTP',
                name: '李同学',
                role: 'AI 产品经理',
                story: '了解自己的性格优势后，专注于产品思维的培养，成功转向 AI 产品方向，现在领导推荐系统团队。',
                avatar: Briefcase,
              },
            ].map((story, index) => (
              <ParallaxSection key={index} speed={index === 0 ? 0.2 : -0.2}>
                <FadeInOnScroll direction={index === 0 ? 'left' : 'right'}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-3xl p-8"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.3, rotate: -10 }}
                      >
                        <story.avatar className="w-8 h-8" strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <p className="font-bold text-text-primary">{story.name}</p>
                        <p className="text-sm text-text-secondary">{story.role}</p>
                        <p className="text-xs text-purple-600 font-medium mt-1">{story.mbti} 型</p>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed italic">"{story.story}"</p>
                  </motion.div>
                </FadeInOnScroll>
              </ParallaxSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - 视差背景 */}
      <section className="py-24 relative overflow-hidden">
        <ParallaxSection speed={0.5} className="absolute inset-0 -z-10">
          <div className="w-full h-[150%] bg-gradient-to-t from-black via-gray-900 to-gray-800" />
        </ParallaxSection>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FadeInOnScroll>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
            >
              准备好探索你的 AI 之路了吗？
            </motion.h2>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.2}>
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
              无论你是否有编程基础，我们都能帮助你找到适合的学习道路
            </p>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={0.4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                as={Link}
                to="/mbti-test"
                size="lg"
                radius="full"
                className="bg-bg-secondary text-text-primary font-semibold px-10 py-6 text-lg hover:bg-bg-tertiary"
              >
                立即开始 →
              </Button>
            </motion.div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  )
}
