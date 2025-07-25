// API configuration using environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    TOKEN: `${API_BASE_URL}/auth/token`
  },
  
  // Palette endpoints
  PALETTE: {
    SAVE: `${API_BASE_URL}/palette/save`,
    PUBLIC: `${API_BASE_URL}/palette/public`,
    USER: (userId) => `${API_BASE_URL}/palette/user/${userId}`,
    BY_ID: (paletteId) => `${API_BASE_URL}/palette/${paletteId}`,
    COMMENT: (paletteId) => `${API_BASE_URL}/palette/${paletteId}/comment`
  },
  
  // AI endpoints
  AI: {
    SUGGESTIONS: `${API_BASE_URL}/ai/suggestions`,
    ANIMATION: `${API_BASE_URL}/ai/animation`
  }
};

export default API_BASE_URL;