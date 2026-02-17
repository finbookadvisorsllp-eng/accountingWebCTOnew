import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
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

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  activateClient: (data) => api.post('/auth/activate-client', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout')
};

// User APIs
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  assignSubordinate: (id, data) => api.post(`/users/${id}/assign`, data),
  removeSubordinate: (parentId, subordinateId) => api.delete(`/users/${parentId}/subordinates/${subordinateId}`),
  getHierarchy: () => api.get('/users/hierarchy/tree')
};

// Client APIs
export const clientAPI = {
  createClient: (data) => api.post('/clients', data),
  getClients: (params) => api.get('/clients', { params }),
  getClient: (id) => api.get(`/clients/${id}`),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  assignClient: (id, data) => api.post(`/clients/${id}/assign`, data),
  getClientStats: () => api.get('/clients/stats')
};

// Business APIs
export const businessAPI = {
  createBusiness: (data) => api.post('/businesses', data),
  getBusinesses: (params) => api.get('/businesses', { params }),
  getBusiness: (id) => api.get(`/businesses/${id}`),
  updateBusiness: (id, data) => api.put(`/businesses/${id}`, data),
  deleteBusiness: (id) => api.delete(`/businesses/${id}`),
  assignBusiness: (id, data) => api.post(`/businesses/${id}/assign`, data),
  getBusinessStats: () => api.get('/businesses/stats')
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getHierarchy: () => api.get('/dashboard/hierarchy'),
  getActivities: (params) => api.get('/dashboard/activities', { params })
};

// Audit APIs
export const auditAPI = {
  getAuditLogs: (params) => api.get('/audit', { params }),
  getAuditSummary: (params) => api.get('/audit/summary', { params })
};

// ==================== OLD SYSTEM (Admin/Employee) APIs ====================
// Candidate APIs
export const candidateAPI = {
  getAllCandidates: (params) => api.get('/admin/candidates', { params }),
  getCandidate: (id) => api.get(`/admin/candidates/${id}`),
  createCandidate: (data) => api.post('/admin/candidates', data),
  updateCandidate: (id, data) => api.put(`/admin/candidates/${id}`, data),
  deleteCandidate: (id) => api.delete(`/admin/candidates/${id}`),
  addInterest: (id, data) => api.post(`/admin/candidates/${id}/interest`, data),
  addExit: (id, data) => api.post(`/admin/candidates/${id}/exit`, data),
  getStats: () => api.get('/admin/candidates/stats'),
  getEmployeeCandidates: () => api.get('/employee/candidates'),
  updateCandidateStatus: (id, data) => api.patch(`/admin/candidates/${id}/status`, data)
};

// Employee APIs (Old System)
export const employeeAPI = {
  getProfile: () => api.get('/employee/profile'),
  updateProfile: (data) => api.put('/employee/profile', data),
  getAssignedCandidates: () => api.get('/employee/candidates'),
  updateCandidateInterest: (id, data) => api.put(`/employee/candidates/${id}/interest`, data),
  reportExit: (id, data) => api.post(`/employee/candidates/${id}/exit`, data)
};

// Admin APIs (Old System)
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllEmployees: () => api.get('/admin/employees'),
  getEmployeeProfile: (id) => api.get(`/admin/employees/${id}`),
  updateEmployeeProfile: (id, data) => api.put(`/admin/employees/${id}`, data)
};

export default api;