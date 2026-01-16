"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shouldUnoptimizeImage } from '../../lib/utils/imageHelpers';
import LeadInterestModal from '../properties/LeadInterestModal';

export default function ProjectCard({ project }) {
  const { id, title, images = [], emirate, purpose: rawPurpose } = project;
  const purpose = (rawPurpose || '').toLowerCase();
  const img = images[0] || 'https://picsum.photos/800/600?grayscale';
  const [showInterestModal, setShowInterestModal] = useState(false);

  const handleInterestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInterestModal(true);
  };

  return (
    <>
      <div className="group block rounded overflow-hidden bg-neutral-900 border border-white/10 relative">
        <Link href={`/properties/${id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image 
              src={img} 
              alt={title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
              unoptimized={shouldUnoptimizeImage(img)}
              onError={(e) => {
                // Prevent infinite loop if fallback also fails
                const fallbackUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
                if (e.target.src && !e.target.src.includes(fallbackUrl.split('?')[0])) {
                  e.target.onerror = null;
                  e.target.src = fallbackUrl;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {purpose && (
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${
                  purpose === 'sale' ? 'bg-red-600 text-white border-red-700' : 'bg-blue-600 text-white border-blue-700'
                }`}>
                  {purpose === 'sale' ? 'SALE' : 'RENT'}
                </span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-4">
          <Link href={`/properties/${id}`}>
            <div className="text-xs text-neutral-400">{emirate || 'UAE'}</div>
            <div className="mt-1 font-semibold text-white">{title}</div>
            {project.owner && project.owner.role === 'broker' && project.owner.name && (
              <div className="mt-1 text-xs text-neutral-500">
                By: {project.owner.name}
                {project.owner.phone && (
                  <span className="ml-2 text-neutral-400">• {project.owner.phone}</span>
                )}
              </div>
            )}
          </Link>
          
          <div className="flex gap-2 mt-3">
            <Link 
              href={`/properties/${id}`}
              className="flex-1 text-center px-3 py-2 text-sm text-accent hover:text-accent/80 border border-accent/30 hover:border-accent/50 rounded-lg transition-colors focus-ring"
            >
              View Details
            </Link>
            <button
              onClick={handleInterestClick}
              className="flex-1 px-3 py-2 text-sm bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors focus-ring"
            >
              I'm Interested
            </button>
          </div>
        </div>
      </div>

      {/* Lead Interest Modal */}
      <LeadInterestModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        property={project}
      />
    </>
  );
}


