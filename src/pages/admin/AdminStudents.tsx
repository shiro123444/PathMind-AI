/**
 * 学生数据分析页面
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { neutral, primary } from '../../theme/colors'

// 模拟学生数据
const mockStudents = [
  { id: '1', name: '张三', mbtiCode: 'INTJ', completedAt: '2025-01-03 14:30', testType: '标准测试', dimensions: { E: 25, I: 75, S: 30, N: 70, T: 80, F: 20, J: 65, P: 35 } },
  { id: '2', name: '李四', mbtiCode: 'ENFP', completedAt: '2025-01-03 13:45', testType: '深度分析', dimensions: { E: 70, I: 30, S: 35, N: 65, T: 40, F: 60, J: 25, P: 75 } },
  { id: '3', name: '王五', mbtiCode: 'ISTP', completedAt: '2025-01-03 12:20', testType: '快速测试', dimensions: { E: 35, I: 65, S: 60, N: 40, T: 70, F: 30, J: 40, P: 60 } },
  { id: '4', name: '赵六', mbtiCode: 'ESFJ', completedAt: '2025-01-03 11:15', testType: '标准测试', dimensions: { E: 65, I: 35, S: 55, N: 45, T: 35, F: 65, J: 70, P: 30 } },
  { id: '5', name: '钱七', mbtiCode: 'INFP', completedAt: '2025-01-03 10:00', testType: '深度分析', dimensions: { E: 30, I: 70, S: 25, N: 75, T: 35, F: 65, J: 30, P: 70 } },
  { id: '6', name: '孙八', mbtiCode: 'ENTJ', completedAt: '2025-01-02 16:30', testType: '标准测试', dimensions: { E: 75, I: 25, S: 40, N: 60, T: 80, F: 20, J: 75, P: 25 } },
  { id: '7', name: '周九', mbtiCode: 'ISFJ', completedAt: '2025-01-02 15:20', testType: '快速测试', dimensions: { E: 35, I: 65, S: 70, N: 30, T: 40, F: 60, J: 65, P: 35 } },
  { id: '8', name: '吴十', mbtiCode: 'ENTP', completedAt: '2025-01-02 14:10', testType: '深度分析', dimensions: { E: 70, I: 30, S: 30, N: 70, T: 65, F: 35, J: 35, P: 65 } },
]

// MBTI 类型描述
const mbtiDescriptions: Record<string, string> = {
  INTJ: '建筑师 - 富有想象力的战略家',
  INTP: '逻辑学家 - 创新的发明家',
  ENTJ: '指挥官 - 大胆的领导者',
  ENTP: '辩论家 - 聪明好奇的思想家',
  INFJ: '提倡者 - 安静而神秘的理想主义者',
  INFP: '调停者 - 诗意、善良的利他主义者',
  ENFJ: '主人公 - 富有魅力的领导者',
  ENFP: '竞选者 - 热情、有创造力的社交达人',
  ISTJ: '物流师 - 实际且注重事实的人',
  ISFJ: '守卫者 - 非常专注且温暖的保护者',
  ESTJ: '总经理 - 出色的管理者',
  ESFJ: '执政官 - 极有同情心的社交达人',
  ISTP: '鉴赏家 - 大胆而实际的实验家',
  ISFP: '探险家 - 灵活有魅力的艺术家',
  ESTP: '企业家 - 聪明、精力充沛的人',
  ESFP: '表演者 - 自发的、精力充沛的表演者',
}

// 学生详情弹窗
function StudentDetail({ 
  student, 
  onClose 
}: { 
  student: typeof mockStudents[0]
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
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
        {/* 头部 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: neutral[900] }}>
              {student.name}
            </h2>
            <p className="text-sm" style={{ color: neutral[500] }}>
              {student.completedAt} · {student.testType}
            </p>
          </div>
          <span 
            className="px-4 py-2 rounded-xl text-lg font-mono font-bold"
            style={{ 
              background: `linear-gradient(135deg, ${primary[500]}15 0%, ${primary[600]}15 100%)`,
              color: primary[700],
            }}
          >
            {student.mbtiCode}
          </span>
        </div>

        {/* MBTI 描述 */}
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ background: neutral[50] }}
        >
          <p style={{ color: neutral[700] }}>
            {mbtiDescriptions[student.mbtiCode] || '性格类型描述'}
          </p>
        </div>

        {/* 维度分析 */}
        <div className="space-y-4">
          <h3 className="font-medium" style={{ color: neutral[700] }}>维度分析</h3>
          
          {/* E/I */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: neutral[600] }}>外向 (E)</span>
              <span style={{ color: neutral[600] }}>内向 (I)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: neutral[200] }}>
              <div 
                className="h-full rounded-l-full"
                style={{ 
                  width: `${student.dimensions.E}%`,
                  background: `linear-gradient(90deg, ${primary[400]} 0%, ${primary[600]} 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: neutral[500] }}>{student.dimensions.E}%</span>
              <span style={{ color: neutral[500] }}>{student.dimensions.I}%</span>
            </div>
          </div>

          {/* S/N */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: neutral[600] }}>感觉 (S)</span>
              <span style={{ color: neutral[600] }}>直觉 (N)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: neutral[200] }}>
              <div 
                className="h-full rounded-l-full"
                style={{ 
                  width: `${student.dimensions.S}%`,
                  background: `linear-gradient(90deg, #10B981 0%, #059669 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: neutral[500] }}>{student.dimensions.S}%</span>
              <span style={{ color: neutral[500] }}>{student.dimensions.N}%</span>
            </div>
          </div>

          {/* T/F */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: neutral[600] }}>思考 (T)</span>
              <span style={{ color: neutral[600] }}>情感 (F)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: neutral[200] }}>
              <div 
                className="h-full rounded-l-full"
                style={{ 
                  width: `${student.dimensions.T}%`,
                  background: `linear-gradient(90deg, #F59E0B 0%, #D97706 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: neutral[500] }}>{student.dimensions.T}%</span>
              <span style={{ color: neutral[500] }}>{student.dimensions.F}%</span>
            </div>
          </div>

          {/* J/P */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: neutral[600] }}>判断 (J)</span>
              <span style={{ color: neutral[600] }}>感知 (P)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: neutral[200] }}>
              <div 
                className="h-full rounded-l-full"
                style={{ 
                  width: `${student.dimensions.J}%`,
                  background: `linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: neutral[500] }}>{student.dimensions.J}%</span>
              <span style={{ color: neutral[500] }}>{student.dimensions.P}%</span>
            </div>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl font-medium transition-colors"
          style={{ 
            background: neutral[100],
            color: neutral[700],
          }}
        >
          关闭
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function AdminStudents() {
  const [students] = useState(mockStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMbti, setFilterMbti] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null)

  // 获取所有 MBTI 类型
  const mbtiTypes = useMemo(() => {
    const types = new Set(students.map(s => s.mbtiCode))
    return Array.from(types).sort()
  }, [students])

  // 过滤学生
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMbti = filterMbti === 'all' || s.mbtiCode === filterMbti
      return matchesSearch && matchesMbti
    })
  }, [students, searchQuery, filterMbti])

  // 统计数据
  const stats = useMemo(() => {
    const mbtiCounts: Record<string, number> = {}
    students.forEach(s => {
      mbtiCounts[s.mbtiCode] = (mbtiCounts[s.mbtiCode] || 0) + 1
    })
    
    const sortedTypes = Object.entries(mbtiCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)

    return {
      total: students.length,
      topTypes: sortedTypes,
    }
  }, [students])

  // 导出数据
  const handleExport = () => {
    const csv = [
      ['姓名', 'MBTI类型', '测试类型', '完成时间', 'E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].join(','),
      ...filteredStudents.map(s => [
        s.name,
        s.mbtiCode,
        s.testType,
        s.completedAt,
        s.dimensions.E,
        s.dimensions.I,
        s.dimensions.S,
        s.dimensions.N,
        s.dimensions.T,
        s.dimensions.F,
        s.dimensions.J,
        s.dimensions.P,
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `学生数据_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ color: neutral[900] }}>
          学生数据
        </h1>
        <p style={{ color: neutral[600] }}>
          查看和分析学生测试结果
        </p>
      </motion.div>

      {/* 统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        <div 
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${neutral[200]}`,
          }}
        >
          <p className="text-sm" style={{ color: neutral[500] }}>总人数</p>
          <p className="text-2xl font-black" style={{ color: neutral[900] }}>{stats.total}</p>
        </div>
        
        {stats.topTypes.map(([type, count], index) => (
          <div 
            key={type}
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${neutral[200]}`,
            }}
          >
            <p className="text-sm" style={{ color: neutral[500] }}>
              {index === 0 ? '最多' : `第${index + 1}名`}
            </p>
            <p className="text-lg font-bold font-mono" style={{ color: primary[700] }}>
              {type}
              <span className="text-sm font-normal ml-2" style={{ color: neutral[500] }}>
                {count}人
              </span>
            </p>
          </div>
        ))}
      </motion.div>

      {/* 工具栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        {/* 搜索 */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: neutral[400] }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学生姓名..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{ 
                background: 'rgba(255,255,255,0.8)',
                borderColor: neutral[200],
                color: neutral[900],
              }}
            />
          </div>
        </div>

        {/* MBTI 筛选 */}
        <select
          value={filterMbti}
          onChange={(e) => setFilterMbti(e.target.value)}
          className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
          style={{ 
            background: 'rgba(255,255,255,0.8)',
            borderColor: neutral[200],
            color: neutral[900],
          }}
        >
          <option value="all">全部类型</option>
          {mbtiTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
          style={{ 
            background: 'rgba(255,255,255,0.8)',
            border: `1px solid ${neutral[200]}`,
            color: neutral[700],
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出 CSV
        </button>
      </motion.div>

      {/* 学生列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${neutral[200]}`,
        }}
      >
        {/* 表头 */}
        <div 
          className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium"
          style={{ 
            background: neutral[50],
            color: neutral[600],
            borderBottom: `1px solid ${neutral[200]}`,
          }}
        >
          <div className="col-span-3">姓名</div>
          <div className="col-span-2">MBTI 类型</div>
          <div className="col-span-3">测试类型</div>
          <div className="col-span-3">完成时间</div>
          <div className="col-span-1 text-right">操作</div>
        </div>

        {/* 学生行 */}
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/50 transition-colors cursor-pointer"
            style={{ borderBottom: `1px solid ${neutral[100]}` }}
            onClick={() => setSelectedStudent(student)}
          >
            <div className="col-span-3 font-medium" style={{ color: neutral[800] }}>
              {student.name}
            </div>
            <div className="col-span-2">
              <span 
                className="px-3 py-1 rounded-full text-sm font-mono font-bold"
                style={{ 
                  background: `${primary[500]}15`,
                  color: primary[700],
                }}
              >
                {student.mbtiCode}
              </span>
            </div>
            <div className="col-span-3" style={{ color: neutral[600] }}>
              {student.testType}
            </div>
            <div className="col-span-3 text-sm" style={{ color: neutral[500] }}>
              {student.completedAt}
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                className="p-2 rounded-lg transition-colors hover:bg-white"
                style={{ color: neutral[500] }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {/* 空状态 */}
        {filteredStudents.length === 0 && (
          <div className="py-12 text-center" style={{ color: neutral[500] }}>
            没有找到匹配的学生
          </div>
        )}
      </motion.div>

      {/* 学生详情弹窗 */}
      {selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}
