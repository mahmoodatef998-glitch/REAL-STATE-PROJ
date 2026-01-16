import DisciplinesList from '../../components/disciplines/DisciplinesList';

export const metadata = {
  title: 'Our Disciplines | Alrabie Real Estate',
  description: 'Explore our comprehensive range of design disciplines and expertise.',
};

export default function DisciplinesPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Disciplines</h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Comprehensive expertise across multiple design disciplines to deliver exceptional spaces
          </p>
        </div>
        <DisciplinesList />
      </div>
    </div>
  );
}
