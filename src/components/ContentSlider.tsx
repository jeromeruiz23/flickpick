
'use client';

import type { ContentItem } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentSliderProps {
  items: ContentItem[];
  title?: string;
}

export default function ContentSlider({ items, title }: ContentSliderProps) {
  if (!items || items.length === 0) {
    return title ? <p className="text-muted-foreground">No {title.toLowerCase()} found.</p> : <p  className="text-muted-foreground">No items found.</p>;
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const getEffectiveCardWidth = () => {
    const container = scrollContainerRef.current;
    if (container && container.children.length > 0) {
      const firstCardWrapper = container.children[0] as HTMLElement;
      if (firstCardWrapper && firstCardWrapper.offsetWidth > 0) {
         return firstCardWrapper.offsetWidth;
      }
    }
    if (typeof window !== 'undefined') {
        if (window.innerWidth >= 768) return 200; // md:w-[200px]
        if (window.innerWidth >= 640) return 175; // sm:w-[175px]
    }
    return 150; // w-[150px]
  };
  
  const spaceBetweenCards = 16; // from space-x-4 (1rem)

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1); // -1 for small precision issues
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons(); // Initial check
    container.addEventListener('scroll', checkScrollButtons);

    const startAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (container.scrollWidth <= container.clientWidth) {
        setCanScrollNext(false); // No scroll needed
        return;
      }

      intervalRef.current = setInterval(() => {
        if (isHovering || document.hidden) {
          return;
        }
        
        const currentCardWidth = getEffectiveCardWidth();
        const scrollAmount = currentCardWidth + spaceBetweenCards;

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - (currentCardWidth / 2) ) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 4000); // Scroll every 4 seconds
    };

    startAutoScroll();

    const handleResize = () => {
        checkScrollButtons();
        startAutoScroll(); // Restart to adjust for new widths
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', handleResize);
    };
  }, [items, isHovering]);

  const scrollManually = (direction: 'prev' | 'next') => {
    if (!scrollContainerRef.current) return;
    const currentCardWidth = getEffectiveCardWidth();
    // Scroll by roughly 2-3 cards for a noticeable jump
    const scrollAmount = (currentCardWidth + spaceBetweenCards) * Math.floor(scrollContainerRef.current.clientWidth / (currentCardWidth + spaceBetweenCards) * 0.8) || (currentCardWidth + spaceBetweenCards);

    if (direction === 'prev') {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    // Pause auto-scroll briefly after manual interaction by simulating a hover
    setIsHovering(true);
    setTimeout(() => setIsHovering(false), 5000); // Resume auto-scroll after 5s
  };

  return (
    <section 
      className="mb-12 relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3">
          {title}
        </h2>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 disabled:opacity-0 disabled:cursor-not-allowed",
            !canScrollPrev && "invisible"
          )}
          onClick={() => scrollManually('prev')}
          disabled={!canScrollPrev}
          aria-label="Scroll previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 px-1 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {items.map((item) => (
            <div
              key={`${item.media_type || ('title' in item ? 'movie' : 'tv')}-${item.id}`}
              className="flex-shrink-0 w-[150px] sm:w-[175px] md:w-[200px]"
            >
              <MovieCard item={item} />
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 disabled:opacity-0 disabled:cursor-not-allowed",
            !canScrollNext && "invisible"
          )}
          onClick={() => scrollManually('next')}
          disabled={!canScrollNext}
          aria-label="Scroll next"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}
