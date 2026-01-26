"use client";
import Image from 'next/image';
import Link from 'next/link';
import { shouldUnoptimizeImage } from '../../lib/utils/imageHelpers';

export default function PropertyCard({ property, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
      {/* Image */}
      <div className="relative h-48 bg-neutral-700">
        {(property.images?.[0] || property.imageUrl) ? (
          <Image
            src={property.images?.[0] || property.imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            unoptimized={shouldUnoptimizeImage(property.images?.[0] || property.imageUrl)}
            onError={(e) => {
              // Fallback to a default image if the original fails
              if (e.target.src !== 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80') {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80';
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No Image
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {(() => {
            const s = (property.status || 'active').toLowerCase();
            const p = (property.purpose || '').toLowerCase();

            let label = s.toUpperCase();
            let style = 'bg-red-500/20 text-red-300 border border-red-500/30';

            if (s === 'active') {
              style = 'bg-green-500/20 text-green-300 border border-green-500/30';
              label = 'ACTIVE';
            } else if (['closed', 'sold', 'rented'].includes(s)) {
              if (s === 'sold' || (s === 'closed' && p === 'sale')) {
                label = 'SOLD';
                style = 'bg-red-600 text-white border border-red-700 font-black';
              } else if (s === 'rented' || (s === 'closed' && p === 'rent')) {
                label = 'RENTED';
                style = 'bg-blue-600 text-white border border-blue-700 font-black';
              } else {
                label = 'CLOSED';
                style = 'bg-gray-700 text-white border border-gray-600 font-black';
              }
            }

            return (
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${style}`}>
                {label}
              </span>
            );
          })()}
        </div>

        {/* Purpose Badge (SALE / RENT) - Only show if not fully closed/sold/rented */}
        {(() => {
          const s = (property.status || 'active').toLowerCase();
          const p = (property.purpose || '').toLowerCase();
          const isClosed = ['closed', 'sold', 'rented'].includes(s);

          if (!p || isClosed) return null;

          return (
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${p === 'sale' ? 'bg-red-600 text-white border-red-700' : 'bg-blue-600 text-white border-blue-700'
                }`}>
                {p === 'sale' ? 'SALE' : 'RENT'}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {property.title}
          </h3>
          <span className="text-accent font-bold text-lg">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">📍</span>
            <span>{property.emirate}, UAE</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">🛏️</span>
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">🚿</span>
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">📐</span>
              <span>{property.area_sqft || property.area} sqft</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400">🏠</span>
            <span className="capitalize">{property.type}</span>
            <span className="text-neutral-500">•</span>
            <span className="capitalize">{property.purpose}</span>
          </div>

          <div className="text-xs text-neutral-400">
            Created: {formatDate(property.created_at || property.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded transition-colors focus-ring text-center"
          >
            View
          </Link>

          <button
            onClick={() => onEdit(property)}
            className="px-3 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded transition-colors focus-ring"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors focus-ring"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
