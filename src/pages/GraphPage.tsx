import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KnowledgeGraph from '../components/KnowledgeGraph'
import { useNavigate } from 'react-router-dom'

type GraphMode = 'full' | 'student' | 'career'

interface GraphNode {
  id: string
  name: string
  type: string
  description?: string
  color?: string
}

export default function GraphPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<GraphMode>('full')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  
  // 从 localStorage 获取学生信息
  const studentId = localStorage.getItem('studentId') || undefined
  const studentName = localStorage.getItem('studentName') || '同学'
  const mbtiCode = localStorage.getItem('mbtiCode')

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node)
  }

  const handleNodeAction = () => {
    if (!selectedNode) return
    
    switch (selectedNode.type) {
      case 'career':
        navigate(`/career?id=${selectedNode.id}`)
        break
      case 'course':
        break
      case 'mbti':
        navigate(`/results?type=${selectedNode.id.replace('mbti-', '').toUpperCase()}`)
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* 全屏知识图谱 - 作为背景 */}
      <div className="absolute inset-0">
        <KnowledgeGraph
          mode={mode}
          studentId={studentId}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* 顶部控制栏 - 浮动 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200">
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="返回首页"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900">📊 知识图谱</h1>
          <div className="w-px h-6 bg-gray-300" />
          <button
            onClick={() => setMode('full')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === 'full'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🌐 完整图谱
          </button>
          {studentId && (
            <button
              onClick={() => setMode('student')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                mode === 'student'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👤 我的画像
            </button>
          )}
        </div>
      </div>

      {/* 左下角状态 */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 text-sm">
          {studentId ? (
            <>
              <span className="text-gray-600">👤 {studentName}</span>
              {mbtiCode && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium text-xs">{mbtiCode}</span>}
            </>
          ) : (
            <span className="text-gray-500">完成 MBTI 测试查看个人画像</span>
          )}
        </div>
      </div>

      {/* 侧边栏 - 节点详情 */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-6 overflow-y-auto z-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">节点详情</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 节点图标和名称 */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
                  style={{ backgroundColor: selectedNode.color || '#6b7280' }}
                >
                  {selectedNode.type === 'mbti' && '🧠'}
                  {selectedNode.type === 'career' && '💼'}
                  {selectedNode.type === 'skill' && '⚡'}
                  {selectedNode.type === 'course' && '📚'}
                  {selectedNode.type === 'student' && '👤'}
                  {selectedNode.type === 'learning_path' && '🛤️'}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{selectedNode.name}</p>
                  <p className="text-gray-500 text-sm">
                    {selectedNode.type === 'mbti' && 'MBTI 性格类型'}
                    {selectedNode.type === 'career' && '职业方向'}
                    {selectedNode.type === 'skill' && '技能'}
                    {selectedNode.type === 'course' && '课程'}
                    {selectedNode.type === 'student' && '学生'}
                    {selectedNode.type === 'learning_path' && '学习路径'}
                  </p>
                </div>
              </div>

              {selectedNode.description && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">描述</span>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{selectedNode.description}</p>
                </div>
              )}

              {/* 操作按钮 */}
              {(selectedNode.type === 'career' || selectedNode.type === 'mbti') && (
                <button
                  onClick={handleNodeAction}
                  className="w-full px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-lg"
                >
                  查看详情 →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
