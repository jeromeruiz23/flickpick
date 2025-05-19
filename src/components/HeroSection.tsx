
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ContentItem } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  items: ContentItem[];
}

export default function HeroSection({ items }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayInterval = 7000; // ms
  const fadeDuration = 500; // ms

  const advanceSlide = useCallback((direction: 'next' | 'prev') => {
    if (!items || items.length <= 1) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === 'next') {
          return (prevIndex + 1) % items.length;
        } else {
          return (prevIndex - 1 + items.length) % items.length;
        }
      });
      setIsFading(false);
    }, fadeDuration);
  }, [items]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (items && items.length > 1) {
      timerRef.current = setInterval(() => {
        advanceSlide('next');
      }, autoPlayInterval);
    }
  }, [items, advanceSlide, autoPlayInterval]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [items, currentIndex, resetTimer]); // Reset timer when items or currentIndex changes

  const handlePrev = () => {
    advanceSlide('prev');
    resetTimer(); // Reset timer on manual interaction
  };

  const handleNext = () => {
    advanceSlide('next');
    resetTimer(); // Reset timer on manual interaction
  };

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
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full mb-12 rounded-lg overflow-hidden shadow-xl group">
      {currentItem.backdrop_path && (
        <Image
          key={currentItem.id} 
          src={getImageUrl(currentItem.backdrop_path, 'original')}
          alt={`Backdrop for ${title}`}
          fill
          className="object-cover object-center transition-opacity duration-1000 ease-in-out"
          priority={currentIndex === 0} 
          data-ai-hint="movie scene"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/30 hover:bg-background/60 text-foreground opacity-70 group-hover:opacity-100 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/30 hover:bg-background/60 text-foreground opacity-70 group-hover:opacity-100 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16">
        <div
          className={cn(
            "max-w-2xl transition-opacity ease-in-out",
            isFading ? 'opacity-0 duration-300' : `opacity-100 duration-[${fadeDuration}ms]`
          )}
          style={{ transitionDuration: `${fadeDuration}ms` }}
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
