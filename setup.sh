#!/bin/bash
# AI 学生画像系统 - 一键安装脚本 (Linux/Mac)

echo "========================================"
echo "  AI 学生画像系统 - 环境安装"
echo "========================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# 安装前端依赖
echo -e "\n📦 安装前端依赖..."
npm install

# 安装后端依赖
echo -e "\n📦 安装后端依赖..."
cd server
npm install
cd ..

# 创建环境变量文件
if [ ! -f "server/.env" ]; then
    echo -e "\n📝 创建环境变量文件..."
    cat > server/.env << EOF
# Neo4j 数据库配置
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here

# DeepSeek API
DEEPSEEK_API_KEY=your_api_key_here

# 服务端口
PORT=3001
EOF
    echo "⚠️  请编辑 server/.env 文件，填入 Neo4j 密码和 DeepSeek API Key"
fi

echo -e "\n========================================"
echo "  ✅ 安装完成！"
echo "========================================"
echo -e "\n启动方式:"
echo "  1. 启动 Neo4j 数据库"
echo "  2. 配置 server/.env"
echo "  3. cd server && npm run seed  # 初始化数据"
echo "  4. cd server && npm run dev   # 启动后端"
echo "  5. npm run dev                # 启动前端"
