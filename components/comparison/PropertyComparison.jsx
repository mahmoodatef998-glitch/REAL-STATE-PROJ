"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyComparison({ properties = [], onRemove }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 border border-white/10 text-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Properties to Compare</h3>
        <p className="text-neutral-400">Add properties to compare their features side by side</p>
      </div>
    );
  }

  const features = [
    { key: 'price', label: 'Price', format: (val) => `${val?.toLocaleString()} AED` },
    { key: 'bedrooms', label: 'Bedrooms', format: (val) => val || 'N/A' },
    { key: 'bathrooms', label: 'Bathrooms', format: (val) => val || 'N/A' },
    { key: 'area_sqft', label: 'Area', format: (val) => val ? `${val} sqft` : 'N/A' },
    { key: 'type', label: 'Type', format: (val) => val?.charAt(0).toUpperCase() + val?.slice(1) || 'N/A' },
    { key: 'purpose', label: 'Purpose', format: (val) => val?.charAt(0).toUpperCase() + val?.slice(1) || 'N/A' },
    { key: 'emirate', label: 'Emirate', format: (val) => val || 'N/A' },
    { key: 'location', label: 'Location', format: (val) => val || 'N/A' },
    { key: 'yearBuilt', label: 'Year Built', format: (val) => val || 'N/A' },
    { key: 'parking', label: 'Parking', format: (val) => val || 'N/A' },
    { key: 'furnished', label: 'Furnished', format: (val) => val ? 'Yes' : 'No' }
  ];

  return (
    <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
      <div className="px-6 py-4 bg-neutral-800 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Property Comparison</h2>
        <p className="text-neutral-400 mt-1">Compare up to {properties.length} properties side by side</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="sticky left-0 bg-neutral-800 px-6 py-4 text-left text-sm font-semibold text-white w-48">
                Feature
              </th>
              {properties.map((property, index) => (
                <th key={property.id || index} className="px-6 py-4 text-left min-w-[300px]">
                  <div className="space-y-3">
                    {/* Image */}
                    <div className="relative h-40 rounded-lg overflow-hidden bg-neutral-700">
                      {property.images && property.images[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🏠
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <Link 
                        href={`/properties/${property.id}`}
                        className="text-white font-semibold hover:text-accent transition-colors line-clamp-2"
                      >
                        {property.title}
                      </Link>
                    </div>

                    {/* Remove Button */}
                    {onRemove && (
                      <button
                        onClick={() => onRemove(property.id)}
                        className="w-full px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, featureIndex) => (
              <tr
                key={feature.key}
                className={`border-b border-white/5 ${featureIndex % 2 === 0 ? 'bg-neutral-800/50' : ''}`}
              >
                <td className="sticky left-0 bg-neutral-800 px-6 py-4 text-sm font-medium text-neutral-300">
                  {feature.label}
                </td>
                {properties.map((property, propIndex) => {
                  const value = property[feature.key] || property[feature.key.replace('_', '')];
                  const isHighest = feature.key === 'price' && value === Math.max(...properties.map(p => p.price || 0));
                  const isLowest = feature.key === 'price' && value === Math.min(...properties.map(p => p.price || 0).filter(p => p > 0));

                  return (
                    <td
                      key={`${property.id}-${feature.key}`}
                      className={`px-6 py-4 text-sm ${
                        feature.key === 'price'
                          ? isLowest
                            ? 'text-green-400 font-semibold'
                            : isHighest
                            ? 'text-red-400 font-semibold'
                            : 'text-white'
                          : 'text-white'
                      }`}
                    >
                      {feature.format(value)}
                      {feature.key === 'price' && isLowest && ' 🏆'}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Features/Amenities Row */}
            <tr className="border-b border-white/5">
              <td className="sticky left-0 bg-neutral-800 px-6 py-4 text-sm font-medium text-neutral-300">
                Features
              </td>
              {properties.map((property) => {
                const features = Array.isArray(property.features) 
                  ? property.features 
                  : typeof property.features === 'string'
                  ? property.features.split(',').map(f => f.trim())
                  : [];

                return (
                  <td key={property.id} className="px-6 py-4">
                    {features.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {features.map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-sm">No features listed</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

