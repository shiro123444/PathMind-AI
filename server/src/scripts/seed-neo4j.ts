import { neo4jDriver, closeNeo4j } from '../config/neo4j.js'
import dotenv from 'dotenv'

dotenv.config()

async function seedDatabase() {
  const session = neo4jDriver.session()
  
  try {
    console.log('🌱 Starting database seed...')

    // 清空数据库（开发环境）
    console.log('Clearing existing data...')
    await session.run('MATCH (n) DETACH DELETE n')

    // 创建约束和索引
    console.log('Creating constraints and indexes...')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (m:MBTIType) REQUIRE m.code IS UNIQUE')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (c:Career) REQUIRE c.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (co:Course) REQUIRE co.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (st:Student) REQUIRE st.id IS UNIQUE')
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (lp:LearningPath) REQUIRE lp.id IS UNIQUE')

    // 创建 MBTI 类型节点
    console.log('Creating MBTI types...')
    const mbtiTypes = [
      { code: 'INTJ', name: '建筑师', nickname: '独立思考者', description: '富有想象力和战略性的思考者，一切都在计划之中', category: 'analyst' },
      { code: 'INTP', name: '逻辑学家', nickname: '客观分析者', description: '具有创造力的发明家，对知识有着止不住的渴望', category: 'analyst' },
      { code: 'ENTJ', name: '指挥官', nickname: '果断领导者', description: '大胆、富有想象力且意志强大的领导者', category: 'analyst' },
      { code: 'ENTP', name: '辩论家', nickname: '创新探索者', description: '聪明好奇的思想家，不会放过任何智力挑战', category: 'analyst' },
      { code: 'INFJ', name: '提倡者', nickname: '理想主义者', description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者', category: 'diplomat' },
      { code: 'INFP', name: '调停者', nickname: '理想主义者', description: '诗意、善良的利他主义者，总是热心地为正义事业提供帮助', category: 'diplomat' },
      { code: 'ENFJ', name: '主人公', nickname: '魅力领袖', description: '富有魅力且鼓舞人心的领导者，能够吸引听众', category: 'diplomat' },
      { code: 'ENFP', name: '竞选者', nickname: '热情创意者', description: '热情、有创造力且社交能力强的自由精神', category: 'diplomat' },
      { code: 'ISTJ', name: '物流师', nickname: '责任担当者', description: '实际且注重事实的个人，可靠性不容怀疑', category: 'sentinel' },
      { code: 'ISFJ', name: '守卫者', nickname: '温暖守护者', description: '非常专注且温暖的保护者，时刻准备着保护爱着的人', category: 'sentinel' },
      { code: 'ESTJ', name: '总经理', nickname: '高效管理者', description: '出色的管理者，在管理事情或人方面无与伦比', category: 'sentinel' },
      { code: 'ESFJ', name: '执政官', nickname: '热心助人者', description: '极有同情心、爱交际、受欢迎的人，总是热心地提供帮助', category: 'sentinel' },
      { code: 'ISTP', name: '鉴赏家', nickname: '灵活实干家', description: '大胆而实际的实验家，掌握各种工具', category: 'explorer' },
      { code: 'ISFP', name: '探险家', nickname: '艺术创作者', description: '灵活有魅力的艺术家，时刻准备着探索和体验新事物', category: 'explorer' },
      { code: 'ESTP', name: '企业家', nickname: '活力行动派', description: '聪明、精力充沛、善于感知的人，真正享受生活在边缘', category: 'explorer' },
      { code: 'ESFP', name: '表演者', nickname: '活力四射者', description: '自发的、精力充沛的和热情的表演者——生活在他们周围永远不会无聊', category: 'explorer' },
    ]

    for (const mbti of mbtiTypes) {
      await session.run(`
        CREATE (m:MBTIType {
          code: $code,
          name: $name,
          nickname: $nickname,
          description: $description,
          category: $category
        })
      `, mbti)
    }

    // 创建技能节点
    console.log('Creating skills...')
    const skills = [
      // 编程技能
      { id: 'python', name: 'Python', category: 'programming', level: 'beginner', description: 'AI/ML 首选编程语言' },
      { id: 'pytorch', name: 'PyTorch', category: 'programming', level: 'intermediate', description: '深度学习框架' },
      { id: 'tensorflow', name: 'TensorFlow', category: 'programming', level: 'intermediate', description: '深度学习框架' },
      { id: 'sql', name: 'SQL', category: 'programming', level: 'beginner', description: '数据库查询语言' },
      
      // 数学技能
      { id: 'linear-algebra', name: '线性代数', category: 'math', level: 'intermediate', description: '矩阵运算、向量空间' },
      { id: 'probability', name: '概率论与统计', category: 'math', level: 'intermediate', description: '概率分布、假设检验' },
      { id: 'calculus', name: '微积分', category: 'math', level: 'intermediate', description: '导数、积分、优化' },
      
      // ML 技能
      { id: 'ml-basics', name: '机器学习基础', category: 'ml', level: 'beginner', description: '监督/无监督学习、模型评估' },
      { id: 'deep-learning', name: '深度学习', category: 'ml', level: 'intermediate', description: '神经网络、CNN、RNN' },
      { id: 'nlp', name: '自然语言处理', category: 'ml', level: 'advanced', description: '文本处理、Transformer、LLM' },
      { id: 'cv', name: '计算机视觉', category: 'ml', level: 'advanced', description: '图像处理、目标检测、分割' },
      { id: 'reinforcement-learning', name: '强化学习', category: 'ml', level: 'advanced', description: '策略学习、Q-learning' },
      
      // 数据技能
      { id: 'data-analysis', name: '数据分析', category: 'data', level: 'beginner', description: '数据清洗、探索性分析' },
      { id: 'data-visualization', name: '数据可视化', category: 'data', level: 'beginner', description: '图表制作、Dashboard' },
      { id: 'feature-engineering', name: '特征工程', category: 'data', level: 'intermediate', description: '特征提取、转换、选择' },
      
      // 软技能
      { id: 'communication', name: '沟通能力', category: 'soft', level: 'beginner', description: '技术表达、团队协作' },
      { id: 'problem-solving', name: '问题解决', category: 'soft', level: 'intermediate', description: '分析问题、设计方案' },
      { id: 'project-management', name: '项目管理', category: 'soft', level: 'intermediate', description: '计划、执行、监控' },
    ]

    for (const skill of skills) {
      await session.run(`
        CREATE (s:Skill {
          id: $id,
          name: $name,
          category: $category,
          level: $level,
          description: $description
        })
      `, skill)
    }

    // 创建职业节点
    console.log('Creating careers...')
    const careers = [
      {
        id: 'ai-researcher',
        name: 'AI 研究员',
        description: '探索前沿算法和深度学习模型，推动人工智能理论发展',
        icon: '🔬',
        category: 'research',
        salaryRange: '¥30k-80k/月',
        demandLevel: 'high',
        growthPotential: 9,
      },
      {
        id: 'ml-engineer',
        name: 'AI 算法工程师',
        description: '设计和优化机器学习模型，解决实际业务问题',
        icon: '⚙️',
        category: 'engineering',
        salaryRange: '¥25k-60k/月',
        demandLevel: 'high',
        growthPotential: 8,
      },
      {
        id: 'nlp-engineer',
        name: 'NLP 工程师',
        description: '开发自然语言处理系统，实现语音识别、机器翻译等功能',
        icon: '💬',
        category: 'engineering',
        salaryRange: '¥28k-65k/月',
        demandLevel: 'high',
        growthPotential: 9,
      },
      {
        id: 'cv-engineer',
        name: '计算机视觉工程师',
        description: '开发图像识别、物体检测等视觉系统',
        icon: '👁️',
        category: 'engineering',
        salaryRange: '¥27k-62k/月',
        demandLevel: 'high',
        growthPotential: 8,
      },
      {
        id: 'ai-pm',
        name: 'AI 产品经理',
        description: '定义 AI 产品方向，连接技术和用户需求',
        icon: '📊',
        category: 'product',
        salaryRange: '¥20k-50k/月',
        demandLevel: 'medium',
        growthPotential: 7,
      },
      {
        id: 'data-scientist',
        name: '数据科学家',
        description: '分析大数据，挖掘数据价值，构建预测模型',
        icon: '📈',
        category: 'engineering',
        salaryRange: '¥22k-55k/月',
        demandLevel: 'high',
        growthPotential: 8,
      },
      {
        id: 'ai-designer',
        name: 'AI 交互设计师',
        description: '设计 AI 产品的用户界面和交互体验',
        icon: '🎨',
        category: 'design',
        salaryRange: '¥18k-45k/月',
        demandLevel: 'medium',
        growthPotential: 7,
      },
    ]

    for (const career of careers) {
      await session.run(`
        CREATE (c:Career {
          id: $id,
          name: $name,
          description: $description,
          icon: $icon,
          category: $category,
          salaryRange: $salaryRange,
          demandLevel: $demandLevel,
          growthPotential: $growthPotential
        })
      `, career)
    }

    // 创建课程节点
    console.log('Creating courses...')
    const courses = [
      {
        id: 'python-basics',
        name: 'Python 编程基础',
        description: '零基础入门 Python，掌握编程思维',
        provider: 'Coursera',
        duration: '40小时',
        difficulty: 'beginner',
        rating: 4.8,
        url: 'https://coursera.org',
      },
      {
        id: 'math-for-ml',
        name: '机器学习数学基础',
        description: '线性代数、概率论、微积分核心知识',
        provider: 'Khan Academy',
        duration: '60小时',
        difficulty: 'intermediate',
        rating: 4.7,
        url: 'https://khanacademy.org',
      },
      {
        id: 'ml-coursera',
        name: '机器学习 (Andrew Ng)',
        description: '斯坦福大学经典机器学习课程',
        provider: 'Coursera',
        duration: '60小时',
        difficulty: 'intermediate',
        rating: 4.9,
        url: 'https://coursera.org/learn/machine-learning',
      },
      {
        id: 'deep-learning-ai',
        name: '深度学习专项课程',
        description: '系统学习神经网络和深度学习',
        provider: 'DeepLearning.AI',
        duration: '80小时',
        difficulty: 'intermediate',
        rating: 4.8,
        url: 'https://deeplearning.ai',
      },
      {
        id: 'pytorch-course',
        name: 'PyTorch 深度学习实战',
        description: '使用 PyTorch 构建神经网络',
        provider: 'Fast.ai',
        duration: '50小时',
        difficulty: 'intermediate',
        rating: 4.7,
        url: 'https://fast.ai',
      },
      {
        id: 'nlp-stanford',
        name: 'NLP 入门到精通',
        description: '自然语言处理核心技术和应用',
        provider: 'Stanford Online',
        duration: '70小时',
        difficulty: 'advanced',
        rating: 4.6,
        url: 'https://stanford.edu',
      },
      {
        id: 'cv-course',
        name: '计算机视觉实战',
        description: '图像处理、目标检测、图像分割',
        provider: 'Udacity',
        duration: '60小时',
        difficulty: 'advanced',
        rating: 4.5,
        url: 'https://udacity.com',
      },
      {
        id: 'llm-course',
        name: '大语言模型原理与应用',
        description: '理解 Transformer、GPT、LLM 微调',
        provider: 'Hugging Face',
        duration: '40小时',
        difficulty: 'advanced',
        rating: 4.8,
        url: 'https://huggingface.co/learn',
      },
      {
        id: 'data-analysis-course',
        name: '数据分析实战',
        description: 'Pandas、NumPy、数据可视化',
        provider: 'DataCamp',
        duration: '30小时',
        difficulty: 'beginner',
        rating: 4.6,
        url: 'https://datacamp.com',
      },
      {
        id: 'sql-course',
        name: 'SQL 数据库入门',
        description: '掌握 SQL 查询和数据库操作',
        provider: 'Codecademy',
        duration: '20小时',
        difficulty: 'beginner',
        rating: 4.5,
        url: 'https://codecademy.com',
      },
    ]

    for (const course of courses) {
      await session.run(`
        CREATE (c:Course {
          id: $id,
          name: $name,
          description: $description,
          provider: $provider,
          duration: $duration,
          difficulty: $difficulty,
          rating: $rating,
          url: $url
        })
      `, course)
    }

    // 创建学习路径
    console.log('Creating learning paths...')
    const learningPaths = [
      {
        id: 'ml-engineer-path',
        name: 'AI 算法工程师学习路径',
        description: '从零基础到掌握机器学习核心技能',
        targetCareer: 'ml-engineer',
        estimatedDuration: '6-12个月',
      },
      {
        id: 'nlp-engineer-path',
        name: 'NLP 工程师学习路径',
        description: '成为自然语言处理专家',
        targetCareer: 'nlp-engineer',
        estimatedDuration: '8-14个月',
      },
      {
        id: 'data-scientist-path',
        name: '数据科学家学习路径',
        description: '掌握数据分析和机器学习',
        targetCareer: 'data-scientist',
        estimatedDuration: '6-10个月',
      },
    ]

    for (const path of learningPaths) {
      await session.run(`
        CREATE (lp:LearningPath {
          id: $id,
          name: $name,
          description: $description,
          estimatedDuration: $estimatedDuration
        })
        WITH lp
        MATCH (c:Career {id: $targetCareer})
        CREATE (lp)-[:TARGETS]->(c)
      `, path)
    }

    // 创建关系: 职业 -> MBTI
    console.log('Creating Career-MBTI relationships...')
    const careerMBTI = [
      { career: 'ai-researcher', mbtis: ['INTJ', 'INTP'] },
      { career: 'ml-engineer', mbtis: ['INTJ', 'INTP', 'ENTJ', 'ISTP'] },
      { career: 'nlp-engineer', mbtis: ['INTJ', 'INTP', 'ENTP'] },
      { career: 'cv-engineer', mbtis: ['INTJ', 'INTP', 'ISTP'] },
      { career: 'ai-pm', mbtis: ['ENTJ', 'ENTP', 'ENFJ', 'ESTJ'] },
      { career: 'data-scientist', mbtis: ['INTP', 'INTJ', 'ENTJ', 'ISTJ'] },
      { career: 'ai-designer', mbtis: ['ENFP', 'INFP', 'ISFP', 'ESFP'] },
    ]

    for (const { career, mbtis } of careerMBTI) {
      for (const mbti of mbtis) {
        await session.run(`
          MATCH (c:Career {id: $career})
          MATCH (m:MBTIType {code: $mbti})
          CREATE (c)-[:SUITS]->(m)
        `, { career, mbti })
      }
    }

    // 创建关系: 职业 -> 技能
    console.log('Creating Career-Skill relationships...')
    const careerSkills = [
      { career: 'ai-researcher', skills: ['python', 'pytorch', 'deep-learning', 'linear-algebra', 'probability', 'calculus'] },
      { career: 'ml-engineer', skills: ['python', 'pytorch', 'tensorflow', 'ml-basics', 'deep-learning', 'feature-engineering'] },
      { career: 'nlp-engineer', skills: ['python', 'pytorch', 'nlp', 'deep-learning'] },
      { career: 'cv-engineer', skills: ['python', 'pytorch', 'cv', 'deep-learning'] },
      { career: 'ai-pm', skills: ['ml-basics', 'communication', 'project-management', 'problem-solving'] },
      { career: 'data-scientist', skills: ['python', 'sql', 'ml-basics', 'data-analysis', 'data-visualization', 'probability'] },
      { career: 'ai-designer', skills: ['communication', 'problem-solving'] },
    ]

    for (const { career, skills } of careerSkills) {
      for (const skill of skills) {
        await session.run(`
          MATCH (c:Career {id: $career})
          MATCH (s:Skill {id: $skill})
          CREATE (c)-[:REQUIRES]->(s)
        `, { career, skill })
      }
    }

    // 创建关系: 课程 -> 技能
    console.log('Creating Course-Skill relationships...')
    const courseSkills = [
      { course: 'python-basics', skills: ['python'] },
      { course: 'math-for-ml', skills: ['linear-algebra', 'probability', 'calculus'] },
      { course: 'ml-coursera', skills: ['ml-basics', 'python'] },
      { course: 'deep-learning-ai', skills: ['deep-learning', 'pytorch', 'tensorflow'] },
      { course: 'pytorch-course', skills: ['pytorch', 'deep-learning'] },
      { course: 'nlp-stanford', skills: ['nlp', 'deep-learning'] },
      { course: 'cv-course', skills: ['cv', 'deep-learning'] },
      { course: 'llm-course', skills: ['nlp', 'deep-learning'] },
      { course: 'data-analysis-course', skills: ['data-analysis', 'data-visualization', 'python'] },
      { course: 'sql-course', skills: ['sql'] },
    ]

    for (const { course, skills } of courseSkills) {
      for (const skill of skills) {
        await session.run(`
          MATCH (c:Course {id: $course})
          MATCH (s:Skill {id: $skill})
          CREATE (c)-[:TEACHES]->(s)
        `, { course, skill })
      }
    }

    // 创建关系: 学习路径 -> 课程
    console.log('Creating LearningPath-Course relationships...')
    const pathCourses = [
      { path: 'ml-engineer-path', courses: ['python-basics', 'math-for-ml', 'ml-coursera', 'deep-learning-ai', 'pytorch-course'] },
      { path: 'nlp-engineer-path', courses: ['python-basics', 'math-for-ml', 'ml-coursera', 'deep-learning-ai', 'nlp-stanford', 'llm-course'] },
      { path: 'data-scientist-path', courses: ['python-basics', 'sql-course', 'data-analysis-course', 'math-for-ml', 'ml-coursera'] },
    ]

    for (const { path, courses } of pathCourses) {
      for (let i = 0; i < courses.length; i++) {
        await session.run(`
          MATCH (lp:LearningPath {id: $path})
          MATCH (c:Course {id: $course})
          CREATE (lp)-[:INCLUDES {order: $order}]->(c)
        `, { path, course: courses[i], order: i + 1 })
      }
    }

    console.log('✅ Database seeded successfully!')
    
    // 显示统计信息
    const stats = await session.run(`
      MATCH (m:MBTIType) WITH count(m) as mbtis
      MATCH (c:Career) WITH mbtis, count(c) as careers
      MATCH (s:Skill) WITH mbtis, careers, count(s) as skills
      MATCH (co:Course) WITH mbtis, careers, skills, count(co) as courses
      MATCH (lp:LearningPath) WITH mbtis, careers, skills, courses, count(lp) as paths
      RETURN mbtis, careers, skills, courses, paths
    `)
    
    const record = stats.records[0]
    console.log('\n📊 Database Statistics:')
    console.log(`   MBTI Types: ${record.get('mbtis')}`)
    console.log(`   Careers: ${record.get('careers')}`)
    console.log(`   Skills: ${record.get('skills')}`)
    console.log(`   Courses: ${record.get('courses')}`)
    console.log(`   Learning Paths: ${record.get('paths')}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await session.close()
    await closeNeo4j()
  }
}

// 运行
seedDatabase()
