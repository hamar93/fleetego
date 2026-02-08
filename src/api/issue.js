import api from './api';

export const issueApi = {
    // Report a new issue
    create: async (data) => {
        const response = await api.post('/fleet/issues', data);
        return response.data;
    },

    // Get all issues (with optional filters)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.vehicle_id) params.append('vehicle_id', filters.vehicle_id);

        const response = await api.get(`/fleet/issues?${params.toString()}`);
        return response.data;
    },

    // Update issue status/details
    update: async (id, data) => {
        const response = await api.patch(`/fleet/issues/${id}`, data);
        return response.data;
    }
};

export default issueApi;
