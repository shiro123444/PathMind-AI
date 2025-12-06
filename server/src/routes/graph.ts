import { Router, Request, Response } from 'express'
import { runQuery, runSingleQuery } from '../config/neo4j.js'
import type { GraphNode, GraphEdge, KnowledgeGraph } from '../types/index.js'

const router = Router()

// 节点颜色映射
const NODE_COLORS: Record<string, string> = {
  mbti: '#8B5CF6',     // 紫色
  career: '#3B82F6',   // 蓝色
  skill: '#10B981',    // 绿色
  course: '#F59E0B',   // 橙色
  student: '#EF4444',  // 红色
}

// 节点大小映射
const NODE_SIZES: Record<string, number> = {
  mbti: 20,
  career: 18,
  skill: 12,
  course: 14,
  student: 22,
}

// 获取学生的个性化知识图谱
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params

    const cypher = `
      // 获取学生节点
      MATCH (s:Student {id: $studentId})
      OPTIONAL MATCH (s)-[:HAS_PERSONALITY]->(m:MBTIType)
      
      // 获取适合的职业
      OPTIONAL MATCH (c:Career)-[:SUITS]->(m)
      
      // 获取职业所需技能
      OPTIONAL MATCH (c)-[:REQUIRES]->(skill:Skill)
      
      // 获取课程
      OPTIONAL MATCH (course:Course)-[:TEACHES]->(skill)
      
      // 返回所有相关节点和关系
      WITH s, m, 
           collect(DISTINCT c) as careers,
           collect(DISTINCT skill) as skills,
           collect(DISTINCT course) as courses
      
      RETURN s {.id, .mbtiCode} as student,
             m {.code, .name} as mbti,
             [c IN careers | c {.*}] as careers,
             [sk IN skills | sk {.*}] as skills,
             [co IN courses | co {.*}] as courses
    `

    const result = await runSingleQuery<{
      student: { id: string; mbtiCode: string }
      mbti: { code: string; name: string }
      careers: Array<Record<string, unknown>>
      skills: Array<Record<string, unknown>>
      courses: Array<Record<string, unknown>>
    }>(cypher, { studentId })

    if (!result) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }

    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // 添加学生节点
    nodes.push({
      id: `student-${result.student.id}`,
      label: '我',
      type: 'student',
      properties: result.student,
      color: NODE_COLORS.student,
      size: NODE_SIZES.student,
    })

    // 添加 MBTI 节点
    if (result.mbti) {
      nodes.push({
        id: `mbti-${result.mbti.code}`,
        label: result.mbti.code,
        type: 'mbti',
        properties: result.mbti,
        color: NODE_COLORS.mbti,
        size: NODE_SIZES.mbti,
      })
      edges.push({
        id: `edge-student-mbti`,
        source: `student-${result.student.id}`,
        target: `mbti-${result.mbti.code}`,
        type: 'HAS_PERSONALITY',
        label: '性格类型',
      })
    }

    // 添加职业节点
    result.careers.forEach((career, i) => {
      if (career.id) {
        nodes.push({
          id: `career-${career.id}`,
          label: career.name as string,
          type: 'career',
          properties: career,
          color: NODE_COLORS.career,
          size: NODE_SIZES.career,
        })
        if (result.mbti) {
          edges.push({
            id: `edge-mbti-career-${i}`,
            source: `mbti-${result.mbti.code}`,
            target: `career-${career.id}`,
            type: 'SUITS',
            label: '适合',
          })
        }
      }
    })

    // 添加技能节点
    result.skills.forEach((skill, i) => {
      if (skill.id) {
        nodes.push({
          id: `skill-${skill.id}`,
          label: skill.name as string,
          type: 'skill',
          properties: skill,
          color: NODE_COLORS.skill,
          size: NODE_SIZES.skill,
        })
      }
    })

    // 添加课程节点
    result.courses.forEach((course, i) => {
      if (course.id) {
        nodes.push({
          id: `course-${course.id}`,
          label: course.name as string,
          type: 'course',
          properties: course,
          color: NODE_COLORS.course,
          size: NODE_SIZES.course,
        })
      }
    })

    const graph: KnowledgeGraph = { nodes, edges }

    res.json({ success: true, data: graph })
  } catch (error) {
    console.error('Error getting student graph:', error)
    res.status(500).json({ success: false, error: 'Failed to get knowledge graph' })
  }
})

// 获取完整知识图谱（用于概览）
router.get('/full', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query

    const cypher = `
      // 获取 MBTI 类型
      MATCH (m:MBTIType)
      WITH collect(m {.*}) as mbtis
      
      // 获取职业
      MATCH (c:Career)
      WITH mbtis, collect(c {.*}) as careers
      
      // 获取技能
      MATCH (s:Skill)
      WITH mbtis, careers, collect(s {.*})[0..$limit] as skills
      
      // 获取课程
      MATCH (co:Course)
      WITH mbtis, careers, skills, collect(co {.*})[0..$limit] as courses
      
      RETURN mbtis, careers, skills, courses
    `

    const result = await runSingleQuery<{
      mbtis: Array<Record<string, unknown>>
      careers: Array<Record<string, unknown>>
      skills: Array<Record<string, unknown>>
      courses: Array<Record<string, unknown>>
    }>(cypher, { limit: Number(limit) })

    if (!result) {
      return res.json({ success: true, data: { nodes: [], edges: [] } })
    }

    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // 添加 MBTI 节点
    result.mbtis.forEach(mbti => {
      nodes.push({
        id: `mbti-${mbti.code}`,
        label: mbti.code as string,
        type: 'mbti',
        properties: mbti,
        color: NODE_COLORS.mbti,
        size: NODE_SIZES.mbti,
      })
    })

    // 添加职业节点
    result.careers.forEach(career => {
      nodes.push({
        id: `career-${career.id}`,
        label: career.name as string,
        type: 'career',
        properties: career,
        color: NODE_COLORS.career,
        size: NODE_SIZES.career,
      })
    })

    // 添加技能节点
    result.skills.forEach(skill => {
      nodes.push({
        id: `skill-${skill.id}`,
        label: skill.name as string,
        type: 'skill',
        properties: skill,
        color: NODE_COLORS.skill,
        size: NODE_SIZES.skill,
      })
    })

    // 添加课程节点
    result.courses.forEach(course => {
      nodes.push({
        id: `course-${course.id}`,
        label: course.name as string,
        type: 'course',
        properties: course,
        color: NODE_COLORS.course,
        size: NODE_SIZES.course,
      })
    })

    // 获取关系
    const relCypher = `
      MATCH (c:Career)-[:SUITS]->(m:MBTIType)
      RETURN 'career-' + c.id as source, 'mbti-' + m.code as target, 'SUITS' as type
      UNION
      MATCH (c:Career)-[:REQUIRES]->(s:Skill)
      RETURN 'career-' + c.id as source, 'skill-' + s.id as target, 'REQUIRES' as type
      UNION
      MATCH (co:Course)-[:TEACHES]->(s:Skill)
      RETURN 'course-' + co.id as source, 'skill-' + s.id as target, 'TEACHES' as type
    `

    const relations = await runQuery<{ source: string; target: string; type: string }>(relCypher)
    
    relations.forEach((rel, i) => {
      edges.push({
        id: `edge-${i}`,
        source: rel.source,
        target: rel.target,
        type: rel.type,
      })
    })

    const graph: KnowledgeGraph = { nodes, edges }

    res.json({ success: true, data: graph })
  } catch (error) {
    console.error('Error getting full graph:', error)
    res.status(500).json({ success: false, error: 'Failed to get knowledge graph' })
  }
})

// 获取职业相关的子图
router.get('/career/:careerId', async (req: Request, res: Response) => {
  try {
    const { careerId } = req.params

    const cypher = `
      MATCH (c:Career {id: $careerId})
      OPTIONAL MATCH (c)-[:SUITS]->(m:MBTIType)
      OPTIONAL MATCH (c)-[:REQUIRES]->(s:Skill)
      OPTIONAL MATCH (course:Course)-[:TEACHES]->(s)
      OPTIONAL MATCH (lp:LearningPath)-[:TARGETS]->(c)
      
      RETURN c {.*} as career,
             collect(DISTINCT m {.*}) as mbtiTypes,
             collect(DISTINCT s {.*}) as skills,
             collect(DISTINCT course {.*}) as courses,
             collect(DISTINCT lp {.*}) as learningPaths
    `

    const result = await runSingleQuery<{
      career: Record<string, unknown>
      mbtiTypes: Array<Record<string, unknown>>
      skills: Array<Record<string, unknown>>
      courses: Array<Record<string, unknown>>
      learningPaths: Array<Record<string, unknown>>
    }>(cypher, { careerId })

    if (!result) {
      return res.status(404).json({ success: false, error: 'Career not found' })
    }

    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // 添加职业中心节点
    nodes.push({
      id: `career-${result.career.id}`,
      label: result.career.name as string,
      type: 'career',
      properties: result.career,
      color: NODE_COLORS.career,
      size: 25, // 中心节点更大
    })

    // 添加 MBTI 节点
    result.mbtiTypes.forEach((mbti, i) => {
      if (mbti.code) {
        nodes.push({
          id: `mbti-${mbti.code}`,
          label: mbti.code as string,
          type: 'mbti',
          properties: mbti,
          color: NODE_COLORS.mbti,
          size: NODE_SIZES.mbti,
        })
        edges.push({
          id: `edge-career-mbti-${i}`,
          source: `career-${result.career.id}`,
          target: `mbti-${mbti.code}`,
          type: 'SUITS',
          label: '适合',
        })
      }
    })

    // 添加技能节点
    result.skills.forEach((skill, i) => {
      if (skill.id) {
        nodes.push({
          id: `skill-${skill.id}`,
          label: skill.name as string,
          type: 'skill',
          properties: skill,
          color: NODE_COLORS.skill,
          size: NODE_SIZES.skill,
        })
        edges.push({
          id: `edge-career-skill-${i}`,
          source: `career-${result.career.id}`,
          target: `skill-${skill.id}`,
          type: 'REQUIRES',
          label: '需要',
        })
      }
    })

    // 添加课程节点
    result.courses.forEach((course, i) => {
      if (course.id) {
        nodes.push({
          id: `course-${course.id}`,
          label: course.name as string,
          type: 'course',
          properties: course,
          color: NODE_COLORS.course,
          size: NODE_SIZES.course,
        })
      }
    })

    const graph: KnowledgeGraph = { nodes, edges }

    res.json({ success: true, data: graph })
  } catch (error) {
    console.error('Error getting career graph:', error)
    res.status(500).json({ success: false, error: 'Failed to get knowledge graph' })
  }
})

export default router
