import api from './axios';

export const booksApi = {
  getPublicStats: async () => {
    const response = await api.get('/books/stats/summary');
    return response.data;
  },

  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  getRecentBooks: async (limit = 8) => {
    const response = await api.get('/books/featured/recent', { params: { limit } });
    return response.data;
  },

  getDonationBooks: async (limit = 8) => {
    const response = await api.get('/books/featured/donate', { params: { limit } });
    return response.data;
  },

  getExchangeBooks: async (limit = 8) => {
    const response = await api.get('/books/featured/exchange', { params: { limit } });
    return response.data;
  },

  getMyBooks: async () => {
    const response = await api.get('/books/my');
    return response.data;
  },

  getBookById: async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (bookId, bookData) => {
    const response = await api.put(`/books/${bookId}`, bookData);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await api.delete(`/books/${bookId}`);
    return response.data;
  },
};
