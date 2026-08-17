import api from './axios';

export const reportsApi = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getMyReports: async () => {
    const response = await api.get('/reports/my');
    return response.data;
  },
};
