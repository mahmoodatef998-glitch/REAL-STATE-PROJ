"use client";
import { useState, useEffect } from 'react';
import { useCreateDeal, useUpdateDeal } from '../../hooks/useDeals';
import { getAllProperties } from '../../lib/api/properties';
import { getAllCompanies } from '../../lib/api/companies';
import { useAuth } from '../../contexts/AuthContext';
import { dealSchema } from '../../lib/validations/schemas';
import { api } from '../../lib/api/axios-client';

export default function DealForm({ deal, onClose, onSave }) {
  const { user, isAdmin } = useAuth();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const [formData, setFormData] = useState({
    propertyId: '',
    brokerId: user?.id || '',
    companyId: '',
    clientId: '',
    clientName: '',
    dealType: 'sale',
    dealValue: '',
    commissionRate: '',
    status: 'open',
    commissionApproved: false
  });

  const [properties, setProperties] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch options (properties, companies, brokers, clients)
  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoadingOptions(true);
        
        // Fetch properties
        const props = await getAllProperties();
        setProperties(props || []);

        // Fetch companies
        const comps = await getAllCompanies();
        setCompanies(comps || []);

        // Fetch brokers
        const brokersRes = await api.get('/users?role=broker');
        setBrokers(brokersRes.data.users || []);

        // Fetch clients (optional)
        try {
          const clientsRes = await api.get('/users?role=client');
          setClients(clientsRes.data.users || []);
        } catch (err) {
          // Clients are optional
          setClients([]);
        }

        // If broker is creating deal, set brokerId and companyId automatically
        if (user && !isAdmin() && user.role === 'broker') {
          setFormData(prev => ({
            ...prev,
            brokerId: user.id,
            companyId: user.company_id || user.companyId || prev.companyId
          }));
        }
      } catch (err) {
        console.error('Error fetching options:', err);
        setError('Failed to load options. Please refresh the page.');
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchOptions();
  }, [user, isAdmin]);

  // Load deal data if editing
  useEffect(() => {
    if (deal) {
      setFormData({
        propertyId: deal.property_id || deal.propertyId || '',
        brokerId: deal.broker_id || deal.brokerId || '',
        companyId: deal.company_id || deal.companyId || '',
        clientId: deal.client_id || deal.clientId || '',
        clientName: deal.client_name || deal.clientName || '',
        dealType: deal.deal_type || deal.dealType || 'sale',
        dealValue: deal.deal_value || deal.dealValue || deal.sale_price || deal.salePrice || '',
        commissionRate: deal.commission_rate || deal.commissionRate || '',
        status: deal.status || 'open',
        commissionApproved: deal.commission_approved || deal.commissionApproved || false
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Convert string values to numbers
      const submitData = {
        propertyId: parseInt(formData.propertyId),
        brokerId: parseInt(formData.brokerId),
        companyId: parseInt(formData.companyId),
        clientId: formData.clientId ? parseInt(formData.clientId) : null,
        clientName: formData.clientName.trim(),
        dealType: formData.dealType,
        dealValue: parseFloat(formData.dealValue),
        status: formData.status
      };

      // Commission fields: only for Admin or when editing
      if (isAdmin() || deal) {
        if (formData.commissionRate) {
          submitData.commissionRate = parseFloat(formData.commissionRate);
          submitData.commissionApproved = true; // Mark as approved when admin sets it
        }
      }

      // Validate with Zod (commission optional for brokers creating new deals)
      const schemaToUse = (isAdmin() || deal) ? dealSchema : dealSchema.omit({ commissionRate: true });
      schemaToUse.parse(submitData);

      if (deal) {
        // Update existing deal
        await updateDeal.mutateAsync({ id: deal.id, ...submitData });
      } else {
        // Create new deal
        await createDeal.mutateAsync(submitData);
      }

      onSave();
    } catch (err) {
      console.error('Deal save error:', err);
      
      // Handle Zod validation errors
      if (err.issues) {
        const errors = {};
        err.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else {
        // Handle API errors
        const errorMessage = err.response?.data?.error || 
                           err.response?.data?.details?.[0]?.message ||
                           err.message ||
                           'Failed to save deal';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate commission preview
  const dealValueNum = parseFloat(formData.dealValue) || 0;
  const commissionRateNum = parseFloat(formData.commissionRate) || 0;
  const commissionValue = dealValueNum * commissionRateNum;
  const brokerShare = commissionValue * 0.7;
  const companyShare = commissionValue * 0.3;

  if (loadingOptions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-neutral-900 rounded-lg p-8 border border-white/10 max-w-sm w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-neutral-300 mt-4 text-center">Loading form options...</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0 || properties.length === 0 || brokers.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-neutral-900 rounded-lg p-8 w-full max-w-2xl mx-4 border border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white focus-ring"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">
              {companies.length === 0 && 'No companies found. Please create a company first.'}
              {properties.length === 0 && 'No properties found. Please create a property first.'}
              {brokers.length === 0 && 'No brokers found. Please register brokers first.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-neutral-900 rounded-lg p-8 w-full max-w-2xl mx-auto border border-white/10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white focus-ring"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {deal ? 'Edit Deal' : 'Create New Deal'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Selection */}
          <div>
            <label htmlFor="propertyId" className="block text-sm font-medium mb-2">
              Property *
            </label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              required
              disabled={loadingOptions}
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.propertyId ? 'border-red-500' : 'border-white/10'
              }`}
            >
              <option value="">Select Property</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.title} - {prop.emirate} ({prop.price?.toLocaleString()} AED)
                </option>
              ))}
            </select>
            {fieldErrors.propertyId && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.propertyId}</p>
            )}
          </div>

          {/* Broker Selection */}
          <div>
            <label htmlFor="brokerId" className="block text-sm font-medium mb-2">
              Broker *
            </label>
            <select
              id="brokerId"
              name="brokerId"
              value={formData.brokerId}
              onChange={handleChange}
              required
              disabled={loadingOptions || (!isAdmin() && user?.role === 'broker')}
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.brokerId ? 'border-red-500' : 'border-white/10'
              }`}
            >
              <option value="">Select Broker</option>
              {brokers.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.name} ({broker.email})
                </option>
              ))}
            </select>
            {fieldErrors.brokerId && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.brokerId}</p>
            )}
          </div>

          {/* Company Selection */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium mb-2">
              Company *
            </label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
              disabled={loadingOptions}
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.companyId ? 'border-red-500' : 'border-white/10'
              }`}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {fieldErrors.companyId && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.companyId}</p>
            )}
          </div>

          {/* Client Selection (Optional) */}
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium mb-2">
              Client (Optional)
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={loadingOptions}
              className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
            >
              <option value="">Select Client (Optional)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          {/* Client Name */}
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium mb-2">
              Client Name *
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.clientName ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Enter client name"
            />
            {fieldErrors.clientName && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.clientName}</p>
            )}
          </div>

          {/* Deal Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dealType" className="block text-sm font-medium mb-2">
                Deal Type *
              </label>
              <select
                id="dealType"
                name="dealType"
                value={formData.dealType}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                  fieldErrors.dealType ? 'border-red-500' : 'border-white/10'
                }`}
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                  fieldErrors.status ? 'border-red-500' : 'border-white/10'
                }`}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Deal Value & Commission Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dealValue" className="block text-sm font-medium mb-2">
                Deal Value (AED) *
              </label>
              <input
                type="number"
                id="dealValue"
                name="dealValue"
                value={formData.dealValue}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                  fieldErrors.dealValue ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="500000"
              />
              {fieldErrors.dealValue && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.dealValue}</p>
              )}
            </div>

            <div>
              <label htmlFor="commissionRate" className="block text-sm font-medium mb-2">
                Commission Rate (e.g., 0.05 for 5%) {!isAdmin() && !deal && '(Admin will set)'}
              </label>
              {!isAdmin() && !deal ? (
                <div className="w-full px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-neutral-400">
                  <p className="text-sm">📋 Commission will be set by Admin after review</p>
                  <p className="text-xs mt-1">Close the deal first, then Admin will approve and set commission</p>
                </div>
              ) : (
                <>
                  <input
                    type="number"
                    id="commissionRate"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    required={isAdmin()}
                    min="0"
                    max="1"
                    step="0.001"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                      fieldErrors.commissionRate ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="0.05"
                  />
                  {fieldErrors.commissionRate && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.commissionRate}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-400">
                    Enter as decimal (0.05 = 5%, 0.10 = 10%)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Commission Preview */}
          {(isAdmin() || deal) && (formData.dealValue && formData.commissionRate) && (
            <div className="p-4 bg-neutral-800 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold mb-3">Commission Calculation Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Commission:</span>
                  <span className="font-semibold text-white">
                    {commissionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Broker Share (70%):</span>
                  <span className="font-semibold text-green-400">
                    {brokerShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Company Share (30%):</span>
                  <span className="font-semibold text-blue-400">
                    {companyShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-neutral-300 hover:text-white transition-colors focus-ring rounded-lg border border-white/10"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.propertyId || !formData.brokerId || !formData.companyId || !formData.clientName || !formData.dealValue || !formData.commissionRate}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{deal ? 'Update Deal' : 'Create Deal'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

