"use client";
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAllProperties } from '../../hooks/useProperties';
import { useAuth } from '../../contexts/AuthContext';
import PropertyForm from './PropertyForm';
import PropertyCard from './PropertyCard';

export default function PropertiesManagement() {
  // Admin/Broker dashboard should show ALL properties including closed ones
  const { data: properties = [], isLoading, refetch } = useAllProperties({ showAll: true });
  const { canManageProperties, user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // New: Status filter
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'closed'

  if (!canManageProperties()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-300">You don&apos;t have permission to manage properties.</p>
      </div>
    );
  }

  // Filter: Admin sees all, Broker sees only their own
  const userProperties = isAdmin() 
    ? properties 
    : properties.filter(p => p.owner_id === user?.id || p.created_by === user?.id);

  // Get properties based on active tab
  const getPropertiesForTab = () => {
    if (activeTab === 'active') {
      // Active Properties tab: show only active
      return userProperties.filter(p => 
        p.status === 'active'
      );
    } else if (activeTab === 'closed') {
      // Closed Properties tab: show only closed/sold/rented
      return userProperties.filter(p => 
        p.status === 'closed' || p.status === 'sold' || p.status === 'rented'
      );
    }
    return userProperties;
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

  // Calculate stats
  const stats = {
    total: userProperties.length,
    active: userProperties.filter(p => p.status === 'active').length,
    closed: userProperties.filter(p => p.status === 'closed').length,
    sold: userProperties.filter(p => p.status === 'sold' || p.status === 'rented').length,
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
    // Reset filters to show all
    setFilter('all');
    setStatusFilter('all');
    // Invalidate and refetch the properties query
    await queryClient.invalidateQueries({ queryKey: ['all-properties'] });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="text-neutral-300 mt-4">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              setActiveTab('active');
              setStatusFilter('all');
            }}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors focus-ring border-b-2 text-sm sm:text-base ${
              activeTab === 'active'
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
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      {/* Header Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              {activeTab === 'active' ? 'Active Properties' : 'Closed Properties'}
            </h2>
            <div className="text-sm text-neutral-300">
              {filteredProperties.length} of {tabProperties.length} properties shown
              {!isAdmin() && (
                <span className="text-neutral-400 ml-2">(Your properties only)</span>
              )}
            </div>
          </div>

          {activeTab === 'active' && (
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
            >
              + Add New Property
            </button>
          )}
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
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
          
          {/* Status Filter (within current tab) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white focus-ring"
          >
            {activeTab === 'active' ? (
              <>
                <option value="all">All Active</option>
              </>
            ) : (
              <>
                <option value="all">All Closed Status</option>
                <option value="closed">Closed Only</option>
                <option value="sold">Sold Only</option>
                <option value="rented">Rented Only</option>
              </>
            )}
          </select>
          
          {/* Clear Filters Button */}
          {(filter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">
            {activeTab === 'active' ? 'No Active Properties' : 'No Closed Properties'}
          </h3>
          <p className="text-neutral-300 mb-4">
            {activeTab === 'active' 
              ? (filter === 'all' 
                  ? 'No active properties in the system yet.' 
                  : `No active ${filter} properties found.`)
              : 'No closed properties yet. Properties marked as Closed, Sold, or Rented will appear here.'
            }
          </p>
          {activeTab === 'active' && (
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus-ring"
            >
              Add First Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={async () => {
                if (confirm('Are you sure you want to delete this property?')) {
                  try {
                    const { api } = await import('../../lib/api/axios-client');
                    await api.delete(`/properties/${property.id}`);
                    refetch();
                  } catch (error) {
                    console.error('Delete failed:', error);
                    alert('Failed to delete property. You can only delete properties you added.');
                  }
                }
              }}
            />
          ))}
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
    </div>
  );
}
