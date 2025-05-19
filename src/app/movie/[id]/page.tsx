
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getMovieDetails, type Movie } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Clapperboard, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      if (!params?.id) {
        setIsLoading(false);
        setErrorOccurred(true); // No ID, so error
        return;
      }
      try {
        setIsLoading(true);
        const movieData = await getMovieDetails(Number(params.id));
        setMovie(movieData);
        setErrorOccurred(false);
      } catch (error) {
        console.error(`Failed to load movie details for ID ${params.id}:`, error);
        setErrorOccurred(true);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [params]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading movie details...</p>
      </div>
    );
  }

  if (errorOccurred || !movie) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground">The details for this movie could not be loaded. It might not exist or there was a network issue.</p>
      </div>
    );
  }

  const playerUrl = `https://vidsrc.to/embed/movie/${movie.id}`;

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

            <div className="mt-8">
              <Button onClick={() => setShowPlayer(!showPlayer)} variant="primary" size="lg" className="w-full md:w-auto">
                  <Play className="mr-2 h-5 w-5" /> {showPlayer ? 'Hide Player' : 'Watch Now on VidSrc'}
              </Button>
              {showPlayer && (
                  <div className="mt-6 aspect-video bg-black rounded-lg shadow-xl overflow-hidden border border-border">
                      <iframe
                          src={playerUrl}
                          title={`Watch ${movie.title}`}
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          className="w-full h-full"
                      ></iframe>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
