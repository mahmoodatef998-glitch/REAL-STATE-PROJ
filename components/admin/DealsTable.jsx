"use client";
import { useState } from 'react';
import DealCard from './DealCard';

export default function DealsTable({ deals = [], totals = null, onEdit, onDelete, isLoading = false }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const status = deal.status || 'open';
    const type = deal.deal_type || deal.dealType || 'sale';
    
    const statusMatch = statusFilter === 'all' || status === statusFilter;
    const typeMatch = typeFilter === 'all' || type === typeFilter;
    
    return statusMatch && typeMatch;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="text-neutral-300 mt-4">Loading deals...</p>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Deals Found</h3>
        <p className="text-neutral-300 mb-4">No deals have been created yet.</p>
        <p className="text-sm text-neutral-400">Start by creating your first deal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring text-sm"
          >
            <option value="all">All Types</option>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Totals Summary */}
        {totals && (
          <div className="flex gap-4 text-sm">
            <div className="px-3 py-1 bg-neutral-800 rounded border border-white/10">
              <span className="text-neutral-400">Total Deals: </span>
              <span className="text-white font-semibold">{totals.totalDeals || deals.length}</span>
            </div>
            {totals.totalCommissionValue > 0 && (
              <div className="px-3 py-1 bg-neutral-800 rounded border border-white/10">
                <span className="text-neutral-400">Total Commission: </span>
                <span className="text-green-400 font-semibold">
                  {totals.totalCommissionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredDeals.length !== deals.length && (
        <div className="text-sm text-neutral-400 bg-neutral-800/50 px-4 py-2 rounded border border-white/10 inline-block">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
      )}

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Deals Match Filters</h3>
          <p className="text-neutral-300 mb-4">Try adjusting your filters.</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={!!onEdit && !!onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

