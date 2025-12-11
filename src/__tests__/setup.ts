import '@testing-library/jest-dom'

// Mock WebGL context for tests
const mockWebGLContext = {
  getExtension: () => null,
  getParameter: () => null,
  createShader: () => ({}),
  shaderSource: () => {},
  compileShader: () => {},
  getShaderParameter: () => true,
  createProgram: () => ({}),
  attachShader: () => {},
  linkProgram: () => {},
  getProgramParameter: () => true,
  useProgram: () => {},
  createBuffer: () => ({}),
  bindBuffer: () => {},
  bufferData: () => {},
  enableVertexAttribArray: () => {},
  vertexAttribPointer: () => {},
  drawArrays: () => {},
  viewport: () => {},
  clearColor: () => {},
  clear: () => {},
  enable: () => {},
  disable: () => {},
  blendFunc: () => {},
  depthFunc: () => {},
  cullFace: () => {},
  frontFace: () => {},
  getAttribLocation: () => 0,
  getUniformLocation: () => ({}),
  uniform1f: () => {},
  uniform2f: () => {},
  uniform3f: () => {},
  uniform4f: () => {},
  uniformMatrix4fv: () => {},
}

// Store original getContext for tests to restore
export const originalGetContext = HTMLCanvasElement.prototype.getContext

// Mock canvas getContext - default to WebGL available
// Tests can override this as needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(HTMLCanvasElement.prototype as any).getContext = function (contextType: string) {
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    return mockWebGLContext as unknown as WebGLRenderingContext
  }
  if (contextType === '2d') {
    return {} as CanvasRenderingContext2D
  }
  return null
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
