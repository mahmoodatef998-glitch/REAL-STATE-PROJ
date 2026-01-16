import { api } from './axios-client';

/**
 * Get all deals (with optional filters)
 * @param {Object} filters - { brokerId, companyId, clientId, status }
 * @returns {Promise}
 */
export async function getAllDeals(filters = {}) {
  const params = new URLSearchParams();
  if (filters.brokerId) params.append('brokerId', filters.brokerId);
  if (filters.companyId) params.append('companyId', filters.companyId);
  if (filters.clientId) params.append('clientId', filters.clientId);
  if (filters.status) params.append('status', filters.status);

  const queryString = params.toString();
  const url = queryString ? `/deals?${queryString}` : '/deals';
  
  const response = await api.get(url);
  return response.data;
}

/**
 * Get deal by ID
 * @param {number} id
 * @returns {Promise}
 */
export async function getDealById(id) {
  const response = await api.get(`/deals/${id}`);
  return response.data.deal;
}

/**
 * Create a new deal
 * @param {Object} dealData
 * @returns {Promise}
 */
export async function createDeal(dealData) {
  const response = await api.post('/deals', dealData);
  return response.data;
}

/**
 * Update a deal
 * @param {number} id
 * @param {Object} updateData
 * @returns {Promise}
 */
export async function updateDeal(id, updateData) {
  const response = await api.put(`/deals/${id}`, updateData);
  return response.data;
}

/**
 * Delete a deal (admin only)
 * @param {number} id
 * @returns {Promise}
 */
export async function deleteDeal(id) {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
}

/**
 * Get companies list (for deal creation)
 * @returns {Promise}
 */
export async function getCompanies() {
  const response = await api.get('/companies');
  return response.data.companies || [];
}

