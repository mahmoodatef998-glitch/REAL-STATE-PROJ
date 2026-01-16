import ContactForm from '../../components/contact/ContactForm';

export const metadata = {
  title: 'Contact Us | Alrabie Real Estate',
  description: 'Get in touch with our team for inquiries about properties and services.',
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Contact Us</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="bg-neutral-900 p-6 rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3">Office Address</h3>
                    <p className="text-neutral-300">
                      Alrabie Real Estate<br />
                      Business Bay, Dubai<br />
                      United Arab Emirates
                    </p>
                  </div>
                  
                  <div className="bg-neutral-900 p-6 rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2 text-neutral-300">
                      <p>📞 +971 4 123 4567</p>
                      <p>📱 +971 50 123 4567</p>
                      <p>✉️ info@alrabie.ae</p>
                      <p>🌐 www.alrabie.ae</p>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-900 p-6 rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3">Business Hours</h3>
                    <div className="space-y-1 text-neutral-300">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <p className="text-neutral-300 mb-2">
                      For urgent property matters outside business hours:
                    </p>
                    <p className="text-accent font-semibold">+971 50 999 8888</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
