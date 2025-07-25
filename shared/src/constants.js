// Common constants used across the application
export const MOOD_CATEGORIES = {
  CALM: 'calm',
  ENERGETIC: 'energetic',
  HAPPY: 'happy',
  MELANCHOLY: 'melancholy',
  CREATIVE: 'creative',
  FOCUSED: 'focused',
  ROMANTIC: 'romantic',
  MYSTERIOUS: 'mysterious'
};

export const ANIMATION_TYPES = [
  { label: 'Gradient Wave', value: 'gradient' },
  { label: 'Color Bubbles', value: 'bubbles' },
  { label: 'Flowing Orbs', value: 'orbs' },
  { label: 'Gentle Pulse', value: 'pulse' },
  { label: 'Cursor Ripple', value: 'ripple' }
];

export const COLOR_FORMATS = {
  HEX: 'hex',
  RGB: 'rgb',
  HSL: 'hsl',
  HSV: 'hsv'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify'
  },
  PALETTES: {
    CREATE: '/palette/create',
    GET_ALL: '/palette/all',
    GET_BY_ID: '/palette/:id',
    UPDATE: '/palette/:id',
    DELETE: '/palette/:id',
    SAVE: '/palette/save'
  },
  AI: {
    GENERATE: '/ai/generate',
    ANIMATION: '/ai/animation',
    SUGGESTIONS: '/ai/suggestions'
  }
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const PALETTE_LIMITS = {
  MIN_COLORS: 2,
  MAX_COLORS: 8,
  DEFAULT_COLORS: 4
};