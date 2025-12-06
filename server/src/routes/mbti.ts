import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { runQuery, runSingleQuery } from '../config/neo4j.js'
import type { MBTICode, MBTIScores, Student } from '../types/index.js'

const router = Router()

// 提交 MBTI 测试结果
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { mbtiCode, scores, studentId } = req.body as {
      mbtiCode: MBTICode
      scores: MBTIScores
      studentId?: string
    }

    if (!mbtiCode || !scores) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing mbtiCode or scores' 
      })
    }

    const id = studentId || uuidv4()
    const now = new Date().toISOString()

    // 创建或更新学生节点，并关联 MBTI 类型
    const cypher = `
      MERGE (s:Student {id: $id})
      SET s.mbtiCode = $mbtiCode,
          s.mbtiScores = $scores,
          s.updatedAt = $now
      ON CREATE SET s.createdAt = $now, s.interests = [], s.completedCourses = [], s.targetCareers = []
      
      WITH s
      MATCH (m:MBTIType {code: $mbtiCode})
      MERGE (s)-[:HAS_PERSONALITY]->(m)
      
      RETURN s {.*, mbtiType: m.name} as student
    `

    const result = await runSingleQuery<{ student: Student }>(cypher, {
      id,
      mbtiCode,
      scores: JSON.stringify(scores),
      now,
    })

    res.json({ 
      success: true, 
      data: {
        studentId: id,
        mbtiCode,
        student: result?.student
      }
    })
  } catch (error) {
    console.error('Error submitting MBTI:', error)
    res.status(500).json({ success: false, error: 'Failed to save MBTI result' })
  }
})

// 获取 MBTI 类型信息
router.get('/type/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params

    const cypher = `
      MATCH (m:MBTIType {code: $code})
      OPTIONAL MATCH (m)<-[:SUITS]-(c:Career)
      RETURN m {.*} as mbtiType, collect(c {.*}) as suitableCareers
    `

    const result = await runSingleQuery<{ mbtiType: unknown; suitableCareers: unknown[] }>(
      cypher, 
      { code: code.toUpperCase() }
    )

    if (!result) {
      return res.status(404).json({ success: false, error: 'MBTI type not found' })
    }

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Error getting MBTI type:', error)
    res.status(500).json({ success: false, error: 'Failed to get MBTI type' })
  }
})

// 获取所有 MBTI 类型
router.get('/types', async (req: Request, res: Response) => {
  try {
    const cypher = `
      MATCH (m:MBTIType)
      RETURN m {.*} as mbtiType
      ORDER BY m.code
    `

    const results = await runQuery<{ mbtiType: unknown }>(cypher)

    res.json({ 
      success: true, 
      data: results.map(r => r.mbtiType) 
    })
  } catch (error) {
    console.error('Error getting MBTI types:', error)
    res.status(500).json({ success: false, error: 'Failed to get MBTI types' })
  }
})

export default router
