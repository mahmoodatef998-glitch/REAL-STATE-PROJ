import { api } from './axios-client';

/**
 * Get all companies
 * @returns {Promise}
 */
export async function getAllCompanies() {
  const response = await api.get('/companies');
  return response.data.companies || [];
}

/**
 * Get company by ID
 * @param {number} id
 * @returns {Promise}
 */
export async function getCompanyById(id) {
  const response = await api.get(`/companies/${id}`);
  return response.data.company;
}

/**
 * Create a new company (admin only)
 * @param {Object} companyData
 * @returns {Promise}
 */
export async function createCompany(companyData) {
  const response = await api.post('/companies', companyData);
  return response.data;
}

