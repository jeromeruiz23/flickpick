
import Image from 'next/image';
import Link from 'next/link';
import type { ContentItem } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils'; // Updated import
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

interface HeroSectionProps {
  item: ContentItem;
}

export default function HeroSection({ item }: HeroSectionProps) {
  const title = 'title' in item ? item.title : item.name;
  const itemType = 'title' in item ? 'movie' : 'tv';
  const detailUrl = `/${itemType}/${item.id}`;

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full mb-12 rounded-lg overflow-hidden shadow-xl">
      {item.backdrop_path && (
        <Image
          src={getImageUrl(item.backdrop_path, 'original')}
          alt={`Backdrop for ${title}`}
          fill
          className="object-cover object-center"
          priority
          data-ai-hint="movie scene"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-6 line-clamp-3 drop-shadow-sm">
            {item.overview}
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
