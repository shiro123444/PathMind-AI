/**
 * 题目管理页面
 */

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { primary } from '../../theme/colors'
import type { Question, QuestionType, MBTIDimension, MBTIValue, BinaryQuestion } from '../../types/mbti'
import { deepTestQuestions } from '../../data/questions'

// 题目类型标签
const questionTypeLabels: Record<QuestionType, string> = {
  binary: '二选一',
  scale: '量表',
  scenario: '情景',
  ranking: '排序',
}

// 维度标签
const dimensionLabels: Record<MBTIDimension, string> = {
  EI: 'E/I 外向/内向',
  SN: 'S/N 感觉/直觉',
  TF: 'T/F 思考/情感',
  JP: 'J/P 判断/感知',
}

// CSV 解析结果类型
interface ParsedQuestion {
  text: string
  type: QuestionType
  dimension: MBTIDimension
  category: string
  optionA: string
  optionB: string
  valid: boolean
  error?: string
}

// 批量导入模态框
function BatchImportModal({
  onImport,
  onCancel,
}: {
  onImport: (questions: Question[]) => void
  onCancel: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([])
  const [fileName, setFileName] = useState('')
  const [parseError, setParseError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 解析 CSV 内容
  const parseCSV = useCallback((content: string) => {
    const lines = content.trim().split('\n')
    if (lines.length < 2) {
      setParseError('CSV 文件至少需要包含表头和一行数据')
      return
    }

    // 解析表头
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['text', 'type', 'dimension', 'category', 'optiona', 'optionb']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      setParseError(`缺少必要列: ${missingHeaders.join(', ')}`)
      return
    }

    const textIdx = headers.indexOf('text')
    const typeIdx = headers.indexOf('type')
    const dimensionIdx = headers.indexOf('dimension')
    const categoryIdx = headers.indexOf('category')
    const optionAIdx = headers.indexOf('optiona')
    const optionBIdx = headers.indexOf('optionb')

    const validTypes: QuestionType[] = ['binary', 'scale', 'scenario', 'ranking']
    const validDimensions: MBTIDimension[] = ['EI', 'SN', 'TF', 'JP']

    const parsed: ParsedQuestion[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // 简单 CSV 解析（处理引号内的逗号）
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const text = values[textIdx] || ''
      const type = values[typeIdx] as QuestionType
      const dimension = values[dimensionIdx] as MBTIDimension
      const category = values[categoryIdx] || 'standard'
      const optionA = values[optionAIdx] || ''
      const optionB = values[optionBIdx] || ''

      let valid = true
      let error = ''

      if (!text) {
        valid = false
        error = '题目内容不能为空'
      } else if (!validTypes.includes(type)) {
        valid = false
        error = `无效的题目类型: ${type}`
      } else if (!validDimensions.includes(dimension)) {
        valid = false
        error = `无效的维度: ${dimension}`
      } else if (type === 'binary' && (!optionA || !optionB)) {
        valid = false
        error = '二选一题型需要两个选项'
      }

      parsed.push({ text, type, dimension, category, optionA, optionB, valid, error })
    }

    setParsedQuestions(parsed)
    setParseError('')
  }, [])

  // 处理文件选择
  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setParseError('请上传 CSV 格式文件')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      parseCSV(content)
    }
    reader.onerror = () => {
      setParseError('文件读取失败')
    }
    reader.readAsText(file)
  }, [parseCSV])

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  // 确认导入
  const handleConfirmImport = () => {
    const validQuestions = parsedQuestions.filter(q => q.valid)
    const dimensionValues: Record<MBTIDimension, [MBTIValue, MBTIValue]> = {
      EI: ['E', 'I'],
      SN: ['S', 'N'],
      TF: ['T', 'F'],
      JP: ['J', 'P'],
    }

    const newQuestions: Question[] = validQuestions.map((q, idx) => {
      const [leftVal, rightVal] = dimensionValues[q.dimension]
      return {
        id: `import_${Date.now()}_${idx}`,
        type: 'binary',
        text: q.text,
        dimension: q.dimension,
        category: q.category,
        options: [
          { text: q.optionA, value: leftVal },
          { text: q.optionB, value: rightVal },
        ],
      } as BinaryQuestion
    })

    onImport(newQuestions)
  }

  const validCount = parsedQuestions.filter(q => q.valid).length
  const invalidCount = parsedQuestions.filter(q => !q.valid).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl flex flex-col"
        style={{
          background: 'white',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="p-6 border-b border-border-primary">
          <h2 className="text-xl font-bold text-text-primary">
            批量导入题目
          </h2>
          <p className="text-sm mt-1 text-text-muted">
            上传 CSV 文件批量导入题目，需包含: text, type, dimension, category, optionA, optionB
          </p>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto p-6">
          {/* 文件上传区 */}
          {parsedQuestions.length === 0 && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-primary-500 bg-primary-50' : ''
              }`}
              style={{ borderColor: isDragging ? primary[500] : 'var(--border-primary)' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
              <svg
                className="w-12 h-12 mx-auto mb-4 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="font-medium text-text-secondary">
                拖拽 CSV 文件到此处，或点击选择文件
              </p>
              <p className="text-sm mt-2 text-text-muted">
                支持 .csv 格式
              </p>
            </div>
          )}

          {/* 错误提示 */}
          {parseError && (
            <div
              className="p-4 rounded-xl mb-4"
              style={{ background: '#FEF2F2', color: '#DC2626' }}
            >
              {parseError}
            </div>
          )}

          {/* 预览列表 */}
          {parsedQuestions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-medium text-text-secondary">
                    {fileName}
                  </span>
                  <span className="text-sm ml-3 text-text-muted">
                    共 {parsedQuestions.length} 条，有效 {validCount} 条
                    {invalidCount > 0 && (
                      <span style={{ color: '#DC2626' }}>，无效 {invalidCount} 条</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setParsedQuestions([])
                    setFileName('')
                  }}
                  className="text-sm px-3 py-1 rounded-lg text-text-secondary bg-bg-tertiary"
                >
                  重新选择
                </button>
              </div>

              <div
                className="rounded-xl overflow-hidden border border-border-primary"
              >
                <div
                  className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium bg-bg-primary text-text-secondary"
                >
                  <div className="col-span-1">状态</div>
                  <div className="col-span-5">题目</div>
                  <div className="col-span-2">类型</div>
                  <div className="col-span-2">维度</div>
                  <div className="col-span-2">选项</div>
                </div>
                <div className="max-h-60 overflow-auto">
                  {parsedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 px-4 py-2 text-sm items-center"
                      style={{
                        borderTop: '1px solid var(--border-primary)',
                        background: q.valid ? 'white' : '#FEF2F2',
                      }}
                    >
                      <div className="col-span-1">
                        {q.valid ? (
                          <span style={{ color: '#10B981' }}>✓</span>
                        ) : (
                          <span
                            style={{ color: '#DC2626' }}
                            title={q.error}
                          >
                            ✗
                          </span>
                        )}
                      </div>
                      <div
                        className="col-span-5 truncate text-text-primary"
                        title={q.text}
                      >
                        {q.text || '-'}
                      </div>
                      <div className="col-span-2 text-text-secondary">
                        {questionTypeLabels[q.type] || q.type}
                      </div>
                      <div className="col-span-2 text-text-secondary">
                        {q.dimension}
                      </div>
                      <div
                        className="col-span-2 truncate text-xs text-text-muted"
                        title={`${q.optionA} / ${q.optionB}`}
                      >
                        {q.optionA ? `${q.optionA.slice(0, 8)}...` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div
          className="p-6 border-t flex gap-3 border-border-primary"
        >
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-medium transition-colors bg-bg-tertiary text-text-secondary"
          >
            取消
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={validCount === 0}
            className="flex-1 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
            }}
          >
            导入 {validCount} 条题目
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 题目编辑器组件
function QuestionEditor({ 
  question, 
  onSave, 
  onCancel 
}: { 
  question?: Question
  onSave: (q: Partial<Question>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    type: question?.type || 'binary' as QuestionType,
    dimension: question?.dimension || 'EI' as MBTIDimension,
    category: question?.category || 'standard',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg p-6 rounded-2xl"
        style={{
          background: 'white',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6 text-text-primary">
          {question ? '编辑题目' : '新建题目'}
        </h2>

        <div className="space-y-4">
          {/* 题目内容 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              题目内容
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none border-border-primary text-text-primary"
              placeholder="请输入题目内容..."
            />
          </div>

          {/* 题目类型 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              题目类型
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
            >
              {Object.entries(questionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* 维度 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              MBTI 维度
            </label>
            <select
              value={formData.dimension}
              onChange={(e) => setFormData({ ...formData, dimension: e.target.value as MBTIDimension })}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
            >
              {Object.entries(dimensionLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* 测试类型 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              所属测试
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
            >
              <option value="quick">快速测试</option>
              <option value="standard">标准测试</option>
              <option value="deep">深度分析</option>
            </select>
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-medium transition-colors bg-bg-tertiary text-text-secondary"
          >
            取消
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 rounded-xl font-medium text-white transition-colors"
            style={{ 
              background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
            }}
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>(deepTestQuestions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all')
  const [filterDimension, setFilterDimension] = useState<MBTIDimension | 'all'>('all')
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 过滤题目
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'all' || q.type === filterType
      const matchesDimension = filterDimension === 'all' || q.dimension === filterDimension
      return matchesSearch && matchesType && matchesDimension
    })
  }, [questions, searchQuery, filterType, filterDimension])

  // 分页
  const totalPages = Math.ceil(filteredQuestions.length / pageSize)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 保存题目
  const handleSave = (data: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? { ...editingQuestion, ...data } as Question : q
      ))
    } else {
      const newQuestion: BinaryQuestion = {
        id: `q${Date.now()}`,
        type: 'binary',
        text: data.text || '',
        dimension: (data.dimension || 'EI') as MBTIDimension,
        category: data.category || 'standard',
        options: [
          { text: '选项 A', value: 'E' },
          { text: '选项 B', value: 'I' },
        ],
      }
      setQuestions(prev => [...prev, newQuestion])
    }
    setEditingQuestion(null)
    setIsCreating(false)
  }

  // 删除题目
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这道题目吗？')) {
      setQuestions(prev => prev.filter(q => q.id !== id))
    }
  }

  // 批量导入
  const handleBatchImport = (newQuestions: Question[]) => {
    setQuestions(prev => [...prev, ...newQuestions])
    setIsImporting(false)
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-text-primary">
          题目管理
        </h1>
        <p className="text-text-secondary">
          管理 MBTI 测试题库，共 {questions.length} 道题目
        </p>
      </motion.div>

      {/* 工具栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        {/* 搜索 */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索题目..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
              style={{ 
                background: 'rgba(255,255,255,0.8)',
              }}
            />
          </div>
        </div>

        {/* 类型筛选 */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as QuestionType | 'all')}
          className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
          style={{ 
            background: 'rgba(255,255,255,0.8)',
          }}
        >
          <option value="all">全部类型</option>
          {Object.entries(questionTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* 维度筛选 */}
        <select
          value={filterDimension}
          onChange={(e) => setFilterDimension(e.target.value as MBTIDimension | 'all')}
          className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all border-border-primary text-text-primary"
          style={{ 
            background: 'rgba(255,255,255,0.8)',
          }}
        >
          <option value="all">全部维度</option>
          {Object.entries(dimensionLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* 批量导入按钮 */}
        <button
          onClick={() => setIsImporting(true)}
          className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
          style={{ 
            background: 'rgba(255,255,255,0.8)',
            color: primary[700],
            border: `1px solid ${primary[300]}`,
          }}
        >
          ↑ 批量导入
        </button>

        {/* 新建按钮 */}
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
          style={{ 
            background: `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`,
          }}
        >
          + 新建题目
        </button>
      </motion.div>

      {/* 题目列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden border border-border-primary"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* 表头 */}
        <div 
          className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium bg-bg-primary text-text-secondary border-b border-border-primary"
        >
          <div className="col-span-1">ID</div>
          <div className="col-span-5">题目内容</div>
          <div className="col-span-2">类型</div>
          <div className="col-span-2">维度</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        {/* 题目行 */}
        {paginatedQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-bg-hover transition-colors border-b border-border-primary"
          >
            <div className="col-span-1 text-sm font-mono text-text-muted">
              {question.id.slice(0, 6)}
            </div>
            <div className="col-span-5 truncate text-text-primary">
              {question.text}
            </div>
            <div className="col-span-2">
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: `${primary[500]}15`,
                  color: primary[700],
                }}
              >
                {questionTypeLabels[question.type]}
              </span>
            </div>
            <div className="col-span-2">
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium bg-bg-tertiary text-text-secondary"
              >
                {question.dimension}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingQuestion(question)}
                className="p-2 rounded-lg transition-colors hover:bg-bg-hover text-text-muted"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(question.id)}
                className="p-2 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: '#EF4444' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {/* 空状态 */}
        {paginatedQuestions.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            没有找到匹配的题目
          </div>
        )}
      </motion.div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-text-secondary"
            style={{ 
              background: 'rgba(255,255,255,0.8)',
            }}
          >
            上一页
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10 rounded-lg font-medium transition-colors"
                style={{ 
                  background: page === currentPage 
                    ? `linear-gradient(135deg, ${primary[600]} 0%, ${primary[800]} 100%)`
                    : 'rgba(255,255,255,0.8)',
                  color: page === currentPage ? 'white' : 'var(--text-secondary)',
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-text-secondary"
            style={{ 
              background: 'rgba(255,255,255,0.8)',
            }}
          >
            下一页
          </button>
        </div>
      )}

      {/* 编辑器弹窗 */}
      <AnimatePresence>
        {(editingQuestion || isCreating) && (
          <QuestionEditor
            question={editingQuestion || undefined}
            onSave={handleSave}
            onCancel={() => {
              setEditingQuestion(null)
              setIsCreating(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* 批量导入弹窗 */}
      <AnimatePresence>
        {isImporting && (
          <BatchImportModal
            onImport={handleBatchImport}
            onCancel={() => setIsImporting(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
