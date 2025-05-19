
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ContentItem } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  items: ContentItem[];
}

export default function HeroSection({ items }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsFading(false);
      }, 500); // Corresponds to the fade-out duration
    }, 7000); // Change item every 7 seconds

    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full mb-12 rounded-lg overflow-hidden shadow-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-xl">No featured content available.</p>
      </section>
    );
  }

  const currentItem = items[currentIndex];
  const title = 'title' in currentItem ? currentItem.title : currentItem.name;
  const itemType = 'title' in currentItem ? 'movie' : 'tv';
  const detailUrl = `/${itemType}/${currentItem.id}`;

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full mb-12 rounded-lg overflow-hidden shadow-xl">
      {currentItem.backdrop_path && (
        <Image
          key={currentItem.id} // Ensures Image component re-renders correctly on item change
          src={getImageUrl(currentItem.backdrop_path, 'original')}
          alt={`Backdrop for ${title}`}
          fill
          className="object-cover object-center transition-opacity duration-1000 ease-in-out"
          priority={currentIndex === 0} // Prioritize loading the first image
          data-ai-hint="movie scene"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16">
        <div
          className={`max-w-2xl transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-6 line-clamp-3 drop-shadow-sm">
            {currentItem.overview}
          </p>
          <Link href={detailUrl}>
            <Button variant="primary" size="lg" className="text-lg px-8 py-6">
              <PlayCircle size={24} className="mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
