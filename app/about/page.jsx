"use client";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-900 py-20">
      <div className="container-x">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About <span className="text-accent">AL RABEI</span> Real Estate
          </h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Your trusted partner in UAE real estate excellence
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Story */}
          <section className="bg-neutral-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              AL RABEI Real Estate has been serving the UAE property market with dedication and professionalism. 
              We specialize in connecting buyers, sellers, and investors with their perfect properties.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              Our team of experienced brokers brings local market knowledge and international standards 
              to every transaction, ensuring our clients receive the best possible service.
            </p>
          </section>

          {/* Our Values */}
          <section className="bg-neutral-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Excellence</h3>
                  <p className="text-neutral-300">
                    We strive for excellence in every property transaction and client interaction.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-4xl">🤝</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Trust</h3>
                  <p className="text-neutral-300">
                    Building lasting relationships through transparency and integrity.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-neutral-300">
                    Leveraging technology to provide seamless real estate experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-4xl">🌟</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Quality</h3>
                  <p className="text-neutral-300">
                    Curating the finest properties across the UAE market.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="bg-neutral-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Our Services</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">Property Sales</h3>
                  <p className="text-neutral-300">Expert guidance through buying and selling properties</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">Property Rentals</h3>
                  <p className="text-neutral-300">Comprehensive rental solutions for landlords and tenants</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">Investment Consultation</h3>
                  <p className="text-neutral-300">Strategic advice for real estate investments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">Property Management</h3>
                  <p className="text-neutral-300">Professional management services for property owners</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-300 mb-6">
              Contact us today to find your perfect property or list your property with us
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/properties"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-neutral-700 text-white font-semibold rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
