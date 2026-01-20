/**
 * Reports API Client
 * Handles monthly commission and income reports
 */

import { api } from './axios-client';

/**
 * Get monthly commission for a broker
 */
export const getBrokerMonthlyCommission = async (brokerId: number | string | undefined, year?: number | string, month?: number | string) => {
    const params = new URLSearchParams();
    if (brokerId) params.append('brokerId', String(brokerId));
    if (year) params.append('year', String(year));
    if (month) params.append('month', String(month));

    const response = await api.get(`/reports/broker/monthly?${params.toString()}`);
    return response.data;
};

/**
 * Get broker commission history
 */
export const getBrokerCommissionHistory = async (brokerId: number | string | undefined, months: number = 12) => {
    const params = new URLSearchParams();
    if (brokerId) params.append('brokerId', String(brokerId));
    params.append('months', String(months));

    const response = await api.get(`/reports/broker/history?${params.toString()}`);
    return response.data;
};

/**
 * Compare current month with previous for broker
 */
export const compareBrokerMonths = async (brokerId: number | string | undefined) => {
    const params = new URLSearchParams();
    if (brokerId) params.append('brokerId', String(brokerId));

    const response = await api.get(`/reports/broker/compare?${params.toString()}`);
    return response.data;
};

/**
 * Get monthly income for company (Admin only)
 */
export const getCompanyMonthlyIncome = async (companyId: number | string | undefined, year?: number | string, month?: number | string) => {
    const params = new URLSearchParams();
    if (companyId) params.append('companyId', String(companyId));
    if (year) params.append('year', String(year));
    if (month) params.append('month', String(month));

    const response = await api.get(`/reports/company/monthly?${params.toString()}`);
    return response.data;
};

/**
 * Get company income history (Admin only)
 */
export const getCompanyIncomeHistory = async (companyId: number | string | undefined, months: number = 12) => {
    const params = new URLSearchParams();
    if (companyId) params.append('companyId', String(companyId));
    params.append('months', String(months));

    const response = await api.get(`/reports/company/history?${params.toString()}`);
    return response.data;
};

/**
 * Get all brokers performance (Admin only)
 */
export const getBrokersPerformance = async (year?: number | string, month?: number | string, companyId?: number | string) => {
    const params = new URLSearchParams();
    if (year) params.append('year', String(year));
    if (month) params.append('month', String(month));
    if (companyId) params.append('companyId', String(companyId));

    const response = await api.get(`/reports/brokers/performance?${params.toString()}`);
    return response.data;
};

/**
 * Get dashboard summary
 */
export const getDashboardSummary = async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
};

/**
 * Get available months list
 */
export const getAvailableMonths = async (count: number = 12) => {
    const response = await api.get(`/reports/months?count=${count}`);
    return response.data;
};

/**
 * Filter deals by date/month
 */
export const filterDealsByDate = async (filters: any) => {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.brokerId) params.append('brokerId', filters.brokerId);
    if (filters.companyId) params.append('companyId', filters.companyId);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`/deals/filter?${params.toString()}`);
    return response.data;
};
