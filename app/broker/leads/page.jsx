"use client";
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLeads, useUpdateLeadStatus, useLeadStats } from '../../../hooks/useLeads';
import { useRouter } from 'next/navigation';

export default function LeadsPage() {
  const { isAuthenticated, isBroker, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: leads = [], isLoading, error } = useLeads({ status: statusFilter === 'all' ? undefined : statusFilter });
  const { data: stats } = useLeadStats();
  const updateStatus = useUpdateLeadStatus();

  // Redirect if not authenticated or not authorized
  if (!authLoading && (!isAuthenticated || (!isBroker() && !isAdmin()))) {
    router.push('/');
    return null;
  }

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ id: leadId, status: newStatus });
    } catch (error) {
      console.error('Failed to update lead status:', error);
      alert('Failed to update lead status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter leads by search term
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(search) ||
      lead.phone?.toLowerCase().includes(search) ||
      lead.property?.title?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'negotiating':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'closed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container-x">
          <div className="text-center text-neutral-400">Loading leads...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container-x">
          <div className="text-center text-red-400">Failed to load leads. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-x">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Leads Dashboard</h1>
          <p className="text-neutral-400">Manage your property leads and follow-ups</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-neutral-400">Total Leads</div>
            </div>
            <div className="bg-neutral-900 border border-blue-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-300">{stats.new}</div>
              <div className="text-sm text-neutral-400">New</div>
            </div>
            <div className="bg-neutral-900 border border-yellow-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300">{stats.contacted}</div>
              <div className="text-sm text-neutral-400">Contacted</div>
            </div>
            <div className="bg-neutral-900 border border-purple-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-300">{stats.negotiating}</div>
              <div className="text-sm text-neutral-400">Negotiating</div>
            </div>
            <div className="bg-neutral-900 border border-green-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-300">{stats.closed}</div>
              <div className="text-sm text-neutral-400">Closed</div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="negotiating">Negotiating</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or property..."
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
              />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              {searchTerm ? 'No leads found matching your search.' : 'No leads yet. They will appear here when users express interest in your properties.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-800 border-b border-white/10">
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Lead Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Phone</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Property</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Date Added</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {lead.status === 'new' && (
                              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="New Lead" />
                            )}
                            <span className="font-medium text-white">{lead.name}</span>
                            {lead.isBehavioral && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white animate-bounce shadow-lg shadow-orange-600/20" title="High Intent detected by behavior">
                                🔥 HOT LEAD
                              </span>
                            )}
                          </div>
                          {lead.message && (
                            <div className="text-xs text-neutral-400 italic max-w-xs">{lead.message}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-neutral-300">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="hover:text-accent transition-colors flex items-center gap-2">
                            <span>📞</span> {lead.phone}
                          </a>
                        ) : (
                          <span className="text-neutral-500 italic text-xs">No phone provided</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.property ? (
                          <div>
                            <div className="font-medium text-white">{lead.property.title}</div>
                            <div className="text-sm text-neutral-400">
                              {lead.property.emirate} • {formatPrice(lead.property.price)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-500">No property</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          disabled={updateStatus.isPending}
                          className={`px-3 py-1 rounded border text-xs font-medium focus-ring ${getStatusColor(lead.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-400">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors focus-ring"
                          >
                            Call
                          </a>
                          {lead.property && (
                            <a
                              href={`/properties/${lead.property.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded transition-colors focus-ring"
                            >
                              View Property
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredLeads.length > 0 && (
          <div className="mt-4 text-sm text-neutral-400 text-center">
            Showing {filteredLeads.length} of {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

