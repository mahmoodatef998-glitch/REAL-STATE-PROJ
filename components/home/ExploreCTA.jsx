"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

export default function ExploreCTA() {
  const prefersReduced = useReducedMotion();
  
  return (
    <section className="container-x py-16">
      <motion.div
        className="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-12 text-center"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Discover our portfolio of iconic spaces
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          From luxury villas to commercial developments, explore our curated collection of exceptional properties across the Emirates.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center px-8 py-4 bg-white text-accent font-semibold rounded-lg hover:bg-white/90 transition-colors focus-ring"
        >
          Start Exploring
        </Link>
      </motion.div>
    </section>
  );
}
