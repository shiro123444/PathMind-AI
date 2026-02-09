/**
 * 专业配色系统
 * 
 * 设计原则：
 * - 使用低饱和度的中性色作为基础
 * - 强调色使用柔和的暖色调
 * - 避免过于鲜艳的紫色，使用更成熟的色调
 * - 玻璃态效果使用微妙的透明度
 */

// 中性色 - 基于暖灰色调
export const neutral = {
  50: '#FAFAF9',   // 背景
  100: '#F5F5F4',  // 卡片背景
  200: '#E7E5E4',  // 边框
  300: '#D6D3D1',  // 分割线
  400: '#A8A29E',  // 次要文字
  500: '#78716C',  // 辅助文字
  600: '#57534E',  // 正文
  700: '#44403C',  // 标题
  800: '#292524',  // 强调
  900: '#1C1917',  // 最深
}

// 主色 - 柔和的蓝灰色（专业感）
export const primary = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
}

// 强调色 - 柔和的珊瑚/桃色（温暖但不刺眼）
export const accent = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
}

// 辅助色 - 柔和的青色（清新感）
export const secondary = {
  50: '#F0FDFA',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6',
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
}

// 成功色 - 柔和的绿色
export const success = {
  light: '#D1FAE5',
  main: '#10B981',
  dark: '#059669',
}

// 警告色 - 柔和的琥珀色
export const warning = {
  light: '#FEF3C7',
  main: '#F59E0B',
  dark: '#D97706',
}

// 错误色 - 柔和的红色
export const error = {
  light: '#FEE2E2',
  main: '#EF4444',
  dark: '#DC2626',
}

// 玻璃态效果配置
export const glass = {
  // 背景
  bg: {
    light: 'rgba(255, 255, 255, 0.7)',
    medium: 'rgba(255, 255, 255, 0.8)',
    strong: 'rgba(255, 255, 255, 0.9)',
  },
  // 边框
  border: {
    light: 'rgba(255, 255, 255, 0.2)',
    medium: 'rgba(255, 255, 255, 0.3)',
    strong: 'rgba(255, 255, 255, 0.4)',
  },
  // 阴影
  shadow: {
    light: '0 4px 24px rgba(0, 0, 0, 0.04)',
    medium: '0 8px 32px rgba(0, 0, 0, 0.06)',
    strong: '0 12px 48px rgba(0, 0, 0, 0.08)',
  },
  // 模糊
  blur: {
    light: 'blur(8px)',
    medium: 'blur(16px)',
    strong: 'blur(24px)',
  },
}

// 渐变 - 使用更柔和的色调
export const gradients = {
  // 主渐变 - 柔和的暖色
  primary: 'linear-gradient(135deg, #FED7AA 0%, #FECACA 50%, #E9D5FF 100%)',
  // 卡片渐变 - 非常微妙
  card: {
    peach: 'linear-gradient(135deg, rgba(254, 215, 170, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)',
    mint: 'linear-gradient(135deg, rgba(153, 246, 228, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)',
    lavender: 'linear-gradient(135deg, rgba(233, 213, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)',
    sky: 'linear-gradient(135deg, rgba(186, 230, 253, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)',
  },
  // 按钮渐变 - 更成熟的色调
  button: {
    primary: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    accent: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
  },
}

// 呼吸光晕颜色 - 更柔和
export const orbs = {
  peach: 'rgba(254, 215, 170, 0.2)',
  mint: 'rgba(153, 246, 228, 0.15)',
  lavender: 'rgba(233, 213, 255, 0.15)',
  sky: 'rgba(186, 230, 253, 0.15)',
}

// 语义色 - 亮色模式
export const light = {
  bg: {
    primary: '#FAFAF9',
    secondary: '#ffffff',
    card: 'rgba(255,255,255,0.75)',
    cardHover: 'rgba(255,255,255,0.85)',
  },
  text: {
    primary: '#1C1917',
    secondary: '#57534E',
    muted: '#78716C',
  },
  border: {
    primary: 'rgba(0,0,0,0.08)',
    hover: 'rgba(0,0,0,0.12)',
  },
  glass: {
    bg: 'rgba(255,255,255,0.8)',
    border: 'rgba(255,255,255,0.3)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
    blur: 'blur(12px)',
  },
}

// 语义色 - 暗色模式（深黑 + 玻璃态）
export const dark = {
  bg: {
    primary: '#0c0c0c',
    secondary: '#141414',
    card: 'rgba(255,255,255,0.05)',
    cardHover: 'rgba(255,255,255,0.08)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },
  border: {
    primary: 'rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.2)',
  },
  glass: {
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    shadow: '0 8px 32px rgba(0,0,0,0.3)',
    blur: 'blur(12px)',
  },
}

export default {
  neutral,
  primary,
  accent,
  secondary,
  success,
  warning,
  error,
  glass,
  gradients,
  orbs,
  light,
  dark,
}
