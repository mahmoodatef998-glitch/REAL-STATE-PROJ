export const metadata = {
  title: 'Sustainability | Alrabie Real Estate',
  description: 'Our commitment to sustainable design and environmental responsibility.',
};

export default function SustainabilityPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Sustainability</h1>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-neutral-300 text-xl leading-relaxed mb-8 text-center">
                We are committed to creating environmentally responsible spaces that minimize impact 
                while maximizing comfort and functionality.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    Our sustainable design approach integrates energy efficiency, renewable materials, 
                    and innovative technologies to create buildings that work harmoniously with their environment.
                  </p>
                  <p className="text-neutral-300 leading-relaxed">
                    From green building certifications to smart home systems, we ensure every project 
                    contributes to a more sustainable future for our communities.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Key Initiatives</h2>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      LEED and BREEAM certified projects
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Solar panel integration
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Water conservation systems
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Smart building technologies
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Sustainable material sourcing
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">50%</div>
                    <div className="text-sm text-neutral-300">Energy Reduction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">100%</div>
                    <div className="text-sm text-neutral-300">Renewable Materials</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">25+</div>
                    <div className="text-sm text-neutral-300">LEED Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">75%</div>
                    <div className="text-sm text-neutral-300">Water Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
