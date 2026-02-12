import api from '../api/api';

export const timocomService = {
  getFreights: async (filters = {}) => {
    try {
      // Build query parameters, only include non-empty values
      const params = {};

      if (filters.originCountry) params.origin_country = filters.originCountry;
      if (filters.destinationCountry) params.destination_country = filters.destinationCountry;
      if (filters.originCity) params.origin = filters.originCity;
      if (filters.destinationCity) params.destination = filters.destinationCity;
      if (filters.date) params.date = filters.date;

      const response = await api.get('/api/timocom/search', { params });
      // Backend returns { source: "...", results: [...] }
      return response.data;
    } catch (error) {
      console.error("Timocom API Error:", error);
      return { results: [] };
    }
  },

  sendOffer: async (freightId, amount) => {
    // In a real app, this would also be a backend call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Offer sent for ${freightId}: ${amount}`);
    return { success: true, message: 'Offer sent successfully' };
  }
};
