export const LAYOUT = {
  HEADER: {
    HEIGHT: 56,
    HEIGHT_DESKTOP: 64,
  },
  BOTTOM_NAV: {
    HEIGHT: 64,
  },
  CONTENT: {
    PADDING: 16,
    PADDING_DESKTOP: 24,
    MAX_WIDTH: 1280,
  },
  SAFE_AREA: {
    TOP: 'env(safe-area-inset-top, 0px)',
    BOTTOM: 'env(safe-area-inset-bottom, 0px)',
    LEFT: 'env(safe-area-inset-left, 0px)',
    RIGHT: 'env(safe-area-inset-right, 0px)',
  },
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
  },
} as const;
