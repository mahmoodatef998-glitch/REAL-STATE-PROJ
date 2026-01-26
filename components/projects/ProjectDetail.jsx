"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '../../lib/api/properties';
import { shouldUnoptimizeImage } from '../../lib/utils/imageHelpers';
import LeadInterestModal from '../properties/LeadInterestModal';

export default function ProjectDetail({ projectId }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showExpressInterestModal, setShowExpressInterestModal] = useState(false);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['property', projectId],
    queryFn: () => getPropertyById(projectId),
    enabled: !!projectId
  });

  // Get images from project (safe access)
  const images = project?.images || [];
  const imagesLength = images.length;

  // Auto-slide images every 5 seconds (MUST be before any conditional returns)
  useEffect(() => {
    if (imagesLength <= 1) {
      // Clear interval if not enough images
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start auto-slide
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setSelectedImageIndex((prev) => (prev + 1) % imagesLength);
      }
    }, 5000); // 5 seconds

    // Cleanup on unmount or when images change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [imagesLength]);

  // Handle manual image selection (pause auto-slide temporarily)
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    // Pause for 3 seconds after manual selection
    isPausedRef.current = true;
    setTimeout(() => {
      isPausedRef.current = false;
    }, 3000);
  };

  // Pause on hover over main image
  const handleImageMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleImageMouseLeave = () => {
    isPausedRef.current = false;
  };

  // NOW we can do conditional returns after all Hooks
  if (isLoading) {
    return (
      <div className="container-x py-12">
        <div className="text-center">
          <div className="text-neutral-400">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="container-x py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-neutral-400 mb-6">The requested property could not be found.</p>
          <Link href="/properties" className="text-accent hover:text-accent/80">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = images[selectedImageIndex] || 'https://picsum.photos/800/600';

  // Add cache-buster to force image reload
  const imageSrcWithCache = mainImage.includes('?')
    ? `${mainImage}&t=${selectedImageIndex}`
    : `${mainImage}?t=${selectedImageIndex}`;

  // Debug: Log owner info
  console.log('Property owner:', project.owner);
  console.log('Current image index:', selectedImageIndex, 'Image URL:', mainImage);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: project.title,
    description: project.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.emirate,
      addressRegion: 'UAE',
      addressCountry: 'AE'
    },
    ...(project.location && { address: { ...project.address, streetAddress: project.location } }),
    ...(project.price && { price: project.price, priceCurrency: 'AED' }),
    ...(project.bedrooms && { numberOfBedrooms: project.bedrooms }),
    ...(project.bathrooms && { numberOfBathroomsTotal: project.bathrooms }),
    ...(project.area_sqft && { floorSize: { value: project.area_sqft, unitText: 'sqft' } }),
    ...(images.length > 0 && { image: images })
  };

  return (
    <div className="container-x py-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-neutral-400 hover:text-white">Home</Link>
        <span className="mx-2 text-neutral-400">/</span>
        <Link href="/properties" className="text-neutral-400 hover:text-white">Properties</Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="text-white">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div
            className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden group"
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
          >
            <div className="relative w-full h-full">
              <Image
                key={`main-${selectedImageIndex}`}
                src={imageSrcWithCache}
                alt={project.title}
                fill
                className="w-full h-full object-cover transition-opacity duration-500"
                unoptimized={true}
                onError={(e) => {
                  // Prevent infinite loop if fallback also fails
                  const fallbackUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
                  if (e.target.src !== fallbackUrl) {
                    e.target.onerror = null;
                    e.target.src = fallbackUrl;
                  }
                }}
              />
            </div>
            {/* Auto-slide indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${selectedImageIndex === index
                      ? 'w-8 bg-accent'
                      : 'w-1 bg-white/40'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={`thumb-${index}-${image}`}
                  onClick={() => handleImageSelect(index)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all duration-300 ${selectedImageIndex === index
                    ? 'border-accent scale-105'
                    : 'border-transparent hover:border-white/20'
                    }`}
                >
                  <Image
                    key={`thumb-img-${index}-${image}`}
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                    className="object-cover"
                    unoptimized={shouldUnoptimizeImage(image)}
                    onError={(e) => {
                      // Prevent infinite loop if fallback also fails
                      const fallbackUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80';
                      if (e.target.src !== fallbackUrl) {
                        e.target.onerror = null;
                        e.target.src = fallbackUrl;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {project.emirate && (
              <span className="px-4 py-2 bg-neutral-800 rounded-full text-sm">
                📍 {project.emirate}
              </span>
            )}
            {project.type && (
              <span className="px-4 py-2 bg-neutral-800 rounded-full text-sm capitalize">
                🏠 {project.type}
              </span>
            )}
            {(() => {
              const s = (project.status || 'active').toLowerCase();
              const p = (project.purpose || '').toLowerCase();

              if (['closed', 'sold', 'rented'].includes(s)) {
                let label = 'Closed';
                let style = 'bg-gray-700 text-white';

                if (s === 'sold' || (s === 'closed' && p === 'sale')) {
                  label = 'SOLD';
                  style = 'bg-red-600 text-white font-bold px-6';
                } else if (s === 'rented' || (s === 'closed' && p === 'rent')) {
                  label = 'RENTED';
                  style = 'bg-blue-600 text-white font-bold px-6';
                }

                return (
                  <span className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest shadow-lg ${style}`}>
                    {label}
                  </span>
                );
              }

              return (
                <span className="px-4 py-2 bg-neutral-800 rounded-full text-sm capitalize">
                  {p === 'sale' ? '💰 For Sale' : '🏠 For Rent'}
                </span>
              );
            })()}
          </div>

          {project.price && (
            <div className="text-3xl font-bold text-accent mb-6">
              {project.price.toLocaleString()} AED
            </div>
          )}

          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-neutral-300 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {project.bedrooms && (
              <div className="bg-neutral-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent">{project.bedrooms}</div>
                <div className="text-sm text-neutral-400">Bedrooms</div>
              </div>
            )}
            {project.bathrooms && (
              <div className="bg-neutral-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent">{project.bathrooms}</div>
                <div className="text-sm text-neutral-400">Bathrooms</div>
              </div>
            )}
            {project.area_sqft && (
              <div className="bg-neutral-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent">{project.area_sqft}</div>
                <div className="text-sm text-neutral-400">Sq Ft</div>
              </div>
            )}
            {project.location && (
              <div className="bg-neutral-900 p-4 rounded-lg">
                <div className="text-sm font-medium text-white">{project.location}</div>
                <div className="text-sm text-neutral-400">Location</div>
              </div>
            )}
          </div>

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Broker Contact Information */}
          {project.owner && (project.owner.role === 'broker' || project.owner.role === 'admin') && (
            <div className="mb-8 p-6 bg-neutral-900 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Contact Broker</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 min-w-[80px]">Name:</span>
                  <span className="text-white font-medium">{project.owner.name}</span>
                </div>
                {project.owner.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 min-w-[80px]">Phone:</span>
                    <a
                      href={`tel:${project.owner.phone}`}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      {project.owner.phone}
                    </a>
                  </div>
                )}
                {project.owner.whatsapp && (
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 min-w-[80px]">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${project.owner.whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      {project.owner.whatsapp}
                    </a>
                  </div>
                )}
                {project.owner.email && (
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 min-w-[80px]">Email:</span>
                    <a
                      href={`mailto:${project.owner.email}`}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      {project.owner.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowExpressInterestModal(true)}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring text-center"
            >
              Express Interest
            </button>
            {project.owner?.phone && (
              <a
                href={`tel:${project.owner.phone}`}
                className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors focus-ring text-center"
              >
                📞 Call Broker
              </a>
            )}
            {project.owner?.whatsapp && (
              <a
                href={`https://wa.me/${project.owner.whatsapp.replace(/[^\d]/g, '')}?text=Hi, I'm interested in this property: ${encodeURIComponent(project.title)} (ID: ${project.id})`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-green-500/50 text-green-400 font-semibold rounded-lg hover:bg-green-500/10 transition-colors focus-ring text-center"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Express Interest Modal */}
      <LeadInterestModal
        isOpen={showExpressInterestModal}
        onClose={() => setShowExpressInterestModal(false)}
        property={project}
        openEmailAfterSubmit={true}
      />
    </div>
  );
}
