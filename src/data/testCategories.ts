/**
 * MBTI 测试类型配置
 */

import type { TestCategory } from '../types/mbti'

export const testCategories: TestCategory[] = [
  {
    id: 'quick',
    name: '快速测试',
    description: '快速了解你的性格倾向，适合初次接触 MBTI 的同学',
    questionCount: 12,
    estimatedMinutes: 5,
    difficulty: 'easy',
    icon: '⚡',
    color: 'sky', // 天蓝色
  },
  {
    id: 'standard',
    name: '标准测试',
    description: '全面的 MBTI 性格分析，获取更准确的性格类型判断',
    questionCount: 48,
    estimatedMinutes: 20,
    difficulty: 'medium',
    icon: '📊',
    color: 'teal', // 青色
  },
  {
    id: 'deep',
    name: '深度分析',
    description: '深入探索你的性格特质，包含情景题和排序题',
    questionCount: 93,
    estimatedMinutes: 40,
    difficulty: 'hard',
    icon: '🔬',
    color: 'indigo', // 靛蓝色
  },
]

// 获取测试类型
export const getTestCategory = (id: string): TestCategory | undefined => {
  return testCategories.find(cat => cat.id === id)
}

// 难度标签映射
export const difficultyLabels: Record<string, string> = {
  easy: '入门',
  medium: '标准',
  hard: '进阶',
}

// 难度颜色映射
export const difficultyColors: Record<string, string> = {
  easy: '#10B981', // 绿色
  medium: '#F59E0B', // 琥珀色
  hard: '#8B5CF6', // 紫色
}
