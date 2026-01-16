"use client";
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MonthlyCommissionsTable from '../../../components/admin/MonthlyCommissionsTable';

export default function AdminReportsPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not admin (using useEffect)
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="container-x">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Monthly Reports
          </h1>
          <p className="text-neutral-300">
            View and calculate monthly commissions for all brokers
          </p>
        </div>

        {/* Monthly Commissions Table */}
        <MonthlyCommissionsTable />

        {/* Instructions Card */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            💡 How to Use
          </h3>
          <ul className="space-y-2 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Select a month from the dropdown above to view commissions for that period</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>The table displays all brokers with their monthly commission details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span><strong>Broker Share (70%):</strong> The amount payable to the broker as salary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span><strong>Company Share (30%):</strong> Net income for the company from commissions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Table is sorted by performance (highest commissions first)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

