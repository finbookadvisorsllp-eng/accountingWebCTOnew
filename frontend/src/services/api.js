import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  employeeLogin: (credentials) => api.post("/auth/employee-login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

// Candidate endpoints
export const candidateAPI = {
  // submitInterestForm: (data) => api.post('/candidates/interest', data),
  // 🔥 IMPORTANT CHANGE: multipart support
  submitInterestForm: (data) =>
    api.post("/candidates/interest", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  checkCandidate: (data) => api.post("/candidates/check", data),
  submitExitedForm: (data) => api.post("/candidates/exited", data),
  getCandidates: (params) => api.get("/candidates", { params }),
  getCandidate: (id) => api.get(`/candidates/${id}`),
  allowExited: (id) => api.put(`/candidates/${id}/allow-exited`),
  approveCandidate: (id, data) =>
    api.post(`/candidates/${id}/approve`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateAdminFields: (id, data) =>
    api.put(`/candidates/${id}/admin-update`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getStats: () => api.get("/candidates/stats"),
  deleteCandidate: (id) => api.delete(`/candidates/${id}`),
  // Employee self-service
  acceptContract: (id) => api.put(`/candidates/${id}/accept-contract`),
  updateOwnProfile: (id, data) =>
    api.put(`/candidates/${id}/update-profile`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (id, data) =>
    api.put(`/candidates/${id}/change-password`, data),
};

// Upload endpoints
export const uploadAPI = {
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    return api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// new add
// Client endpoints
export const clientAPI = {
  createClient: (data) => api.post("/clients", data),
  getClients: (params) => api.get("/clients", { params }),
  getMyClients: (params) => api.get("/clients/my-clients", { params }),
  getClient: (id) => api.get(`/clients/${id}`),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  assignAccountant: (clientId, accountantId) =>
    api.put(`/clients/${clientId}/assign`, { accountantId }),
  getChildCompanies: (id) => api.get(`/clients/${id}/children`),
  getStats: () => api.get("/clients/stats"),
};

// User endpoints
export const userAPI = {
  getAccountants: () => api.get("/users/accountants"),
  getAllUsers: (params) => api.get("/users", { params }),
};
// new update 19-02
// Entity Type endpoints (MASTER DATA)
export const entityTypeAPI = {
  getAll: () => api.get("/entity-types"),
  getOne: (id) => api.get(`/entity-types/${id}`),
  create: (data) => api.post("/entity-types", data),
  update: (id, data) => api.put(`/entity-types/${id}`, data),
  remove: (id) => api.delete(`/entity-types/${id}`),
};

// Nature of Business endpoints (MASTER DATA)
export const natureOfBusinessAPI = {
  getAll: () => api.get("/nature-of-business"),
  getOne: (id) => api.get(`/nature-of-business/${id}`),
  create: (data) => api.post("/nature-of-business", data),
  update: (id, data) => api.put(`/nature-of-business/${id}`, data),
  remove: (id) => api.delete(`/nature-of-business/${id}`),
};

// Compliance Task endpoints (MASTER DATA)
export const complianceTaskAPI = {
  getAll: () => api.get("/compliance-tasks"),
  getOne: (id) => api.get(`/compliance-tasks/${id}`),
  create: (data) => api.post("/compliance-tasks", data),
  update: (id, data) => api.put(`/compliance-tasks/${id}`, data),
  remove: (id) => api.delete(`/compliance-tasks/${id}`),

  // 🔥 dashboard
  // getStats: () => api.get("/compliance-tasks/stats"),
};

export const complianceAPI = {
  getAll: () => api.get("/compliances"),
  getOne: (id) => api.get(`/compliances/${id}`),
  create: (data) => api.post("/compliances", data),
  update: (id, data) => api.put(`/compliances/${id}`, data),
  remove: (id) => api.delete(`/compliances/${id}`),
};

// Attendance endpoints
export const attendanceAPI = {
  // Office
  officeCheckIn: (data) => api.post("/attendance/office/check-in", data),
  officeCheckOut: (data) => api.post("/attendance/office/check-out", data),
  officeToday: () => api.get("/attendance/office/today"),
  officeHistory: (params) => api.get("/attendance/office/history", { params }),
  // Client visit
  clientCheckIn: (clientId, data) =>
    api.post(`/attendance/client/${clientId}/check-in`, data),
  clientCheckOut: (clientId, data) =>
    api.post(`/attendance/client/${clientId}/check-out`, data),
  clientHistory: (clientId) =>
    api.get(`/attendance/client/${clientId}/history`),
  // Summary
  getSummary: (params) => api.get("/attendance/summary", { params }),
};

export const businessSummaryAPI = {
  createOrUpdate: (data) => api.post("/business-summary", data),
  getByClientAndYear: (clientId, year) => api.get(`/business-summary/${clientId}`, { params: { year } }),
  getSingleMonth: (clientId, year, month) => api.get(`/business-summary/${clientId}/${year}/${month}`),
};

export const gstLiabilityAPI = {
  createOrUpdate: (data) => api.post("/gst-liability", data),
  getByClientAndYear: (clientId, year) => api.get(`/gst-liability/${clientId}`, { params: { year } }),
  getSingleMonth: (clientId, year, month) => api.get(`/gst-liability/${clientId}/${year}/${month}`),
};

export const pnlAPI = {
  createOrUpdate: (data) => api.post("/pnl", data),
  getByYear: (clientId, year) => api.get(`/pnl/${clientId}`, { params: { year } }),
  getSummary: (clientId, year) => api.get(`/pnl/${clientId}/summary`, { params: { year } }),
};

export const balanceSheetAPI = {
  createOrUpdate: (data) => api.post("/balance-sheet", data),
  getByYear: (clientId, year) => api.get(`/balance-sheet/${clientId}`, { params: { year } }),
  getSummary: (clientId, year) => api.get(`/balance-sheet/${clientId}/summary`, { params: { year } }),
};

// complianceAPI merged above

export default api;
