/**
 * Custom hooks for Monthly Reports
 */

import { useQuery } from '@tanstack/react-query';
import {
  getBrokerMonthlyCommission,
  getBrokerCommissionHistory,
  compareBrokerMonths,
  getCompanyMonthlyIncome,
  getCompanyIncomeHistory,
  getBrokersPerformance,
  getDashboardSummary,
  getAvailableMonths,
  filterDealsByDate
} from '../lib/api/reports';

/**
 * Get broker monthly commission
 */
export function useBrokerMonthlyCommission(brokerId, year, month) {
  return useQuery({
    queryKey: ['brokerMonthlyCommission', brokerId, year, month],
    queryFn: () => getBrokerMonthlyCommission(brokerId, year, month),
    enabled: !!brokerId || !!year || !!month,
  });
}

/**
 * Get broker commission history
 */
export function useBrokerCommissionHistory(brokerId, months = 12) {
  return useQuery({
    queryKey: ['brokerCommissionHistory', brokerId, months],
    queryFn: () => getBrokerCommissionHistory(brokerId, months),
    enabled: !!brokerId,
  });
}

/**
 * Compare broker months
 */
export function useCompareBrokerMonths(brokerId) {
  return useQuery({
    queryKey: ['compareBrokerMonths', brokerId],
    queryFn: () => compareBrokerMonths(brokerId),
    enabled: !!brokerId,
  });
}

/**
 * Get company monthly income (Admin only)
 */
export function useCompanyMonthlyIncome(companyId, year, month) {
  return useQuery({
    queryKey: ['companyMonthlyIncome', companyId, year, month],
    queryFn: () => getCompanyMonthlyIncome(companyId, year, month),
  });
}

/**
 * Get company income history (Admin only)
 */
export function useCompanyIncomeHistory(companyId, months = 12) {
  return useQuery({
    queryKey: ['companyIncomeHistory', companyId, months],
    queryFn: () => getCompanyIncomeHistory(companyId, months),
  });
}

/**
 * Get all brokers performance (Admin only)
 */
export function useBrokersPerformance(year, month, companyId) {
  return useQuery({
    queryKey: ['brokersPerformance', year, month, companyId],
    queryFn: () => getBrokersPerformance(year, month, companyId),
  });
}

/**
 * Get dashboard summary
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });
}

/**
 * Get available months
 */
export function useAvailableMonths(count = 12) {
  return useQuery({
    queryKey: ['availableMonths', count],
    queryFn: () => getAvailableMonths(count),
  });
}

/**
 * Filter deals by date
 */
export function useFilteredDeals(filters) {
  return useQuery({
    queryKey: ['filteredDeals', filters],
    queryFn: () => filterDealsByDate(filters),
    enabled: !!filters && Object.keys(filters).length > 0,
  });
}

