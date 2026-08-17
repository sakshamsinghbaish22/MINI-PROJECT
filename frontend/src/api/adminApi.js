import api from './axios';

export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (search = '') => {
    const response = await api.get('/admin/users', { params: { search } });
    return response.data;
  },

  toggleUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, null, {
      params: { is_active: isActive },
    });
    return response.data;
  },

  getBooks: async (params = {}) => {
    const response = await api.get('/admin/books', { params });
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await api.delete(`/admin/books/${bookId}`);
    return response.data;
  },

  getReports: async (status = '') => {
    const params = status ? { status } : {};
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  updateReportStatus: async (reportId, updateData) => {
    const response = await api.put(`/admin/reports/${reportId}/status`, updateData);
    return response.data;
  },
};
