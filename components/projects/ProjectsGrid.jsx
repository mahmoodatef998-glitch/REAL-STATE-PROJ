"use client";
import { useState } from 'react';
import { useAllProperties } from '../../hooks/useProperties';
import ProjectCard from '../home/ProjectCard';

export default function ProjectsGrid() {
  const [filters, setFilters] = useState({
    type: '',
    emirate: '',
    purpose: '',
    price_min: '',
    price_max: ''
  });

  const { data = [], isLoading, isError } = useAllProperties(filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1">
        <div className="bg-neutral-900 p-6 rounded-lg border border-white/10 sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
              >
                <option value="">All Types</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Emirate</label>
              <select
                value={filters.emirate}
                onChange={(e) => handleFilterChange('emirate', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
              >
                <option value="">All Emirates</option>
                <option value="Ajman">Ajman</option>
                <option value="Dubai">Dubai</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Purpose</label>
              <select
                value={filters.purpose}
                onChange={(e) => handleFilterChange('purpose', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
              >
                <option value="">All Purposes</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.price_min}
                  onChange={(e) => handleFilterChange('price_min', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.price_max}
                  onChange={(e) => handleFilterChange('price_max', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded focus-ring"
                />
              </div>
            </div>

            <button
              onClick={() => setFilters({ type: '', emirate: '', purpose: '', price_min: '', price_max: '' })}
              className="w-full px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Properties Grid */}
      <div className="lg:col-span-3">
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-neutral-400">Loading properties...</div>
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <div className="text-red-400">Failed to load properties. Please try again.</div>
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400">No properties found matching your criteria.</div>
          </div>
        )}

        {!isLoading && !isError && data.length > 0 && (
          <>
            <div className="mb-6 text-sm text-neutral-400">
              Showing {data.length} propert{data.length !== 1 ? 'ies' : 'y'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
