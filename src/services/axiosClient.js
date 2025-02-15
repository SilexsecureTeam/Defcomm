import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensures cookies are sent securely for authentication
});

// Request interceptor for adding secure headers
axiosClient.interceptors.request.use(
  (config) => {
    // Add additional security headers if needed
    config.headers["X-XSS-Protection"] = "1; mode=block";
    config.headers["X-Content-Type-Options"] = "nosniff";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - Redirect to login");
      // Handle token expiration or logout
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
