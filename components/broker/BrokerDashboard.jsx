"use client";
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api/axios-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeals } from '../../hooks/useDeals';
import { useDeleteDeal } from '../../hooks/useDeals';
import PropertyCard from '../admin/PropertyCard';
import PropertyForm from '../admin/PropertyForm';
import DealForm from '../admin/DealForm';
import DealsTable from '../admin/DealsTable';

async function getMyProperties() {
  // Get current user first
  const userResponse = await api.get('/auth/profile');
  const userId = userResponse.data.user.id;
  
  // Get properties by owner - include ALL statuses for dashboard
  try {
    const response = await api.get(`/properties/owner/${userId}`, {
      params: { showAll: true } // Request all statuses including closed
    });
    return response.data.properties || [];
  } catch (error) {
    // Fallback: get all and filter client-side - include all statuses
    const response = await api.get('/properties', {
      params: { status: 'active,closed,sold,rented' }
    });
    const { properties } = response.data;
    return properties.filter(p => p.owner_id === userId || p.created_by === userId);
  }
}

export default function BrokerDashboard() {
  const { user, isBroker } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // New: Status filter
  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'deals', or 'closed'
  const [showDealForm, setShowDealForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const deleteDeal = useDeleteDeal();

  // Fetch deals for this broker only
  const { data: dealsData, isLoading: dealsLoading, refetch: refetchDeals } = useDeals({
    brokerId: user?.id
  });

  const { data: myProperties = [], isLoading, refetch } = useQuery({
    queryKey: ['myProperties', user?.id],
    queryFn: getMyProperties,
    enabled: !!user && isBroker(),
  });

  if (!isBroker()) {
    return (
      <div className="container-x py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-300">Only brokers can access this page.</p>
      </div>
    );
  }

  // Get properties based on active tab
  const getPropertiesForTab = () => {
    if (activeTab === 'properties') {
      // Active Properties tab: show only active
      return myProperties.filter(p => 
        p.status === 'active'
      );
    } else if (activeTab === 'closed') {
      // Closed Properties tab: show only closed/sold/rented
      return myProperties.filter(p => 
        p.status === 'closed' || p.status === 'sold' || p.status === 'rented'
      );
    }
    return myProperties;
  };

  const tabProperties = getPropertiesForTab();

  const filteredProperties = tabProperties.filter(property => {
    // Filter by type
    if (filter !== 'all' && property.type !== filter) {
      return false;
    }
    
    // Filter by status (additional filtering within tab)
    if (statusFilter !== 'all' && property.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const stats = {
    total: myProperties.length,
    active: myProperties.filter(p => p.status === 'active').length,
    closed: myProperties.filter(p => p.status === 'closed').length,
    sold: myProperties.filter(p => p.status === 'sold' || p.status === 'rented').length,
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

  const handleEdit = (property) => {
    // Verify ownership before editing
    const isOwner = property.owner_id === user.id || property.created_by === user.id;
    if (!isOwner) {
      alert('You can only edit properties you added.');
      return;
    }
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
    // Reset filters to show all
    setFilter('all');
    setStatusFilter('all');
    // Invalidate and refetch the properties query
    await queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    refetch();
  };

  const handleDelete = async (propertyId) => {
    const property = myProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Verify ownership before deleting
    const isOwner = property.owner_id === user.id || property.created_by === user.id;
    if (!isOwner) {
      alert('You can only delete properties you added.');
      return;
    }

    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete property. You can only delete properties you added.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container-x py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="text-neutral-300 mt-4">Loading your properties...</p>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
        <p className="text-neutral-300">Manage your properties and deals</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              setActiveTab('properties');
              setStatusFilter('all');
            }}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${
              activeTab === 'properties'
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
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${
              activeTab === 'closed'
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
            onClick={() => {
              setActiveTab('deals');
            }}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${
              activeTab === 'deals'
                ? 'text-accent border-accent'
                : 'text-neutral-400 border-transparent hover:text-white'
            }`}
          >
            My Deals & Commissions
            {deals.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-accent/20 rounded">
                {deals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8`}>
        {activeTab === 'properties' || activeTab === 'closed' ? (
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
              <div className="text-sm text-neutral-400">My Deals</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {dealsTotals?.byStatus?.closed || 0}
              </div>
              <div className="text-sm text-neutral-400">Closed</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {dealsTotals?.totalBrokerShare 
                  ? `${(dealsTotals.totalBrokerShare / 1000).toFixed(1)}K`
                  : '0'} AED
              </div>
              <div className="text-sm text-neutral-400">My Commission (70%)</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
              <div className="text-2xl font-bold text-accent mb-1">
                {dealsTotals?.totalCommissionValue 
                  ? `${(dealsTotals.totalCommissionValue / 1000).toFixed(1)}K`
                  : '0'} AED
              </div>
              <div className="text-sm text-neutral-400">Total Commission</div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        {activeTab === 'properties' ? (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
          >
            + Add New Property
          </button>
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
      {activeTab === 'properties' ? (
        /* Active Properties Section */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold text-white">Active Properties</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Type Filter */}
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
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
              </select>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">No Properties Yet</h3>
              <p className="text-neutral-300 mb-4">
                {filter === 'all' 
                  ? "You haven't added any properties yet. Start by adding your first property!" 
                  : `No ${filter} properties found.`}
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
              >
                Add Your First Property
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
            <h2 className="text-2xl font-semibold text-white">Closed Properties</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Type Filter */}
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
              
              {/* Status Filter (within closed) */}
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
                You don't have any closed properties yet. Properties marked as Closed, Sold, or Rented will appear here.
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
          <h2 className="text-2xl font-semibold text-white">My Deals</h2>
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
  );
}

