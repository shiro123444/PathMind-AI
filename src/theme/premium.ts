/**
 * Premium Typography System Interface
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export interface PremiumTypographySystem {
  fontFamily: {
    body: string;              // "Inter", "Pretendard", sans-serif
    mono: string;              // monospace for numbers and code
  };
  fontWeight: {
    normal: number;            // 400
    bold: number;              // 700
  };
  lineHeight: {
    body: number;              // 1.4 (between 1.3 and 1.5)
    heading: number;           // 1.2
  };
  letterSpacing: {
    heading: string;           // -0.04em
    body: string;              // normal
  };
  fontSmoothing: string;       // antialiased
}

/**
 * Premium Typography Configuration
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const premiumTypography: PremiumTypographySystem = {
  fontFamily: {
    // Requirement 7.1: Body text font family
    body: '"Inter", "Pretendard", sans-serif',
    // Requirement 7.2: Monospace font for numbers and code
    mono: '"SF Mono", "Fira Code", "Consolas", monospace',
  },
  fontWeight: {
    // Requirement 7.3: Font weights
    normal: 400,
    bold: 700,
  },
  lineHeight: {
    // Requirement 7.4: Line heights (body between 1.3 and 1.5)
    body: 1.4,
    heading: 1.2,
  },
  letterSpacing: {
    // Requirement 7.3: Letter spacing for headings
    heading: '-0.04em',
    body: 'normal',
  },
  // Requirement 7.5: Font smoothing
  fontSmoothing: 'antialiased',
};

/**
 * Get body text CSS styles
 * Requirements: 7.1, 7.4, 7.5
 */
export function getBodyTextStyles(): Record<string, string | number> {
  return {
    fontFamily: premiumTypography.fontFamily.body,
    fontWeight: premiumTypography.fontWeight.normal,
    lineHeight: premiumTypography.lineHeight.body,
    WebkitFontSmoothing: premiumTypography.fontSmoothing,
    MozOsxFontSmoothing: 'grayscale',
  };
}

/**
 * Get heading text CSS styles
 * Requirements: 7.1, 7.3, 7.5
 */
export function getHeadingTextStyles(): Record<string, string | number> {
  return {
    fontFamily: premiumTypography.fontFamily.body,
    fontWeight: premiumTypography.fontWeight.bold,
    lineHeight: premiumTypography.lineHeight.heading,
    letterSpacing: premiumTypography.letterSpacing.heading,
    WebkitFontSmoothing: premiumTypography.fontSmoothing,
    MozOsxFontSmoothing: 'grayscale',
  };
}

/**
 * Get monospace text CSS styles
 * Requirement 7.2
 */
export function getMonospaceTextStyles(): Record<string, string | number> {
  return {
    fontFamily: premiumTypography.fontFamily.mono,
    fontWeight: premiumTypography.fontWeight.normal,
    WebkitFontSmoothing: premiumTypography.fontSmoothing,
    MozOsxFontSmoothing: 'grayscale',
  };
}


/**
 * Premium Animation System Interface
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export interface PremiumAnimationConfig {
  showUp: {
    keyframes: Keyframe[];
    duration: number;
  };
  opaShowIn: {
    keyframes: Keyframe[];
    duration: number;
  };
  playBtHover: {
    keyframes: Keyframe[];
    duration: number;
  };
  spin: {
    keyframes: Keyframe[];
    duration: number;
  };
  defaultTransition: {
    duration: number;
    easing: string;
  };
}

/**
 * Premium Animation Configuration
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */
export const premiumAnimations: PremiumAnimationConfig = {
  // Requirement 6.1: show_up animation (translateY 100vh -> 0)
  showUp: {
    keyframes: [
      { transform: 'translateY(100vh)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    duration: 400,
  },
  
  // Requirement 6.2: opa_show_in animation (opacity 0 -> 1)
  opaShowIn: {
    keyframes: [
      { opacity: 0 },
      { opacity: 1 },
    ],
    duration: 500,
  },
  
  // Requirement 6.3: play_bt_hover animation (opacity cycling 0->1->0->1)
  playBtHover: {
    keyframes: [
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.25 },
      { opacity: 0, offset: 0.5 },
      { opacity: 1, offset: 0.75 },
      { opacity: 1, offset: 1 },
    ],
    duration: 1000,
  },
  
  // Requirement 6.4: spin animation (rotateY with translateZ)
  spin: {
    keyframes: [
      { transform: 'translateZ(-20vw) rotateY(0deg)' },
      { transform: 'translateZ(-20vw) rotateY(-360deg)' },
    ],
    duration: 2000,
  },
  
  // Requirement 6.5: Default transition duration
  defaultTransition: {
    duration: 200, // 0.2s = 200ms
    easing: 'ease-out',
  },
};

/**
 * CSS Keyframes as strings for injection into stylesheets
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export const premiumKeyframesCSS = {
  // Requirement 6.1
  showUp: `
    @keyframes show_up {
      from {
        transform: translateY(100vh);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  // Requirement 6.2
  opaShowIn: `
    @keyframes opa_show_in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  // Requirement 6.3
  playBtHover: `
    @keyframes play_bt_hover {
      0% { opacity: 0; }
      25% { opacity: 1; }
      50% { opacity: 0; }
      75% { opacity: 1; }
      100% { opacity: 1; }
    }
  `,
  
  // Requirement 6.4
  spin: `
    @keyframes spin {
      from {
        transform: translateZ(-20vw) rotateY(0deg);
      }
      to {
        transform: translateZ(-20vw) rotateY(-360deg);
      }
    }
  `,
};

/**
 * Get default transition CSS value
 * Requirement 6.5
 */
export function getDefaultTransition(property: string = 'all'): string {
  const { duration, easing } = premiumAnimations.defaultTransition;
  return `${property} ${duration}ms ${easing}`;
}

/**
 * Apply animation to an element using Web Animations API
 */
export function applyAnimation(
  element: HTMLElement,
  animationType: keyof Omit<PremiumAnimationConfig, 'defaultTransition'>
): Animation {
  const config = premiumAnimations[animationType];
  return element.animate(config.keyframes, {
    duration: config.duration,
    easing: 'ease-out',
    fill: 'forwards',
  });
}
