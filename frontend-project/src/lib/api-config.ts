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
    COMPLETE: `${API_CONFIG.API_BASE_URL}/profile/complete`,
  },
  STARTUPS: {
    LIST: `${API_CONFIG.API_BASE_URL}/startups`,
    GET: (id: string) => `${API_CONFIG.API_BASE_URL}/startups/${id}`,
  },
  JOBS: {
    LIST: `${API_CONFIG.API_BASE_URL}/jobs`,
    CREATE: `${API_CONFIG.API_BASE_URL}/jobs`,
    APPLY: `${API_CONFIG.API_BASE_URL}/jobs/apply`,
    MY_APPLICATIONS: `${API_CONFIG.API_BASE_URL}/jobs/my-applications`,
    MY_POSTED: `${API_CONFIG.API_BASE_URL}/jobs/my-posted`,
    UPDATE_STATUS: `${API_CONFIG.API_BASE_URL}/jobs/application-status`,
  },
  MESSAGES: {
    CHATS: `${API_CONFIG.API_BASE_URL}/messages/chats`,
    SEND: `${API_CONFIG.API_BASE_URL}/messages`,
    GET: (userId: string) => `${API_CONFIG.API_BASE_URL}/messages/${userId}`,
    SEARCH_USERS: `${API_CONFIG.API_BASE_URL}/messages/search-users`,
  },
  INVESTMENTS: {
    LIST: `${API_CONFIG.API_BASE_URL}/investments`,
    PORTFOLIO: `${API_CONFIG.API_BASE_URL}/investments/portfolio`,
    REQUEST: `${API_CONFIG.API_BASE_URL}/investments/request`,
    UPDATE_STATUS: (id: string) => `${API_CONFIG.API_BASE_URL}/investments/${id}/status`,
  },
  PITCH: {
    LIST: `${API_CONFIG.API_BASE_URL}/pitch-sessions`,
    CREATE: `${API_CONFIG.API_BASE_URL}/pitch-sessions`,
    RESPOND: (id: string) => `${API_CONFIG.API_BASE_URL}/pitch-sessions/${id}/respond`,
    FEEDBACK: (id: string) => `${API_CONFIG.API_BASE_URL}/pitch-sessions/${id}/feedback`,
  },
  DASHBOARD: {
    STATS: `${API_CONFIG.API_BASE_URL}/dashboard/stats`,
    NOTIFICATIONS: `${API_CONFIG.API_BASE_URL}/dashboard/notifications`,
    MARK_READ: `${API_CONFIG.API_BASE_URL}/dashboard/notifications/read`,
    PLATFORM_STATS: `${API_CONFIG.API_BASE_URL}/dashboard/platform-stats`,
  },
  CONNECTIONS: {
    LIST: `${API_CONFIG.API_BASE_URL}/connections`,
    REQUEST: `${API_CONFIG.API_BASE_URL}/connections/request`,
    RESPOND: (id: string) => `${API_CONFIG.API_BASE_URL}/connections/${id}`,
  },
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper to get auth headers
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Default fetch options
export const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include' as RequestCredentials,
  headers: DEFAULT_HEADERS,
};