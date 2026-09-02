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
  getPendingArticles: () => API.get('/admin-verification/articles'),
  getPendingQuizzes: () => API.get('/admin-verification/quizzes'),
  getStats: () => API.get('/admin-verification/stats'),
  approveArticle: (id) => API.put(`/admin-verification/articles/${id}/approve`),
  rejectArticle: (id, reason) => API.put(`/admin-verification/articles/${id}/reject`, { reason }),
  requestArticleChanges: (id, comment) => API.put(`/admin-verification/articles/${id}/request-changes`, { comment }),
  approveQuiz: (id) => API.put(`/admin-verification/quizzes/${id}/approve`),
  rejectQuiz: (id, reason) => API.put(`/admin-verification/quizzes/${id}/reject`, { reason }),
  requestQuizChanges: (id, comment) => API.put(`/admin-verification/quizzes/${id}/request-changes`, { comment }),
};

// Article Management API Endpoints
export const articleAPI = {
  getArticles: (params) => API.get('/articles', { params }),
  getArticleById: (id) => API.get(`/articles/${id}`),
  getMyArticles: () => API.get('/articles/mine'),
  getMyArticleById: (id) => API.get(`/articles/mine/${id}`),
  createArticle: (data) => API.post('/articles', data),
  updateArticle: (id, data) => API.put(`/articles/${id}`, data),
  deleteArticle: (id) => API.delete(`/articles/${id}`),
  submitArticle: (id) => API.patch(`/articles/${id}/submit`),
  likeArticle: (id) => API.patch(`/articles/${id}/like`),
  viewArticle: (id) => API.patch(`/articles/${id}/view`),
  reviewArticle: (id, data) => API.patch(`/articles/${id}/review`, data),
};

// Quiz API Endpoints
export const quizAPI = {
  getAllQuizzes: (params) => API.get('/quizzes', { params }),
  getQuizById: (id) => API.get(`/quizzes/${id}`),
  getQuizByArticleId: (articleId) => API.get(`/quizzes/article/${articleId}`),
  createQuiz: (data) => API.post('/quizzes', data),
  updateQuiz: (id, data) => API.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => API.delete(`/quizzes/${id}`),
  submitQuiz: (id) => API.patch(`/quizzes/${id}/submit`),
};

// Quiz Attempt API Endpoints
export const quizAttemptAPI = {
  submitAttempt: (data) => API.post('/quiz-attempts', data),
  getMyAttempts: () => API.get('/quiz-attempts/my'),
  getQuizAttempts: (quizId) => API.get(`/quiz-attempts/quiz/${quizId}`),
};

// Notification API Endpoints
export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
};

export default API;
