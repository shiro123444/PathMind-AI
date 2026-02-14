module.exports = {
  apps: [
    {
      name: 'pathmind-frontend',
      cwd: '/root/PathMind-AI',
      script: 'npx',
      args: 'vite --host 0.0.0.0 --port 5174',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'pathmind-backend',
      cwd: '/root/PathMind-AI/server',
      script: 'node',
      args: 'dist/index.js',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      autorestart: true,
      max_restarts: 10
    }
  ]
}
