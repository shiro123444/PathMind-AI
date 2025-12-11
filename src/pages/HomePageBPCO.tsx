/**
 * Premium Homepage - 惊艳的首页设计
 * 
 * 特色:
 * - Bento Grid 布局
 * - 大胆的排版
 * - 流畅的滚动动画
 * - 3D 悬浮效果
 * - 渐变色彩
 */

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Button } from '@heroui/react'
import {
  ParallaxMarquee,
  StrokeMarquee,
  ScrollTextReveal,
  CircularText,
  RotatingText,
  HoverCard,
  ScrollProgressIndicator,
} from '../components/animations'

// ============================================
// Hero Section - 震撼开场
// ============================================
function HeroSection() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // 鼠标跟随效果
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20)
  }

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 背景渐变球 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)',
            x: springX,
            y: springY,
          }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            x: springX,
            y: springY,
          }}
        />
      </div>

      {/* 装饰性圆形文字 */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-20 hidden lg:block">
        <CircularText 
          text="AI LEARNING PATH • DISCOVER YOUR FUTURE • " 
          radius={60}
          rotationDuration={25}
        />
      </div>

      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full"
      >
        {/* 顶部标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full">
            NEW
          </span>
          <span className="text-sm text-gray-600">
            AI 驱动的个性化学习平台
          </span>
        </motion.div>

        {/* 主标题 - 超大字体 */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[13vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tight text-gray-900"
          >
            发现你的
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-baseline flex-wrap gap-x-4"
          >
            <span className="text-[13vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              AI
            </span>
            <RotatingText 
              texts={['学习之路', '职业方向', '无限可能']}
              interval={2500}
              className="text-[13vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tight text-gray-900"
            />
          </motion.div>
        </div>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-gray-600 mb-10"
          style={{ 
            maxWidth: '540px',
            lineHeight: '1.8',
            whiteSpace: 'normal',
            wordBreak: 'keep-all'
          }}
        >
          通过 MBTI 性格测试了解自己，获取 AI 领域的个性化职业推荐和学习路径
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <Button
            as={Link}
            to="/mbti-test"
            size="lg"
            radius="full"
            className="bg-black text-white font-semibold px-10 py-6 text-base hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl"
          >
            开始测试 →
          </Button>
          <Button
            as={Link}
            to="/login"
            size="lg"
            radius="full"
            variant="bordered"
            className="font-semibold px-8 py-6 border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
          >
            登录账户
          </Button>
        </motion.div>
      </motion.div>

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-gray-400">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1"
        >
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}


// ============================================
// Bento Grid Section - 功能展示
// ============================================
function BentoGridSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    { 
      id: 'mbti',
      title: 'MBTI 测试', 
      desc: '精准的性格分析',
      icon: '🧠',
      link: '/mbti-test',
      gradient: 'from-purple-500 to-indigo-600',
      size: 'large' as const
    },
    { 
      id: 'career',
      title: 'AI 职业推荐', 
      desc: '智能匹配最适合你的方向',
      icon: '🎯',
      link: '/careers',
      gradient: 'from-pink-500 to-rose-600',
      size: 'medium' as const
    },
    { 
      id: 'learning',
      title: '学习路径', 
      desc: '个性化课程规划',
      icon: '📚',
      link: '/learning-path',
      gradient: 'from-orange-500 to-amber-600',
      size: 'medium' as const
    },
    { 
      id: 'ai',
      title: 'AI 助手', 
      desc: '24/7 智能学习顾问',
      icon: '🤖',
      link: '/ai-advisor',
      gradient: 'from-cyan-500 to-blue-600',
      size: 'large' as const
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-4">
            完整的学习生态
          </h2>
          <p className="text-lg text-gray-600 max-w-xl">
            从性格测试到职业规划，我们提供全方位的 AI 学习支持
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {features.map((feature, index) => (
            <BentoCard 
              key={feature.id} 
              feature={feature} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface BentoFeature {
  id: string
  title: string
  desc: string
  icon: string
  link: string
  gradient: string
  size: 'small' | 'medium' | 'large'
}

function BentoCard({ feature, index, isInView }: { feature: BentoFeature; index: number; isInView: boolean }) {
  const sizeClasses = {
    small: '',
    medium: 'md:col-span-1 md:row-span-1',
    large: 'md:col-span-2 md:row-span-2',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={sizeClasses[feature.size]}
    >
      <HoverCard className="h-full">
        <Link 
          to={feature.link}
          className={`
            block h-full p-6 md:p-8 rounded-3xl 
            bg-gradient-to-br ${feature.gradient}
            text-white relative overflow-hidden group
            transition-shadow hover:shadow-2xl
          `}
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <motion.span 
              className="text-4xl md:text-5xl mb-4"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {feature.icon}
            </motion.span>
            
            <div className="mt-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                {feature.desc}
              </p>
            </div>

            <motion.div 
              className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <span className="text-lg">→</span>
            </motion.div>
          </div>
        </Link>
      </HoverCard>
    </motion.div>
  )
}


// ============================================
// Marquee Section - 文字跑马灯
// ============================================
function MarqueeSection() {
  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <ParallaxMarquee 
        text="MBTI • AI LEARNING • CAREER PATH • PERSONALITY •" 
        baseVelocity={2}
        textClassName="text-gray-200"
      />
      <div className="h-2" />
      <ParallaxMarquee 
        text="DISCOVER • GROW • ACHIEVE • TRANSFORM •" 
        baseVelocity={-2}
        textClassName="text-gray-300"
      />
    </section>
  )
}

// ============================================
// Stats Section - 数据统计
// ============================================
function StatsSection() {
  const stats = [
    { value: '50K+', label: '活跃学生', icon: '👥' },
    { value: '16', label: '性格类型', icon: '🎭' },
    { value: '100+', label: '优质课程', icon: '📖' },
    { value: '95%', label: '满意度', icon: '⭐' },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <span className="text-3xl mb-4 block">{stat.icon}</span>
              <motion.p 
                className="text-4xl md:text-5xl lg:text-6xl font-black"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-400 mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ============================================
// Philosophy Section - 理念展示
// ============================================
function PhilosophySection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-sm font-mono text-gray-500 uppercase tracking-widest">
            Our Philosophy
          </span>
        </motion.div>

        <ScrollTextReveal 
          text="我们相信每个人都有独特的学习方式和职业潜力。通过科学的性格分析和 AI 技术，我们帮助你发现最适合自己的 AI 学习路径，让学习变得更高效、更有趣。"
          className="text-gray-900"
        />
      </div>

      {/* 描边文字装饰 */}
      <div className="mt-20">
        <StrokeMarquee text="PERSONALITY • LEARNING • GROWTH" duration={30} />
      </div>
    </section>
  )
}

// ============================================
// Testimonials Section - 用户故事
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      mbti: 'INTJ',
      name: '张同学',
      role: 'AI 算法工程师 @ 字节跳动',
      story: '通过系统的学习路径和 AI 助手的个性化指导，从零基础到掌握深度学习，用时 8 个月获得国际认证。',
      avatar: '👨‍💻',
    },
    {
      mbti: 'ENTP',
      name: '李同学',
      role: 'AI 产品经理 @ 阿里巴巴',
      story: '了解自己的性格优势后，专注于产品思维的培养，成功转向 AI 产品方向，现在领导推荐系统团队。',
      avatar: '👩‍💼',
    },
    {
      mbti: 'INFJ',
      name: '王同学',
      role: 'NLP 研究员 @ 腾讯',
      story: '平台帮我找到了最适合我性格的研究方向，现在专注于对话系统研究，发表了多篇顶会论文。',
      avatar: '🧑‍🔬',
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
            学生成功故事
          </h2>
          <p className="text-gray-600 text-lg">
            看看他们是如何通过我们的平台实现职业转型的
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
            >
              <HoverCard>
                <div className="h-full p-8 rounded-3xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    "{item.story}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                      {item.mbti}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA Section - 行动召唤
// ============================================
function CTASection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={ref} className="relative py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* 背景装饰 */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
      </motion.div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8"
        >
          准备好开始了吗？
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          无论你是否有编程基础，我们都能帮助你找到适合的 AI 学习道路
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            as={Link}
            to="/mbti-test"
            size="lg"
            radius="full"
            className="bg-white text-black font-bold px-12 py-6 text-lg hover:bg-gray-100 transition-all hover:scale-105"
          >
            立即开始 →
          </Button>
          <Button
            as={Link}
            to="/ai-advisor"
            size="lg"
            radius="full"
            variant="bordered"
            className="font-bold px-10 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10"
          >
            咨询 AI 助手
          </Button>
        </motion.div>
      </div>
    </section>
  )
}


// ============================================
// Footer Section - 页脚
// ============================================
function FooterSection() {
  return (
    <footer className="py-16 px-6 md:px-12 lg:px-20 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black mb-4">AI Learning Path</h3>
            <p className="text-gray-400" style={{ maxWidth: '400px', lineHeight: '1.8' }}>
              通过 MBTI 性格测试，发现最适合你的 AI 学习路径。让每个人都能找到属于自己的 AI 之路。
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/mbti-test" className="hover:text-white transition-colors">MBTI 测试</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">职业推荐</Link></li>
              <li><Link to="/learning-path" className="hover:text-white transition-colors">学习路径</Link></li>
              <li><Link to="/ai-advisor" className="hover:text-white transition-colors">AI 助手</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">联系我们</h4>
            <ul className="space-y-2 text-gray-400">
              <li>support@ailearning.com</li>
              <li>GitHub</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 AI Learning Path. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// Main Component
// ============================================
export default function HomePageBPCO() {
  return (
    <div className="w-full overflow-hidden bg-white">
      <ScrollProgressIndicator />
      <HeroSection />
      <MarqueeSection />
      <BentoGridSection />
      <StatsSection />
      <PhilosophySection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
