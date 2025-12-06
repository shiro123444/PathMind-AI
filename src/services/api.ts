// API 服务层 - 连接后端 API

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 通用请求函数
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || '请求失败' };
    }

    return result;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return { success: false, error: '网络错误，请检查后端服务是否启动' };
  }
}

// ==================== MBTI 相关 API ====================

export interface MBTIAnswer {
  questionId: number;
  answer: 'A' | 'B';
}

export interface MBTISubmitData {
  studentName: string;
  answers: MBTIAnswer[];
}

export interface MBTIResult {
  studentId: string;
  mbtiCode: string;
  mbtiType: {
    code: string;
    name: string;
    nickname: string;
    description: string;
    category: string;
  };
  dimensions: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

export interface MBTIType {
  code: string;
  name: string;
  nickname: string;
  description: string;
  category: string;
}

export const mbtiApi = {
  // 提交 MBTI 测试结果
  submit: (data: MBTISubmitData) =>
    request<MBTIResult>('/mbti/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取指定 MBTI 类型信息
  getType: (code: string) => request<MBTIType>(`/mbti/type/${code}`),

  // 获取所有 MBTI 类型
  getAllTypes: () => request<MBTIType[]>('/mbti/types'),
};

// ==================== 职业相关 API ====================

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  salaryRange: string;
  demandLevel: string;
  requiredSkills: Skill[];
  suitableMBTI: string[];
}

export const careerApi = {
  // 根据 MBTI 类型推荐职业
  recommend: (mbtiCode: string) => request<Career[]>(`/careers/recommend/${mbtiCode}`),

  // 获取职业详情
  getById: (careerId: string) => request<Career>(`/careers/${careerId}`),

  // 获取所有职业
  getAll: () => request<Career[]>('/careers'),
};

// ==================== 学习路径 API ====================

export interface Course {
  id: string;
  name: string;
  provider: string;
  url: string;
  duration: string;
  level: string;
  description: string;
  rating: number;
  skills: string[];
  completed?: boolean;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  courses: Course[];
  targetCareer?: Career;
}

export const learningPathApi = {
  // 获取职业对应的学习路径
  getByCareer: (careerId: string) => request<LearningPath[]>(`/learning-paths/career/${careerId}`),

  // 获取学习路径详情
  getById: (pathId: string) => request<LearningPath>(`/learning-paths/${pathId}`),

  // 获取学生个性化学习路径推荐
  recommend: (studentId: string) => request<LearningPath[]>(`/learning-paths/recommend/${studentId}`),
};

// ==================== AI 对话 API ====================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
}

export const chatApi = {
  // 发送消息给 AI
  send: (messages: ChatMessage[], studentId?: string) =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, studentId }),
    }),

  // 获取个性化问题建议
  getSuggestions: (studentId: string) =>
    request<string[]>(`/chat/suggestions/${studentId}`),
};

// ==================== 知识图谱 API ====================

export interface GraphNode {
  id: string;
  name: string;
  type: 'student' | 'mbti' | 'career' | 'skill' | 'course' | 'learning_path';
  color: string;
  size: number;
  description?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  label: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const graphApi = {
  // 获取学生相关的知识图谱
  getStudentGraph: (studentId: string) =>
    request<KnowledgeGraphData>(`/graph/student/${studentId}`),

  // 获取职业相关的知识图谱
  getCareerGraph: (careerId: string) =>
    request<KnowledgeGraphData>(`/graph/career/${careerId}`),

  // 获取完整知识图谱
  getFullGraph: () => request<KnowledgeGraphData>('/graph/full'),
};

// ==================== 学生相关 API ====================

export interface Student {
  id: string;
  name: string;
  mbtiCode?: string;
  completedCourses?: string[];
  targetCareers?: string[];
  createdAt?: string;
}

export const studentApi = {
  // 获取学生信息
  getById: (studentId: string) => request<Student>(`/students/${studentId}`),

  // 更新学生信息
  update: (studentId: string, data: Partial<Student>) =>
    request<Student>(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ==================== 健康检查 ====================

export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('/health'),
};

// 导出所有 API
export default {
  mbti: mbtiApi,
  career: careerApi,
  learningPath: learningPathApi,
  chat: chatApi,
  graph: graphApi,
  student: studentApi,
  health: healthApi,
};
