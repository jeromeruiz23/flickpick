
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getTVShowDetails, type TVShow } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Tv, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function TVShowDetailPage() {
  const params = useParams<{ id: string }>();
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    async function fetchShow() {
      if (!params?.id) {
        setIsLoading(false);
        setErrorOccurred(true); // No ID, so error
        return;
      }
      try {
        setIsLoading(true);
        const showData = await getTVShowDetails(Number(params.id));
        setTvShow(showData);
        setErrorOccurred(false);
      } catch (error) {
        console.error(`Failed to load TV show details for ID ${params.id}:`, error);
        setErrorOccurred(true);
        setTvShow(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShow();
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading TV show details...</p>
      </div>
    );
  }

  if (errorOccurred || !tvShow) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">TV Show Not Found</h1>
        <p className="text-muted-foreground">The details for this TV show could not be loaded. It might not exist or there was a network issue.</p>
      </div>
    );
  }

  const playerUrl = `https://vidsrc.to/embed/tv/${tvShow.id}`;

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {tvShow.backdrop_path && (
        <div className="relative h-[40vh] md:h-[50vh] w-full -mx-4 -mt-8 md:-mx-0 md:-mt-0 md:rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'original')}
            alt={`Backdrop for ${tvShow.name}`}
            fill
            className="object-cover object-center"
            priority
            data-ai-hint="tv show scene"
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
                src={getImageUrl(tvShow.poster_path, 'w500')}
                alt={tvShow.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                data-ai-hint="tv show poster"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">{tvShow.name}</h1>
            {tvShow.tagline && <p className="text-lg text-muted-foreground italic mb-4">{tvShow.tagline}</p>}
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star size={18} className="mr-1.5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-foreground">{tvShow.vote_average.toFixed(1)}</span>
                <span className="ml-1">({tvShow.vote_count} votes)</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays size={18} className="mr-1.5" />
                <span>First Aired: {new Date(tvShow.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {tvShow.number_of_seasons && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tv size={18} className="mr-1.5" />
                  <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map(genre => (
                    <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Overview</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{tvShow.overview}</p>
            </div>

            <div className="mt-8">
              <Button onClick={() => setShowPlayer(!showPlayer)} variant="primary" size="lg" className="w-full md:w-auto">
                  <Play className="mr-2 h-5 w-5" /> {showPlayer ? 'Hide Player' : 'Watch Now on VidSrc'}
              </Button>
              {showPlayer && (
                  <div className="mt-6 aspect-video bg-black rounded-lg shadow-xl overflow-hidden border border-border">
                      <iframe
                          src={playerUrl}
                          title={`Watch ${tvShow.name}`}
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          className="w-full h-full"
                      ></iframe>
                  </div>
              )}
            </div>

             {/* Seasons Information */}
            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Seasons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tvShow.seasons.filter(s => s.poster_path && s.season_number > 0).map(season => ( // Filter out "Specials" or seasons without posters
                    <div key={season.id} className="bg-card rounded-lg overflow-hidden shadow-lg">
                      <div className="aspect-[2/3] relative w-full">
                        <Image
                          src={getImageUrl(season.poster_path, 'w300')}
                          alt={season.name || `Season ${season.season_number}`}
                          fill
                          className="object-cover"
                          data-ai-hint="tv season poster"
                        />
                       </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm truncate">{season.name || `Season ${season.season_number}`}</h4>
                        <p className="text-xs text-muted-foreground">{season.episode_count} Episodes</p>
                        {season.air_date && <p className="text-xs text-muted-foreground">Aired: {new Date(season.air_date).getFullYear()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
