# AI Learning Path

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-5.15-4581C3?style=for-the-badge&logo=neo4j&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)

基于 MBTI 性格测试的 AI 学习路径推荐系统，通过性格分析为用户匹配 AI 领域的职业方向和学习规划。

## ✨ 主要功能

| 功能 | 描述 |
|------|------|
| 🧠 MBTI 性格测评 | 12 题快速版性格测试，精准分析性格类型 |
| 📊 性格维度分析 | 雷达图可视化展示 E/I、S/N、T/F、J/P 四维度得分 |
| 🎯 AI 职业推荐 | 基于性格类型智能匹配 AI 领域职业方向 |
| 📚 学习路径规划 | 个性化课程推荐，从入门到精通的完整学习路线 |
| 🤖 智能对话助手 | DeepSeek 大模型驱动的 24/7 学习顾问 |
| 🔗 知识图谱可视化 | Neo4j 图数据库实现技能、职业、课程关联展示 |

## 🛠️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 核心 UI 框架 |
| TypeScript | 5.9.3 | 类型安全的 JavaScript |
| Vite | 7.2.4 | 构建工具与开发服务器 |
| Tailwind CSS | 4.1.17 | 原子化 CSS 样式框架 |
| Framer Motion | 12.23.25 | 动画与交互效果 |
| HeroUI | 2.8.5 | UI 组件库 |
| React Router | 7.10.1 | 客户端路由 |
| Recharts | 3.5.1 | 数据可视化图表 |
| react-force-graph-2d | 1.29.0 | 知识图谱可视化 |
| Three.js | 0.181.2 | 3D 效果渲染 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Express | 4.18.2 | Node.js Web 框架 |
| TypeScript | 5.3.2 | 类型安全的后端开发 |
| Neo4j Driver | 5.15.0 | 图数据库连接驱动 |
| OpenAI SDK | 4.20.0 | DeepSeek API 调用 (兼容 OpenAI 接口) |
| Zod | 3.22.4 | 运行时类型验证 |
| UUID | 9.0.1 | 唯一标识符生成 |

### 开发工具

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范检查 |
| Vitest | 单元测试框架 |
| Testing Library | React 组件测试 |
| tsx | TypeScript 直接运行 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Neo4j Desktop 或 Neo4j AuraDB
- DeepSeek API Key

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/shiro123444/student-profile-frontend.git
cd student-profile-frontend

# 2. 安装依赖（推荐使用一键安装脚本）
# Linux/Mac:
./setup.sh
# Windows PowerShell:
.\setup.ps1

# 或手动安装：
npm install && cd server && npm install && cd ..

# 3. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 填写以下配置：
# - NEO4J_URI=bolt://localhost:7687
# - NEO4J_USER=neo4j
# - NEO4J_PASSWORD=你的Neo4j密码
# - DEEPSEEK_API_KEY=你的DeepSeek API Key

# 4. 启动 Neo4j Desktop，然后初始化数据
cd server && npm run seed && cd ..

# 5. 启动服务
# 终端 1 - 启动后端服务 (端口 3001)
cd server && npm run dev

# 终端 2 - 启动前端服务 (端口 5173)
npm run dev
```

### 访问地址

- 前端应用: http://localhost:5173
- 后端 API: http://localhost:3001/api
- 健康检查: http://localhost:3001/api/health

## 📁 项目结构

```
student-profile-frontend/
├── 📄 README.md              # 项目文档
├── 📄 package.json           # 前端依赖配置
├── 📄 vite.config.ts         # Vite 构建配置
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 eslint.config.js       # ESLint 代码规范配置
├── 📄 vitest.config.ts       # Vitest 测试配置
├── 📄 index.html             # HTML 入口文件
├── 📄 setup.sh               # Linux/Mac 一键安装脚本
├── 📄 setup.ps1              # Windows 一键安装脚本
│
├── 📂 src/                   # 前端源代码
│   ├── 📄 main.tsx           # 应用入口
│   ├── 📄 App.tsx            # 根组件与路由配置
│   ├── 📄 index.css          # 全局样式
│   │
│   ├── 📂 pages/             # 页面组件
│   │   ├── HomePageBPCO.tsx  # 首页（主入口）
│   │   ├── HomePage.tsx      # 旧版首页（备用）
│   │   ├── MBTITestPage.tsx  # MBTI 性格测试
│   │   ├── ResultsPage.tsx   # 测试结果页
│   │   ├── CareerPage.tsx    # 职业推荐页
│   │   ├── LearningPathPage.tsx # 学习路径页
│   │   ├── AIAdvisor.tsx     # AI 智能助手
│   │   ├── GraphPage.tsx     # 知识图谱页
│   │   ├── DashboardPage.tsx # 用户仪表盘
│   │   └── LoginPage.tsx     # 登录页
│   │
│   ├── 📂 components/        # 可复用组件
│   │   ├── 📂 ui/            # 基础 UI 组件
│   │   ├── 📂 premium/       # 高级效果组件
│   │   ├── 📂 animations/    # 动画组件
│   │   ├── Layout.tsx        # 布局组件
│   │   ├── Navbar.tsx        # 导航栏
│   │   ├── KnowledgeGraph.tsx # 知识图谱组件
│   │   └── LoadingProvider.tsx # 加载状态管理
│   │
│   ├── 📂 services/          # API 服务层
│   │   └── api.ts            # 后端 API 封装
│   │
│   ├── 📂 providers/         # React Context
│   │   └── HeroUIProvider.tsx # HeroUI 主题配置
│   │
│   ├── 📂 theme/             # 主题配置
│   │   ├── index.ts          # 主题导出
│   │   └── premium.ts        # 高级主题变量
│   │
│   ├── 📂 types/             # TypeScript 类型定义
│   │   └── student.ts        # 学生相关类型
│   │
│   ├── 📂 __tests__/         # 单元测试
│   │   ├── setup.ts          # 测试配置
│   │   └── 📂 properties/    # 属性测试
│   │
│   └── 📂 assets/            # 静态资源
│       └── react.svg         # React Logo
│
├── 📂 server/                # 后端源代码
│   ├── 📄 package.json       # 后端依赖配置
│   ├── 📄 tsconfig.json      # TypeScript 配置
│   ├── 📄 .env.example       # 环境变量示例
│   │
│   └── 📂 src/
│       ├── 📄 index.ts       # 服务入口
│       │
│       ├── 📂 config/        # 配置文件
│       │   ├── neo4j.ts      # Neo4j 数据库连接
│       │   └── deepseek.ts   # DeepSeek API 配置
│       │
│       ├── 📂 routes/        # API 路由
│       │   ├── mbti.ts       # MBTI 测试相关 API
│       │   ├── career.ts     # 职业推荐 API
│       │   ├── learning-path.ts # 学习路径 API
│       │   ├── chat.ts       # AI 对话 API
│       │   └── graph.ts      # 知识图谱 API
│       │
│       ├── 📂 scripts/       # 脚本
│       │   └── seed-neo4j.ts # 数据库初始化脚本
│       │
│       └── 📂 types/         # 类型定义
│
└── 📂 public/                # 公共静态资源
    └── vite.svg              # 网站图标
```

## 📚 API 文档

### MBTI 相关

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/mbti/submit` | 提交 MBTI 测试结果 |
| GET | `/api/mbti/type/:code` | 获取指定 MBTI 类型信息 |
| GET | `/api/mbti/types` | 获取所有 MBTI 类型 |

### 职业推荐

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/careers/recommend/:mbtiCode` | 根据 MBTI 推荐职业 |
| GET | `/api/careers/:careerId` | 获取职业详情 |
| GET | `/api/careers` | 获取所有职业 |

### 学习路径

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/learning-path/career/:careerId` | 获取职业对应学习路径 |
| GET | `/api/learning-path/:pathId` | 获取学习路径详情 |
| GET | `/api/learning-path/recommend/:studentId` | 获取个性化推荐 |

### AI 对话

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/chat` | 发送消息给 AI 助手 |
| GET | `/api/chat/suggestions/:studentId` | 获取个性化问题建议 |

### 知识图谱

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/graph/full` | 获取完整知识图谱 |
| GET | `/api/graph/student/:studentId` | 获取学生相关图谱 |
| GET | `/api/graph/career/:careerId` | 获取职业相关图谱 |

## 🧪 开发命令

```bash
# 前端命令
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 代码规范检查
npm run test         # 运行测试
npm run test:watch   # 监听模式测试
npm run test:coverage # 测试覆盖率报告

# 后端命令 (在 server 目录下)
npm run dev          # 启动开发服务器 (热重载)
npm run build        # 编译 TypeScript
npm run start        # 启动生产服务器
npm run seed         # 初始化数据库数据
```

## 📝 文件分类说明

### 核心代码文件
- `src/` - 前端 React 应用源代码
- `server/src/` - 后端 Express 服务源代码

### 配置文件
- `package.json` - 项目依赖和脚本配置
- `vite.config.ts` - Vite 构建配置
- `tsconfig.*.json` - TypeScript 编译配置
- `eslint.config.js` - 代码规范配置
- `vitest.config.ts` - 测试框架配置

### 安装脚本
- `setup.sh` - Linux/Mac 一键安装脚本
- `setup.ps1` - Windows PowerShell 一键安装脚本

### 环境配置
- `server/.env.example` - 环境变量模板（需复制为 `.env` 并填写）
- `server/.env` - 实际环境变量（已在 `.gitignore` 中忽略）

### 静态资源
- `public/` - 公共静态资源
- `src/assets/` - 前端静态资源

### 测试文件
- `src/__tests__/` - 前端单元测试

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件
