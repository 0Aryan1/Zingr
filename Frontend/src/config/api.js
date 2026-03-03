// API Configuration
// Automatically uses the correct API URL based on environment

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.MODE === 'production' 
                      ? 'https://your-backend-app.vercel.app' 
                      : 'http://localhost:3000');

// Remove trailing slash if present
export const API_URL = API_BASE_URL.replace(/\/$/, '');

export default API_URL;
