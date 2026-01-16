"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNewProjects } from '../../hooks/useProperties';

export default function HighlightedProject() {
  const { data = [] } = useNewProjects(1);
  const prefersReduced = useReducedMotion();
  const project = data[0];

  if (!project) return null;

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={project.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80'}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover"
          onError={(e) => {
            // Prevent infinite loop if fallback also fails
            const fallbackUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80';
            if (e.target.src !== fallbackUrl) {
              e.target.onerror = null;
              e.target.src = fallbackUrl;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="container-x py-24">
        <motion.div
          className="max-w-2xl"
          initial={prefersReduced ? false : { opacity: 0, x: -50 }}
          whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {project.title}
          </h2>
          <p className="text-white/90 text-lg mb-8">
            {project.description || 'Experience exceptional living in this premium property designed for modern comfort and luxury.'}
          </p>
          <div className="flex flex-wrap gap-4 mb-8 text-white/80">
            {project.emirate && (
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                📍 {project.emirate}
              </span>
            )}
            {project.bedrooms && (
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                🛏️ {project.bedrooms} bedrooms
              </span>
            )}
            {project.price && (
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                💰 {project.price.toLocaleString()} AED
              </span>
            )}
          </div>
          <Link
            href={`/properties/${project.id}`}
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
          >
            Explore This Property →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
