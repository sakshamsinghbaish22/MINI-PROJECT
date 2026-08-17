import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookcycle_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth expiration handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!error.config?.url?.includes('/auth/me')) {
        localStorage.removeItem('bookcycle_token');
        localStorage.removeItem('bookcycle_user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },
  getSellerProfile: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/public`);
    return response.data;
  },
  getUserStats: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/stats`);
    return response.data;
  },
};

export const booksApi = {
  getBooks: async (params = {}) => {
    const response = await apiClient.get('/books', { params });
    return response.data;
  },
  getBookById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },
  createBook: async (bookData) => {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },
  getMyListings: async () => {
    const response = await apiClient.get('/books/user/me');
    return response.data;
  },
};

export const wishlistApi = {
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },
  addToWishlist: async (bookId) => {
    const response = await apiClient.post('/wishlist', { book_id: bookId });
    return response.data;
  },
  removeFromWishlist: async (bookId) => {
    const response = await apiClient.delete(`/wishlist/${bookId}`);
    return response.data;
  },
};

export const messagesApi = {
  getConversations: async () => {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  },
  getThread: async (otherUserId) => {
    const response = await apiClient.get(`/messages/thread/${otherUserId}`);
    return response.data;
  },
  sendMessage: async ({ receiver_id, book_id, message }) => {
    const response = await apiClient.post('/messages', {
      receiver_id,
      book_id,
      message,
    });
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data;
  },
};

export const transactionsApi = {
  getTransactions: async (type = null) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },
  createTransaction: async (data) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },
  updateStatus: async (transactionId, status) => {
    const response = await apiClient.put(`/transactions/${transactionId}/status`, { status });
    return response.data;
  },
};

export const reviewsApi = {
  getUserReviews: async (userId) => {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },
};

export const reportsApi = {
  createReport: async (reportData) => {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  },
};

export const adminApi = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },
  updateUserStatus: async (userId, isActive) => {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },
  getBooks: async (params = {}) => {
    const response = await apiClient.get('/admin/books', { params });
    return response.data;
  },
  deleteBook: async (bookId) => {
    const response = await apiClient.delete(`/admin/books/${bookId}`);
    return response.data;
  },
  getReports: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/admin/reports', { params });
    return response.data;
  },
  updateReport: async (reportId, status, adminNotes = '') => {
    const response = await apiClient.put(`/admin/reports/${reportId}`, {
      status,
      admin_notes: adminNotes,
    });
    return response.data;
  },
};

export default apiClient;
