'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { getMovieDetails, type Movie, type ContentItem, getMovieRecommendations } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Clapperboard, Play, YoutubeIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CommentSection from '@/components/CommentSection';
import ContentSlider from '@/components/ContentSlider';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = use(params);
  const movieId = Number(resolvedParams.id);
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [playerVisible, setPlayerVisible] = useState(false); 
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function fetchMovie() {
      if (!movieId) return;
      try {
        setIsLoading(true);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);

        if (movieData.videos?.results) {
          const trailer = movieData.videos.results.find(
            v => v.site === 'YouTube' && v.type === 'Trailer'
          );
          if (trailer) setTrailerKey(trailer.key);
        }

        const recommendationsData = await getMovieRecommendations(movieId);
        setRecommendations(recommendationsData.results);
      } catch (error) {
        console.error("Error loading movie:", error);
        setErrorOccurred(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
  if (errorOccurred || !movie) return <div className="text-center py-20"><h1 className="text-2xl font-bold">Movie not found</h1></div>;

  const playerUrl = `https://vidsrc.sbs/embed/movie/${movie.id}?autoplay=1&color=e50914&sub=en&t=120&controls=0`;

  return (
    <div className="min-h-screen">
      {movie.backdrop_path && (
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-xl text-muted-foreground italic mb-4">{movie.tagline}</p>}
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center text-yellow-400">
                <Star className="fill-current mr-1" size={16} />
                <span className="font-bold text-foreground text-base">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarDays className="mr-1" size={16} />
                {new Date(movie.release_date).getFullYear()}
              </div>
              {movie.runtime && (
                <div className="flex items-center text-muted-foreground">
                  <Clapperboard className="mr-1" size={16} />
                  {movie.runtime} min
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(g => (
                <Badge key={g.id} variant="secondary">{g.name}</Badge>
              ))}
            </div>

            <p className="text-lg leading-relaxed mb-8">{movie.overview}</p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setPlayerVisible(!playerVisible)}>
                <Play className="mr-2" /> {playerVisible ? 'Hide Player' : 'Watch Now'}
              </Button>

              {trailerKey && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg">
                      <YoutubeIcon className="mr-2" /> Trailer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl aspect-video p-0 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {playerVisible && (
              <div className="mt-8 aspect-video bg-black rounded-lg overflow-hidden border border-border">
                <iframe src={playerUrl} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" />
              </div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-16">
            <ContentSlider items={recommendations} title="Recommended Movies" />
          </div>
        )}
        
        <CommentSection />
      </div>
    </div>
  );
}
