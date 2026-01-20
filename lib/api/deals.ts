import { api } from './axios-client';
import { Company } from './companies';

export interface DealFilters {
    brokerId?: number | string;
    companyId?: number | string;
    clientId?: number | string;
    status?: string;
    month?: string;
    startDate?: string;
    endDate?: string;
}

export interface Deal {
    id: number;
    propertyId: number;
    brokerId: number;
    companyId: number;
    clientId?: number;
    clientName: string;
    dealType: 'sale' | 'rent';
    dealValue: number;
    salePrice: number; // Backward compatibility
    commissionRate?: number;
    commissionValue?: number;
    brokerShare?: number;
    companyShare?: number;
    status: 'open' | 'closed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    dateClosed?: string;
    property?: any;
    broker?: any;
    company?: any;
    client?: any;
}

/**
 * Get all deals (with optional filters)
 */
export async function getAllDeals(filters: DealFilters = {}): Promise<{
    success: boolean;
    deals: Deal[];
    totals?: any
}> {
    const params = new URLSearchParams();
    if (filters.brokerId) params.append('brokerId', String(filters.brokerId));
    if (filters.companyId) params.append('companyId', String(filters.companyId));
    if (filters.clientId) params.append('clientId', String(filters.clientId));
    if (filters.status) params.append('status', filters.status);

    // Add date filters
    if (filters.month) params.append('month', filters.month);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/deals?${queryString}` : '/deals';

    const response = await api.get(url);
    return response.data;
}

/**
 * Get deals with specific filter endpoint (if backend supports /deals/filter)
 */
export async function getFilteredDeals(filters: DealFilters = {}): Promise<{
    success: boolean;
    filters: any;
    deals: Deal[];
    totals?: any
}> {
    const params = new URLSearchParams();
    if (filters.brokerId) params.append('brokerId', String(filters.brokerId));
    if (filters.companyId) params.append('companyId', String(filters.companyId));
    if (filters.status) params.append('status', filters.status);
    if (filters.month) params.append('month', filters.month);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/deals/filter?${queryString}` : '/deals/filter';

    const response = await api.get(url);
    return response.data;
}

/**
 * Get deal by ID
 */
export async function getDealById(id: number | string): Promise<Deal> {
    const response = await api.get(`/deals/${id}`);
    return response.data.deal;
}

/**
 * Create a new deal
 */
export async function createDeal(dealData: Partial<Deal>): Promise<{ success: boolean; deal: Deal }> {
    const response = await api.post('/deals', dealData);
    return response.data;
}

/**
 * Update a deal
 */
export async function updateDeal(id: number | string, updateData: Partial<Deal>): Promise<{ success: boolean; deal: Deal }> {
    const response = await api.put(`/deals/${id}`, updateData);
    return response.data;
}

/**
 * Delete a deal (admin only)
 */
export async function deleteDeal(id: number | string): Promise<{ success: boolean }> {
    const response = await api.delete(`/deals/${id}`);
    return response.data;
}

/**
 * Get companies list (for deal creation)
 */
export async function getCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data.companies || [];
}
