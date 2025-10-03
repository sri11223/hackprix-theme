// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.API_BASE_URL}/auth/login`,
    REGISTER: `${API_CONFIG.API_BASE_URL}/auth/register`,
    LOGOUT: `${API_CONFIG.API_BASE_URL}/auth/logout`,
  },
  PROFILE: {
    GET: `${API_CONFIG.API_BASE_URL}/profile`,
    UPDATE: `${API_CONFIG.API_BASE_URL}/profile/update`,
  },
  FOOD: {
    BASE: `${API_CONFIG.API_BASE_URL}/food`,
  },
  FORM: {
    CONTACT: `${API_CONFIG.API_BASE_URL}/form`,
  },
  NGO: {
    BASE: `${API_CONFIG.API_BASE_URL}/ngo`,
  }
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include' as RequestCredentials,
  headers: DEFAULT_HEADERS,
};