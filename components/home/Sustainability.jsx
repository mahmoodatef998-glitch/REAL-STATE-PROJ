"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

export default function Sustainability() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="container-x py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, x: -50 }}
          whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sustainable Design</h2>
          <p className="text-neutral-300 text-lg mb-6">
            We are committed to creating environmentally responsible spaces that minimize impact 
            while maximizing comfort and functionality. Our sustainable design approach integrates 
            energy efficiency, renewable materials, and innovative technologies.
          </p>
          <p className="text-neutral-300 text-lg mb-8">
            From green building certifications to smart home systems, we ensure every project 
            contributes to a more sustainable future for our communities.
          </p>
          <Link
            href="/sustainability"
            className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
          >
            Learn About Our Impact →
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6"
          initial={prefersReduced ? false : { opacity: 0, x: 50 }}
          whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-neutral-800 p-6 rounded-lg border border-white/10">
            <div className="text-3xl font-bold text-accent mb-2">50%</div>
            <div className="text-sm text-neutral-300">Energy Reduction</div>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg border border-white/10">
            <div className="text-3xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-neutral-300">Renewable Materials</div>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg border border-white/10">
            <div className="text-3xl font-bold text-accent mb-2">LEED</div>
            <div className="text-sm text-neutral-300">Certified Projects</div>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg border border-white/10">
            <div className="text-3xl font-bold text-accent mb-2">25+</div>
            <div className="text-sm text-neutral-300">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
