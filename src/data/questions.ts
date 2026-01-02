/**
 * MBTI 测试题库
 * 
 * 包含各种题型的示例题目
 */

import type { Question, BinaryQuestion, ScaleQuestion, ScenarioQuestion, RankingQuestion } from '../types/mbti'

// ============================================
// 快速测试题目（12题，每个维度3题）
// ============================================
export const quickTestQuestions: Question[] = [
  // E/I 维度
  {
    id: 'q1',
    type: 'binary',
    text: '在社交场合中，你通常：',
    dimension: 'EI',
    category: 'quick',
    options: [
      { text: '主动与他人交谈，享受社交', value: 'E' },
      { text: '等待他人来找你交谈', value: 'I' },
    ],
  } as BinaryQuestion,
  {
    id: 'q2',
    type: 'binary',
    text: '周末休息时，你更倾向于：',
    dimension: 'EI',
    category: 'quick',
    options: [
      { text: '和朋友出去聚会、社交', value: 'E' },
      { text: '独处或只和亲密的人在一起', value: 'I' },
    ],
  } as BinaryQuestion,
  {
    id: 'q3',
    type: 'binary',
    text: '在团队项目中，你通常：',
    dimension: 'EI',
    category: 'quick',
    options: [
      { text: '喜欢领导和协调团队', value: 'E' },
      { text: '更喜欢独立完成自己的部分', value: 'I' },
    ],
  } as BinaryQuestion,

  // S/N 维度
  {
    id: 'q4',
    type: 'binary',
    text: '在处理信息时，你更关注：',
    dimension: 'SN',
    category: 'quick',
    options: [
      { text: '具体的事实和细节', value: 'S' },
      { text: '整体的模式和可能性', value: 'N' },
    ],
  } as BinaryQuestion,
  {
    id: 'q5',
    type: 'binary',
    text: '学习新事物时，你更喜欢：',
    dimension: 'SN',
    category: 'quick',
    options: [
      { text: '按部就班，从基础开始', value: 'S' },
      { text: '直接跳到感兴趣的部分', value: 'N' },
    ],
  } as BinaryQuestion,
  {
    id: 'q6',
    type: 'binary',
    text: '在学习或工作中，你更重视：',
    dimension: 'SN',
    category: 'quick',
    options: [
      { text: '掌握实用的技能和方法', value: 'S' },
      { text: '理解背后的原理和理论', value: 'N' },
    ],
  } as BinaryQuestion,

  // T/F 维度
  {
    id: 'q7',
    type: 'binary',
    text: '当你需要做决定时，你更倾向于：',
    dimension: 'TF',
    category: 'quick',
    options: [
      { text: '依靠逻辑和客观分析', value: 'T' },
      { text: '考虑他人感受和价值观', value: 'F' },
    ],
  } as BinaryQuestion,
  {
    id: 'q8',
    type: 'binary',
    text: '面对冲突时，你倾向于：',
    dimension: 'TF',
    category: 'quick',
    options: [
      { text: '直接面对，寻求解决方案', value: 'T' },
      { text: '先考虑如何维护关系', value: 'F' },
    ],
  } as BinaryQuestion,
  {
    id: 'q9',
    type: 'binary',
    text: '当朋友向你倾诉烦恼时，你通常：',
    dimension: 'TF',
    category: 'quick',
    options: [
      { text: '帮他分析问题，提供解决方案', value: 'T' },
      { text: '表示理解和支持，倾听他的感受', value: 'F' },
    ],
  } as BinaryQuestion,

  // J/P 维度
  {
    id: 'q10',
    type: 'binary',
    text: '你更喜欢的生活方式是：',
    dimension: 'JP',
    category: 'quick',
    options: [
      { text: '有计划、有组织的', value: 'J' },
      { text: '灵活、随性的', value: 'P' },
    ],
  } as BinaryQuestion,
  {
    id: 'q11',
    type: 'binary',
    text: '对于截止日期，你通常：',
    dimension: 'JP',
    category: 'quick',
    options: [
      { text: '提前完成任务', value: 'J' },
      { text: '在最后时刻完成', value: 'P' },
    ],
  } as BinaryQuestion,
  {
    id: 'q12',
    type: 'binary',
    text: '对于旅行，你更喜欢：',
    dimension: 'JP',
    category: 'quick',
    options: [
      { text: '提前详细规划行程', value: 'J' },
      { text: '到了再说，随机应变', value: 'P' },
    ],
  } as BinaryQuestion,
]

// ============================================
// 标准测试额外题目（量表题 + 更多二选一）
// ============================================
export const standardTestQuestions: Question[] = [
  ...quickTestQuestions,
  
  // 量表题示例
  {
    id: 's1',
    type: 'scale',
    text: '在一个聚会上，你会：',
    dimension: 'EI',
    category: 'standard',
    leftLabel: '主动认识新朋友',
    rightLabel: '只和熟人交流',
    leftValue: 'E',
    rightValue: 'I',
    scaleSize: 5,
  } as ScaleQuestion,
  {
    id: 's2',
    type: 'scale',
    text: '面对一个复杂问题，你倾向于：',
    dimension: 'SN',
    category: 'standard',
    leftLabel: '关注具体细节',
    rightLabel: '寻找整体规律',
    leftValue: 'S',
    rightValue: 'N',
    scaleSize: 5,
  } as ScaleQuestion,
  {
    id: 's3',
    type: 'scale',
    text: '做重要决定时，你更看重：',
    dimension: 'TF',
    category: 'standard',
    leftLabel: '逻辑和效率',
    rightLabel: '和谐与感受',
    leftValue: 'T',
    rightValue: 'F',
    scaleSize: 5,
  } as ScaleQuestion,
  {
    id: 's4',
    type: 'scale',
    text: '你的工作风格更接近：',
    dimension: 'JP',
    category: 'standard',
    leftLabel: '按计划执行',
    rightLabel: '灵活应变',
    leftValue: 'J',
    rightValue: 'P',
    scaleSize: 5,
  } as ScaleQuestion,

  // 更多二选一题目
  {
    id: 'b13',
    type: 'binary',
    text: '你更喜欢的工作环境是：',
    dimension: 'EI',
    category: 'standard',
    options: [
      { text: '开放式办公，方便交流', value: 'E' },
      { text: '独立空间，安静专注', value: 'I' },
    ],
  } as BinaryQuestion,
  {
    id: 'b14',
    type: 'binary',
    text: '阅读一本书时，你更关注：',
    dimension: 'SN',
    category: 'standard',
    options: [
      { text: '具体的故事情节和细节', value: 'S' },
      { text: '作者想表达的深层含义', value: 'N' },
    ],
  } as BinaryQuestion,
  {
    id: 'b15',
    type: 'binary',
    text: '评价一个方案时，你首先考虑：',
    dimension: 'TF',
    category: 'standard',
    options: [
      { text: '是否合理、可行', value: 'T' },
      { text: '是否照顾到所有人', value: 'F' },
    ],
  } as BinaryQuestion,
  {
    id: 'b16',
    type: 'binary',
    text: '你的房间通常是：',
    dimension: 'JP',
    category: 'standard',
    options: [
      { text: '整洁有序，物品归位', value: 'J' },
      { text: '有些凌乱，但我知道东西在哪', value: 'P' },
    ],
  } as BinaryQuestion,
]

// ============================================
// 深度分析额外题目（情景题 + 排序题）
// ============================================
export const deepTestQuestions: Question[] = [
  ...standardTestQuestions,

  // 情景题示例
  {
    id: 'sc1',
    type: 'scenario',
    text: '你被邀请参加一个你不太熟悉的人的生日派对',
    dimension: 'EI',
    category: 'deep',
    scenario: '周末你收到一个同事的生日派对邀请，你和这位同事只是点头之交，派对上可能有很多你不认识的人。',
    options: [
      { text: '欣然接受，这是认识新朋友的好机会', value: 'E', weight: 2 },
      { text: '接受邀请，但希望能带一个朋友一起去', value: 'E', weight: 1 },
      { text: '礼貌地找个理由婉拒', value: 'I', weight: 1 },
      { text: '直接说不太想去陌生人多的场合', value: 'I', weight: 2 },
    ],
  } as ScenarioQuestion,
  {
    id: 'sc2',
    type: 'scenario',
    text: '你需要为团队选择一个新项目方向',
    dimension: 'SN',
    category: 'deep',
    scenario: '作为项目负责人，你需要在两个方向中选择：A方向有成熟的技术方案和案例；B方向是新兴领域，潜力大但风险也大。',
    options: [
      { text: '选择A，稳妥可靠，有据可循', value: 'S', weight: 2 },
      { text: '倾向A，但会研究B的可行性', value: 'S', weight: 1 },
      { text: '倾向B，但会做好风险评估', value: 'N', weight: 1 },
      { text: '选择B，创新才能脱颖而出', value: 'N', weight: 2 },
    ],
  } as ScenarioQuestion,
  {
    id: 'sc3',
    type: 'scenario',
    text: '团队成员之间发生了分歧',
    dimension: 'TF',
    category: 'deep',
    scenario: '你的两个团队成员因为工作方式不同产生了矛盾，影响了项目进度。你需要介入处理这个问题。',
    options: [
      { text: '分析问题根源，制定明确的工作规范', value: 'T', weight: 2 },
      { text: '分别了解情况，找出最优解决方案', value: 'T', weight: 1 },
      { text: '分别与他们沟通，理解各自的感受', value: 'F', weight: 1 },
      { text: '组织团建活动，改善团队氛围', value: 'F', weight: 2 },
    ],
  } as ScenarioQuestion,

  // 排序题示例
  {
    id: 'r1',
    type: 'ranking',
    text: '按照你的偏好，对以下活动进行排序',
    dimension: 'EI',
    category: 'deep',
    items: [
      { id: 'r1a', text: '参加大型社交活动', value: 'E' },
      { id: 'r1b', text: '和三五好友小聚', value: 'E' },
      { id: 'r1c', text: '独自看书或看电影', value: 'I' },
      { id: 'r1d', text: '在家独处放松', value: 'I' },
    ],
  } as RankingQuestion,
  {
    id: 'r2',
    type: 'ranking',
    text: '学习新技能时，你更喜欢的方式（从最喜欢到最不喜欢）',
    dimension: 'SN',
    category: 'deep',
    items: [
      { id: 'r2a', text: '跟着教程一步步操作', value: 'S' },
      { id: 'r2b', text: '先了解整体框架再深入', value: 'N' },
      { id: 'r2c', text: '通过实际项目边做边学', value: 'S' },
      { id: 'r2d', text: '探索各种可能性和创新用法', value: 'N' },
    ],
  } as RankingQuestion,
]

// ============================================
// 根据测试类型获取题目
// ============================================
export const getQuestionsByCategory = (categoryId: string): Question[] => {
  switch (categoryId) {
    case 'quick':
      return quickTestQuestions
    case 'standard':
      return standardTestQuestions.slice(0, 48) // 取前48题
    case 'deep':
      return deepTestQuestions
    default:
      return quickTestQuestions
  }
}

// 获取单个题目
export const getQuestionById = (id: string): Question | undefined => {
  return deepTestQuestions.find(q => q.id === id)
}
