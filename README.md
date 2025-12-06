# AI 学生画像系统

基于 MBTI 性格测试的学生画像分析系统，提供职业推荐、学习路径规划和 AI 智能顾问。

## 技术栈

**前端**: React 19 + TypeScript + Vite + Tailwind CSS + react-force-graph-2d  
**后端**: Express + TypeScript + Neo4j + DeepSeek AI

## 快速开始

### 1. 安装依赖

`powershell
# Windows
.\setup.ps1

# Linux/Mac
chmod +x setup.sh && ./setup.sh
`

或手动安装：
`ash
npm install
cd server && npm install
`

### 2. 配置环境变量

编辑 server/.env：
`env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=你的密码
DEEPSEEK_API_KEY=你的API密钥
PORT=3001
`

### 3. 启动 Neo4j

下载 [Neo4j Desktop](https://neo4j.com/download/) 并启动数据库。

### 4. 初始化数据

`ash
cd server
npm run seed
`

### 5. 启动服务

`ash
# 终端1 - 后端
cd server && npm run dev

# 终端2 - 前端
npm run dev
`

访问 http://localhost:5173

## 功能

- MBTI 测试 - 48题性格测评
- 学生画像 - 多维度能力分析
- 职业推荐 - 基于性格匹配职业
- 学习路径 - 个性化课程规划
- AI 顾问 - DeepSeek 智能对话
- 知识图谱 - Neo4j 可视化关系网络

## 项目结构

`
 src/                  # 前端源码
    components/       # 组件
    pages/           # 页面
    services/        # API 服务
 server/              # 后端源码
    src/
       config/      # Neo4j/DeepSeek 配置
       routes/      # API 路由
       scripts/     # 数据初始化脚本
 setup.ps1/setup.sh   # 安装脚本
`

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/mbti/submit | 提交测试答案 |
| GET | /api/career/recommendations/:mbtiCode | 获取职业推荐 |
| GET | /api/learning-path/:studentId | 获取学习路径 |
| POST | /api/chat | AI 对话 |
| GET | /api/graph/full | 获取完整知识图谱 |
