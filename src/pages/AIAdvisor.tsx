import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  const studentId = localStorage.getItem('studentId') || undefined
  const studentName = localStorage.getItem('studentName') || '同学'
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好，${studentName}！👋 我是你的 AI 学习助手，由 DeepSeek 大模型驱动。\n\n我可以帮助你：\n• 📚 推荐适合你的课程和学习路径\n• 💡 解答技术问题和学习困惑\n• 🎯 制定个人职业发展计划\n• 💬 讨论 AI 领域的最新发展\n\n请告诉我你感兴趣的话题吧！`,
      timestamp: new Date(),
      suggestions: ['我对机器学习感兴趣', '根据我的性格推荐学习路径', '给我职业发展建议', '项目实战建议'],
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
          suggestions: ['重试', '查看知识图谱', '刷新页面'],
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
      content: `好的，${studentName}！让我们开始新的对话。你想聊些什么？`,
      timestamp: new Date(),
      suggestions: ['我对机器学习感兴趣', '根据我的性格推荐学习路径', '给我职业发展建议', '项目实战建议'],
    }])
    setChatHistory([])
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="text-xl font-black text-gray-900">AI Path</Link>
        </div>
        
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> 新对话
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">快捷功能</p>
          <div className="space-y-2">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                showGraph ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📊 知识图谱
            </button>
            <Link to="/learning-path" className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700">
              📚 学习路径
            </Link>
            <Link to="/careers" className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700">
              🎯 职业推荐
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link to="/dashboard" className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 text-center">
            ← 返回仪表盘
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${showGraph ? 'w-1/2' : 'w-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">🤖 AI 学习助手</h1>
            <p className="text-sm text-gray-500 hidden sm:block">由 DeepSeek 大模型驱动</p>
          </div>
          <div className="flex gap-2 md:hidden">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`p-2 rounded-lg ${showGraph ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}
            >
              📊
            </button>
            <button onClick={handleNewChat} className="p-2 rounded-lg bg-gray-100">
              +
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
                <div className={`max-w-[85%] md:max-w-xl ${
                  message.role === 'user'
                    ? 'bg-black text-white rounded-3xl rounded-tr-lg'
                    : 'bg-gray-100 text-gray-900 rounded-3xl rounded-tl-lg'
                } px-5 py-4`}>
                  <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1].suggestions && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2"
            >
              {messages[messages.length - 1].suggestions?.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}

          {/* Loading */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-gray-100 rounded-3xl rounded-tl-lg px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">AI 思考中</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-white">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 md:px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </form>
        </div>
      </div>

      {/* Knowledge Graph Panel */}
      {showGraph && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '50%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full border-l border-gray-200 bg-gray-50 hidden md:block"
        >
          <div className="h-full p-4">
            <KnowledgeGraph studentId={studentId} mode={studentId ? 'student' : 'full'} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
