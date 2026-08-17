import api from './axios';

export const messagesApi = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getMessageThread: async (otherUserId, bookId = null) => {
    const params = bookId ? { book_id: bookId } : {};
    const response = await api.get(`/messages/thread/${otherUserId}`, { params });
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  },
};
