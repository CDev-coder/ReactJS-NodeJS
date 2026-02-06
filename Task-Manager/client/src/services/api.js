import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock token for demo (in real app, get from login)
const mockToken = "mock-jwt-token-for-demo";

// Add auth header
api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${mockToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Task API
export const taskAPI = {
  getAll: (params) => api.get("/tasks", { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post("/tasks", taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
