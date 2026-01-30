"use client";
import { useState } from 'react';
import { useAllProperties } from '../../hooks/useProperties';
import ProjectCard from '../home/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ProjectsGrid() {
  const [filters, setFilters] = useState({
    type: '',
    emirate: '',
    purpose: '',
    price_min: '',
    price_max: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data = [], isLoading, isError } = useAllProperties(filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="space-y-12">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-bold text-xs uppercase tracking-widest ${isFilterOpen || activeFiltersCount > 0
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
              }`}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => setFilters({ type: '', emirate: '', purpose: '', price_min: '', price_max: '' })}
              className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs font-black uppercase tracking-[0.2em] text-white/20">
          {data.length} Results Found
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-bold appearance-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900">All Types</option>
                  <option value="villa" className="bg-neutral-900">Villa</option>
                  <option value="apartment" className="bg-neutral-900">Apartment</option>
                  <option value="commercial" className="bg-neutral-900">Commercial</option>
                  <option value="office" className="bg-neutral-900">Office</option>
                  <option value="land" className="bg-neutral-900">Land</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Emirate</label>
                <select
                  value={filters.emirate}
                  onChange={(e) => handleFilterChange('emirate', e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-bold appearance-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900">All Emirates</option>
                  <option value="Ajman" className="bg-neutral-900">Ajman</option>
                  <option value="Dubai" className="bg-neutral-900">Dubai</option>
                  <option value="Sharjah" className="bg-neutral-900">Sharjah</option>
                  <option value="Abu Dhabi" className="bg-neutral-900">Abu Dhabi</option>
                  <option value="Ras Al Khaimah" className="bg-neutral-900">Ras Al Khaimah</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Purpose</label>
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-bold appearance-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900">All Purposes</option>
                  <option value="sale" className="bg-neutral-900">For Sale</option>
                  <option value="rent" className="bg-neutral-900">For Rent</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price Range</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={filters.price_min}
                    onChange={(e) => handleFilterChange('price_min', e.target.value)}
                    placeholder="Min"
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-bold"
                  />
                  <span className="text-white/20">—</span>
                  <input
                    type="number"
                    value={filters.price_max}
                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                    placeholder="Max"
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Content */}
      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[4/5] rounded-[2rem] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 font-bold mb-4">Error loading properties.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest">Retry</button>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center py-20">
              <p className="text-white/20 text-xl font-medium mb-4">No Properties Found</p>
              <button
                onClick={() => setFilters({ type: '', emirate: '', purpose: '', price_min: '', price_max: '' })}
                className="text-accent text-xs font-black uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
