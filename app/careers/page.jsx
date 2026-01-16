export const metadata = {
  title: 'Careers | Alrabie Real Estate',
  description: 'Join our team of innovators, designers, and visionaries.',
};

export default function CareersPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Careers</h1>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-neutral-300 text-xl leading-relaxed mb-8 text-center">
                Join our team of innovators, designers, and visionaries who are shaping the future 
                of real estate in the Emirates.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Why Join Us?</h2>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Work on innovative projects across the UAE
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Collaborative and inclusive work environment
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Professional development opportunities
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Competitive compensation and benefits
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      Flexible work arrangements
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
                  <div className="space-y-4">
                    <div className="bg-neutral-900 p-4 rounded-lg border border-white/10">
                      <h3 className="font-semibold mb-2">Senior Architect</h3>
                      <p className="text-sm text-neutral-400 mb-2">Full-time • Dubai</p>
                      <p className="text-sm text-neutral-300">Lead architectural design for luxury residential projects.</p>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-lg border border-white/10">
                      <h3 className="font-semibold mb-2">Project Manager</h3>
                      <p className="text-sm text-neutral-400 mb-2">Full-time • Ajman</p>
                      <p className="text-sm text-neutral-300">Oversee project delivery from conception to completion.</p>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-lg border border-white/10">
                      <h3 className="font-semibold mb-2">Interior Designer</h3>
                      <p className="text-sm text-neutral-400 mb-2">Full-time • Sharjah</p>
                      <p className="text-sm text-neutral-300">Create stunning interior spaces for commercial and residential projects.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Ready to Join Our Team?</h2>
                <p className="text-neutral-300 mb-6">
                  Send us your resume and portfolio to careers@alrabie.ae
                </p>
                <button className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
