import api from '../api/api';

export const timocomService = {
  getFreights: async (filter = {}) => {
    try {
      const response = await api.get('/api/timocom/search', { params: filter });
      // Backend returns { source: "...", results: [...] }
      return response.data;
    } catch (error) {
      console.error("Timocom API Error:", error);
      return [];
    }
  },

  sendOffer: async (freightId, amount) => {
    // In a real app, this would also be a backend call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Offer sent for ${freightId}: ${amount}`);
    return { success: true, message: 'Offer sent successfully' };
  }
};
