/**
 * Helper utility to handle API URLs correctly whether using a proxy or direct access
 */
import axios from 'axios';

// Determine if we're in development or production
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// API configuration
const apiConfig = {
  // In development, use direct API calls to the backend
  development: {
    baseURL: 'http://13.232.209.194:80',
    useProxy: false
  },
  // In production, use the Netlify proxy to avoid CORS and mixed content issues
  production: {
    baseURL: '',  // Empty because we'll use relative URLs with the proxy
    useProxy: true
  }
};

// Select the appropriate configuration
const config = isDevelopment ? apiConfig.development : apiConfig.production;

/**
 * Creates the appropriate URL for API calls
 * @param {string} endpoint - API endpoint path (without leading slash)
 * @returns {string} Complete URL to use for API calls
 */
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  if (config.useProxy) {
    // Use the Netlify proxy
    return `/api/${cleanEndpoint}`;
  } else {
    // Direct API call
    return `${config.baseURL}/${cleanEndpoint}`;
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
  // If the URL already contains "/api/", don't add another "/api/"
  if (config.url.includes('/api/')) {
    return config;
  }
  
  // If the URL doesn't start with http or /, use the getApiUrl helper
  if (!config.url.startsWith('http') && !config.url.startsWith('/')) {
    config.url = getApiUrl(config.url);
  } else if (config.url.startsWith('/')) {
    // If it starts with /, add the /api prefix
    config.url = `/api${config.url}`;
  }
  return config;
});

export default api;
