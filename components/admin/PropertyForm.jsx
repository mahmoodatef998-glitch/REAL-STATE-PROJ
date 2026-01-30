"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { api } from '../../lib/api/axios-client';
import { propertySchema } from '../../lib/validations/schemas';
import { shouldUnoptimizeImage } from '../../lib/utils/imageHelpers';
import { useAuth } from '../../contexts/AuthContext';

export default function PropertyForm({ property, onClose, onSave }) {
  const { isAdmin, user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    emirate: '',
    type: 'villa',
    purpose: 'sale',
    status: 'active',
    features: '',
    location: '',
    yearBuilt: '',
    parking: '',
    furnished: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]); // New files to upload
  const [existingImageUrls, setExistingImageUrls] = useState([]); // Existing image URLs
  const [previewImages, setPreviewImages] = useState([]); // All preview images (existing + new)
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Tabs state (Details / Make Deal)
  const [activeTab, setActiveTab] = useState('details');

  // Deal form data
  const [dealData, setDealData] = useState({
    clientName: '',
    dealValue: '',
    dealType: 'sale',
    commissionRate: ''
  });

  const [dealError, setDealError] = useState('');
  const [dealFieldErrors, setDealFieldErrors] = useState({});
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Fetch companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await api.get('/companies');
        if (response.data.companies) {
          setAvailableCompanies(response.data.companies);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area_sqft || property.area || '',
        emirate: property.emirate || '',
        type: property.type || 'villa',
        purpose: property.purpose || 'sale',
        status: property.status || 'active',
        features: Array.isArray(property.features) ? property.features.join(', ') : (property.features || ''),
        location: property.location || '',
        yearBuilt: property.yearBuilt || '',
        parking: property.parking || '',
        furnished: property.furnished || false
      });

      // Set existing images as previews
      if (property.images && property.images.length > 0) {
        setExistingImageUrls(property.images);
        setPreviewImages(property.images);
      }

      // Auto-populate deal data from property
      setDealData({
        clientName: '',
        dealValue: property.price || '',
        dealType: property.purpose || 'sale', // sale or rent
        commissionRate: ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDealChange = (e) => {
    const { name, value } = e.target;
    setDealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setError('');

    // Add to uploaded files
    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Create previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removeImage = (index) => {
    const imageUrl = previewImages[index];

    // Check if this is an existing URL (from server) or a new file preview (data: URL)
    if (imageUrl && imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      // This is an existing image URL - remove from existingImageUrls
      setExistingImageUrls(prev => prev.filter(url => url !== imageUrl));
    } else if (imageUrl && imageUrl.startsWith('data:')) {
      // This is a new file preview (data: URL) - find corresponding file
      // Count how many data URLs appear before this index
      const dataUrlsBefore = previewImages
        .slice(0, index)
        .filter(img => img.startsWith('data:')).length;

      // Remove the corresponding file from uploadedFiles
      setUploadedFiles(prev => {
        const newFiles = [...prev];
        newFiles.splice(dataUrlsBefore, 1);
        return newFiles;
      });
    }

    // Always remove from previews
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDealSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDealError('');
    setDealFieldErrors({});

    try {
      // Validation
      if (!dealData.clientName || !dealData.dealValue || !dealData.commissionRate) {
        setDealError('Please fill all required fields');
        setLoading(false);
        return;
      }

      if (!property || !property.id) {
        setDealError('Property not found');
        setLoading(false);
        return;
      }

      // Get company ID from multiple sources
      let companyId = property.owner?.companyId ||
        property.owner?.company_id ||
        user?.companyId ||
        user?.company_id ||
        property.companyId ||
        property.company_id;

      // If still no companyId, use first available company
      if (!companyId && availableCompanies.length > 0) {
        companyId = availableCompanies[0].id;
        console.log('Using first available company:', availableCompanies[0].name);
      }

      if (!companyId) {
        setDealError('Company not found. Please create a company first or ensure the property owner has a company.');
        setLoading(false);
        return;
      }

      // Prepare deal data
      const submitDealData = {
        propertyId: property.id,
        brokerId: property.owner?.id || property.ownerId,
        companyId: parseInt(companyId),
        clientName: dealData.clientName.trim(),
        dealType: dealData.dealType,
        dealValue: parseFloat(dealData.dealValue),
        commissionRate: parseFloat(dealData.commissionRate),
        status: 'closed' // Auto-set to closed
      };

      // Create deal
      const response = await api.post('/deals', submitDealData);

      if (response.data.success) {
        // Success - close modal and refresh
        onSave();
      } else {
        setDealError(response.data.error || 'Failed to create deal');
      }
    } catch (err) {
      console.error('Deal creation error:', err);
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        err.message ||
        'Failed to create deal';
      setDealError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Ensure status is one of the valid enum values
      const validStatus = ['active', 'closed', 'sold', 'rented'].includes(formData.status)
        ? formData.status
        : 'active';

      const parseNumber = (val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      };

      const submitData = {
        title: formData.title,
        description: formData.description || '',
        type: formData.type,
        purpose: formData.purpose,
        price: parseNumber(formData.price),
        area_sqft: parseNumber(formData.area),
        bedrooms: parseNumber(formData.bedrooms),
        bathrooms: parseNumber(formData.bathrooms),
        emirate: formData.emirate,
        location: formData.location || '',
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        status: validStatus,
      };

      // Validate with Zod
      const validationData = { ...submitData };
      try {
        propertySchema.parse(validationData);
      } catch (zodError) {
        console.error('Frontend Validation Error (Zod):', zodError.errors.map(e => `${e.path.join('.')}: ${e.message}`));
        throw zodError;
      }

      // Helper function to append form data correctly
      const appendFormData = (formDataToSend, data) => {
        Object.keys(data).forEach(key => {
          const value = data[key];
          if (value !== undefined && value !== null) {
            // Convert numbers and booleans to strings for FormData
            if (typeof value === 'number' || typeof value === 'boolean') {
              formDataToSend.append(key, String(value));
            } else if (Array.isArray(value)) {
              // For arrays, send as JSON string
              formDataToSend.append(key, JSON.stringify(value));
            } else {
              formDataToSend.append(key, value);
            }
          }
        });
      };

      if (property) {
        // Update existing property
        const formDataToSend = new FormData();

        // Add text fields
        appendFormData(formDataToSend, submitData);

        // Always send existing images (even if empty array) to allow complete removal
        formDataToSend.append('existingImages', JSON.stringify(existingImageUrls));

        // Add new image files
        uploadedFiles.forEach(file => {
          formDataToSend.append('images', file);
        });

        // Always use FormData for multipart/form-data (even if no new files)
        // Don't set Content-Type header - axios will set it with boundary automatically
        await api.put(`/properties/${property.id}`, formDataToSend);
      } else {
        // Create new property with file upload
        const formDataToSend = new FormData();

        // Add text fields
        appendFormData(formDataToSend, submitData);

        // Add image files
        uploadedFiles.forEach(file => {
          formDataToSend.append('images', file);
        });

        // Use FormData for multipart/form-data
        // Don't set Content-Type header - axios will set it with boundary automatically
        await api.post('/properties', formDataToSend);
      }

      onSave();
    } catch (error) {
      console.error('Property save error:', error);

      // Handle Zod validation errors
      if (error.issues) {
        const errors = {};
        error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else {
        // Handle API errors
        console.error('API Error details:', error.response?.data);

        // Map backend validation errors to fields if possible
        if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
          const backendErrors = {};
          error.response.data.details.forEach(err => {
            const field = err.field || err.param;
            if (field) {
              backendErrors[field] = err.message || 'Invalid value';
            }
          });
          setFieldErrors(prev => ({ ...prev, ...backendErrors }));
        }

        const errorMessage = error.response?.data?.error ||
          (error.response?.data?.details && error.response.data.details[0]?.message) ||
          error.message ||
          'Failed to save property';
        setError(errorMessage);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" onClick={onClose} />

      <div className="relative bg-neutral-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-white/10 my-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-white/10">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white focus-ring"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Tabs - Show "Make Deal" only for Admin on closed/sold/rented properties */}
          {property && isAdmin() && ['closed', 'sold', 'rented'].includes(formData.status) && (
            <div className="flex border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'details'
                  ? 'text-accent border-accent'
                  : 'text-neutral-400 border-transparent hover:text-white'
                  }`}
              >
                Property Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deal')}
                className={`flex-1 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'deal'
                  ? 'text-accent border-accent'
                  : 'text-neutral-400 border-transparent hover:text-white'
                  }`}
              >
                🤝 Make Deal
              </button>
            </div>
          )}
        </div>

        <form onSubmit={activeTab === 'deal' ? handleDealSubmit : handleSubmit} className="p-6 space-y-6">
          {/* Error Messages */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          {dealError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
              {dealError}
            </div>
          )}

          {/* Tab Content: Make Deal */}
          {activeTab === 'deal' && property && (
            <div className="space-y-6">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="text-lg font-semibold text-accent mb-2">🤝 Create Deal for this Property</h3>
                <p className="text-sm text-neutral-300">
                  Property: <span className="font-medium text-white">{property.title}</span>
                </p>
                <p className="text-sm text-neutral-300">
                  Broker: <span className="font-medium text-white">{property.owner?.name || 'N/A'}</span>
                </p>
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
                  value={dealData.clientName}
                  onChange={handleDealChange}
                  required
                  className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${dealFieldErrors.clientName ? 'border-red-500' : 'border-white/10'
                    }`}
                  placeholder="Ahmed Ali"
                />
                {dealFieldErrors.clientName && (
                  <p className="mt-1 text-sm text-red-400">{dealFieldErrors.clientName}</p>
                )}
              </div>

              {/* Deal Value & Deal Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dealValue" className="block text-sm font-medium mb-2">
                    Deal Value (AED) *
                  </label>
                  <input
                    type="number"
                    id="dealValue"
                    name="dealValue"
                    value={dealData.dealValue}
                    onChange={handleDealChange}
                    required
                    min="1"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${dealFieldErrors.dealValue ? 'border-red-500' : 'border-white/10'
                      }`}
                    placeholder="2500000"
                  />
                  {dealFieldErrors.dealValue && (
                    <p className="mt-1 text-sm text-red-400">{dealFieldErrors.dealValue}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dealType" className="block text-sm font-medium mb-2">
                    Deal Type *
                  </label>
                  <select
                    id="dealType"
                    name="dealType"
                    value={dealData.dealType}
                    onChange={handleDealChange}
                    required
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${dealFieldErrors.dealType ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                  {dealFieldErrors.dealType && (
                    <p className="mt-1 text-sm text-red-400">{dealFieldErrors.dealType}</p>
                  )}
                </div>
              </div>

              {/* Commission Rate */}
              <div>
                <label htmlFor="commissionRate" className="block text-sm font-medium mb-2">
                  Commission Rate (e.g., 0.05 for 5%) *
                </label>
                <input
                  type="number"
                  id="commissionRate"
                  name="commissionRate"
                  value={dealData.commissionRate}
                  onChange={handleDealChange}
                  required
                  min="0"
                  max="1"
                  step="0.001"
                  className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${dealFieldErrors.commissionRate ? 'border-red-500' : 'border-white/10'
                    }`}
                  placeholder="0.05"
                />
                {dealFieldErrors.commissionRate && (
                  <p className="mt-1 text-sm text-red-400">{dealFieldErrors.commissionRate}</p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  Enter as decimal (0.05 = 5%, 0.10 = 10%)
                </p>
              </div>

              {/* Commission Preview */}
              {dealData.dealValue && dealData.commissionRate && (
                <div className="p-4 bg-neutral-800 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold mb-3">Commission Calculation Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Commission:</span>
                      <span className="font-semibold text-white">
                        {(parseFloat(dealData.dealValue) * parseFloat(dealData.commissionRate)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                      <div>
                        <div className="text-xs text-neutral-400 mb-1">Broker Share (70%)</div>
                        <div className="text-green-400 font-semibold">
                          {(parseFloat(dealData.dealValue) * parseFloat(dealData.commissionRate) * 0.7).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400 mb-1">Company Share (30%)</div>
                        <div className="text-blue-400 font-semibold">
                          {(parseFloat(dealData.dealValue) * parseFloat(dealData.commissionRate) * 0.3).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons for Deal */}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors focus-ring"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Creating Deal...' : 'Create Deal'}
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Property Details */}
          {activeTab === 'details' && (
            <>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.title ? 'border-red-500' : 'border-white/10'
                      }`}
                    placeholder="Luxury Villa in Ajman"
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Price (AED) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.price ? 'border-red-500' : 'border-white/10'
                      }`}
                    placeholder="1250000"
                  />
                  {fieldErrors.price && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.description ? 'border-red-500' : 'border-white/10'
                    }`}
                  placeholder="Detailed description of the property..."
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.description}</p>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.bedrooms ? 'border-red-500' : 'border-white/10'
                      }`}
                  />
                  {fieldErrors.bedrooms && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.bedrooms}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.bathrooms ? 'border-red-500' : 'border-white/10'
                      }`}
                  />
                  {fieldErrors.bathrooms && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.bathrooms}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium mb-2">
                    Area (sqft) *
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    min="0"
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.area_sqft ? 'border-red-500' : 'border-white/10'
                      }`}
                  />
                  {fieldErrors.area_sqft && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.area_sqft}</p>
                  )}
                </div>
              </div>

              {/* Location & Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="emirate" className="block text-sm font-medium mb-2">
                    Emirate *
                  </label>
                  <select
                    id="emirate"
                    name="emirate"
                    value={formData.emirate}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.emirate ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <option value="">Select Emirate</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                  {fieldErrors.emirate && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.emirate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-2">
                    Property Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.type ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                    <option value="land">Land</option>
                  </select>
                  {fieldErrors.type && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-2">
                    Purpose *
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.purpose ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                  {fieldErrors.purpose && (
                    <p className="mt-1 text-sm text-red-400">{fieldErrors.purpose}</p>
                  )}
                </div>
              </div>

              {/* Image Upload with Drag and Drop */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Property Images *
                </label>
                <div
                  ref={dropZoneRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging
                    ? 'border-accent bg-accent/10'
                    : 'border-white/20 hover:border-white/30'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-neutral-300 mb-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-accent hover:text-accent/80 underline font-medium"
                      >
                        Click to upload
                      </button>
                      {' or drag and drop'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      PNG, JPG, GIF up to 5MB each (Max 100 images)
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                          {preview.startsWith('http') || preview.startsWith('data:') ? (
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover"
                              unoptimized={shouldUnoptimizeImage(preview)}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-neutral-800 text-neutral-400">
                              Invalid Image
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Specific Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  autoComplete="address-line1"
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
                  placeholder="Al Nuaimiya, Ajman"
                />
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium mb-2">
                  Features
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
                  placeholder="Swimming pool, Garden, Balcony, etc."
                />
              </div>

              {/* Status & Furnished */}
              <div className="flex items-center gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="w-4 h-4 text-accent bg-neutral-800 border-white/10 rounded focus-ring"
                  />
                  <label htmlFor="furnished" className="text-sm font-medium">
                    Furnished
                  </label>
                </div>
              </div>

              {/* Submit Buttons - Property Details */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-neutral-300 hover:text-white transition-colors focus-ring"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (property ? 'Update Property' : 'Add Property')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
