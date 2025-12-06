import { Router, Request, Response } from 'express'
import { runQuery, runSingleQuery } from '../config/neo4j.js'
import type { MBTICode } from '../types/index.js'

const router = Router()

// 根据 MBTI 获取推荐职业
router.get('/recommend/:mbtiCode', async (req: Request, res: Response) => {
  try {
    const { mbtiCode } = req.params

    const cypher = `
      MATCH (c:Career)-[:SUITS]->(m:MBTIType {code: $mbtiCode})
      OPTIONAL MATCH (c)-[:REQUIRES]->(s:Skill)
      RETURN c {.*} as career, collect(DISTINCT s {.*}) as requiredSkills
      ORDER BY c.growthPotential DESC
    `

    const results = await runQuery<{ career: unknown; requiredSkills: unknown[] }>(
      cypher, 
      { mbtiCode: mbtiCode.toUpperCase() }
    )

    res.json({ 
      success: true, 
      data: results.map(r => ({
        ...r.career,
        requiredSkills: r.requiredSkills
      }))
    })
  } catch (error) {
    console.error('Error getting career recommendations:', error)
    res.status(500).json({ success: false, error: 'Failed to get recommendations' })
  }
})

// 获取职业详情
router.get('/:careerId', async (req: Request, res: Response) => {
  try {
    const { careerId } = req.params

    const cypher = `
      MATCH (c:Career {id: $careerId})
      OPTIONAL MATCH (c)-[:REQUIRES]->(s:Skill)
      OPTIONAL MATCH (c)-[:SUITS]->(m:MBTIType)
      OPTIONAL MATCH (lp:LearningPath)-[:TARGETS]->(c)
      RETURN c {.*} as career, 
             collect(DISTINCT s {.*}) as requiredSkills,
             collect(DISTINCT m.code) as suitableMBTI,
             collect(DISTINCT lp {.*}) as learningPaths
    `

    const result = await runSingleQuery<{ 
      career: unknown
      requiredSkills: unknown[]
      suitableMBTI: string[]
      learningPaths: unknown[]
    }>(cypher, { careerId })

    if (!result) {
      return res.status(404).json({ success: false, error: 'Career not found' })
    }

    res.json({ 
      success: true, 
      data: {
        ...result.career,
        requiredSkills: result.requiredSkills,
        suitableMBTI: result.suitableMBTI,
        learningPaths: result.learningPaths
      }
    })
  } catch (error) {
    console.error('Error getting career details:', error)
    res.status(500).json({ success: false, error: 'Failed to get career details' })
  }
})

// 获取所有职业
router.get('/', async (req: Request, res: Response) => {
  try {
    const cypher = `
      MATCH (c:Career)
      OPTIONAL MATCH (c)-[:SUITS]->(m:MBTIType)
      RETURN c {.*} as career, collect(m.code) as suitableMBTI
      ORDER BY c.name
    `

    const results = await runQuery<{ career: unknown; suitableMBTI: string[] }>(cypher)

    res.json({ 
      success: true, 
      data: results.map(r => ({
        ...r.career,
        suitableMBTI: r.suitableMBTI
      }))
    })
  } catch (error) {
    console.error('Error getting careers:', error)
    res.status(500).json({ success: false, error: 'Failed to get careers' })
  }
})

export default router
