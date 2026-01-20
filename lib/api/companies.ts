import { api } from './axios-client';

export interface Company {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Get all companies
 */
export async function getAllCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data.companies || [];
}

/**
 * Get company by ID
 */
export async function getCompanyById(id: number | string): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data.company;
}

/**
 * Create a new company (admin only)
 */
export async function createCompany(companyData: Partial<Company>): Promise<Company> {
    const response = await api.post('/companies', companyData);
    return response.data.company;
}
