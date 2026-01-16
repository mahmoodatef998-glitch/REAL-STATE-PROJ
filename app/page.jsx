import Hero from '../components/home/Hero';
import Disciplines from '../components/home/Disciplines';
import NewsSection from '../components/home/NewsSection';
import ExploreCTA from '../components/home/ExploreCTA';
import FeaturedProjects from '../components/home/FeaturedProjects';
import HighlightedProject from '../components/home/HighlightedProject';
import Sustainability from '../components/home/Sustainability';
import CareersCTA from '../components/home/CareersCTA';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero />
      
      {/* Our Disciplines - Right after Hero */}
      <div className="py-16 md:py-24 bg-neutral-900">
        <Disciplines />
      </div>
      
      {/* News & Perspectives Carousel */}
      <NewsSection />
      
      {/* Explore CTA */}
      <div className="py-16 md:py-24">
        <ExploreCTA />
      </div>
      
      {/* Featured Projects */}
      <div className="py-16 md:py-24 bg-neutral-900">
        <FeaturedProjects />
      </div>
      
      {/* Highlighted Project */}
      <div className="py-16 md:py-24">
        <HighlightedProject />
      </div>
      
      {/* Sustainability */}
      <div className="py-16 md:py-24 bg-neutral-900">
        <Sustainability />
      </div>
      
      {/* Careers CTA */}
      <div className="py-16 md:py-24">
        <CareersCTA />
      </div>
    </div>
  );
}


