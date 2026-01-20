"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Move newsItems outside component for better performance
const newsItems = [
  {
    id: 1,
    title: "Luxury Waterfront Villa in Dubai Marina",
    category: "Featured Property",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
    description: "Experience ultimate luxury living with panoramic sea views and world-class amenities",
    date: "Nov 2025",
    tag: "Luxury"
  },
  {
    id: 2,
    title: "Modern Penthouse in Downtown Dubai",
    category: "Premium Listing",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
    description: "Stunning contemporary design with breathtaking skyline views from every room",
    date: "Nov 2025",
    tag: "Modern"
  },
  {
    id: 3,
    title: "Elegant Villa in Arabian Ranches",
    category: "Family Home",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    description: "Spacious family villa with private pool, garden, and premium finishes",
    date: "Nov 2025",
    tag: "Family"
  },
  {
    id: 4,
    title: "Contemporary Apartment in Palm Jumeirah",
    category: "Beachfront Living",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    description: "Wake up to stunning beach views in this exclusive island community",
    date: "Nov 2025",
    tag: "Beach"
  },
  {
    id: 5,
    title: "Smart Home Villa in Dubai Hills",
    category: "Smart Living",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    description: "Cutting-edge technology meets luxury in this fully automated smart home",
    date: "Nov 2025",
    tag: "Smart"
  },
  {
    id: 6,
    title: "Exclusive Mansion in Emirates Hills",
    category: "Ultra Luxury",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80",
    description: "Palatial living in Dubai&apos;s most prestigious golf community with unmatched privacy",
    date: "Nov 2025",
    tag: "Exclusive"
  }
];

export default function NewsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-play: change slide every 5 seconds (pause on hover)
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % newsItems.length);
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentItem = newsItems[currentSlide];

  const getTagColor = (tag) => {
    const colors = {
      Luxury: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      Modern: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Family: 'bg-green-500/20 text-green-300 border-green-500/30',
      Beach: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      Smart: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Exclusive: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    };
    return colors[tag] || 'bg-accent/20 text-accent border-accent/30';
  };

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Properties Slideshow"
    >
      {/* Background Images with Fade Transition */}
      {newsItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-x">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="mb-6 animate-fade-in">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${getTagColor(currentItem.tag)}`}>
                {currentItem.tag}
              </span>
            </div>

            {/* Category */}
            <div className="text-accent text-lg font-medium mb-4 animate-fade-in">
              {currentItem.category}
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              {currentItem.title}
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 animate-fade-in">
              {currentItem.description}
            </p>

            {/* CTA Button */}
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20 animate-fade-in"
            >
              <span>Explore Properties</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-all hover:scale-110 focus-ring z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-all hover:scale-110 focus-ring z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${index === currentSlide
                ? 'w-12 bg-accent'
                : 'w-3 bg-white/50 hover:bg-white/70'
              } h-3 rounded-full focus-ring`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium">
        <span className="text-accent">{currentSlide + 1}</span> / {newsItems.length}
      </div>
    </section>
  );
}

