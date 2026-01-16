import ProjectDetail from '../../../components/projects/ProjectDetail';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3050/api'}/properties/${id}`);
    if (!response.ok) throw new Error('Property not found');
    
    const { property } = await response.json();
    
    return {
      title: `${property.title} | Alrabie Real Estate`,
      description: property.description || `Explore ${property.title} - Premium property in ${property.emirate}`,
    };
  } catch (error) {
    return {
      title: 'Property Not Found | Alrabie Real Estate',
      description: 'The requested property could not be found.',
    };
  }
}

export default function PropertyDetailPage({ params }) {
  const { id } = params;

  return (
    <div className="pt-16">
      <ProjectDetail projectId={id} />
    </div>
  );
}

