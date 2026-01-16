"use client";
import { useState, useEffect, useRef } from 'react';
import { useLatestNews } from '../../hooks/useNews';
import NewsCard from './NewsCard';

export default function NewsCarousel() {
  const { data = [], isLoading } = useLatestNews(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (data.length <= 1 || isLoading) return;

    // Start auto-slide
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % data.length);
      }
    }, 5000); // 5 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data.length, isLoading]);

  // Pause on hover
  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  if (isLoading) {
    return (
      <section className="container-x py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">News & Perspectives</h2>
          <p className="text-neutral-300 mt-2">Loading latest updates...</p>
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="container-x py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">News & Perspectives</h2>
          <p className="text-neutral-300 mt-2">No news available at the moment</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-16">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">News & Perspectives</h2>
        <p className="text-neutral-300 mt-2">Stay informed with our latest insights and project updates</p>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {data.map((news) => (
              <div key={news.id} className="w-full flex-shrink-0 px-3">
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        </div>
        
        {data.length > 1 && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center focus-ring disabled:opacity-50"
              onClick={prevSlide}
              aria-label="Previous news items"
            >
              ←
            </button>
            
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center focus-ring disabled:opacity-50"
              onClick={nextSlide}
              aria-label="Next news items"
            >
              →
            </button>
          </>
        )}
        
        {data.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {data.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-accent' : 'bg-neutral-600'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
