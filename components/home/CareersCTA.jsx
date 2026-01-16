"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CareersCTA() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          alt="Team collaboration"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      <div className="container-x py-24">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            We can&apos;t do it without you
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Join our team of innovators, designers, and visionaries who are shaping the future 
            of real estate in the Emirates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
            >
              Explore Careers →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors focus-ring"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
