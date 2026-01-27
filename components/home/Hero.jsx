"use client";
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const prefersReduced = useReducedMotion();
  return (
    <section className="relative min-h-[80vh] flex items-center bg-black">
      <div className="absolute inset-0 -z-10 bg-black">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
          alt="Hero background"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-neutral-950/40" />
      </div>
      <div className="container-x py-24 text-white">
        <motion.h1
          className="max-w-3xl text-5xl md:text-7xl font-bold leading-tight"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          We design the places where people love to be together.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-base md:text-lg text-neutral-200"
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Premier real estate experiences across Ajman and the Emirates.
        </motion.p>
        <motion.div
          className="mt-10 flex items-center gap-4"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={prefersReduced ? {} : { opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <button className="px-6 py-3 bg-accent text-white rounded focus-ring">Watch our mission in action — 60 sec</button>
          <a href="#properties" className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 focus-ring">Explore our work</a>
        </motion.div>
      </div>
    </section>
  );
}


