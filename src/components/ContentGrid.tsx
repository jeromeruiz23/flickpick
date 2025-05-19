import type { ContentItem } from '@/lib/tmdb';
import MovieCard from './MovieCard';

interface ContentGridProps {
  items: ContentItem[];
  title?: string;
}

export default function ContentGrid({ items, title }: ContentGridProps) {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map((item) => (
          <MovieCard key={`${item.media_type || ('title' in item ? 'movie' : 'tv')}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
