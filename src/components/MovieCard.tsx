
import Image from 'next/image';
import Link from 'next/link';
import type { ContentItem } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils'; // Updated import
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface MovieCardProps {
  item: ContentItem;
}

export default function MovieCard({ item }: MovieCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const itemType = 'title' in item ? 'movie' : 'tv';
  const detailUrl = `/${itemType}/${item.id}`;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <Link href={detailUrl} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/30 hover:border-primary/50">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="aspect-[2/3] relative w-full">
            <Image
              src={getImageUrl(item.poster_path, 'w500')}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="movie poster"
            />
          </div>
          <div className="p-3 flex flex-col flex-grow justify-between bg-card-foreground/5 dark:bg-card-foreground/10">
            <div>
              <h3 className="font-semibold text-sm md:text-base leading-tight truncate group-hover:text-primary transition-colors" title={title}>
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{year}</p>
            </div>
            {item.vote_average > 0 && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
                <span>{item.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
