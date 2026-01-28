"use client";
import ProjectCard from './ProjectCard';
import { useProperties } from '../../hooks/useProperties';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedProjects() {
  const { data: properties, isLoading } = useProperties({ limit: 6, sort: '-createdAt' });

  return (
    <section id="properties" className="section-padding">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-gradient mb-6"
            >
              LATEST PROJECTS.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/40 text-lg font-medium leading-relaxed"
            >
              Curated architectural excellence across the Emirates. Each property is selected for its unique design and investment potential.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/properties" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
              View All Properties
              <span className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/5] rounded-[2rem] bg-neutral-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties?.map((project, idx) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
