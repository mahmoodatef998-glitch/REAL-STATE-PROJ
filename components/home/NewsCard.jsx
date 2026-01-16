import Image from 'next/image';
import Link from 'next/link';

export default function NewsCard({ news }) {
  const { title, category, date, thumbnail, link } = news;
  
  return (
    <article className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors focus-ring">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            // Prevent infinite loop if fallback also fails
            const fallbackUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80';
            if (e.target.src !== fallbackUrl) {
              e.target.onerror = null;
              e.target.src = fallbackUrl;
            }
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <time className="text-sm text-neutral-400" dateTime={date}>
          {new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </time>
        
        <h3 className="mt-2 text-lg font-semibold text-white line-clamp-2">
          {title}
        </h3>
        
        <Link 
          href={link}
          className="mt-4 inline-flex items-center text-accent hover:text-accent/80 transition-colors focus-ring"
        >
          View Article →
        </Link>
      </div>
    </article>
  );
}
