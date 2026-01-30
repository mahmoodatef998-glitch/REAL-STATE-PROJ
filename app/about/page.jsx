"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const values = [
  { icon: '🎯', title: 'Excellence', description: 'We strive for excellence in every property transaction and client interaction.' },
  { icon: '🤝', title: 'Trust', description: 'Building lasting relationships through transparency and integrity.' },
  { icon: '💡', title: 'Innovation', description: 'Leveraging technology to provide seamless real estate experiences.' },
  { icon: '🌟', title: 'Quality', description: 'Curating the finest properties across the UAE market.' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <div className="container-x mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gradient mb-8">
            REDEFINING<br />
            LIVING STANDARDS.
          </h1>
          <p className="text-white/40 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
            Al Rabie Real Estate is more than a brokerage; we are curators of luxury lifestyles across the United Arab Emirates.
          </p>
        </motion.div>
      </div>

      {/* Narrative Section */}
      <section className="container-x mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Our Philosophy</h2>
            <div className="space-y-6 text-white/50 text-lg leading-relaxed">
              <p>
                Established in the heart of the UAE, Al Rabie has grown into a beacon of architectural appreciation and investment foresight.
                We believe that every home tells a story, and every investment shapes a future.
              </p>
              <p>
                Our methodology combines deep local expertise with a global perspective on luxury. We don't just sell properties;
                We curate spaces that inspire.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square rounded-[3rem] bg-white/5 border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent p-12 flex flex-col justify-end">
              <h4 className="text-4xl font-black text-white mb-2">15+</h4>
              <p className="text-xs font-black uppercase tracking-widest text-accent">Years of Excellence</p>
            </div>
            {/* Decorative lines */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/5 rounded-tr-[3rem]" />
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container-x mb-40">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-4">Core Principles</h2>
          <p className="text-3xl font-bold tracking-tight text-white">The foundations of our success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bento-card group"
            >
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{v.icon}</div>
              <h3 className="text-lg font-bold text-white mb-4">{v.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-x">
        <div className="glow-mesh rounded-[4rem] p-16 md:p-24 text-center border border-white/5 overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">START YOUR<br />JOURNEY.</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/properties"
                className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform"
              >
                BROWSE PORTFOLIO
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-full hover:bg-white/10 transition-all"
              >
                REQUEST CALLBACK
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
