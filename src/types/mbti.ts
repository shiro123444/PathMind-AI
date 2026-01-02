/**
 * MBTI 测试系统类型定义
 * 
 * 包含测试类型、题目类型、学生结果等数据结构
 */

// MBTI 维度类型
export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MBTIValue = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

// 测试难度
export type TestDifficulty = 'easy' | 'medium' | 'hard'

// 题目类型
export type QuestionType = 'binary' | 'scale' | 'scenario' | 'ranking'

// ============================================
// 测试类型
// ============================================
export interface TestCategory {
  id: string
  name: string
  description: string
  questionCount: number
  estimatedMinutes: number
  difficulty: TestDifficulty
  icon: string
  color: string // 用于卡片渐变色
}

// ============================================
// 题目类型
// ============================================
export interface BaseQuestion {
  id: string
  type: QuestionType
  text: string
  dimension: MBTIDimension
  category: string // test category id
}

// 二选一题型
export interface BinaryQuestion extends BaseQuestion {
  type: 'binary'
  options: [
    { text: string; value: MBTIValue },
    { text: string; value: MBTIValue }
  ]
}

// 量表题型
export interface ScaleQuestion extends BaseQuestion {
  type: 'scale'
  leftLabel: string
  rightLabel: string
  leftValue: MBTIValue
  rightValue: MBTIValue
  scaleSize: 5 | 7
}

// 情景题型
export interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario'
  scenario: string
  options: Array<{
    text: string
    value: MBTIValue
    weight: number
  }>
}

// 排序题型
export interface RankingQuestion extends BaseQuestion {
  type: 'ranking'
  items: Array<{
    id: string
    text: string
    value: MBTIValue
  }>
}

// 联合题目类型
export type Question = BinaryQuestion | ScaleQuestion | ScenarioQuestion | RankingQuestion

// ============================================
// 答案类型
// ============================================
export interface BinaryAnswer {
  questionId: string
  type: 'binary'
  selectedValue: MBTIValue
}

export interface ScaleAnswer {
  questionId: string
  type: 'scale'
  value: number // 1-5 或 1-7
}

export interface ScenarioAnswer {
  questionId: string
  type: 'scenario'
  selectedIndex: number
}

export interface RankingAnswer {
  questionId: string
  type: 'ranking'
  order: string[] // item ids in order
}

export type Answer = BinaryAnswer | ScaleAnswer | ScenarioAnswer | RankingAnswer

// ============================================
// 测试进度（localStorage 存储）
// ============================================
export interface TestProgress {
  testCategoryId: string
  currentQuestionIndex: number
  answers: Record<string, Answer>
  startedAt: string
  lastUpdatedAt: string
}

// ============================================
// 学生结果
// ============================================
export interface StudentResult {
  id: string
  studentId: string
  studentName: string
  testCategoryId: string
  mbtiCode: string
  dimensions: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  completedAt: Date
  answers: Answer[]
}

// ============================================
// 班级分析数据
// ============================================
export interface ClassAnalytics {
  totalStudents: number
  completedTests: number
  mbtiDistribution: Record<string, number>
  dimensionAverages: {
    EI: number // -100 to 100, negative = I, positive = E
    SN: number
    TF: number
    JP: number
  }
}

// ============================================
// 管理后台相关
// ============================================
export interface QuestionFilter {
  search?: string
  type?: QuestionType
  dimension?: MBTIDimension
  category?: string
}

export interface StudentFilter {
  search?: string
  mbtiType?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

// 分页
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

// 排序
export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}
