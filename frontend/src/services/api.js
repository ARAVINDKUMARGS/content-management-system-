import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lumen_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        console.warn('[Lumen Auth API] Session expired or unauthorized.');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API Endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
};

// User Management API Endpoints
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getUserById: (id) => API.get(`/users/${id}`),
  // Admin Endpoints
  getAllUsers: () => API.get('/users'),
  createUserByAdmin: (data) => API.post('/users', data),
  updateUserRole: (id, role) => API.put(`/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/users/${id}`),
};
// Admin Verification API Endpoints
export const adminVerificationAPI = {
  // Get content waiting for admin review
  getPendingArticles: () =>
    API.get('/admin-verification/articles'),

  getPendingQuizzes: () =>
    API.get('/admin-verification/quizzes'),
getStats: () => API.get("/admin-verification/stats"),
  // Article actions
  approveArticle: (id) =>
    API.put(`/admin-verification/articles/${id}/approve`),

  rejectArticle: (id, reason) =>
    API.put(`/admin-verification/articles/${id}/reject`, {
      reason,
    }),

  requestArticleChanges: (id, comment) =>
    API.put(`/admin-verification/articles/${id}/request-changes`, {
      comment,
    }),

  // Quiz actions
  approveQuiz: (id) =>
    API.put(`/admin-verification/quizzes/${id}/approve`),

  rejectQuiz: (id, reason) =>
    API.put(`/admin-verification/quizzes/${id}/reject`, {
      reason,
    }),

  requestQuizChanges: (id, comment) =>
    API.put(`/admin-verification/quizzes/${id}/request-changes`, {
      comment,
    }),
};


export default API;
