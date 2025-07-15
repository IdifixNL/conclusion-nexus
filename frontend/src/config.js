// Configuration for different environments
const config = {
  // Development (local) - backend runs on port 3003
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3003'
  },
  // Production (server) - backend runs on port 3001, or use relative URLs
  production: {
    apiUrl: process.env.REACT_APP_API_URL || '' // Empty for relative URLs (handled by Nginx)
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const apiUrl = config[env].apiUrl;

// Helper function to make API calls
export const apiCall = (endpoint) => {
  return apiUrl + endpoint;
}; 