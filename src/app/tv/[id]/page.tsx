'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { getTVShowDetails, type TVShow, type ContentItem, getTVShowRecommendations } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb-utils';
import { Star, CalendarDays, Tv, Play, YoutubeIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import CommentSection from '@/components/CommentSection';
import ContentSlider from '@/components/ContentSlider';

interface TVShowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  const resolvedParams = use(params);
  const tvId = Number(resolvedParams.id);
  
  const [show, setShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function fetchShow() {
      if (!tvId) return;
      try {
        setLoading(true);
        const data = await getTVShowDetails(tvId);
        setShow(data);

        if (data.videos?.results) {
          const trailer = data.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
          if (trailer) setTrailerKey(trailer.key);
        }

        const recs = await getTVShowRecommendations(tvId);
        setRecommendations(recs.results);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [tvId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
  if (error || !show) return <div className="text-center py-20"><h1 className="text-2xl font-bold">Show not found</h1></div>;

  const playerUrl = `https://vidsrc.sbs/embed/tv/${show.id}/${selectedSeason}/${selectedEpisode}?autoplay=1&color=e50914&sub=en&t=120&controls=0`;
  const currentSeason = show.seasons?.find(s => s.season_number === selectedSeason);

  return (
    <div className="min-h-screen pb-12">
      {show.backdrop_path && (
        <div className="relative h-[40vh] md:h-[60vh]">
          <Image src={getImageUrl(show.backdrop_path, 'original')} alt={show.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image src={getImageUrl(show.poster_path, 'w500')} alt={show.name} fill className="object-cover" />
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{show.name}</h1>
            {show.tagline && <p className="text-xl text-muted-foreground italic mb-4">{show.tagline}</p>}
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center text-yellow-400">
                <Star className="fill-current mr-1" size={16} />
                <span className="font-bold text-foreground text-base">{show.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarDays className="mr-1" size={16} />
                {new Date(show.first_air_date).getFullYear()}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Tv className="mr-1" size={16} />
                {show.number_of_seasons} Seasons
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map(g => <Badge key={g.id} variant="secondary">{g.name}</Badge>)}
            </div>

            <p className="text-lg leading-relaxed mb-8">{show.overview}</p>

            <div className="bg-card p-6 rounded-lg border border-border mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Episode</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-40">
                  <Label>Season</Label>
                  <Select value={selectedSeason.toString()} onValueChange={(v) => setSelectedSeason(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {show.seasons?.filter(s => s.season_number > 0).map(s => (
                        <SelectItem key={s.id} value={s.season_number.toString()}>Season {s.season_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-40">
                  <Label>Episode</Label>
                  <Select value={selectedEpisode.toString()} onValueChange={(v) => setSelectedEpisode(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: currentSeason?.episode_count || 1 }).map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>Episode {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => setPlayerVisible(!playerVisible)}>
                  <Play className="mr-2" /> {playerVisible ? 'Hide Player' : 'Watch Now'}
                </Button>

                {trailerKey && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline"><YoutubeIcon className="mr-2" /> Trailer</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl aspect-video p-0 overflow-hidden">
                      <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} className="w-full h-full" allowFullScreen />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {playerVisible && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border">
                <iframe src={playerUrl} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" />
              </div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-16">
            <ContentSlider items={recommendations} title="Recommended Shows" />
          </div>
        )}

        <CommentSection />
      </div>
    </div>
  );
}
