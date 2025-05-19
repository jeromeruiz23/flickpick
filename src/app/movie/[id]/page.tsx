import Image from 'next/image';
import { getMovieDetails, getImageUrl, type Movie } from '@/lib/tmdb';
import { Star, CalendarDays, Users, Clapperboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MovieDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  try {
    const movie = await getMovieDetails(Number(params.id));
    return {
      title: `${movie.title} - FlickPick`,
      description: movie.overview,
    };
  } catch (error) {
    return {
      title: 'Movie Not Found - FlickPick',
      description: 'Details for this movie could not be loaded.',
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  let movie: Movie | null = null;
  let errorOccurred = false;

  try {
    movie = await getMovieDetails(Number(params.id));
  } catch (error) {
    console.error(`Failed to load movie details for ID ${params.id}:`, error);
    errorOccurred = true;
  }

  if (errorOccurred || !movie) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground">The details for this movie could not be loaded. It might not exist or there was a network issue.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-[40vh] md:h-[50vh] w-full -mx-4 -mt-8 md:-mx-0 md:-mt-0 md:rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={`Backdrop for ${movie.title}`}
            fill
            className="object-cover object-center"
            priority
            data-ai-hint="movie scene"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative -mt-24 md:-mt-32">
        <div className="md:flex md:space-x-8 items-start">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 mb-6 md:mb-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                data-ai-hint="movie poster"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-lg text-muted-foreground italic mb-4">{movie.tagline}</p>}
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star size={18} className="mr-1.5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
                <span className="ml-1">({movie.vote_count} votes)</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays size={18} className="mr-1.5" />
                <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clapperboard size={18} className="mr-1.5" />
                  <span>{movie.runtime} minutes</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Overview</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{movie.overview}</p>
            </div>

            {/* Add more sections like Cast, Reviews, etc. here as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
