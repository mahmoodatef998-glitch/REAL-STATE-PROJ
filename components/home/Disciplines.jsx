"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useDisciplines } from '../../hooks/useDisciplines';

export default function Disciplines() {
  const { data = [] } = useDisciplines();
  const prefersReduced = useReducedMotion();

  return (
    <section className="container-x py-16">
      <motion.div
        className="text-center mb-12"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">Our Disciplines</h2>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg max-w-2xl mx-auto">
          Comprehensive expertise across multiple design disciplines to deliver exceptional spaces
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={prefersReduced ? false : { opacity: 0 }}
        whileInView={prefersReduced ? {} : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {data.map((discipline, index) => (
          <motion.div
            key={discipline}
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/disciplines"
              className="inline-block px-6 py-3 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 transition-all duration-300 focus-ring shadow-sm hover:shadow-md"
            >
              {discipline}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
