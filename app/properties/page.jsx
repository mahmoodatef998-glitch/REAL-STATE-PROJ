import ProjectsGrid from '../../components/projects/ProjectsGrid';

export const metadata = {
  title: 'Properties | Alrabie Real Estate',
  description: 'Explore our portfolio of premium properties across Ajman and the Emirates.',
};

export default function PropertiesPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Properties</h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Discover our curated collection of exceptional properties designed for modern living
          </p>
        </div>
        <ProjectsGrid />
      </div>
    </div>
  );
}

