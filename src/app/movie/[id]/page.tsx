
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getMovieDetails, type Movie, type ContentItem, getMovieRecommendations } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Clapperboard, Play, X, YoutubeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CommentSection from '@/components/CommentSection';
import ContentSlider from '@/components/ContentSlider';

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = Number(params.id);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(true); 
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function fetchMovie() {
      if (!movieId) {
        setIsLoading(false);
        setErrorOccurred(true);
        return;
      }
      try {
        setIsLoading(true);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);

        if (movieData.videos && movieData.videos.results.length > 0) {
          const officialTrailer = movieData.videos.results.find(
            video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
          );
          if (officialTrailer) {
            setTrailerKey(officialTrailer.key);
          } else {
            const anyTrailer = movieData.videos.results.find(
              video => video.site === 'YouTube' && video.type === 'Trailer'
            );
            if (anyTrailer) {
              setTrailerKey(anyTrailer.key);
            }
          }
        }
        setErrorOccurred(false);

        // Fetch recommendations
        const recommendationsData = await getMovieRecommendations(movieId);
        setRecommendations(recommendationsData.results);

      } catch (error) {
        console.error(`Failed to load movie details for ID ${movieId}:`, error);
        setErrorOccurred(true);
        setMovie(null);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  const handleTogglePlayer = () => {
    if (movie?.external_ids?.imdb_id) {
        setPlayerVisible(!playerVisible);
    }
  };

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

  const canWatch = !!movie.external_ids?.imdb_id;
  const playerUrl = canWatch && movie.external_ids.imdb_id ? `https://godriveplayer.com/player.php?imdb=${movie.external_ids.imdb_id}` : '';

  return (
    <div className="min-h-screen">
      {movie.backdrop_path && (
        <div className="relative h-[40vh] md:h-[50vh] w-full -mx-4 -mt-8 md:-mx-0 md:-mt-0 md:rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={`Backdrop for ${movie.title}`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            data-ai-hint="movie scene"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative -mt-24 md:-mt-32">
        <div className="md:flex md:space-x-8 items-start">
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

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Available Actions:</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Button onClick={handleTogglePlayer} variant="primary" size="lg" disabled={!canWatch}>
                    <Play className="mr-2 h-5 w-5" /> {playerVisible && canWatch ? "Hide Player" : "Watch on GoDrivePlayer"}
                </Button>
                {!canWatch && <p className="text-sm text-muted-foreground">IMDb ID not available, cannot play.</p>}
                {trailerKey && (
                  <Dialog open={showTrailerModal} onOpenChange={setShowTrailerModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        <YoutubeIcon className="mr-2 h-5 w-5" /> Watch Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                      <DialogHeader className="sr-only">
                        <DialogTitle>{movie.title} Trailer</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="rounded-md"
                        ></iframe>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div
                className={cn(
                  "transition-all duration-500 ease-in-out overflow-hidden",
                  playerVisible && canWatch && playerUrl
                    ? "opacity-100 max-h-[70vh] mt-6"
                    : "opacity-0 max-h-0 mt-0"
                )}
              >
                {playerVisible && canWatch && playerUrl && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">Playing on: GoDrivePlayer</p>
                        <Button onClick={() => setPlayerVisible(false)} variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close Player</span>
                        </Button>
                    </div>
                    <div className="aspect-video bg-black rounded-lg shadow-xl overflow-hidden border border-border">
                        <iframe
                            key={playerUrl}
                            src={playerUrl}
                            title={`Watch ${movie.title} on GoDrivePlayer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        ></iframe>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-12">
            <ContentSlider items={recommendations} title="You Might Also Like" />
          </div>
        )}
        
        <CommentSection />
      </div>
    </div>
  );
}
