
import type { ContentItem } from '@/lib/tmdb';
import MovieCard from './MovieCard';

interface ContentSliderProps {
  items: ContentItem[];
  title?: string;
}

export default function ContentSlider({ items, title }: ContentSliderProps) {
  if (!items || items.length === 0) {
    return title ? <p className="text-muted-foreground">No {title.toLowerCase()} found.</p> : <p  className="text-muted-foreground">No items found.</p>;
  }

  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3">
          {title}
        </h2>
      )}
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {/* 
          You can add Tailwind scrollbar utilities here if desired, e.g.,
          For Webkit (Chrome, Safari, Edge):
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:bg-background 
          [&::-webkit-scrollbar-thumb]:bg-primary/80
          [&::-webkit-scrollbar-thumb]:rounded-full
          
          For Firefox (simpler, might need plugin for full control or rely on newer Tailwind features):
          scrollbar-thin scrollbar-thumb-primary/80 scrollbar-track-background
        */}
        {items.map((item) => (
          <div 
            key={`${item.media_type || ('title' in item ? 'movie' : 'tv')}-${item.id}`} 
            className="flex-shrink-0 w-[150px] sm:w-[175px] md:w-[200px]" // Adjust card widths as needed for a slider
          >
            <MovieCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
