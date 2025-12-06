import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatApi, type ChatMessage } from '../services/api'
import KnowledgeGraph from '../components/KnowledgeGraph'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAdvisor() {
  // 从 localStorage 获取学生 ID
  const studentId = localStorage.getItem('studentId') || undefined
  const studentName = localStorage.getItem('studentName') || '同学'
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好，${studentName}！👋 我是你的 AI 学习助手，由 DeepSeek 大模型驱动。\n\n我可以帮助你：\n• 📚 推荐适合你的课程和学习路径\n• 💡 解答技术问题和学习困惑\n• 🎯 制定个人职业发展计划\n• 💬 讨论 AI 领域的最新发展\n\n请告诉我你感兴趣的话题吧！`,
      timestamp: new Date(),
      suggestions: [
        '我对机器学习感兴趣',
        '根据我的性格推荐学习路径',
        '给我职业发展建议',
        '项目实战建议',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 获取个性化建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (studentId) {
        const result = await chatApi.getSuggestions(studentId)
        if (result.success && result.data) {
          setMessages(prev => {
            const updated = [...prev]
            if (updated[0]) {
              updated[0].suggestions = result.data
            }
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

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // 更新对话历史
    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: message }
    ]
    setChatHistory(newChatHistory)

    try {
      // 调用真实的 DeepSeek API
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
        
        // 更新对话历史
        setChatHistory(prev => [
          ...prev,
          { role: 'assistant', content: result.data!.reply }
        ])
      } else {
        // API 调用失败，使用本地回复
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，AI 服务暂时不可用。请确保后端服务已启动。\n\n你可以尝试重新提问，或者查看知识图谱了解相关信息。',
          timestamp: new Date(),
          suggestions: ['重试', '查看知识图谱', '刷新页面'],
        }
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } catch (error) {
      console.error('发送消息失败:', error)
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
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `好的，${studentName}！让我们开始新的对话。你想聊些什么？`,
        timestamp: new Date(),
        suggestions: [
          '我对机器学习感兴趣',
          '根据我的性格推荐学习路径',
          '给我职业发展建议',
          '项目实战建议',
        ],
      },
    ])
    setChatHistory([])
  }

  return (
    <div className="w-full h-screen flex bg-white">
      {/* 左侧对话区域 */}
      <div className={`flex-1 flex flex-col ${showGraph ? 'w-1/2' : 'w-full'}`}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🤖 AI 学习助手</h1>
            <p className="text-sm text-gray-600">
              由 DeepSeek 大模型驱动 · 24/7 为你提供个性化学习建议
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`px-4 py-2 rounded-full transition-colors font-medium ${
                showGraph
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              📊 知识图谱
            </button>
            <button
              onClick={handleNewChat}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
            >
              新对话
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl ${
                    message.role === 'user'
                      ? 'bg-black text-white rounded-3xl rounded-tr-lg'
                      : 'bg-gray-100 text-gray-900 rounded-3xl rounded-tl-lg'
                  } px-6 py-4`}
                >
                  <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 建议按钮 */}
          {messages.length > 0 && messages[messages.length - 1].suggestions && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {messages[messages.length - 1].suggestions?.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full text-sm font-medium transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 rounded-3xl rounded-tl-lg px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2">AI 思考中</span>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题或选择建议..."
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </form>
        </div>
      </div>

      {/* 右侧知识图谱面板 */}
      {showGraph && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '50%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full border-l border-gray-200 bg-gray-50"
        >
          <div className="h-full p-4">
            <KnowledgeGraph
              studentId={studentId}
              mode={studentId ? 'student' : 'full'}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
