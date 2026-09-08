import axios from 'axios';

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const QUIZ_API = axios.create({
  baseURL: import.meta.env.VITE_QUIZ_API_URL || 'http://localhost:5001/api',
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
        console.warn(
          '[Lumen Auth API] Session expired or unauthorized.'
        );
      }
    }

    return Promise.reject(error);
  }
);

// ======================================================
// Authentication API
// ======================================================

export const authAPI = {
  register: (data) =>
    API.post('/auth/register', data),

  login: (data) =>
    API.post('/auth/login', data),

  logout: () =>
    API.post('/auth/logout'),

  getMe: () =>
    API.get('/auth/me'),
};

// ======================================================
// User Management API
// ======================================================

export const userAPI = {
  // Current user's profile
  getProfile: () =>
    API.get('/users/profile'),

  // Update current user's profile
  updateProfile: (data) =>
    API.put('/users/profile', data),

  // Public user profile
  getUserById: (id) =>
    API.get(`/users/${id}`),

  // Admin endpoints
  getAllUsers: () =>
    API.get('/users'),

  createUserByAdmin: (data) =>
    API.post('/users', data),

  updateUserRole: (id, role) =>
    API.put(`/users/${id}/role`, { role }),

  deleteUser: (id) =>
    API.delete(`/users/${id}`),
};

// ======================================================
// Admin Verification API
// ======================================================

export const adminVerificationAPI = {
  // Get content waiting for admin review
  getPendingArticles: () =>
    API.get('/admin-verification/articles'),

  getPendingQuizzes: () =>
    API.get('/admin-verification/quizzes'),

  getStats: () =>
    API.get('/admin-verification/stats'),

  // Article actions
  approveArticle: (id) =>
    API.put(`/admin-verification/articles/${id}/approve`),

  rejectArticle: (id, reason) =>
    API.put(`/admin-verification/articles/${id}/reject`, {
      reason,
    }),

  requestArticleChanges: (id, comment) =>
    API.put(
      `/admin-verification/articles/${id}/request-changes`,
      {
        comment,
      }
    ),

  // Quiz actions
  approveQuiz: (id) =>
    API.put(`/admin-verification/quizzes/${id}/approve`),

  rejectQuiz: (id, reason) =>
    API.put(`/admin-verification/quizzes/${id}/reject`, {
      reason,
    }),

  requestQuizChanges: (id, comment) =>
    API.put(
      `/admin-verification/quizzes/${id}/request-changes`,
      {
        comment,
      }
    ),
};

// ======================================================
// Article Management API
// ======================================================

export const articleAPI = {
  // Public / Browse
  getArticles: (params) =>
    API.get('/articles', { params }),

  getArticleById: (id) =>
    API.get(`/articles/${id}`),

  // Published articles by specific author
  getPublishedArticlesByAuthor: (id) =>
    API.get(`/articles/author/${id}`),

  // Current author's articles
  getMyArticles: () =>
    API.get('/articles/mine'),

  getMyArticleById: (id) =>
    API.get(`/articles/mine/${id}`),

  // Create / Update
  createArticle: (data) =>
    API.post('/articles', data),

  updateArticle: (id, data) =>
    API.put(`/articles/${id}`, data),

  deleteArticle: (id) =>
    API.delete(`/articles/${id}`),

  // Submit article
  submitArticle: (id) =>
    API.patch(`/articles/${id}/submit`),

  // Like article
  likeArticle: (id) =>
    API.patch(`/articles/${id}/like`),

  // Increment article views
  viewArticle: (id) =>
    API.patch(`/articles/${id}/view`),

  // Admin review
  reviewArticle: (id, data) =>
    API.patch(`/articles/${id}/review`, data),

  // Admin: get all non-draft articles
  getAllArticlesForAdmin: () =>
    API.get('/articles/admin/all'),
};

// ======================================================
// Quiz API
// ======================================================

export const quizAPI = {
  getAllQuizzes: (params) =>
    API.get('/quizzes', { params }),

  getQuizById: (id) =>
    API.get(`/quizzes/${id}`),

  getQuizByArticleId: (articleId) =>
    API.get(`/quizzes/article/${articleId}`),

  createQuiz: (data) =>
    API.post('/quizzes', data),

  updateQuiz: (id, data) =>
    API.put(`/quizzes/${id}`, data),

  deleteQuiz: (id) =>
    API.delete(`/quizzes/${id}`),

  submitQuiz: (id) =>
    API.patch(`/quizzes/${id}/submit`),
};

// ======================================================
// Quiz Attempt API
// ======================================================

export const quizAttemptAPI = {
  submitAttempt: (data) =>
    API.post('/quiz-attempts', data),

  getMyAttempts: () =>
    API.get('/quiz-attempts/my'),

  getQuizAttempts: (quizId) =>
    API.get(`/quiz-attempts/quiz/${quizId}`),
};

// ======================================================
// Notification API
// ======================================================

export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
};
// Comment & Discussion API Endpoints (Sadanand Module)
export const commentAPI = {
  getCommentsByTarget: (targetId) => API.get(`/comments/target/${targetId}`),
  createComment: (data) => API.post('/comments', data),
  updateComment: (id, data) => API.put(`/comments/${id}`, data),
  deleteComment: (id) => API.delete(`/comments/${id}`),
  toggleReaction: (id, type = 'like') => API.post(`/comments/${id}/react`, { type }),
  getRecentDiscussions: (limit = 8) => API.get('/comments/recent', { params: { limit } }),

  // Admin
  reviewArticle: (id, data) =>
    API.patch(`/articles/${id}/review`, data),

  getAllArticlesForAdmin: () =>
    API.get('/articles/admin/all'),
};

// Quiz Management API Endpoints
export const QuizAPI = {
  getAllQuizzes: () => QUIZ_API.get('/quizzes'),
  getQuizById: (id) => QUIZ_API.get(`/quizzes/${id}`),

  updateQuiz: (id, data) =>
    QUIZ_API.put(`/quizzes/${id}`, data),

  deleteQuiz: (id) =>
    QUIZ_API.delete(`/quizzes/${id}`),

};

export default API;