import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MBTITestPage from './pages/MBTITestPage'
import ResultsPage from './pages/ResultsPage'
import CareerPage from './pages/CareerPage'
import LearningPathPage from './pages/LearningPathPage'
import AIAdvisor from './pages/AIAdvisor'
import GraphPage from './pages/GraphPage'
import { LoadingProvider } from './components/LoadingProvider'

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          {/* 全屏页面 - 不使用 Layout */}
          <Route path="graph" element={<GraphPage />} />
          
          {/* 常规页面 - 使用 Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="mbti-test" element={<MBTITestPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="careers" element={<CareerPage />} />
            <Route path="learning-path" element={<LearningPathPage />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
          </Route>
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  )
}

export default App

