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

  sendOffer: async (offerData) => {
    try {
      const response = await api.post('/api/timocom/offer', offerData);
      return response.data;
    } catch (error) {
      console.error("Timocom Offer Error:", error);
      throw error;
    }
  },

  getMyOffers: async (skip = 0, limit = 50) => {
    try {
      const response = await api.get('/api/timocom/offers', { params: { skip, limit } });
      return response.data.offers || [];
    } catch (error) {
      console.error("Timocom Get Offers Error:", error);
      return [];
    }
  },

  getTemplates: async () => {
    try {
      const response = await api.get('/api/timocom/templates');
      return response.data;
    } catch (error) {
      console.error("Timocom Get Templates Error:", error);
      return [];
    }
  },

  saveTemplate: async (templateData) => {
    try {
      const response = await api.post('/api/timocom/templates', templateData);
      return response.data;
    } catch (error) {
      console.error("Timocom Save Template Error:", error);
      throw error;
    }
  },

  deleteTemplate: async (templateId) => {
    try {
      const response = await api.delete(`/api/timocom/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error("Timocom Delete Template Error:", error);
      throw error;
    }
  },

  analyzeRisk: async (companyName) => {
    try {
      const response = await api.post('/api/ai/analyze-risk', { company_name: companyName });
      return response.data;
    } catch (error) {
      console.error("Timocom Analyze Risk Error:", error);
      return null;
    }
  }
};
