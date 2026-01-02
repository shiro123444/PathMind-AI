/**
 * Premium Homepage - 惊艳的首页设计（重新设计版）
 * 
 * 特色:
 * - 保留动画效果（Hero、Marquee）
 * - 快速入口提前出现
 * - 浅色系 + 玻璃态设计
 * - 专业蓝灰色配色
 * - 系统特色介绍
 */

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Button } from '@heroui/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {
  ParallaxMarquee,
  CircularText,
  FlipText,
  BreathingOrb,
  ScrollProgressIndicator,
} from '../components/animations'
import { GlassCard } from '../components/ui'
import { variants, easings, durations, heroSequence } from '../theme/motion'
import { primary, neutral } from '../theme/colors'

// ============================================
// Hero Section - Claude 风格左右分栏设计
// ============================================
function HeroSection() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${neutral[50]} 0%, white 50%, ${primary[50]}30 100%)` }}
    >
      {/* 背景呼吸光晕 - 更微妙 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BreathingOrb 
          color="rgba(226,232,240,0.3)"
          size={600}
          position={{ top: '-15%', left: '-10%' }}
          phaseOffset={0}
        />
        <BreathingOrb 
          color="rgba(241,245,249,0.25)"
          size={500}
          position={{ bottom: '-10%', right: '20%' }}
          phaseOffset={0.5}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* 左侧：文案区域 */}
          <motion.div 
            style={{ y, opacity }}
            className="flex flex-col justify-center"
          >
            {/* 顶部标签 */}
            <motion.div
              variants={variants.heroTitle}
              initial="initial"
              animate="animate"
              transition={{ 
                delay: heroSequence.sequence.newTag, 
                duration: durations.slow, 
                ease: easings.smooth 
              }}
              className="flex items-center gap-3 mb-8"
            >
              <span 
                className="px-4 py-1.5 text-white text-xs font-medium rounded-full"
                style={{ background: primary[800] }}
              >
                武汉商学院
              </span>
              <span style={{ color: neutral[500] }} className="text-sm">
                AI 与大数据学院
              </span>
            </motion.div>

            {/* 主标题 - 更优雅的排版 */}
            <div className="mb-6">
              <motion.h1
                variants={variants.heroTitle}
                initial="initial"
                animate="animate"
                transition={{ 
                  delay: heroSequence.sequence.mainTitle, 
                  duration: durations.slower, 
                  ease: easings.smooth 
                }}
                className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-2"
                style={{ color: neutral[900] }}
              >
                发现你的
              </motion.h1>
              
              <motion.div
                variants={variants.heroTitle}
                initial="initial"
                animate="animate"
                transition={{ 
                  delay: heroSequence.sequence.aiGradient, 
                  duration: durations.slower, 
                  ease: easings.smooth 
                }}
                className="flex items-baseline flex-wrap gap-x-3"
              >
                <span 
                  className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${primary[500]} 0%, ${primary[700]} 50%, ${primary[900]} 100%)` }}
                >
                  AI
                </span>
                <motion.span
                  variants={variants.heroTitle}
                  initial="initial"
                  animate="animate"
                  transition={{ 
                    delay: heroSequence.sequence.flipText, 
                    duration: durations.slower, 
                    ease: easings.smooth 
                  }}
                  style={{ color: neutral[900] }}
                >
                  <FlipText 
                    texts={['职业方向', '学习之路', '无限可能']}
                    interval={2500}
                    className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
                  />
                </motion.span>
              </motion.div>
            </div>

            {/* 副标题 */}
            <motion.p
              variants={variants.heroTitle}
              initial="initial"
              animate="animate"
              transition={{ 
                delay: heroSequence.sequence.subtitle, 
                duration: durations.slow, 
                ease: easings.smooth 
              }}
              className="text-base md:text-lg mb-8 leading-relaxed"
              style={{ 
                maxWidth: '420px',
                color: neutral[600],
              }}
            >
              通过 MBTI 性格测试了解自己，获取 AI 领域的个性化职业推荐和学习路径
            </motion.p>

            {/* CTA 按钮 */}
            <motion.div
              variants={variants.heroTitle}
              initial="initial"
              animate="animate"
              transition={{ 
                delay: heroSequence.sequence.ctaButtons, 
                duration: durations.slow, 
                ease: easings.smooth 
              }}
              className="flex flex-wrap gap-4"
            >
              <Button
                as={Link}
                to="/mbti-test"
                size="lg"
                radius="full"
                className="text-white font-semibold px-8 py-6 text-base transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: primary[800] }}
              >
                开始测试 →
              </Button>
              <Button
                as={Link}
                to="/login"
                size="lg"
                radius="full"
                variant="bordered"
                className="font-semibold px-6 py-6"
                style={{ borderColor: neutral[300], color: neutral[700] }}
              >
                登录账户
              </Button>
            </motion.div>
          </motion.div>

          {/* 右侧：Lottie 动画区域 */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ 
              delay: 0.4, 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="relative hidden lg:block"
          >
            {/* Lottie 容器 - 圆角玻璃效果 */}
            <div 
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: '1/1',
                background: `linear-gradient(135deg, ${neutral[50]}80 0%, white 50%, ${primary[50]}40 100%)`,
                boxShadow: `0 25px 80px -20px ${primary[900]}15, 0 10px 40px -15px ${primary[800]}10`,
              }}
            >
              {/* Lottie 动画 */}
              <DotLottieReact
                src="/animations/hero.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
              
              {/* 装饰性浮动元素 */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: primary[700],
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                🎯 AI 职业规划
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 8, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{ 
                  duration: 3.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute bottom-6 left-6 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: primary[700],
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                🧠 MBTI 性格测试
              </motion.div>
            </div>
            
            {/* 装饰性圆形文字 - 移到左上角避免重叠 */}
            <div className="absolute -top-12 -left-12 w-24 h-24 opacity-15">
              <CircularText 
                text="AI LEARNING • FUTURE • " 
                radius={45}
                rotationDuration={20}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 滚动提示 */}
      <motion.div
        variants={variants.heroTitle}
        initial="initial"
        animate="animate"
        transition={{ 
          delay: heroSequence.sequence.ctaButtons + heroSequence.staggerDelay, 
          duration: durations.slow, 
          ease: easings.smooth 
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: neutral[400] }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full flex justify-center pt-1"
          style={{ border: `2px solid ${neutral[300]}` }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: neutral[400] }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// Quick Entry Section - 快速入口（提前出现）
// ============================================
function QuickEntrySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    { 
      id: 'mbti',
      title: 'MBTI 测试', 
      desc: '了解你的性格类型',
      icon: '🧠',
      link: '/mbti-test',
      color: 'white' as const
    },
    { 
      id: 'results',
      title: '结果分析', 
      desc: '深入分析性格特质',
      icon: '📊',
      link: '/results',
      color: 'white' as const
    },
    { 
      id: 'career',
      title: '职业推荐', 
      desc: '智能匹配职业方向',
      icon: '🎯',
      link: '/careers',
      color: 'white' as const
    },
    { 
      id: 'ai',
      title: 'AI 助手', 
      desc: '24/7 智能学习顾问',
      icon: '🤖',
      link: '/ai-advisor',
      color: 'white' as const
    },
  ]

  return (
    <section 
      ref={ref} 
      className="py-20 px-6 md:px-12 lg:px-20"
      style={{ background: `linear-gradient(180deg, ${neutral[50]} 0%, white 100%)` }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4"
            style={{ color: neutral[900] }}
          >
            快速开始
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: neutral[600] }}>
            选择你感兴趣的功能，开始探索你的 AI 职业方向
          </p>
        </motion.div>

        {/* Quick Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={feature.link}>
                <GlassCard 
                  variant="standard" 
                  color={feature.color}
                  className="h-full flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <motion.span 
                      className="text-4xl mb-4 block"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {feature.icon}
                    </motion.span>
                    <h3 className="text-xl font-bold mb-2" style={{ color: neutral[900] }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm" style={{ color: neutral[600] }}>
                      {feature.desc}
                    </p>
                  </div>
                  <motion.div 
                    className="mt-4 text-lg"
                    style={{ color: neutral[400] }}
                    whileHover={{ x: 4 }}
                  >
                    →
                  </motion.div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// Marquee Section - 文字跑马灯
// ============================================
function MarqueeSection() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <ParallaxMarquee 
        text="MBTI • AI LEARNING • CAREER PATH • PERSONALITY •" 
        baseVelocity={2}
        textClassName="text-stone-200"
      />
      <div className="h-2" />
      <ParallaxMarquee 
        text="DISCOVER • GROW • ACHIEVE • TRANSFORM •" 
        baseVelocity={-2}
        textClassName="text-stone-300"
      />
    </section>
  )
}

// ============================================
// Features Section - 系统特色介绍
// ============================================
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: '🧠',
      title: 'MBTI 性格测试',
      desc: '通过科学的性格测试，深入了解你的性格类型、优势和发展方向。',
    },
    {
      icon: '🤖',
      title: 'AI 智能分析',
      desc: '利用先进的 AI 技术，为你提供个性化的职业推荐和学习建议。',
    },
    {
      icon: '📊',
      title: '知识图谱可视化',
      desc: '直观展示 AI 领域的知识体系，帮助你规划完整的学习路径。',
    },
  ]

  return (
    <section 
      ref={ref} 
      className="py-24 px-6 md:px-12 lg:px-20"
      style={{ background: `linear-gradient(180deg, white 0%, ${neutral[50]} 100%)` }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ color: neutral[900] }}
          >
            系统特色
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: neutral[600] }}>
            三大核心功能，助力你的 AI 学习之路
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <motion.span 
                className="text-5xl mb-4 block"
                whileHover={{ scale: 1.2 }}
              >
                {feature.icon}
              </motion.span>
              <h3 className="text-2xl font-bold mb-3" style={{ color: neutral[900] }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: neutral[600] }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// Stats Section - 数据统计
// ============================================
function StatsSection() {
  const stats = [
    { value: '16', label: '性格类型', icon: '🎭' },
    { value: '100+', label: '优质课程', icon: '📖' },
    { value: '∞', label: '学习可能', icon: '🚀' },
    { value: '24/7', label: 'AI 助手', icon: '🤖' },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20 bg-white">
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
                style={{ color: neutral[900] }}
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
              >
                {stat.value}
              </motion.p>
              <p className="mt-2 font-medium" style={{ color: neutral[600] }}>{stat.label}</p>
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
    <section 
      ref={ref} 
      className="relative py-32 px-6 md:px-12 lg:px-20 text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${primary[800]} 0%, ${primary[900]} 50%, #0F172A 100%)` }}
    >
      {/* 背景装饰 */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: `${primary[500]}15` }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: `${primary[400]}10` }} />
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
          className="text-xl mb-12 max-w-2xl mx-auto"
          style={{ color: `${neutral[400]}` }}
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
            className="bg-white font-bold px-12 py-6 text-lg transition-all hover:scale-105"
            style={{ color: primary[800] }}
          >
            立即开始 →
          </Button>
          <Button
            as={Link}
            to="/ai-advisor"
            size="lg"
            radius="full"
            variant="bordered"
            className="font-bold px-10 py-6 text-lg text-white"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
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
    <footer className="py-16 px-6 md:px-12 lg:px-20 text-white" style={{ background: primary[900] }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black mb-4">EduProfile</h3>
            <p style={{ maxWidth: '400px', lineHeight: '1.8', color: neutral[400] }}>
              武汉商学院 AI 与大数据学院 职业规划系统。通过 MBTI 性格测试，发现最适合你的 AI 学习路径。
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">快速链接</h4>
            <ul className="space-y-2" style={{ color: neutral[400] }}>
              <li><Link to="/mbti-test" className="hover:text-white transition-colors">MBTI 测试</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">职业推荐</Link></li>
              <li><Link to="/learning-path" className="hover:text-white transition-colors">学习路径</Link></li>
              <li><Link to="/ai-advisor" className="hover:text-white transition-colors">AI 助手</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">联系我们</h4>
            <ul className="space-y-2" style={{ color: neutral[400] }}>
              <li>support@eduprofile.com</li>
              <li>GitHub</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
        
        <div 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid ${primary[800]}` }}
        >
          <p className="text-sm" style={{ color: neutral[500] }}>
            © 2025 EduProfile. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: neutral[500] }}>
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
      <QuickEntrySection />
      <MarqueeSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
