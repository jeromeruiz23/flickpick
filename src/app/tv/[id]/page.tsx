
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getTVShowDetails, type TVShow, type Season } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Tv, Play, X, YoutubeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CommentSection from '@/components/CommentSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function TVShowDetailPage() {
  const params = useParams<{ id: string }>();
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(true); // Player is visible by default
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [currentSeasonDetails, setCurrentSeasonDetails] = useState<Season | null>(null);

  useEffect(() => {
    async function fetchShow() {
      if (!params?.id) {
        setIsLoading(false);
        setErrorOccurred(true);
        return;
      }
      try {
        setIsLoading(true);
        const showData = await getTVShowDetails(Number(params.id));
        setTvShow(showData);

        if (showData.videos && showData.videos.results.length > 0) {
          const officialTrailer = showData.videos.results.find(
            video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
          );
          if (officialTrailer) {
            setTrailerKey(officialTrailer.key);
          } else {
            const anyTrailer = showData.videos.results.find(
              video => video.site === 'YouTube' && video.type === 'Trailer'
            );
            if (anyTrailer) {
              setTrailerKey(anyTrailer.key);
            }
          }
        }

        if (showData.seasons && showData.seasons.length > 0) {
          const firstRegularSeason = showData.seasons.find(s => s.season_number > 0 && s.episode_count > 0);
          if (firstRegularSeason) {
            setSelectedSeason(firstRegularSeason.season_number);
          } else {
             const anySeasonWithEpisodes = showData.seasons.find(s => s.episode_count > 0);
             if (anySeasonWithEpisodes) {
                setSelectedSeason(anySeasonWithEpisodes.season_number);
             }
          }
        }
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

  useEffect(() => {
    if (tvShow && selectedSeason !== null) {
      const seasonDetail = tvShow.seasons?.find(s => s.season_number === selectedSeason);
      setCurrentSeasonDetails(seasonDetail || null);
      if (seasonDetail && seasonDetail.episode_count > 0) {
        setSelectedEpisode(1); 
      } else {
        setSelectedEpisode(null);
      }
    } else {
      setCurrentSeasonDetails(null);
      setSelectedEpisode(null);
    }
  }, [selectedSeason, tvShow]);


  const handleTogglePlayer = () => {
     if (tvShow?.id && selectedSeason !== null && selectedEpisode !== null) {
      setPlayerVisible(!playerVisible);
    }
  };

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

  const playerUrl = tvShow && selectedSeason !== null && selectedEpisode !== null ? `https://vidsrc.to/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}` : '';

  const availableSeasons = tvShow.seasons?.filter(s => s.episode_count > 0) || [];
  const canWatch = tvShow?.id && selectedSeason !== null && selectedEpisode !== null;

  return (
    <div className="min-h-screen">
      {tvShow.backdrop_path && (
        <div className="relative h-[40vh] md:h-[50vh] w-full -mx-4 -mt-8 md:-mx-0 md:-mt-0 md:rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'original')}
            alt={`Backdrop for ${tvShow.name}`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            data-ai-hint="tv show scene"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative -mt-24 md:-mt-32">
        <div className="md:flex md:space-x-8 items-start">
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

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Watch Options:</h3>
              
              {availableSeasons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 items-end">
                  <div>
                    <Label htmlFor="season-select" className="text-sm font-medium text-muted-foreground">Season</Label>
                    <Select
                      value={selectedSeason?.toString()}
                      onValueChange={(value) => setSelectedSeason(Number(value))}
                    >
                      <SelectTrigger id="season-select" className="w-full mt-1">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSeasons.map(season => (
                          <SelectItem key={season.id} value={season.season_number.toString()}>
                            {season.name || `Season ${season.season_number}`} ({season.episode_count} episodes)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentSeasonDetails && selectedSeason !== null && currentSeasonDetails.episode_count > 0 && (
                    <div>
                      <Label htmlFor="episode-select" className="text-sm font-medium text-muted-foreground">Episode</Label>
                      <Select
                        value={selectedEpisode?.toString()}
                        onValueChange={(value) => setSelectedEpisode(Number(value))}
                        disabled={!currentSeasonDetails || currentSeasonDetails.episode_count === 0}
                      >
                        <SelectTrigger id="episode-select" className="w-full mt-1">
                          <SelectValue placeholder="Select episode" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: currentSeasonDetails.episode_count }, (_, i) => i + 1).map(epNum => (
                            <SelectItem key={epNum} value={epNum.toString()}>
                              Episode {epNum}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No seasons with episodes available for selection.</p>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                <Button 
                  onClick={handleTogglePlayer} 
                  variant="primary" 
                  size="lg"
                  disabled={!canWatch}
                >
                    <Play className="mr-2 h-5 w-5" /> {playerVisible ? "Hide Player" : "Watch on VidSrc"}
                </Button>
                {trailerKey && (
                  <Dialog open={showTrailerModal} onOpenChange={setShowTrailerModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        <YoutubeIcon className="mr-2 h-5 w-5" /> Watch Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                      <DialogHeader className="sr-only">
                        <DialogTitle>{tvShow.name} Trailer</DialogTitle>
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
                  playerVisible && playerUrl
                    ? "opacity-100 max-h-[70vh] mt-6"
                    : "opacity-0 max-h-0 mt-0"
                )}
              >
                {playerVisible && playerUrl && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          Playing Season {selectedSeason} Episode {selectedEpisode} on VidSrc.
                        </p>
                         <Button onClick={() => setPlayerVisible(false)} variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close Player</span>
                        </Button>
                    </div>
                    <div className="aspect-video bg-black rounded-lg shadow-xl overflow-hidden border border-border">
                        <iframe
                            key={playerUrl} 
                            src={playerUrl}
                            title={`Watch ${tvShow.name} S${selectedSeason}E${selectedEpisode} on VidSrc`}
                            sandbox="allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        ></iframe>
                    </div>
                  </>
                )}
              </div>
            </div>

            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Seasons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tvShow.seasons.filter(s => s.poster_path && s.episode_count > 0).map(season => (
                    <div key={season.id} className="bg-card rounded-lg overflow-hidden shadow-lg">
                      <div className="aspect-[2/3] relative w-full">
                        <Image
                          src={getImageUrl(season.poster_path, 'w300')}
                          alt={season.name || `Season ${season.season_number}`}
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
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
        <CommentSection />
      </div>
    </div>
  );
}
