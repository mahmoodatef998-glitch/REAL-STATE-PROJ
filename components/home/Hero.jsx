"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 lg:pt-0">
      {/* Background Mesh Glow */}
      <div className="absolute inset-x-0 top-0 h-[500px] glow-mesh -z-10 opacity-60" />

      <div className="container-x w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-gradient mb-8">
                PREMIER<br />
                ESTATES.<br />
                <span className="text-accent">UAV.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-white/50 max-w-lg mb-12 leading-relaxed font-medium"
            >
              Discover the most exclusive properties in Ajman and across the Emirates. Minimalist design, high-end living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-6"
            >
              <button className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform duration-300">
                Explore Work
              </button>
              <button className="flex items-center gap-3 text-white/80 hover:text-white font-bold transition-all group">
                <span className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/40 transition-all">
                  →
                </span>
                Our Mission
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5"
          >
            <Image
              src="/images/hero-bg.png"
              alt="Luxury Real Estate"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
