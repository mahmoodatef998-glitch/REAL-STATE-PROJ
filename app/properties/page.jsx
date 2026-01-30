import ProjectsGrid from '../../components/projects/ProjectsGrid';

export const metadata = {
  title: 'Portfolio | Alrabie Real Estate',
  description: 'A curated selection of the most prestigious properties in the UAE.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      {/* Page Header */}
      <div className="container-x mb-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gradient mb-8">
            DISCOVER<br />
            EXCELLENCE.
          </h1>
          <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            From modern waterfront apartments to minimalist desert villas, explore our exclusive collection of premium real estate across the Emirates.
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <section className="container-x">
        <ProjectsGrid />
      </section>

      {/* Background Accent */}
      <div className="fixed top-0 right-0 h-[600px] w-[600px] glow-mesh -z-10 opacity-20 pointer-events-none" />
    </div>
  );
}
