"use client";
import { useDisciplines } from '../../hooks/useDisciplines';

export default function DisciplinesList() {
  const { data = [] } = useDisciplines();

  const disciplineDescriptions = {
    'Architecture': 'Comprehensive architectural design services from concept to completion.',
    'Audiovisual Consultancy': 'Expert guidance on audio-visual systems and technology integration.',
    'Brand Activation': 'Creating memorable brand experiences through strategic design.',
    'Design & Build': 'End-to-end design and construction services for seamless project delivery.',
    'Event': 'Specialized event space design and management solutions.',
    'Food & Beverage Strategy': 'Strategic planning for dining and hospitality spaces.',
    'Interior Design': 'Creating beautiful, functional interior spaces that inspire.',
    'Landscape Architecture': 'Sustainable landscape design that enhances outdoor environments.',
    'Urban Design': 'Comprehensive urban planning and city development solutions.',
    'Wayfinding': 'Intuitive navigation systems that guide people through complex spaces.'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((discipline) => (
        <div key={discipline} className="bg-neutral-900 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
          <h3 className="text-xl font-semibold mb-3">{discipline}</h3>
          <p className="text-neutral-300 text-sm leading-relaxed">
            {disciplineDescriptions[discipline] || 'Professional services in this specialized field.'}
          </p>
        </div>
      ))}
    </div>
  );
}
