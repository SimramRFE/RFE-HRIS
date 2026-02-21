import axios from 'axios';

 const API_URL = import.meta.env.VITE_API_URL || 'https://gportalcms.com/api';
// const API_URL = 'http://localhost:5000/api';

const getApiOrigin = () => {
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  try {
    return new URL(API_URL, fallbackOrigin).origin;
  } catch (error) {
    return fallbackOrigin;
  }
};

const getDocumentByFilename = (filename) => {
  if (!filename) {
    return '';
  }

  return `${getApiOrigin()}/uploads/documents/${filename}`;
};

export const resolveDocumentUrl = (rawUrl = '') => {
  if (!rawUrl) {
    return '';
  }

  const normalizedUrl = String(rawUrl).trim();

  if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
    return normalizedUrl;
  }

  const uploadsOrigin = getApiOrigin();

  if (normalizedUrl.startsWith('/')) {
    return new URL(normalizedUrl, uploadsOrigin).toString();
  }

  if (normalizedUrl.includes('/uploads/')) {
    return new URL(`/${normalizedUrl.replace(/^\/+/, '')}`, uploadsOrigin).toString();
  }

  const filename = normalizedUrl.split('/').pop();
  return getDocumentByFilename(filename);
};

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
    const token =
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('managerToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('managerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

managerApi.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem('managerToken') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('managerToken') ||
      localStorage.getItem('token');
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
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/manager-login');

      if (!isAuthRequest) {
        // Token expired or invalid
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('managerToken');
        sessionStorage.removeItem('manager');
        sessionStorage.removeItem('managerAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        localStorage.removeItem('managerToken');
        localStorage.removeItem('manager');
        localStorage.removeItem('managerAuth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor for manager API
managerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/manager-login');

      if (!isAuthRequest) {
        // Token expired or invalid
        sessionStorage.removeItem('managerToken');
        sessionStorage.removeItem('manager');
        sessionStorage.removeItem('managerAuth');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth');
        sessionStorage.removeItem('user');
        localStorage.removeItem('managerToken');
        localStorage.removeItem('manager');
        localStorage.removeItem('managerAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  managerLogin: (data) => api.post('/auth/manager-login', data),
  createManager: (data) => api.post('/auth/create-manager', data),
  getManagers: () => api.get('/auth/managers'),
  updateManagerStatus: (id, isActive) => api.put(`/auth/managers/${id}/status`, { isActive }),
  deleteManager: (id) => api.delete(`/auth/managers/${id}`),
  resetManagerPassword: (id, data) => api.put(`/auth/managers/${id}/reset-password`, data),
  firstLoginPasswordChange: (data) => api.put('/auth/first-login-password-change', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  resetAdminPassword: (data) => api.put('/auth/admin/reset-password', data),
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
  getVisaCountries: () => api.get('/employees/visa-countries'),
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
  getDocument: (filename) => getDocumentByFilename(filename),
  resolveDocumentUrl,
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
