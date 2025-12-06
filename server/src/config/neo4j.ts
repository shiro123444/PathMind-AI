import neo4j, { Driver } from 'neo4j-driver'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'
const user = process.env.NEO4J_USER || 'neo4j'
const password = process.env.NEO4J_PASSWORD || ''

export const neo4jDriver: Driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password)
)

export async function closeNeo4j(): Promise<void> {
  await neo4jDriver.close()
}

// 辅助函数：运行 Cypher 查询
export async function runQuery<T>(
  cypher: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const session = neo4jDriver.session()
  try {
    const result = await session.run(cypher, params)
    return result.records.map(record => record.toObject() as T)
  } finally {
    await session.close()
  }
}

// 辅助函数：运行单条记录查询
export async function runSingleQuery<T>(
  cypher: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  const results = await runQuery<T>(cypher, params)
  return results[0] || null
}
