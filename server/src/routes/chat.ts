import { Router, Request, Response } from 'express'
import { runQuery, runSingleQuery } from '../config/neo4j.js'
import { chatWithDeepSeek, ChatMessage } from '../config/deepseek.js'

const router = Router()

// AI 对话接口
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, studentId, history = [] } = req.body as {
      message: string
      studentId?: string
      history?: ChatMessage[]
    }

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' })
    }

    // 获取学生上下文信息
    let studentContext = ''
    if (studentId) {
      const cypher = `
        MATCH (s:Student {id: $studentId})
        OPTIONAL MATCH (s)-[:HAS_PERSONALITY]->(m:MBTIType)
        OPTIONAL MATCH (s)-[:COMPLETED]->(course:Course)
        OPTIONAL MATCH (s)-[:TARGETS]->(career:Career)
        RETURN s {.*} as student,
               m {.*} as mbtiType,
               collect(DISTINCT course.name) as completedCourses,
               collect(DISTINCT career.name) as targetCareers
      `
      const result = await runSingleQuery<{
        student: Record<string, unknown>
        mbtiType: Record<string, unknown>
        completedCourses: string[]
        targetCareers: string[]
      }>(cypher, { studentId })

      if (result) {
        studentContext = `
学生 MBTI 类型: ${result.mbtiType?.code || '未测试'} (${result.mbtiType?.name || ''})
已完成课程: ${result.completedCourses.length > 0 ? result.completedCourses.join(', ') : '无'}
目标职业: ${result.targetCareers.length > 0 ? result.targetCareers.join(', ') : '未设置'}
`
      }
    }

    // 根据消息内容查询知识图谱补充信息
    let graphContext = ''
    
    // 检测是否询问职业相关
    if (message.includes('职业') || message.includes('工作') || message.includes('岗位')) {
      const careers = await runQuery<{ career: Record<string, unknown> }>(`
        MATCH (c:Career)
        RETURN c {.*} as career
        LIMIT 5
      `)
      if (careers.length > 0) {
        graphContext += '\n可推荐的 AI 职业方向：\n'
        careers.forEach(c => {
          graphContext += `- ${c.career.name}: ${c.career.description}\n`
        })
      }
    }

    // 检测是否询问课程相关
    if (message.includes('课程') || message.includes('学习') || message.includes('推荐')) {
      const courses = await runQuery<{ course: Record<string, unknown> }>(`
        MATCH (c:Course)
        RETURN c {.*} as course
        ORDER BY c.rating DESC
        LIMIT 5
      `)
      if (courses.length > 0) {
        graphContext += '\n推荐课程：\n'
        courses.forEach(c => {
          graphContext += `- ${c.course.name} (${c.course.provider}): ${c.course.description}\n`
        })
      }
    }

    // 检测是否询问技能相关
    if (message.includes('技能') || message.includes('能力')) {
      const skills = await runQuery<{ skill: Record<string, unknown> }>(`
        MATCH (s:Skill)
        RETURN s {.*} as skill
        LIMIT 10
      `)
      if (skills.length > 0) {
        graphContext += '\nAI 领域关键技能：\n'
        skills.forEach(s => {
          graphContext += `- ${s.skill.name} (${s.skill.category})\n`
        })
      }
    }

    const fullContext = studentContext + graphContext

    // 构建对话历史
    const messages: ChatMessage[] = [
      ...history.slice(-10), // 只保留最近 10 条历史
      { role: 'user', content: message }
    ]

    // 调用 DeepSeek API
    const response = await chatWithDeepSeek(messages, fullContext)

    res.json({
      success: true,
      data: {
        message: response,
        context: {
          hasStudentProfile: !!studentId,
          usedGraphData: !!graphContext
        }
      }
    })
  } catch (error) {
    console.error('Error in chat:', error)
    res.status(500).json({ success: false, error: 'Failed to process chat message' })
  }
})

// 获取推荐的问题
router.get('/suggestions/:studentId?', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params

    let suggestions = [
      '我应该学习哪些 AI 技能？',
      '推荐适合我的学习路径',
      '如何成为 AI 工程师？',
      '有哪些好的深度学习课程？',
    ]

    if (studentId) {
      const result = await runSingleQuery<{ mbtiCode: string }>(`
        MATCH (s:Student {id: $studentId})-[:HAS_PERSONALITY]->(m:MBTIType)
        RETURN m.code as mbtiCode
      `, { studentId })

      if (result?.mbtiCode) {
        suggestions = [
          `作为 ${result.mbtiCode} 型人格，我适合什么 AI 职业？`,
          '根据我的性格推荐学习路径',
          '我应该先学什么课程？',
          '如何规划我的 AI 学习计划？',
        ]
      }
    }

    res.json({ success: true, data: suggestions })
  } catch (error) {
    console.error('Error getting suggestions:', error)
    res.status(500).json({ success: false, error: 'Failed to get suggestions' })
  }
})

export default router
