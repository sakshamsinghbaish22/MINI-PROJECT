import api from './axios';

export const reviewsApi = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },
};
