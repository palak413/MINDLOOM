import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // For FormData requests, remove the Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Don't show toast for 404 errors (endpoints not implemented yet)
    if (error.response?.status !== 404) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
};

// Journal API
export const journalAPI = {
  createEntry: (content) => api.post('/journal', { content }),
  getEntries: () => api.get('/journal').catch(() => ({ data: { data: [] } })),
};

// Task API
export const taskAPI = {
  getTasks: () => api.get('/tasks').catch(() => ({ data: { data: [] } })),
  createTask: (taskData) => api.post('/tasks', taskData),
  completeTask: (taskId) => api.patch(`/tasks/${taskId}/complete`),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

// Mood API
export const moodAPI = {
  logMood: (moodData) => api.post('/mood', moodData),
  getMoodHistory: () => api.get('/mood').catch(() => ({ data: { data: [] } })),
};

// Plant API
export const plantAPI = {
  getPlant: () => api.get('/plant/me').catch(() => ({ data: { data: { growthLevel: 1, growthPoints: 0, healthStatus: 'healthy' } } })),
  waterPlant: () => api.post('/plant/water'),
};

// Breathing API
export const breathingAPI = {
  logSession: (sessionData) => api.post('/breathing/session', sessionData),
  getSessions: () => api.get('/breathing/sessions').catch(() => ({ data: { data: [] } })),
};

// Store API
export const storeAPI = {
  getItems: () => api.get('/store').catch(() => ({ data: { data: [] } })),
  buyItem: (itemId) => api.post(`/store/${itemId}/buy`),
};

// Badge API
export const badgeAPI = {
  getBadges: () => api.get('/badges').catch(() => ({ data: { data: [] } })),
};

// Chat API
export const chatAPI = {
  sendMessage: (message, history = []) => api.post('/chat', { message, history }),
};

// Voice API
export const voiceAPI = {
  analyzeVoice: (audioData) => api.post('/voice/analyze-mood', audioData),
};

export default api;
