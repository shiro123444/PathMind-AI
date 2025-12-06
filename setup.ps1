# AI 学生画像系统 - 一键安装脚本 (Windows PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI 学生画像系统 - 环境安装" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查 Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未检测到 Node.js，请先安装: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $(node -v)" -ForegroundColor Green

# 安装前端依赖
Write-Host "`n📦 安装前端依赖..." -ForegroundColor Yellow
npm install

# 安装后端依赖
Write-Host "`n📦 安装后端依赖..." -ForegroundColor Yellow
Set-Location server
npm install
Set-Location ..

# 创建环境变量文件
if (!(Test-Path "server\.env")) {
    Write-Host "`n📝 创建环境变量文件..." -ForegroundColor Yellow
    @"
# Neo4j 数据库配置
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here

# DeepSeek API
DEEPSEEK_API_KEY=your_api_key_here

# 服务端口
PORT=3001
"@ | Out-File -FilePath "server\.env" -Encoding UTF8
    Write-Host "⚠️  请编辑 server/.env 文件，填入 Neo4j 密码和 DeepSeek API Key" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ 安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n启动方式:" -ForegroundColor White
Write-Host "  1. 启动 Neo4j 数据库" -ForegroundColor Gray
Write-Host "  2. 配置 server/.env" -ForegroundColor Gray
Write-Host "  3. cd server && npm run seed  # 初始化数据" -ForegroundColor Gray
Write-Host "  4. cd server && npm run dev   # 启动后端" -ForegroundColor Gray
Write-Host "  5. npm run dev                # 启动前端" -ForegroundColor Gray
Write-Host ""
