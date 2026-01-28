"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { shouldUnoptimizeImage } from '../../lib/utils/imageHelpers';
import LeadInterestModal from '../properties/LeadInterestModal';
import { useState } from 'react';

export default function ProjectCard({ project }) {
  const { id, title, images = [], emirate, purpose: rawPurpose } = project;
  const purpose = (rawPurpose || '').toLowerCase();
  const img = images[0] || 'https://picsum.photos/800/600';
  const [showInterestModal, setShowInterestModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="group relative"
      >
        <Link href={`/properties/${id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/5">
            <Image
              src={img}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-[0.22, 1, 0.36, 1] group-hover:scale-110"
              unoptimized={shouldUnoptimizeImage(img)}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Info on Image */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                  {emirate}
                </span>
                <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border ${purpose === 'sale' ? 'bg-accent/20 text-accent border-accent/20' : 'bg-green-500/20 text-green-400 border-green-500/20'
                  }`}>
                  For {purpose}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors duration-300">
                {title}
              </h3>
            </div>
          </div>
        </Link>

        {/* Hover Action Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowInterestModal(true);
          }}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full glass-effect text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:border-accent"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </motion.div>

      <LeadInterestModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        propertyId={id}
        propertyTitle={title}
      />
    </>
  );
}
