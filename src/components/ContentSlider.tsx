
'use client';

import type { ContentItem } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const startAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Only scroll if content overflows
      if (container.scrollWidth <= container.clientWidth) {
        return;
      }

      intervalRef.current = setInterval(() => {
        if (isHovering || document.hidden) { // Pause if hovering or tab is not visible
          return;
        }

        const getEffectiveCardWidth = () => {
          if (container.children.length > 0) {
            const firstCardWrapper = container.children[0] as HTMLElement;
            // Ensure the element is actually part of the DOM and has a width
            if (firstCardWrapper && firstCardWrapper.offsetWidth > 0) {
               return firstCardWrapper.offsetWidth;
            }
          }
          // Fallback based on common Tailwind class, e.g., md:w-[200px]
          // This is an estimate; actual width depends on current viewport.
          // Prioritize measured width.
          if (window.innerWidth >= 768) return 200;
          if (window.innerWidth >= 640) return 175;
          return 150;
        };

        const currentCardWidth = getEffectiveCardWidth();
        const spaceBetweenCards = 16; // from space-x-4 (1rem)

        // Check if we are at the end (or very close to it)
        // Add a small buffer to prevent getting stuck if scrollWidth is not perfectly divisible
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - (currentCardWidth / 2) ) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: currentCardWidth + spaceBetweenCards, behavior: 'smooth' });
        }
      }, 3000); // Scroll every 3 seconds
    };

    startAutoScroll();

    // Re-evaluate on window resize
    const handleResize = () => {
        startAutoScroll();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [items, isHovering]); // Rerun effect if items change or hover state changes

  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3">
          {title}
        </h2>
      )}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
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
    </section>
  );
}
