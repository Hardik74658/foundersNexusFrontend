/**
 * Helper utility to handle API URLs correctly whether using a proxy or direct access
 */
import axios from 'axios';

// Read environment variables - fixed to work with Vite's import.meta approach
const useProxy = import.meta.env.VITE_USE_PROXY === 'true';
const apiUrl = import.meta.env.VITE_API_URL || 'http://13.232.209.194:80';

/**
 * Creates the appropriate URL for API calls
 * @param {string} endpoint - API endpoint path (without leading slash)
 * @returns {string} Complete URL to use for API calls
 */
export const getApiUrl = (endpoint) => {
  if (useProxy) {
    // Use the Netlify proxy to avoid mixed content issues
    return `/api/${endpoint}`;
  } else {
    // Direct API call (will have mixed content issues on HTTPS sites)
    return `${apiUrl}/${endpoint}`;
  }
};

// Create an axios instance with default config
const api = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle URLs
api.interceptors.request.use(config => {
  // If the URL doesn't start with http or /, use the getApiUrl helper
  if (!config.url.startsWith('http') && !config.url.startsWith('/')) {
    config.url = getApiUrl(config.url);
  }
  return config;
});

export default api;
