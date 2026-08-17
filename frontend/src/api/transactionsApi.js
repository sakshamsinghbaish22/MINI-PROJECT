import api from './axios';

export const transactionsApi = {
  createTransaction: async (txData) => {
    const response = await api.post('/transactions', txData);
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getIncomingTransactions: async () => {
    const response = await api.get('/transactions/incoming');
    return response.data;
  },

  getOutgoingTransactions: async () => {
    const response = await api.get('/transactions/outgoing');
    return response.data;
  },

  getTransactionById: async (txId) => {
    const response = await api.get(`/transactions/${txId}`);
    return response.data;
  },

  updateTransactionStatus: async (txId, status) => {
    const response = await api.put(`/transactions/${txId}/status`, { status });
    return response.data;
  },
};
