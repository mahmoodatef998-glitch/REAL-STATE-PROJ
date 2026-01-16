"use client";
import { useState } from 'react';

export default function AdvancedSearch({ onSearch, onReset }) {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    emirate: '',
    type: '',
    features: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
  const propertyTypes = ['villa', 'apartment', 'townhouse', 'penthouse', 'studio'];
  const availableFeatures = ['Pool', 'Garden', 'Parking', 'Gym', 'Security', 'Balcony', 'Furnished'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      areaMin: '',
      areaMax: '',
      emirate: '',
      type: '',
      features: []
    });
    onReset();
  };

  return (
    <div className="bg-neutral-800 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Advanced Search</h3>
            <p className="text-sm text-neutral-400">Filter properties by your preferences</p>
          </div>
        </div>
        <svg 
          className={`w-6 h-6 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Price Range (AED)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="Min Price"
                className="px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="Max Price"
                className="px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-3">Bedrooms</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-3">Bathrooms</label>
              <select
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Area Range */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Area (sqft)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="areaMin"
                value={filters.areaMin}
                onChange={handleChange}
                placeholder="Min Area"
                className="px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              />
              <input
                type="number"
                name="areaMax"
                value={filters.areaMax}
                onChange={handleChange}
                placeholder="Max Area"
                className="px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              />
            </div>
          </div>

          {/* Emirate & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-3">Emirate</label>
              <select
                name="emirate"
                value={filters.emirate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              >
                <option value="">All Emirates</option>
                {emirates.map(emirate => (
                  <option key={emirate} value={emirate}>{emirate}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-3">Property Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-700 border border-white/10 rounded-lg text-white focus-ring"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">Features</label>
            <div className="flex flex-wrap gap-2">
              {availableFeatures.map(feature => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.features.includes(feature)
                      ? 'bg-accent text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {filters.features.includes(feature) && '✓ '}
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-neutral-700 text-white font-semibold rounded-lg hover:bg-neutral-600 transition-colors focus-ring"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
            >
              Search Properties
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

