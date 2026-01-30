"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useAllProperties } from '../../hooks/useProperties';
import { useDeals, useDeleteDeal } from '../../hooks/useDeals';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api/axios-client';
import PropertyCard from './PropertyCard';
import PropertyForm from './PropertyForm';
import DealForm from './DealForm';
import DealsTable from './DealsTable';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: properties = [], isLoading, refetch } = useAllProperties({ showAll: true });
  const { data: dealsData, isLoading: dealsLoading, refetch: refetchDeals } = useDeals();
  const deleteDeal = useDeleteDeal();

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'closed', or 'deals'
  const [showDealForm, setShowDealForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  if (!isAdmin()) {
    return (
      <div className="container-x py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-300">Only administrators can access this page.</p>
      </div>
    );
  }

  // Get properties based on active tab
  const getPropertiesForTab = () => {
    if (activeTab === 'active') {
      return properties.filter(p => p.status === 'active');
    } else if (activeTab === 'closed') {
      return properties.filter(p =>
        p.status === 'closed' || p.status === 'sold' || p.status === 'rented'
      );
    }
    return properties;
  };

  const tabProperties = getPropertiesForTab();

  const filteredProperties = tabProperties.filter(property => {
    // Filter by type
    if (filter !== 'all' && property.type !== filter) {
      return false;
    }

    // Filter by status
    if (statusFilter !== 'all' && property.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    closed: properties.filter(p => p.status === 'closed').length,
    sold: properties.filter(p => p.status === 'sold' || p.status === 'rented').length,
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleFormClose = async () => {
    setShowForm(false);
    setEditingProperty(null);
    setFilter('all');
    setStatusFilter('all');
    await queryClient.invalidateQueries({ queryKey: ['all-properties'] });
    refetch();
  };

  const handleDelete = async (propertyId) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete property.');
      }
    }
  };

  // Deal handlers
  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowDealForm(true);
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowDealForm(true);
  };

  const handleDealFormClose = () => {
    setShowDealForm(false);
    setEditingDeal(null);
    refetchDeals();
  };

  const handleDeleteDeal = async (dealId) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal.mutateAsync(dealId);
        refetchDeals();
      } catch (error) {
        console.error('Delete deal failed:', error);
        alert('Failed to delete deal.');
      }
    }
  };

  const deals = dealsData?.deals || [];
  const dealsTotals = dealsData?.totals || null;

  if (isLoading && activeTab === 'properties') {
    return (
      <div className="container-x py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="text-neutral-300 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container-x py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Management Portal</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-3">Admin <span className="text-white/20">Dashboard</span></h1>
          <p className="text-neutral-400 max-w-xl text-lg font-medium leading-relaxed">
            Execute strategic operations, manage premium inventory, and oversee financial performance through the Alrabie internal system.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setActiveTab('active');
                setStatusFilter('all');
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${activeTab === 'active'
                ? 'text-accent border-accent'
                : 'text-neutral-400 border-transparent hover:text-white'
                }`}
            >
              Active Properties
              {stats.active > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded">
                  {stats.active}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('closed');
                setStatusFilter('all');
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${activeTab === 'closed'
                ? 'text-accent border-accent'
                : 'text-neutral-400 border-transparent hover:text-white'
                }`}
            >
              Closed Properties
              {stats.closed + stats.sold > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-500/20 text-gray-300 rounded">
                  {stats.closed + stats.sold}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${activeTab === 'deals'
                ? 'text-accent border-accent'
                : 'text-neutral-400 border-transparent hover:text-white'
                }`}
            >
              Deals & Commissions
              {deals.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-accent/20 rounded">
                  {deals.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 ${activeTab === 'deals' ? 'md:grid-cols-5' : ''}`}>
          {activeTab === 'active' || activeTab === 'closed' ? (
            <>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                <div className="text-sm text-neutral-400">Total Properties</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-1">{stats.active}</div>
                <div className="text-sm text-neutral-400">Active</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-gray-500/20">
                <div className="text-3xl font-bold text-gray-400 mb-1">{stats.closed}</div>
                <div className="text-sm text-neutral-400">Closed</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-400 mb-1">{stats.sold}</div>
                <div className="text-sm text-neutral-400">Sold/Rented</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">{dealsTotals?.totalDeals || deals.length}</div>
                <div className="text-sm text-neutral-400">Total Deals</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {dealsTotals?.byStatus?.closed || 0}
                </div>
                <div className="text-sm text-neutral-400">Closed</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {dealsTotals?.byStatus?.open || 0}
                </div>
                <div className="text-sm text-neutral-400">Open</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {dealsTotals?.totalCommissionValue
                    ? `${(dealsTotals.totalCommissionValue / 1000).toFixed(1)}K`
                    : '0'}
                </div>
                <div className="text-sm text-neutral-400">Total Commission</div>
              </div>
              <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
                <div className="text-2xl font-bold text-accent mb-1">
                  {dealsTotals?.totalDealValue
                    ? `${(dealsTotals.totalDealValue / 1000000).toFixed(1)}M`
                    : '0'}
                </div>
                <div className="text-sm text-neutral-400">Total Value</div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
          {activeTab === 'active' ? (
            <>
              <Link
                href="/admin/approvals"
                className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors focus-ring"
              >
                View Pending Approvals
              </Link>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
              >
                + Add New Property
              </button>
            </>
          ) : activeTab === 'deals' ? (
            <button
              onClick={handleAddDeal}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
            >
              + Create New Deal
            </button>
          ) : null}
        </div>

        {/* Content Tabs */}
        {activeTab === 'active' ? (
          /* Active Properties Section */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">Active Properties (All Brokers)</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring"
                >
                  <option value="all">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-2">No Active Properties</h3>
                <p className="text-neutral-300 mb-4">
                  {filter === 'all' ? 'No active properties in the system yet.' : `No active ${filter} properties found.`}
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
                >
                  Add First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={handleEdit}
                    onDelete={() => handleDelete(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'closed' ? (
          /* Closed Properties Section */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">Closed Properties (All Brokers)</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring"
                >
                  <option value="all">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="land">Land</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring"
                >
                  <option value="all">All Closed Status</option>
                  <option value="closed">Closed Only</option>
                  <option value="sold">Sold Only</option>
                  <option value="rented">Rented Only</option>
                </select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-2">No Closed Properties</h3>
                <p className="text-neutral-300 mb-4">
                  No closed properties yet. Properties marked as Closed, Sold, or Rented from all brokers will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={handleEdit}
                    onDelete={() => handleDelete(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Deals Section */
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">All Deals</h2>
            <DealsTable
              deals={deals}
              totals={dealsTotals}
              onEdit={handleEditDeal}
              onDelete={handleDeleteDeal}
              isLoading={dealsLoading}
            />
          </div>
        )}

        {/* Property Form Modal */}
        {showForm && (
          <PropertyForm
            property={editingProperty}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {/* Deal Form Modal */}
        {showDealForm && (
          <DealForm
            deal={editingDeal}
            onClose={handleDealFormClose}
            onSave={handleDealFormClose}
          />
        )}
      </div>
    </div>
  );
}

