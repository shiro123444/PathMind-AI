/**
 * Smooth Scroll System
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * Implements smooth-wrapper and smooth-content container structure
 * with parallax effects and 60fps performance
 */

import React, { useRef, useEffect, useState, useCallback, createContext, useContext } from 'react';

/**
 * Smooth Scroll Configuration
 */
export interface SmoothScrollConfig {
  /** Easing factor for smooth scrolling (0-1, lower = smoother) */
  ease: number;
  /** Enable/disable smooth scrolling */
  enabled: boolean;
  /** Parallax speed multiplier for background layers (Requirement 8.4) */
  parallaxSpeed: number;
}

const defaultConfig: SmoothScrollConfig = {
  ease: 0.1,
  enabled: true,
  parallaxSpeed: 0.3, // Requirement 8.4: 0.3x scroll speed
};

/**
 * Smooth Scroll Context for sharing scroll state
 */
interface SmoothScrollContextValue {
  scrollY: number;
  targetScrollY: number;
  parallaxOffset: number;
  isScrolling: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollY: 0,
  targetScrollY: 0,
  parallaxOffset: 0,
  isScrolling: false,
});

/**
 * Hook to access smooth scroll state
 */
export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

/**
 * Props for SmoothScrollProvider
 */
export interface SmoothScrollProviderProps {
  children: React.ReactNode;
  config?: Partial<SmoothScrollConfig>;
  className?: string;
}

/**
 * SmoothScrollProvider Component
 * Requirements: 8.1, 8.2, 8.3
 * 
 * Implements smooth-wrapper and smooth-content container structure
 * with smooth scrolling behavior and easing
 */
export function SmoothScrollProvider({
  children,
  config: userConfig,
  className = '',
}: SmoothScrollProviderProps): React.ReactElement {
  const config = { ...defaultConfig, ...userConfig };
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  const [scrollState, setScrollState] = useState<SmoothScrollContextValue>({
    scrollY: 0,
    targetScrollY: 0,
    parallaxOffset: 0,
    isScrolling: false,
  });

  // Track current scroll position for smooth interpolation
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  /**
   * Animation loop for smooth scrolling
   * Requirement 8.5: Update transforms within 16ms (60fps)
   */
  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Ensure we're running at ~60fps (within 16ms)
    if (deltaTime > 0) {
      const target = targetScrollRef.current;
      const current = currentScrollRef.current;
      
      // Smooth interpolation with easing
      const diff = target - current;
      const newScroll = current + diff * config.ease;
      
      // Check if we've essentially reached the target
      const isScrolling = Math.abs(diff) > 0.5;
      
      if (isScrolling) {
        currentScrollRef.current = newScroll;
        
        // Apply transform to content (Requirement 8.2: smooth scrolling with easing)
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${-newScroll}px)`;
        }
        
        // Calculate parallax offset (Requirement 8.4: 0.3x scroll speed)
        const parallaxOffset = newScroll * config.parallaxSpeed;
        
        setScrollState({
          scrollY: newScroll,
          targetScrollY: target,
          parallaxOffset,
          isScrolling: true,
        });
      } else {
        currentScrollRef.current = target;
        
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${-target}px)`;
        }
        
        setScrollState(prev => ({
          ...prev,
          scrollY: target,
          isScrolling: false,
        }));
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [config.ease, config.parallaxSpeed]);

  /**
   * Handle wheel events for smooth scrolling
   */
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!config.enabled) return;
    
    e.preventDefault();
    
    const contentHeight = contentRef.current?.scrollHeight || 0;
    const viewportHeight = window.innerHeight;
    const maxScroll = Math.max(0, contentHeight - viewportHeight);
    
    // Update target scroll position
    targetScrollRef.current = Math.max(0, Math.min(
      targetScrollRef.current + e.deltaY,
      maxScroll
    ));
    
    setScrollState(prev => ({
      ...prev,
      targetScrollY: targetScrollRef.current,
      isScrolling: true,
    }));
  }, [config.enabled]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!config.enabled) return;
    
    const contentHeight = contentRef.current?.scrollHeight || 0;
    const viewportHeight = window.innerHeight;
    const maxScroll = Math.max(0, contentHeight - viewportHeight);
    
    let delta = 0;
    
    switch (e.key) {
      case 'ArrowDown':
        delta = 100;
        break;
      case 'ArrowUp':
        delta = -100;
        break;
      case 'PageDown':
        delta = viewportHeight * 0.9;
        break;
      case 'PageUp':
        delta = -viewportHeight * 0.9;
        break;
      case 'Home':
        targetScrollRef.current = 0;
        return;
      case 'End':
        targetScrollRef.current = maxScroll;
        return;
      default:
        return;
    }
    
    targetScrollRef.current = Math.max(0, Math.min(
      targetScrollRef.current + delta,
      maxScroll
    ));
  }, [config.enabled]);

  /**
   * Set up event listeners and animation loop
   */
  useEffect(() => {
    if (!config.enabled) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    // Add event listeners
    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      wrapper.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config.enabled, animate, handleWheel, handleKeyDown]);

  /**
   * Update body height to match content for proper scrollbar
   */
  useEffect(() => {
    if (!config.enabled || !contentRef.current) return;

    const updateHeight = () => {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      document.body.style.height = `${contentHeight}px`;
    };

    updateHeight();
    
    // Use ResizeObserver to track content height changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      document.body.style.height = '';
    };
  }, [config.enabled]);

  // If smooth scroll is disabled, render children normally
  if (!config.enabled) {
    return (
      <SmoothScrollContext.Provider value={scrollState}>
        <div className={className}>{children}</div>
      </SmoothScrollContext.Provider>
    );
  }

  return (
    <SmoothScrollContext.Provider value={scrollState}>
      {/* Requirement 8.1: smooth-wrapper container */}
      <div
        ref={wrapperRef}
        className={`smooth-wrapper ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        data-testid="smooth-wrapper"
      >
        {/* Requirement 8.1: smooth-content container */}
        <div
          ref={contentRef}
          className="smooth-content"
          style={{
            willChange: 'transform',
          }}
          data-testid="smooth-content"
        >
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  );
}

/**
 * Props for ParallaxLayer component
 */
export interface ParallaxLayerProps {
  children: React.ReactNode;
  /** Speed multiplier (default: 0.3 per Requirement 8.4) */
  speed?: number;
  /** Additional CSS class */
  className?: string;
  /** Whether this is a fixed element (Requirement 8.3) */
  fixed?: boolean;
}

/**
 * ParallaxLayer Component
 * Requirements: 8.3, 8.4, 8.5
 * 
 * Creates a layer that moves at a different speed during scroll
 * Fixed elements are kept outside smooth-content
 */
export function ParallaxLayer({
  children,
  speed = 0.3,
  className = '',
  fixed = false,
}: ParallaxLayerProps): React.ReactElement {
  const layerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useSmoothScroll();
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (fixed || !layerRef.current) return;

    const updateTransform = () => {
      const now = performance.now();
      // Requirement 8.5: Update within 16ms (60fps)
      if (now - lastUpdateRef.current >= 16) {
        lastUpdateRef.current = now;
        
        if (layerRef.current) {
          // Requirement 8.4: Move at specified speed (default 0.3x)
          const offset = scrollY * speed;
          layerRef.current.style.transform = `translateY(${offset}px)`;
        }
      }
      
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    rafRef.current = requestAnimationFrame(updateTransform);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollY, speed, fixed]);

  // Requirement 8.3: Fixed elements are positioned outside smooth-content
  if (fixed) {
    return (
      <div
        ref={layerRef}
        className={`parallax-layer parallax-layer--fixed ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        data-testid="parallax-layer-fixed"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={layerRef}
      className={`parallax-layer ${className}`}
      style={{
        willChange: 'transform',
      }}
      data-testid="parallax-layer"
    >
      {children}
    </div>
  );
}

/**
 * Hook for parallax scroll effects
 * Requirements: 8.4, 8.5
 * 
 * @param speed - Parallax speed multiplier (default: 0.3)
 * @returns Current parallax offset value
 */
export function useParallaxScroll(speed: number = 0.3): number {
  const { scrollY } = useSmoothScroll();
  return scrollY * speed;
}

export default SmoothScrollProvider;
