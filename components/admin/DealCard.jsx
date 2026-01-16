"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function DealCard({ deal, onEdit, onDelete, showActions = true }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const statusColors = {
    open: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    closed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const dealTypeColors = {
    sale: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    rent: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const dealValue = deal.deal_value || deal.dealValue || deal.sale_price || deal.salePrice || 0;
  const commissionValue = deal.commission_value || deal.commissionValue || 0;
  const brokerShare = deal.broker_share || deal.brokerShare || 0;
  const companyShare = deal.company_share || deal.companyShare || 0;
  const commissionApproved = deal.commission_approved || deal.commissionApproved || false;
  const status = deal.status || 'open';
  const dealType = deal.deal_type || deal.dealType || 'sale';

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(deal.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-1 text-xs font-semibold rounded border ${statusColors[status] || statusColors.open}`}>
              {status.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-semibold rounded border ${dealTypeColors[dealType] || dealTypeColors.sale}`}>
              {dealType.toUpperCase()}
            </span>
            {commissionValue > 0 ? (
              <span className="px-2 py-1 text-xs font-semibold rounded border bg-green-500/20 text-green-400 border-green-500/30">
                ✓ COMMISSION SET
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded border bg-orange-500/20 text-orange-400 border-orange-500/30">
                ⏳ PENDING COMMISSION
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {deal.property?.title || `Deal #${deal.id}`}
          </h3>
          {deal.client_name && (
            <p className="text-sm text-neutral-400">
              Client: <span className="text-white font-medium">{deal.client_name}</span>
            </p>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(deal)}
              className="p-2 text-neutral-400 hover:text-accent transition-colors focus-ring rounded"
              title="Edit Deal"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 transition-colors focus-ring rounded ${
                showConfirm 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-neutral-400 hover:text-red-400'
              }`}
              title={showConfirm ? 'Confirm Delete' : 'Delete Deal'}
            >
              {showConfirm ? '🗑️ ✓' : '🗑️'}
            </button>
          </div>
        )}
      </div>

      {/* Property & Broker Info */}
      <div className="space-y-2 mb-4 text-sm">
        {deal.property && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Property:</span>
            <Link 
              href={`/properties/${deal.property.id}`}
              className="text-accent hover:text-accent/80 font-medium"
            >
              {deal.property.title}
            </Link>
          </div>
        )}
        {deal.broker && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Broker:</span>
            <span className="text-white">{deal.broker.name}</span>
          </div>
        )}
        {deal.company && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Company:</span>
            <span className="text-white">{deal.company.name}</span>
          </div>
        )}
      </div>

      {/* Financial Details */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-neutral-400 text-sm">Deal Value:</span>
          <span className="text-white font-semibold">
            {dealValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
          </span>
        </div>
        
        {commissionValue > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-sm">Total Commission:</span>
              <span className="text-green-400 font-semibold">
                {commissionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <div className="text-xs text-neutral-400 mb-1">Broker Share (70%)</div>
                <div className="text-green-400 font-semibold">
                  {brokerShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 mb-1">Company Share (30%)</div>
                <div className="text-blue-400 font-semibold">
                  {companyShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded">
            <span className="text-orange-400">⏳</span>
            <div className="flex-1">
              <div className="text-sm text-orange-300 font-medium">Commission Pending</div>
              <div className="text-xs text-orange-400/80">Admin needs to set commission for this deal</div>
            </div>
          </div>
        )}
      </div>

      {/* Date Info */}
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-neutral-500">
        {deal.date_closed || deal.dateClosed ? (
          <div>Closed: {new Date(deal.date_closed || deal.dateClosed).toLocaleDateString()}</div>
        ) : (
          <div>Created: {new Date(deal.created_at || deal.createdAt).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}

