# AI Learning Path

基于 MBTI 性格测试的 AI 学习路径推荐系统，通过性格分析为用户匹配 AI 领域的职业方向和学习规划。

## 技术栈

**前端**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + Framer Motion + HeroUI

**后端**: Express + TypeScript + Neo4j + DeepSeek API

**可视化**: Recharts + react-force-graph-2d + Three.js

## 快速开始

```bash
# 安装依赖
npm install && cd server && npm install && cd ..

# 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 填写 Neo4j 和 DeepSeek API 配置

# 启动 Neo4j Desktop，然后初始化数据
cd server && npm run seed

# 启动服务
cd server && npm run dev  # 后端 :3001
npm run dev               # 前端 :5173
```

## 主要功能

- MBTI 性格测评（12题快速版）
- 雷达图性格维度分析
- AI 职业方向推荐
- 个性化学习路径规划
- DeepSeek 智能对话助手
- Neo4j 知识图谱可视化

## 项目结构

```
src/           # 前端 React 应用
  ├── components/   # UI 组件
  ├── pages/        # 页面
  └── services/     # API 调用

server/        # 后端 Express 服务
  └── src/
      ├── config/   # 数据库配置
      ├── routes/   # API 路由
      └── scripts/  # 数据初始化脚本
```

## License

MIT
