"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

const disciplines = [
  { name: 'Architecture', icon: '🏛️', description: 'Innovative architectural design that pushes boundaries while honoring local heritage.' },
  { name: 'Interior Design', icon: '🛋️', description: 'Curating spaces that balance luxury, comfort, and functional excellence.' },
  { name: 'Landscape', icon: '🌳', description: 'Sustainable outdoor environments that seamlessly integrate with modern architecture.' },
  { name: 'Sustainability', icon: '🌱', description: 'Committed to green engineering and environmentally responsible real estate solutions.' }
];

export default function Disciplines() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-96 glow-mesh -z-10 opacity-30 rotate-180" />

      <div className="container-x">
        <div className="max-w-3xl mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-gradient mb-8"
          >
            OUR EXPERTISE.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-lg font-medium leading-relaxed"
          >
            Comprehensive design and management services tailored for the elite real estate market. We bridge the gap between vision and reality.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplines.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bento-card group flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl mb-8 block grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                  {item.icon}
                </span>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {item.description}
                </p>
              </div>

              <Link
                href="/disciplines"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-accent transition-colors"
              >
                Learn More <span>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
