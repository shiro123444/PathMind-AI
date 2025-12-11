import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
import { LoadingProvider } from './components/LoadingProvider'
import { HeroUIProvider } from './providers/HeroUIProvider'

function AppRoutes() {
  return (
    <HeroUIProvider>
      <LoadingProvider>
        <Routes>
          {/* 全屏页面 - 不使用 Layout */}
          <Route index element={<HomePageBPCO />} />
          <Route path="home-bpco" element={<HomePageBPCO />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="mbti-test" element={<MBTITestPage />} />
          <Route path="ai-advisor" element={<AIAdvisor />} />
          
          {/* 常规页面 - 使用 Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="home-old" element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="careers" element={<CareerPage />} />
            <Route path="learning-path" element={<LearningPathPage />} />
          </Route>
        </Routes>
      </LoadingProvider>
    </HeroUIProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App

