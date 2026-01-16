import { api } from './axios-client';

/**
 * Leads API client
 */
export const leadsApi = {
  /**
   * Get all leads (filtered by user role automatically on backend)
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.property_id) params.append('property_id', filters.property_id);
    if (filters.broker_id) params.append('broker_id', filters.broker_id);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    const url = `/leads${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get a single lead by ID
   */
  getById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  /**
   * Create a new lead (public endpoint - no auth required)
   */
  create: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  /**
   * Update lead status
   */
  updateStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}`, { status });
    return response.data;
  },

  /**
   * Delete a lead (admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  /**
   * Get leads for a specific property
   */
  getByProperty: async (propertyId) => {
    const response = await api.get(`/leads/property/${propertyId}`);
    return response.data;
  },

  /**
   * Get lead statistics
   */
  getStats: async () => {
    const response = await api.get('/leads/stats/overview');
    return response.data;
  },

  /**
   * Get notification count (new leads)
   */
  getNotificationCount: async () => {
    const response = await api.get('/leads/notifications/count');
    return response.data;
  }
};

