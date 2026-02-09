import type React from 'react'

// MBTI 类型定义
export type MBTICode = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'  // 分析师
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'  // 外交家
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'  // 守护者
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'  // 探索者

export interface MBTIType {
  code: MBTICode
  name: string
  nickname: string
  description: string
  strengths: string[]
  weaknesses: string[]
  learningStyle: LearningStyle
  cognitiveStack: string[] // 认知功能栈
}

// 学习风格
export type LearningStyleType = 'visual' | 'auditory' | 'kinesthetic' | 'reading'

export interface LearningStyle {
  type: LearningStyleType
  name: string
  description: string
  recommendations: string[]
}

// AI 职业方向
export interface AICareer {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  category: 'research' | 'engineering' | 'product' | 'design' | 'business'
  requiredSkills: Skill[]
  suitableMBTI: MBTICode[]
  salaryRange: string
  demandLevel: 'high' | 'medium' | 'low'
  growthPotential: number // 1-10
}

// 技能节点
export interface Skill {
  id: string
  name: string
  category: 'programming' | 'math' | 'ml' | 'data' | 'soft' | 'domain'
  level: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[] // 前置技能ID
  icon?: string
}

// 课程
export interface Course {
  id: string
  name: string
  description: string
  provider: string
  duration: string // 如 "40小时"
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[] // 技能ID列表
  prerequisites: string[] // 前置课程ID
  rating: number
  tags: string[]
  url?: string
  type: 'video' | 'interactive' | 'reading' | 'project'
}

// 学习路径
export interface LearningPath {
  id: string
  name: string
  description: string
  targetCareer: string // 职业ID
  estimatedDuration: string
  courses: CourseNode[]
  milestones: Milestone[]
}

export interface CourseNode {
  courseId: string
  order: number
  isOptional: boolean
  estimatedWeeks: number
}

export interface Milestone {
  id: string
  name: string
  description: string
  afterCourses: string[] // 完成这些课程后达成
  badge?: string
}

// 学生画像
export interface StudentProfile {
  id: string
  userId: string
  mbtiType: MBTICode
  mbtiTestDate: Date
  mbtiScores: MBTIScores
  learningStyle: LearningStyleType
  interests: string[] // 感兴趣的方向
  completedCourses: CompletedCourse[]
  targetCareers: string[] // 目标职业ID
  currentSkills: StudentSkill[]
  learningGoals: string[]
  weeklyStudyHours: number
  createdAt: Date
  updatedAt: Date
}

export interface MBTIScores {
  EI: { E: number; I: number }
  SN: { S: number; N: number }
  TF: { T: number; F: number }
  JP: { J: number; P: number }
}

export interface CompletedCourse {
  courseId: string
  completedAt: Date
  score?: number
  certificate?: string
}

export interface StudentSkill {
  skillId: string
  level: number // 0-100
  lastAssessed: Date
}

// AI 智能体对话
export interface AIConversation {
  id: string
  studentId: string
  messages: AIMessage[]
  context: ConversationContext
  createdAt: Date
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    recommendedCourses?: string[]
    recommendedCareers?: string[]
    graphQuery?: string // Neo4j 查询
  }
}

export interface ConversationContext {
  studentProfile: StudentProfile
  currentTopic?: 'career' | 'course' | 'skill' | 'general'
  recentRecommendations: string[]
}

// 知识图谱节点（前端展示用）
export interface GraphNode {
  id: string
  label: string
  type: 'mbti' | 'career' | 'skill' | 'course' | 'student'
  properties: Record<string, unknown>
  x?: number
  y?: number
  color?: string
  size?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  weight?: number
  label?: string
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
