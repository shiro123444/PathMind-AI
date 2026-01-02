import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardLayout from './components/DashboardLayout'
import { AdminLayout } from './components/admin'
import HomePage from './pages/HomePage'
import HomePageBPCO from './pages/HomePageBPCO'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MBTITestPage from './pages/MBTITestPage'
import ResultsPage from './pages/ResultsPage'
import CareerPage from './pages/CareerPage'
import LearningPathPage from './pages/LearningPathPage'
import AIAdvisor from './pages/AIAdvisor'
import GraphPage from './pages/GraphPage'
import { AdminDashboard, AdminQuestions, AdminStudents } from './pages/admin'
import { LoadingProvider } from './components/LoadingProvider'
import { HeroUIProvider } from './providers/HeroUIProvider'
import { ThemeProvider } from './theme/ThemeContext'

function AppRoutes() {
  return (
    <HeroUIProvider>
      <LoadingProvider>
        <Routes>
          {/* 全屏页面 - 不使用 Layout */}
          <Route index element={<HomePageBPCO />} />
          <Route path="home-bpco" element={<HomePageBPCO />} />
          <Route path="login" element={<LoginPage />} />
          
          {/* Dashboard 页面 - 使用专业液态玻璃布局 */}
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="careers" element={<CareerPage />} />
            <Route path="learning-path" element={<LearningPathPage />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
            <Route path="graph" element={<GraphPage />} />
          </Route>
          
          {/* MBTI 测试页面 - 独立全屏 */}
          <Route path="mbti-test" element={<MBTITestPage />} />
          
          {/* 管理后台 - 使用 AdminLayout */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="students" element={<AdminStudents />} />
          </Route>
          
          {/* 旧版页面 - 使用原 Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="home-old" element={<HomePage />} />
          </Route>
        </Routes>
      </LoadingProvider>
    </HeroUIProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

