import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// DeepSeek 使用 OpenAI 兼容的 API 格式
export const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})

// 系统提示词
export const SYSTEM_PROMPT = `你是一个专业的 AI 教育顾问，专门帮助学生规划人工智能领域的学习路径。

你的职责：
1. 根据学生的 MBTI 性格类型，推荐最适合的 AI 职业方向
2. 根据学生的目标职业和当前技能，推荐个性化的学习课程
3. 解答学生关于 AI 领域的技术问题和职业困惑
4. 提供具体、可执行的学习建议

你了解以下 AI 职业方向：
- AI 研究员：需要深厚的数学和理论基础，适合 INTJ、INTP
- AI 算法工程师：需要编程和机器学习技能，适合 INTJ、INTP、ENTJ
- NLP 工程师：自然语言处理专家，适合 INTJ、INTP、ENTP
- 计算机视觉工程师：图像和视频处理，适合 INTJ、INTP
- AI 产品经理：连接技术和业务，适合 ENTJ、ENTP、ENFJ
- 数据科学家：数据分析和建模，适合 INTP、INTJ、ENTJ
- AI 交互设计师：设计 AI 产品体验，适合 ENFP、INFP

回复时请：
- 使用中文回复
- 结构清晰，使用 emoji 和 markdown 格式
- 给出具体的学习资源和时间规划建议
- 鼓励学生，保持积极友好的态度
`

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function chatWithDeepSeek(
  messages: ChatMessage[],
  studentContext?: string
): Promise<string> {
  const systemMessage = studentContext 
    ? `${SYSTEM_PROMPT}\n\n当前学生信息：\n${studentContext}`
    : SYSTEM_PROMPT

  const response = await deepseekClient.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'
}
