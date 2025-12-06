import { Router, Request, Response } from 'express'
import { runQuery, runSingleQuery } from '../config/neo4j.js'

const router = Router()

// 根据职业获取学习路径
router.get('/career/:careerId', async (req: Request, res: Response) => {
  try {
    const { careerId } = req.params

    const cypher = `
      MATCH (lp:LearningPath)-[:TARGETS]->(c:Career {id: $careerId})
      OPTIONAL MATCH (lp)-[:INCLUDES]->(course:Course)
      RETURN lp {.*} as learningPath, 
             collect(course {.*}) as courses
      ORDER BY lp.name
    `

    const results = await runQuery<{ learningPath: unknown; courses: unknown[] }>(
      cypher, 
      { careerId }
    )

    res.json({ 
      success: true, 
      data: results.map(r => ({
        ...(r.learningPath as object),
        courses: r.courses
      }))
    })
  } catch (error) {
    console.error('Error getting learning paths:', error)
    res.status(500).json({ success: false, error: 'Failed to get learning paths' })
  }
})

// 获取学习路径详情
router.get('/:pathId', async (req: Request, res: Response) => {
  try {
    const { pathId } = req.params

    const cypher = `
      MATCH (lp:LearningPath {id: $pathId})
      OPTIONAL MATCH (lp)-[:INCLUDES]->(course:Course)
      OPTIONAL MATCH (course)-[:TEACHES]->(skill:Skill)
      OPTIONAL MATCH (lp)-[:TARGETS]->(career:Career)
      RETURN lp {.*} as learningPath,
             collect(DISTINCT course {.*, skills: collect(skill.name)}) as courses,
             career {.*} as targetCareer
    `

    const result = await runSingleQuery<{ 
      learningPath: unknown
      courses: unknown[]
      targetCareer: unknown
    }>(cypher, { pathId })

    if (!result) {
      return res.status(404).json({ success: false, error: 'Learning path not found' })
    }

    res.json({ 
      success: true, 
      data: {
        ...(result.learningPath as object),
        courses: result.courses,
        targetCareer: result.targetCareer
      }
    })
  } catch (error) {
    console.error('Error getting learning path:', error)
    res.status(500).json({ success: false, error: 'Failed to get learning path' })
  }
})

// 获取个性化学习路径推荐
router.get('/recommend/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params

    const cypher = `
      MATCH (s:Student {id: $studentId})-[:HAS_PERSONALITY]->(m:MBTIType)
      MATCH (c:Career)-[:SUITS]->(m)
      MATCH (lp:LearningPath)-[:TARGETS]->(c)
      OPTIONAL MATCH (lp)-[:INCLUDES]->(course:Course)
      WHERE NOT course.id IN s.completedCourses
      RETURN lp {.*} as learningPath, 
             c {.*} as career,
             collect(course {.*}) as remainingCourses
      ORDER BY c.growthPotential DESC
      LIMIT 3
    `

    const results = await runQuery<{ 
      learningPath: unknown
      career: unknown
      remainingCourses: unknown[]
    }>(cypher, { studentId })

    res.json({ 
      success: true, 
      data: results.map(r => ({
        ...(r.learningPath as object),
        targetCareer: r.career,
        remainingCourses: r.remainingCourses
      }))
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    res.status(500).json({ success: false, error: 'Failed to get recommendations' })
  }
})

export default router
