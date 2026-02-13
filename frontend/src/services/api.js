import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  employeeLogin: (credentials) => api.post('/auth/employee-login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Candidate endpoints
export const candidateAPI = {
  submitInterestForm: (data) => api.post('/candidates/interest', data),
  checkCandidate: (data) => api.post('/candidates/check', data),
  submitExitedForm: (data) => api.post('/candidates/exited', data),
  getCandidates: (params) => api.get('/candidates', { params }),
  getCandidate: (id) => api.get(`/candidates/${id}`),
  allowExited: (id) => api.put(`/candidates/${id}/allow-exited`),
  approveCandidate: (id, data) => api.post(`/candidates/${id}/approve`, data),
  updateAdminFields: (id, data) => api.put(`/candidates/${id}/admin-update`, data),
  finalConfirmation: (id, data) => api.put(`/candidates/${id}/final-confirmation`, data),
  getStats: () => api.get('/candidates/stats'),
  deleteCandidate: (id) => api.delete(`/candidates/${id}`),
};

// Upload endpoints
export const uploadAPI = {
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
