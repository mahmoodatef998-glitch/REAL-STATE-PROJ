import { api } from './axios-client';

export interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    message?: string;
    property_id: number;
    broker_id: number;
    company_id?: number;
    status: 'new' | 'contacted' | 'negotiating' | 'closed';
    createdAt?: string;
    updatedAt?: string;
    property?: any;
    broker?: any;
}

export interface LeadFilters {
    status?: string;
    property_id?: number | string;
    broker_id?: number | string;
    company_id?: number | string;
    limit?: number | string;
}

/**
 * Leads API client
 */
export const leadsApi = {
    /**
     * Get all leads (filtered by user role automatically on backend)
     */
    getAll: async (filters: LeadFilters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.property_id) params.append('property_id', String(filters.property_id));
        if (filters.broker_id) params.append('broker_id', String(filters.broker_id));
        if (filters.company_id) params.append('company_id', String(filters.company_id));
        if (filters.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        const url = `/leads${queryString ? `?${queryString}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    /**
     * Get a single lead by ID
     */
    getById: async (id: number | string) => {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    /**
     * Create a new lead (public endpoint - no auth required)
     */
    create: async (leadData: Partial<Lead>) => {
        const response = await api.post('/leads', leadData);
        return response.data;
    },

    /**
     * Update lead status
     */
    updateStatus: async (id: number | string, status: string) => {
        const response = await api.put(`/leads/${id}`, { status });
        return response.data;
    },

    /**
     * Delete a lead (admin only)
     */
    delete: async (id: number | string) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    /**
     * Get leads for a specific property
     */
    getByProperty: async (propertyId: number | string) => {
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
