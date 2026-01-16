"use client";
import { useState } from 'react';
import { useLatestNews } from '../../hooks/useNews';
import NewsCard from '../home/NewsCard';

export default function NewsList() {
  const [filter, setFilter] = useState('all');
  const { data = [], isLoading } = useLatestNews(20);

  const filteredNews = filter === 'all' 
    ? data 
    : data.filter(news => news.category.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-neutral-900 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-accent text-white' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'news' 
                ? 'bg-accent text-white' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setFilter('perspectives')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'perspectives' 
                ? 'bg-accent text-white' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Perspectives
          </button>
        </div>
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-neutral-400">Loading news...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}

      {!isLoading && filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-neutral-400">No articles found in this category.</div>
        </div>
      )}
    </div>
  );
}
