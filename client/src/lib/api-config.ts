// API Configuration for different environments
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 
           (import.meta.env.MODE === 'production' 
             ? 'https://erkas-pro-api.vercel.app' 
             : 'http://localhost:3001'),
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      me: '/api/auth/me'
    },
    activities: '/api/activities',
    standards: '/api/standards',
    fields: '/api/fields'
  }
};

// Update fetch calls to use this config
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};