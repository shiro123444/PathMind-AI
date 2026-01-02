/**
 * AI Advisor Page - 专业液态玻璃设计
 * 
 * 特点：
 * - 与 Dashboard 统一的专业配色
 * - 液态玻璃效果
 * - Markdown 渲染 AI 输出
 * - 不跳转新页面，保持在 Dashboard 布局内
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { chatApi, type ChatMessage } from '../services/api'
import { GlassCard } from '../components/ui'
import { primary, neutral } from '../theme/colors'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAdvisor() {
  const studentId = localStorage.getItem('studentId') || undefined
  const studentName = localStorage.getItem('studentName') || '同学'
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好，**${studentName}**！👋 我是你的 AI 学习助手，由 DeepSeek 大模型驱动。

我可以帮助你：
- 📚 推荐适合你的课程和学习路径
- 💡 解答技术问题和学习困惑
- 🎯 制定个人职业发展计划
- 💬 讨论 AI 领域的最新发展

请告诉我你感兴趣的话题吧！`,
      timestamp: new Date(),
      suggestions: ['我对机器学习感兴趣', '根据我的性格推荐学习路径', '给我职业发展建议', '项目实战建议'],
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (studentId) {
        const result = await chatApi.getSuggestions(studentId)
        if (result.success && result.data) {
          setMessages(prev => {
            const updated = [...prev]
            if (updated[0]) updated[0].suggestions = result.data
            return updated
          })
        }
      }
    }
    fetchSuggestions()
  }, [studentId])

  const handleSendMessage = async (text?: string) => {
    const message = text || input
    if (!message.trim()) return

    setInput('')
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const newChatHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }]
    setChatHistory(newChatHistory)

    try {
      const result = await chatApi.send(newChatHistory, studentId)
      
      if (result.success && result.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.data.reply,
          timestamp: new Date(),
          suggestions: result.data.suggestions,
        }
        setMessages((prev) => [...prev, aiMessage])
        setChatHistory(prev => [...prev, { role: 'assistant', content: result.data!.reply }])
      } else {
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，AI 服务暂时不可用。请确保后端服务已启动。',
          timestamp: new Date(),
          suggestions: ['重试', '刷新页面'],
        }
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '连接 AI 服务失败，请检查网络连接和后端服务状态。',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: `好的，**${studentName}**！让我们开始新的对话。你想聊些什么？`,
      timestamp: new Date(),
      suggestions: ['我对机器学习感兴趣', '根据我的性格推荐学习路径', '给我职业发展建议', '项目实战建议'],
    }])
    setChatHistory([])
  }

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(135deg, ${neutral[50]} 0%, #F8FAFC 50%, ${primary[50]}40 100%)` }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <p className="text-sm mb-1 font-medium" style={{ color: primary[600] }}>智能助手</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: neutral[900] }}>
            AI 学习顾问
          </h1>
        </div>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
          style={{ 
            background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
            color: 'white',
          }}
        >
          + 新对话
        </button>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col min-h-0"
      >
        <GlassCard variant="standard" color="white" className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] md:max-w-2xl rounded-2xl px-5 py-4 ${
                      message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                    }`}
                    style={message.role === 'user' ? {
                      background: `linear-gradient(135deg, ${primary[700]} 0%, ${primary[800]} 100%)`,
                      color: 'white',
                    } : {
                      background: neutral[100],
                      color: neutral[800],
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">
                        {message.content}
                      </p>
                    )}
                    <p 
                      className="text-xs mt-2"
                      style={{ opacity: 0.5 }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {messages[messages.length - 1].suggestions?.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{ 
                      background: 'white',
                      border: `1px solid ${neutral[200]}`,
                      color: neutral[700],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = primary[300]
                      e.currentTarget.style.background = primary[50]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = neutral[200]
                      e.currentTarget.style.background = 'white'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Loading */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-start"
              >
                <div 
                  className="rounded-2xl rounded-tl-sm px-5 py-4"
                  style={{ background: neutral[100] }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: neutral[500] }}>AI 思考中</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i} 
                          className="w-2 h-2 rounded-full"
                          style={{ background: primary[400] }}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ 
                            duration: 0.6, 
                            repeat: Infinity, 
                            delay: i * 0.15,
                            ease: 'easeInOut'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div 
            className="p-4 md:p-6"
            style={{ borderTop: `1px solid ${neutral[200]}` }}
          >
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入你的问题..."
                className="flex-1 px-5 py-3 rounded-xl text-sm transition-all"
                style={{ 
                  background: neutral[50],
                  border: `1px solid ${neutral[200]}`,
                  color: neutral[800],
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary[400]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = neutral[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 md:px-8 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
                  color: 'white',
                }}
              >
                发送
              </button>
            </form>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
