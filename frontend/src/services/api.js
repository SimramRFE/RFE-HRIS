import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://gportalcms.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create manager axios instance
const managerApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for manager API
managerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('managerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Response interceptor for manager API
managerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('managerToken');
      localStorage.removeItem('manager');
      localStorage.removeItem('managerAuth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  managerLogin: (data) => api.post('/auth/manager-login', data),
  firstLoginPasswordChange: (data) => api.put('/auth/first-login-password-change', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getMe: () => api.get('/auth/me'),
  getManagerMe: () => managerApi.get('/auth/manager-me'),
  checkAdminExists: () => api.get('/auth/admin-exists'),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  search: (query) => api.get(`/employees/search?query=${query}`),
};

// Upload API
export const uploadAPI = {
  uploadDocuments: (formData) => {
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getDocument: (filename) => `${API_URL.replace('/api', '')}/uploads/documents/${filename}`,
  deleteDocument: (filename) => api.delete(`/upload/${filename}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Team Manager API
export const teamManagerAPI = {
  getAll: () => api.get('/team-managers'),
  getById: (id) => api.get(`/team-managers/${id}`),
  create: (data) => api.post('/team-managers', data),
  update: (id, data) => api.put(`/team-managers/${id}`, data),
  delete: (id) => api.delete(`/team-managers/${id}`),
};

// Expense API (Manager)
export const expenseAPI = {
  getMyBudget: () => managerApi.get('/expenses/my-budget'),
  addExpense: (data) => managerApi.post('/expenses', data),
  updateExpense: (expenseId, data) => managerApi.put(`/expenses/${expenseId}`, data),
  deleteExpense: (expenseId) => managerApi.delete(`/expenses/${expenseId}`),
};

export default api;
