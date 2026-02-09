import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Divider } from '@heroui/react'
import { primary } from '../theme/colors'
import { GraduationCap, Brain, Map, School, Globe, Lightbulb, AlertTriangle } from 'lucide-react'

// OAuth Icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// 校内 VPN 图标
const VPNIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

// 学号图标
const StudentIDIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
  </svg>
)

type LoginChannel = 'campus' | 'external'

export default function LoginPage() {
  const navigate = useNavigate()
  const [channel, setChannel] = useState<LoginChannel>('campus')
  const [studentId, setStudentId] = useState('')
  const [studentIdError, setStudentIdError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 校内学号验证
  const validateStudentId = (value: string) => {
    if (!value) {
      setStudentIdError('请输入学号')
      return false
    }
    // 学号格式：一般为 U/D/M + 年份 + 序号，共 10-12 位
    if (!/^[UDMudm]?\d{8,12}$/.test(value)) {
      setStudentIdError('请输入有效的学号（如 U202112345）')
      return false
    }
    setStudentIdError('')
    return true
  }

  // 统一身份认证登录（学号）
  const handleCampusLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStudentId(studentId)) return

    setIsLoading(true)
    try {
      // TODO: 对接统一身份认证平台 API
      // const res = await authApi.campusLogin(studentId)
      // 自动拉取学生信息（姓名、院系、年级等）
      await new Promise((resolve) => setTimeout(resolve, 1500))
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  // VPN 认证跳转
  const handleVPNAuth = () => {
    // TODO: 跳转到校内 VPN/CAS 统一认证页面
    // window.location.href = 'https://cas.hust.edu.cn/cas/login?service=...'
    console.log('Redirect to campus VPN/CAS auth')
    navigate('/dashboard')
  }

  // 校外 OAuth
  const handleOAuth = (provider: string) => {
    // TODO: 对接 OAuth 流程
    console.log(`OAuth with ${provider}`)
    navigate('/dashboard')
  }

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  }

  const channelTabStyle = (active: boolean) => ({
    background: active ? primary[600] : 'rgba(255, 255, 255, 0.5)',
    color: active ? '#fff' : 'var(--text-secondary)',
    backdropFilter: active ? 'none' : 'blur(10px)',
    border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  })

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-bg-primary">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, ${primary[200]}40, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${primary[100]}50, transparent 70%)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: `radial-gradient(circle, ${primary[50]}30, transparent 60%)` }}
        />
        {/* 网格 */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--text-primary)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 左侧品牌区 */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="relative z-10 max-w-lg"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
              style={{ background: `linear-gradient(135deg, ${primary[600]}, ${primary[400]})` }}
            >
              P
            </div>
            <span className="text-xl font-black text-text-primary">
              PathMind
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-text-primary">
            智能学业
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${primary[600]}, ${primary[400]})` }}
            >
              画像平台
            </span>
          </h1>

          <p className="text-lg mb-12 text-text-muted">
            基于 MBTI 性格分析与知识图谱，为每位同学构建个性化的 AI 学习路径与职业规划
          </p>

          {/* 信息卡片 */}
          <div className="space-y-4">
            {[
              { icon: GraduationCap, title: '统一身份认证', desc: '校内学生一键登录，自动同步学籍信息' },
              { icon: Brain, title: '智能画像分析', desc: '多维度能力评估，精准匹配发展方向' },
              { icon: Map, title: '知识图谱导航', desc: '可视化学习路径，按需推荐课程资源' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={glassStyle}
              >
                <item.icon className="w-6 h-6 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-bold text-sm text-text-primary">{item.title}</p>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 右侧登录区 */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          className="w-full max-w-md"
        >
          {/* 玻璃登录卡 */}
          <div className="rounded-3xl p-8 sm:p-10" style={glassStyle}>
            {/* 移动端 Logo */}
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ background: `linear-gradient(135deg, ${primary[600]}, ${primary[400]})` }}
              >
                P
              </div>
              <span className="text-lg font-black text-text-primary">PathMind</span>
            </Link>

            <h2 className="text-2xl font-bold mb-1 text-text-primary">
              登录平台
            </h2>
            <p className="text-sm mb-8 text-text-muted">
              选择你的身份以继续
            </p>

            {/* 通道切换 Tabs */}
            <div className="flex gap-2 mb-8 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.04)' }}>
              <button
                onClick={() => setChannel('campus')}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer"
                style={channelTabStyle(channel === 'campus')}
              >
                <School className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} />校内学生
              </button>
              <button
                onClick={() => setChannel('external')}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer"
                style={channelTabStyle(channel === 'external')}
              >
                <Globe className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} />校外用户
              </button>
            </div>

            <AnimatePresence mode="wait">
              {channel === 'campus' ? (
                /* ========== 校内通道 ========== */
                <motion.div
                  key="campus"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* VPN / CAS 认证 */}
                  <Button
                    fullWidth
                    size="lg"
                    className="font-semibold h-12 mb-3 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${primary[600]}, ${primary[500]})`,
                    }}
                    startContent={<VPNIcon />}
                    onPress={handleVPNAuth}
                  >
                    校园网 / VPN 统一认证
                  </Button>

                  <p className="text-center text-xs mb-4 text-text-muted">
                    需连接校园网或 VPN，跳转至学校 CAS 统一认证
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <Divider className="flex-1" />
                    <span className="text-xs text-text-muted">
                      或使用学号登录
                    </span>
                    <Divider className="flex-1" />
                  </div>

                  {/* 学号登录 */}
                  <form onSubmit={handleCampusLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-secondary">
                        学号
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                          <StudentIDIcon />
                        </div>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => {
                            setStudentId(e.target.value)
                            if (studentIdError) validateStudentId(e.target.value)
                          }}
                          placeholder="U202112345"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                          style={{
                            borderColor: studentIdError ? '#ef4444' : 'rgba(0,0,0,0.08)',
                            background: 'rgba(255,255,255,0.6)',
                          }}
                          onFocus={(e) => {
                            if (!studentIdError) e.target.style.borderColor = primary[400]
                          }}
                          onBlur={(e) => {
                            if (!studentIdError) e.target.style.borderColor = 'rgba(0,0,0,0.08)'
                          }}
                        />
                      </div>
                      {studentIdError && (
                        <p className="text-red-500 text-xs mt-1.5">{studentIdError}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      isLoading={isLoading}
                      variant="bordered"
                      className="font-semibold h-12 border-2"
                      style={{
                        borderColor: primary[200],
                        color: primary[700],
                        background: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {isLoading ? '认证中...' : '学号登录'}
                    </Button>
                  </form>

                  <div
                    className="mt-4 p-3 rounded-xl text-xs"
                    style={{ background: `${primary[50]}80`, color: primary[700] }}
                  >
                    <Lightbulb className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} />登录后将自动同步你的学籍信息（姓名、院系、年级），无需手动填写
                  </div>
                </motion.div>
              ) : (
                /* ========== 校外通道 ========== */
                <motion.div
                  key="external"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm mb-5 text-text-muted">
                    校外同学或访客可使用第三方账号登录
                  </p>

                  <div className="space-y-3">
                    <Button
                      fullWidth
                      size="lg"
                      variant="bordered"
                      className="font-semibold h-12 transition-colors"
                      style={{
                        borderColor: 'rgba(0,0,0,0.08)',
                        borderWidth: 2,
                        background: 'rgba(255,255,255,0.5)',
                        color: 'var(--text-primary)',
                      }}
                      startContent={<GoogleIcon />}
                      onPress={() => handleOAuth('google')}
                    >
                      使用 Google 登录
                    </Button>

                    <Button
                      fullWidth
                      size="lg"
                      variant="bordered"
                      className="font-semibold h-12 transition-colors"
                      style={{
                        borderColor: 'rgba(0,0,0,0.08)',
                        borderWidth: 2,
                        background: 'rgba(255,255,255,0.5)',
                        color: 'var(--text-primary)',
                      }}
                      startContent={<GithubIcon />}
                      onPress={() => handleOAuth('github')}
                    >
                      使用 GitHub 登录
                    </Button>
                  </div>

                  <div
                    className="mt-6 p-3 rounded-xl text-xs text-text-muted"
                    style={{ background: 'rgba(0,0,0,0.03)' }}
                  >
                    <AlertTriangle className="w-4 h-4 inline-block mr-1 align-text-bottom" strokeWidth={1.5} />校外账号部分功能受限（如学籍同步、课程推荐等），建议校内学生使用统一认证登录
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 底部链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              首次使用？
              <Link
                to="/mbti-test"
                className="font-semibold ml-1 hover:underline"
                style={{ color: primary[600] }}
              >
                先做一次性格测试 →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
