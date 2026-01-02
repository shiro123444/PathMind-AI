/**
 * Graph Page - 专业液态玻璃设计
 * 
 * 特点：
 * - 与 Dashboard 统一的专业配色
 * - 液态玻璃效果
 * - 嵌入式设计，不跳转新页面
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KnowledgeGraph from '../components/KnowledgeGraph'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/ui'
import { primary, neutral } from '../theme/colors'

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
        navigate(`/careers?id=${selectedNode.id}`)
        break
      case 'mbti':
        navigate(`/results?type=${selectedNode.id.replace('mbti-', '').toUpperCase()}`)
        break
      default:
        break
    }
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
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
      >
        <div>
          <p className="text-sm mb-1 font-medium" style={{ color: primary[600] }}>可视化</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: neutral[900] }}>
            知识图谱
          </h1>
        </div>
        
        {/* Mode Switcher */}
        <div 
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: neutral[100] }}
        >
          <button
            onClick={() => setMode('full')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={mode === 'full' ? {
              background: 'white',
              color: neutral[900],
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            } : {
              background: 'transparent',
              color: neutral[500],
            }}
          >
            🌐 完整图谱
          </button>
          {studentId && (
            <button
              onClick={() => setMode('student')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={mode === 'student' ? {
                background: 'white',
                color: neutral[900],
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              } : {
                background: 'transparent',
                color: neutral[500],
              }}
            >
              👤 我的画像
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Graph Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 ${selectedNode ? 'hidden md:block' : ''}`}
        >
          <GlassCard variant="standard" color="white" className="h-full p-0 overflow-hidden">
            <div className="h-full relative">
              <KnowledgeGraph
                mode={mode}
                studentId={studentId}
                onNodeClick={handleNodeClick}
              />
              
              {/* Status Badge */}
              <div 
                className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${neutral[200]}`,
                }}
              >
                {studentId ? (
                  <>
                    <span style={{ color: neutral[600] }}>👤 {studentName}</span>
                    {mbtiCode && (
                      <span 
                        className="px-2 py-0.5 rounded-full font-medium text-xs"
                        style={{ background: primary[100], color: primary[700] }}
                      >
                        {mbtiCode}
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ color: neutral[500] }}>完成 MBTI 测试查看个人画像</span>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Node Detail Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full md:w-80 flex-shrink-0"
            >
              <GlassCard variant="standard" color="white" className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold" style={{ color: neutral[900] }}>节点详情</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    style={{ background: neutral[100], color: neutral[500] }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = neutral[200]
                      e.currentTarget.style.color = neutral[700]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = neutral[100]
                      e.currentTarget.style.color = neutral[500]
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Node Icon and Name */}
                  <div 
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: neutral[50] }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
                      style={{ backgroundColor: selectedNode.color || primary[500] }}
                    >
                      {selectedNode.type === 'mbti' && '🧠'}
                      {selectedNode.type === 'career' && '💼'}
                      {selectedNode.type === 'skill' && '⚡'}
                      {selectedNode.type === 'course' && '📚'}
                      {selectedNode.type === 'student' && '👤'}
                      {selectedNode.type === 'learning_path' && '🛤️'}
                    </div>
                    <div>
                      <p className="font-semibold text-lg" style={{ color: neutral[900] }}>{selectedNode.name}</p>
                      <p className="text-sm" style={{ color: neutral[500] }}>
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
                    <div 
                      className="p-4 rounded-xl"
                      style={{ background: neutral[50] }}
                    >
                      <span 
                        className="text-xs uppercase tracking-wider"
                        style={{ color: neutral[400] }}
                      >
                        描述
                      </span>
                      <p 
                        className="text-sm mt-2 leading-relaxed"
                        style={{ color: neutral[600] }}
                      >
                        {selectedNode.description}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {(selectedNode.type === 'career' || selectedNode.type === 'mbti') && (
                    <button
                      onClick={handleNodeAction}
                      className="w-full px-4 py-3 rounded-xl font-medium transition-all"
                      style={{ 
                        background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
                        color: 'white',
                      }}
                    >
                      查看详情 →
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
