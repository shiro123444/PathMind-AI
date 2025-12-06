// MBTI 类型定义
export type MBTICode = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export interface MBTIResult {
  code: MBTICode
  scores: MBTIScores
  testDate: string
}

export interface MBTIScores {
  E: number
  I: number
  S: number
  N: number
  T: number
  F: number
  J: number
  P: number
}

// 学生数据
export interface Student {
  id: string
  name?: string
  email?: string
  mbtiCode?: MBTICode
  mbtiScores?: MBTIScores
  interests: string[]
  completedCourses: string[]
  targetCareers: string[]
  createdAt: string
  updatedAt: string
}

// AI 职业
export interface Career {
  id: string
  name: string
  description: string
  icon: string
  category: string
  salaryRange: string
  demandLevel: string
  growthPotential: number
  suitableMBTI: MBTICode[]
}

// 技能
export interface Skill {
  id: string
  name: string
  category: string
  level: string
  description?: string
}

// 课程
export interface Course {
  id: string
  name: string
  description: string
  provider: string
  duration: string
  difficulty: string
  rating: number
  url?: string
}

// 学习路径
export interface LearningPath {
  id: string
  name: string
  description: string
  targetCareer: string
  estimatedDuration: string
  courses: string[]
}

// 知识图谱节点
export interface GraphNode {
  id: string
  label: string
  type: 'mbti' | 'career' | 'skill' | 'course' | 'student'
  properties: Record<string, unknown>
  color?: string
  size?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  label?: string
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// API 响应类型
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}
