export const animations = {
  fadeIn: 'fade-in 0.3s ease-out',
  fadeInSlow: 'fade-in 0.5s ease-out',
  slideIn: 'slide-in 0.3s ease-out',
  scaleIn: 'scale-in 0.2s ease-out',
  pulseGlow: 'pulse-glow 2s ease-in-out infinite',
  scalePulse: 'scale-pulse 1.5s ease-in-out infinite',
} as const;

export const staggerDelay = (index: number, baseDelay = 50) => {
  return `${index * baseDelay}ms`;
};

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in',
  pulseGlow: 'animate-pulse-glow',
  scalePulse: 'animate-scale-pulse',
} as const;

export const hoverTransitions = {
  scale: 'transition-transform duration-200 hover:scale-105',
  scaleDown: 'transition-transform duration-200 hover:scale-95',
  lift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  glow: 'transition-shadow duration-200 hover:shadow-lg',
  brighten: 'transition-all duration-200 hover:brightness-110',
} as const;
