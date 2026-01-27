"use client";
import { useNewProjects } from '../../hooks/useProperties';
import ProjectCard from './ProjectCard';

export default function FeaturedProjects() {
  const { data = [], isLoading, isError } = useNewProjects(6);
  return (
    <section id="properties" className="container-x py-16">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">New Arrivals</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">Discover the latest properties added to our portfolio</p>
      </div>
      {isLoading && (
        <div className="py-12 text-neutral-400">Loading properties…</div>
      )}
      {isError && (
        <div className="py-12 text-red-400">Failed to load properties.</div>
      )}
      {!isLoading && !isError && data.length === 0 && (
        <div className="py-12 text-neutral-400 text-center">No new properties available yet.</div>
      )}
      {!isLoading && !isError && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}


