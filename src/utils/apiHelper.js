/**
 * Helper utility to handle API URLs correctly whether using a proxy or direct access
 */
import axios from 'axios';

// Read environment variables
const useProxy = process.env.VITE_USE_PROXY === 'true';
const apiUrl = process.env.VITE_API_URL;

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

export default api;
