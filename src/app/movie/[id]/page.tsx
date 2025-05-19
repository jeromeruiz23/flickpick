
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMovieDetails, getImageUrl, type Movie } from '@/lib/tmdb';
import { Star, CalendarDays, Clapperboard, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MovieDetailPageProps {
  params: { id: string };
}

// generateMetadata can remain if we fetch data for it separately or if Next.js handles it
// For client components, metadata should typically be handled by a parent server component or a dedicated metadata export.
// However, Next.js allows exporting generateMetadata from client components if they can be rendered on the server first.
// Let's keep generateMetadata and fetch movie details for it. The main component will re-fetch or use passed data.

// To ensure metadata generation works correctly and initial data is server-rendered,
// we'll fetch movie details once for the server part (metadata and initial render)
// and then the client component will use this data.
// A simpler approach for this specific case is to fetch inside useEffect if the page is fully client,
// but for SEO and initial load, server-fetched data is better.

// Let's adjust the fetching pattern for a client component.
// The initial data can be fetched and passed, or fetched in useEffect.
// For now, we'll assume the initial `movie` prop approach is not used and fetch within the component.
// The `generateMetadata` function will still work as it's hoisted and run on the server.

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
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
  }, [params.id]);
  
  // It's better practice for generateMetadata to be a separate export if the page is client.
  // For simplicity and to match original structure, we keep it here.
  // This function is executed at build time or on demand on the server.
  // const generateMetadata = async ({ params }: MovieDetailPageProps) => { ... } is not needed inside client component.
  // The file level export is sufficient.

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
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

  const vidsrcUrl = `https://vidsrc.to/embed/movie/${movie.id}`;

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
                          src={vidsrcUrl}
                          title={`Watch ${movie.title}`}
                          allowFullScreen
                          className="w-full h-full"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
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

export async function generateMetadata({ params }: MovieDetailPageProps) {
  try {
    // Fetch minimal data needed for metadata
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
