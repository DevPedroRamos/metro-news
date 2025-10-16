export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
} as const;

export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  lineHeights: {
    body: '150%',
    heading: '120%',
    tight: '110%',
    relaxed: '175%',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const colors = {
  metro: {
    red: {
      50: 'hsl(0, 85%, 97%)',
      100: 'hsl(0, 85%, 92%)',
      200: 'hsl(0, 85%, 82%)',
      300: 'hsl(0, 85%, 72%)',
      400: 'hsl(0, 85%, 65%)',
      500: 'hsl(0, 85%, 60%)',
      600: 'hsl(0, 85%, 50%)',
      700: 'hsl(0, 85%, 45%)',
      800: 'hsl(0, 85%, 35%)',
      900: 'hsl(0, 85%, 25%)',
    },
    green: {
      50: 'hsl(142, 69%, 97%)',
      100: 'hsl(142, 69%, 92%)',
      200: 'hsl(142, 69%, 82%)',
      300: 'hsl(142, 69%, 72%)',
      400: 'hsl(142, 69%, 65%)',
      500: 'hsl(142, 69%, 58%)',
      600: 'hsl(142, 69%, 48%)',
      700: 'hsl(142, 69%, 38%)',
      800: 'hsl(142, 69%, 28%)',
      900: 'hsl(142, 69%, 18%)',
    },
    blue: {
      50: 'hsl(207, 90%, 97%)',
      100: 'hsl(207, 90%, 92%)',
      200: 'hsl(207, 90%, 82%)',
      300: 'hsl(207, 90%, 72%)',
      400: 'hsl(207, 90%, 63%)',
      500: 'hsl(207, 90%, 54%)',
      600: 'hsl(207, 90%, 44%)',
      700: 'hsl(207, 90%, 34%)',
      800: 'hsl(207, 90%, 24%)',
      900: 'hsl(207, 90%, 14%)',
    },
  },
  neutral: {
    50: 'hsl(0, 0%, 98%)',
    100: 'hsl(0, 0%, 96%)',
    200: 'hsl(0, 0%, 90%)',
    300: 'hsl(0, 0%, 80%)',
    400: 'hsl(0, 0%, 65%)',
    500: 'hsl(0, 0%, 45%)',
    600: 'hsl(0, 0%, 35%)',
    700: 'hsl(0, 0%, 25%)',
    800: 'hsl(0, 0%, 15%)',
    900: 'hsl(0, 0%, 9%)',
  },
} as const;

export const accessibilityConfig = {
  focusRing: {
    width: '2px',
    offset: '2px',
    style: 'solid',
  },
  minTouchTarget: '44px',
  minContrastRatio: {
    normal: 4.5,
    large: 3,
  },
} as const;
