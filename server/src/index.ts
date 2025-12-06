import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { neo4jDriver, closeNeo4j } from './config/neo4j.js'
import mbtiRoutes from './routes/mbti.js'
import careerRoutes from './routes/career.js'
import learningPathRoutes from './routes/learning-path.js'
import chatRoutes from './routes/chat.js'
import graphRoutes from './routes/graph.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 健康检查
app.get('/api/health', async (req, res) => {
  try {
    const session = neo4jDriver.session()
    await session.run('RETURN 1')
    await session.close()
    res.json({ status: 'ok', neo4j: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'error', neo4j: 'disconnected' })
  }
})

// 路由
app.use('/api/mbti', mbtiRoutes)
app.use('/api/careers', careerRoutes)
app.use('/api/learning-path', learningPathRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/graph', graphRoutes)

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Neo4j: ${process.env.NEO4J_URI}`)
  console.log(`🤖 DeepSeek API: configured`)
})

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\nShutting down...')
  await closeNeo4j()
  process.exit(0)
})
