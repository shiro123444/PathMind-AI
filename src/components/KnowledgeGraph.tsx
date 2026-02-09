import { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// 定义图谱数据类型
interface GraphNode {
  id: string;
  name: string;
  type: 'student' | 'mbti' | 'career' | 'skill' | 'course' | 'learning_path';
  color: string;
  size: number;
  description?: string;
  [key: string]: unknown;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
  label: string;
}

interface KnowledgeGraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

interface KnowledgeGraphProps {
  studentId?: string;
  careerId?: string;
  mode?: 'student' | 'career' | 'full';
  onNodeClick?: (node: GraphNode) => void;
}

// 节点类型颜色映射 - 浅色主题
const nodeColors: Record<string, string> = {
  student: '#ec4899', // 粉色
  mbti: '#8b5cf6', // 紫色
  career: '#10b981', // 绿色
  skill: '#f59e0b', // 橙黄色
  course: '#3b82f6', // 蓝色
  learning_path: '#ef4444', // 红色
};

// 节点类型大小映射 - 增大尺寸提高可读性
const nodeSizes: Record<string, number> = {
  student: 16,
  mbti: 14,
  career: 18,
  skill: 10,
  course: 12,
  learning_path: 14,
};

// 节点类型中文名
const nodeTypeLabels: Record<string, string> = {
  student: '学生',
  mbti: 'MBTI类型',
  career: '职业',
  skill: '技能',
  course: '课程',
  learning_path: '学习路径',
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function KnowledgeGraph({
  studentId,
  careerId,
  mode = 'full',
  onNodeClick,
}: KnowledgeGraphProps) {
  const graphRef = useRef<any>(null);
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 800, 
    height: typeof window !== 'undefined' ? window.innerHeight : 600 
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取图谱数据
  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${API_BASE}/graph`;

        if (mode === 'student' && studentId) {
          url = `${API_BASE}/graph/student/${studentId}`;
        } else if (mode === 'career' && careerId) {
          url = `${API_BASE}/graph/career/${careerId}`;
        } else {
          url = `${API_BASE}/graph/full`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          // 转换数据格式以适配 ForceGraph2D
          const formattedData = {
            nodes: result.data.nodes.map((node: GraphNode) => ({
              ...node,
              color: node.color || nodeColors[node.type] || '#9ca3af',
              size: node.size || nodeSizes[node.type] || 8,
            })),
            links: result.data.edges.map((edge: GraphEdge) => ({
              source: edge.source,
              target: edge.target,
              label: edge.label,
              type: edge.type,
            })),
          };
          setGraphData(formattedData);
        } else {
          setError(result.error || '获取图谱数据失败');
        }
      } catch (err) {
        console.error('获取图谱数据失败:', err);
        setError('无法连接到服务器，请确保后端服务已启动');
        
        // 开发模式下使用模拟数据
        if (import.meta.env.DEV) {
          setGraphData(getMockData());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [mode, studentId, careerId]);

  // 响应容器大小变化 - 使用 ResizeObserver
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // 使用 getBoundingClientRect 获取准确尺寸，如果为 0 则使用 window 尺寸
        const width = rect.width > 0 ? rect.width : window.innerWidth;
        const height = rect.height > 0 ? rect.height : window.innerHeight;
        setDimensions({ width, height });
      } else {
        // 容器不存在时使用 window 尺寸
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    // 立即更新一次
    updateDimensions();
    
    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // 同时监听 window resize 作为备用
    window.addEventListener('resize', updateDimensions);
    
    // 延迟更新以确保 DOM 完全渲染
    const timer = setTimeout(updateDimensions, 100);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // 配置 D3 力模拟 - 稳定的弹簧物理效果
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      const fg = graphRef.current;
      
      try {
        // 节点间斥力 - 让节点保持距离
        const chargeForce = fg.d3Force('charge');
        if (chargeForce) {
          chargeForce.strength(-200);    // 适中的斥力
          chargeForce.distanceMax(200);  // 作用距离
        }
        
        // 连接线弹簧力
        const linkForce = fg.d3Force('link');
        if (linkForce) {
          linkForce.distance(100);       // 弹簧自然长度
          linkForce.strength(0.5);       // 弹簧强度，0.5 比较柔和
        }
        
        // 启动模拟让初始布局展开
        fg.d3ReheatSimulation();
      } catch (e) {
        console.warn('D3 force configuration failed:', e);
      }
      
      // 稍后自动居中
      setTimeout(() => {
        if (fg) {
          fg.zoomToFit(600, 80);
        }
      }, 2000);
    }
  }, [graphData]);

  // 节点绘制函数 - 带动画效果
  const drawNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      // 确保节点有有效位置
      if (node.x === undefined || node.y === undefined || !isFinite(node.x) || !isFinite(node.y)) {
        return;
      }
      
      const x = node.x;
      const y = node.y;
      const baseSize = node.size || 10;
      const color = node.color || '#6b7280';
      const isHovered = hoveredNode?.id === node.id;
      
      // 悬浮时放大效果
      const scale = isHovered ? 1.25 : 1;
      const size = baseSize * scale;

      // 悬浮时的外发光效果
      if (isHovered) {
        // 外层光晕
        ctx.beginPath();
        ctx.arc(x, y, size + 15, 0, 2 * Math.PI);
        ctx.fillStyle = `${color}25`;
        ctx.fill();
        
        // 内层光晕
        ctx.beginPath();
        ctx.arc(x, y, size + 8, 0, 2 * Math.PI);
        ctx.fillStyle = `${color}35`;
        ctx.fill();
      }

      // 节点阴影
      ctx.shadowColor = isHovered ? color : 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = isHovered ? 12 : 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = isHovered ? 3 : 2;

      // 绘制节点圆形
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 绘制边框
      ctx.strokeStyle = isHovered ? '#1f2937' : 'rgba(255,255,255,0.95)';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();
      
      // 内部高光
      ctx.beginPath();
      ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();

      // 绘制标签 - 始终显示
      const label = node.name || '';
      const fontSize = Math.max(11, 14 / globalScale);
      ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
      const textWidth = ctx.measureText(label).width;
      const padding = 6;
      const labelY = y + size + fontSize / 2 + 10;

      // 标签背景带阴影
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.roundRect(
        x - textWidth / 2 - padding,
        labelY - fontSize / 2 - padding / 2,
        textWidth + padding * 2,
        fontSize + padding,
        6
      );
      ctx.fill();
      
      // 悬浮时标签边框高亮
      if (isHovered) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 标签文字
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHovered ? '#111827' : '#374151';
      ctx.fillText(label, x, labelY);
    },
    [hoveredNode]
  );

  // 边绘制函数 - 浅色主题优化
  const drawLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const start = link.source;
      const end = link.target;

      if (typeof start !== 'object' || typeof end !== 'object') return;
      
      // 确保有有效位置
      if (!isFinite(start.x) || !isFinite(start.y) || !isFinite(end.x) || !isFinite(end.y)) {
        return;
      }

      // 绘制边
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 绘制边标签
      if (globalScale > 1.2 && link.label) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const fontSize = Math.max(10 / globalScale, 3);

        ctx.font = `${fontSize}px "Noto Sans SC", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(link.label, midX, midY);
      }
    },
    []
  );

  // 处理节点点击
  const handleNodeClick = useCallback(
    (node: any) => {
      if (onNodeClick) {
        onNodeClick(node as GraphNode);
      }

      // 缩放到点击的节点
      if (graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 500);
        graphRef.current.zoom(2.5, 500);
      }
    },
    [onNodeClick]
  );

  // 处理节点悬停 - 更改鼠标样式
  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node || null);
    // 更改鼠标样式
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100" style={{ minWidth: '100vw', minHeight: '100vh' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">加载知识图谱中...</p>
        </div>
      </div>
    );
  }

  if (error && graphData.nodes.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100" style={{ minWidth: '100vw', minHeight: '100vh' }}>
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="text-7xl text-text-muted font-bold">!</div>
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <p className="text-text-muted">
            请确保 Neo4j 数据库已启动并运行后端服务
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 overflow-hidden"
      style={{ width: '100%', height: '100%', minWidth: '100vw', minHeight: '100vh' }}
    >
      {/* 图例 - 左上角浮动 */}
      <div className="absolute top-4 left-4 bg-bg-card backdrop-blur-md rounded-xl p-3 z-10 shadow-lg border border-border-primary">
        <h3 className="text-text-secondary font-semibold mb-2 text-xs uppercase tracking-wider">图例</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {Object.entries(nodeTypeLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: nodeColors[type] }}
              />
              <span className="text-text-secondary text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 节点详情悬浮框 - 带动画效果 */}
      {hoveredNode && (
        <div 
          className="absolute bottom-4 left-4 bg-bg-card backdrop-blur-md rounded-2xl px-5 py-4 z-10 shadow-xl border-2 transition-all duration-200 animate-in slide-in-from-bottom-2"
          style={{ borderColor: `${hoveredNode.color}40` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: hoveredNode.color }}
            >
              <span className="text-white text-lg">
                {hoveredNode.type === 'student' && 'S'}
                {hoveredNode.type === 'mbti' && 'M'}
                {hoveredNode.type === 'career' && 'C'}
                {hoveredNode.type === 'skill' && 'K'}
                {hoveredNode.type === 'course' && 'L'}
                {hoveredNode.type === 'learning_path' && 'P'}
              </span>
            </div>
            <div>
              <p className="text-text-primary font-semibold text-base">{hoveredNode.name}</p>
              <p className="text-text-muted text-xs">{nodeTypeLabels[hoveredNode.type]}</p>
            </div>
          </div>
          {hoveredNode.description && (
            <p className="mt-2 text-text-secondary text-sm border-t border-border-primary pt-2">
              {hoveredNode.description}
            </p>
          )}
          <p className="mt-2 text-text-muted text-xs">点击查看详情 →</p>
        </div>
      )}

      {/* 统计信息 - 右上角 */}
      <div className="absolute top-4 right-4 bg-bg-card backdrop-blur-md rounded-xl px-4 py-2 z-10 shadow-lg border border-border-primary">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">
            节点 <span className="text-text-primary font-semibold">{graphData.nodes.length}</span>
          </span>
          <span className="text-text-muted">|</span>
          <span className="text-text-muted">
            关系 <span className="text-text-primary font-semibold">{graphData.links?.length || 0}</span>
          </span>
        </div>
      </div>

      {/* 操作提示 - 右下角 */}
      <div className="absolute bottom-4 right-4 bg-bg-card backdrop-blur-md rounded-xl px-3 py-2 z-10 shadow-lg border border-border-primary">
        <p className="text-text-muted text-xs">
          拖拽节点移动 · 空白处平移 · 滚轮缩放
        </p>
      </div>

      {/* 力导向图 - 全屏 */}
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={drawNode}
        linkCanvasObject={drawLink}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeLabel={() => ''}
        linkLabel={() => ''}
        backgroundColor="transparent"
        
        // 箭头设置
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.85}
        linkDirectionalArrowColor={() => 'rgba(156, 163, 175, 0.6)'}
        
        // 物理引擎参数 - 稳定但有弹性
        cooldownTicks={200}        // 初始布局后冷却
        cooldownTime={3000}        // 3秒后稳定
        d3VelocityDecay={0.4}      // 阻尼，越大越快停止
        d3AlphaDecay={0.02}        // alpha 衰减，让模拟逐渐停止
        d3AlphaMin={0.001}         // 最小alpha
        warmupTicks={100}          // 预热
        
        // 节点拖拽和交互
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        
        // 增大节点点击区域
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          if (!isFinite(node.x) || !isFinite(node.y)) return;
          const size = (node.size || 10) + 15;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fill();
        }}
        
        // 缩放限制
        minZoom={0.2}
        maxZoom={6}
        nodeRelSize={1}
        linkWidth={1.5}
        
        // 拖拽过程中固定节点位置，同时激活模拟让其他节点跟随
        onNodeDrag={(node: any) => {
          node.fx = node.x;
          node.fy = node.y;
          // 激活模拟让连接的节点被拉动
          if (graphRef.current) {
            graphRef.current.d3ReheatSimulation();
          }
        }}
        // 拖拽结束后释放节点，让弹簧拉动它
        onNodeDragEnd={(node: any) => {
          // 释放节点
          node.fx = undefined;
          node.fy = undefined;
          // 重新激活模拟让弹簧效果生效
          if (graphRef.current) {
            graphRef.current.d3ReheatSimulation();
          }
        }}
        
        // 布局完成后居中
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(600, 100);
          }
        }}
        
        // D3 力模拟配置
        dagMode={undefined}
        dagLevelDistance={undefined}
      />
    </div>
  );
}

// 开发模式模拟数据
function getMockData(): any {
  return {
    nodes: [
      { id: 'mbti-intj', name: 'INTJ 建筑师', type: 'mbti', color: nodeColors.mbti, size: nodeSizes.mbti },
      { id: 'mbti-intp', name: 'INTP 逻辑学家', type: 'mbti', color: nodeColors.mbti, size: nodeSizes.mbti },
      { id: 'mbti-entj', name: 'ENTJ 指挥官', type: 'mbti', color: nodeColors.mbti, size: nodeSizes.mbti },
      { id: 'career-ai-researcher', name: 'AI研究员', type: 'career', color: nodeColors.career, size: nodeSizes.career },
      { id: 'career-ml-engineer', name: '机器学习工程师', type: 'career', color: nodeColors.career, size: nodeSizes.career },
      { id: 'career-data-scientist', name: '数据科学家', type: 'career', color: nodeColors.career, size: nodeSizes.career },
      { id: 'skill-python', name: 'Python', type: 'skill', color: nodeColors.skill, size: nodeSizes.skill },
      { id: 'skill-ml', name: '机器学习', type: 'skill', color: nodeColors.skill, size: nodeSizes.skill },
      { id: 'skill-math', name: '数学基础', type: 'skill', color: nodeColors.skill, size: nodeSizes.skill },
      { id: 'skill-dl', name: '深度学习', type: 'skill', color: nodeColors.skill, size: nodeSizes.skill },
      { id: 'course-ml-coursera', name: '机器学习 (Coursera)', type: 'course', color: nodeColors.course, size: nodeSizes.course },
      { id: 'course-dl-ai', name: '深度学习专项课程', type: 'course', color: nodeColors.course, size: nodeSizes.course },
      { id: 'course-python', name: 'Python编程基础', type: 'course', color: nodeColors.course, size: nodeSizes.course },
    ],
    links: [
      { source: 'mbti-intj', target: 'career-ai-researcher', label: '适合', type: 'SUITS' },
      { source: 'mbti-intp', target: 'career-ai-researcher', label: '适合', type: 'SUITS' },
      { source: 'mbti-intj', target: 'career-data-scientist', label: '适合', type: 'SUITS' },
      { source: 'mbti-entj', target: 'career-ml-engineer', label: '适合', type: 'SUITS' },
      { source: 'career-ai-researcher', target: 'skill-ml', label: '需要', type: 'REQUIRES' },
      { source: 'career-ai-researcher', target: 'skill-dl', label: '需要', type: 'REQUIRES' },
      { source: 'career-ai-researcher', target: 'skill-math', label: '需要', type: 'REQUIRES' },
      { source: 'career-ml-engineer', target: 'skill-python', label: '需要', type: 'REQUIRES' },
      { source: 'career-ml-engineer', target: 'skill-ml', label: '需要', type: 'REQUIRES' },
      { source: 'career-data-scientist', target: 'skill-python', label: '需要', type: 'REQUIRES' },
      { source: 'career-data-scientist', target: 'skill-math', label: '需要', type: 'REQUIRES' },
      { source: 'course-ml-coursera', target: 'skill-ml', label: '教授', type: 'TEACHES' },
      { source: 'course-dl-ai', target: 'skill-dl', label: '教授', type: 'TEACHES' },
      { source: 'course-python', target: 'skill-python', label: '教授', type: 'TEACHES' },
    ],
  };
}
