"use client";
import { useState } from 'react';
import { useBrokersPerformance, useAvailableMonths } from '../../hooks/useReports';

export default function MonthlyCommissionsTable() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  
  const { data: monthsData } = useAvailableMonths(12);
  const { data: performanceData, isLoading, error } = useBrokersPerformance(
    selectedYear,
    selectedMonth,
    null
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const months = monthsData?.months || [];
  const brokers = performanceData?.topBrokers || [];
  const summary = performanceData?.summary || {};

  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Monthly Broker Commissions
          </h2>
          <p className="text-neutral-400 text-sm">
            View and calculate commissions for all brokers by month
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex gap-3">
          <select
            value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month));
            }}
            className="px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-accent focus:outline-none"
          >
            {months.map((m) => (
              <option key={`${m.year}-${m.month}`} value={`${m.year}-${String(m.month).padStart(2, '0')}`}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-400 text-sm mb-1">Total Brokers</p>
          <p className="text-2xl font-bold text-white">{summary.totalBrokers || 0}</p>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-400 text-sm mb-1">Total Deals</p>
          <p className="text-2xl font-bold text-white">{summary.totalDeals || 0}</p>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-400 text-sm mb-1">Total Commission</p>
          <p className="text-2xl font-bold text-accent">{formatCurrency(summary.totalCommission)}</p>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-400 text-sm mb-1">Average per Broker</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.averagePerBroker)}</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-neutral-400 mt-4">Loading data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-400">Error loading data</p>
          <p className="text-neutral-400 text-sm mt-2">{error.message}</p>
        </div>
      )}

      {/* Brokers Table */}
      {!isLoading && !error && brokers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Broker</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Email</th>
                <th className="text-center py-3 px-4 text-neutral-400 font-medium">Deals</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Deal Value</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Total Commission</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Broker Share (70%)</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Company Share (30%)</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((item, index) => (
                <tr 
                  key={item.broker?.id || index}
                  className="border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors"
                >
                  <td className="py-4 px-4 text-white">{index + 1}</td>
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{item.broker?.name || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-4 text-neutral-300 text-sm">
                    {item.broker?.email || 'N/A'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                      {item.totalDeals || 0} deals
                    </span>
                  </td>
                  <td className="py-4 px-4 text-neutral-300 text-right">
                    {formatCurrency(item.totalDealValue)}
                  </td>
                  <td className="py-4 px-4 text-neutral-300 text-right">
                    {formatCurrency(item.totalCommission)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-lg font-bold text-green-400">
                      {formatCurrency(item.brokerShare)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-accent font-semibold text-right">
                    {formatCurrency(item.companyShare)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-600 bg-neutral-900/50">
                <td colSpan="3" className="py-4 px-4 text-white font-bold text-left">
                  TOTAL
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                    {summary.totalDeals || 0} deals
                  </span>
                </td>
                <td className="py-4 px-4 text-white font-semibold text-right">
                  {formatCurrency(brokers.reduce((sum, b) => sum + (b.totalDealValue || 0), 0))}
                </td>
                <td className="py-4 px-4 text-white font-semibold text-right">
                  {formatCurrency(summary.totalCommission)}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-xl font-bold text-green-400">
                    {formatCurrency(brokers.reduce((sum, b) => sum + (b.brokerShare || 0), 0))}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-xl font-bold text-accent">
                    {formatCurrency(brokers.reduce((sum, b) => sum + (b.companyShare || 0), 0))}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !error && brokers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-neutral-400">No data available for this month</p>
          <p className="text-neutral-500 text-sm mt-2">Try selecting a different month</p>
        </div>
      )}
    </div>
  );
}

