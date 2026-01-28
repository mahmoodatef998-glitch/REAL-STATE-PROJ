"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Full Size */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Luxury Real Estate UAE"
          fill
          priority
          unoptimized
          className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s]"
        />
        {/* Advanced Overlay System */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80 z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
      </div>

      {/* Content Layer */}
      <div className="container-x w-full relative z-20 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">
              Experience Excellence
            </span>
            <h1 className="text-6xl md:text-[7rem] lg:text-[8.5rem] font-black leading-[0.85] tracking-tighter text-gradient pb-4">
              FUTURE<br />
              OF LIVING.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto mb-14 leading-relaxed font-medium"
          >
            Redefining luxury through architectural precision and minimalist design.
            Exclusive properties in Ajman and across the Emirates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            <button className="group relative px-10 py-5 bg-white text-black font-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <span className="relative z-10">EXPLORE PROPERTIES</span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button className="flex items-center gap-4 text-white/80 hover:text-white font-bold transition-all group">
              <span className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              OUR STORY
            </button>
          </motion.div>
        </div>
      </div>

      {/* Hero Footnote / Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-white/60 animate-bounce" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Scroll</span>
      </motion.div>
    </section>
  );
}
