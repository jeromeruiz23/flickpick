
import { getPopularMovies, getPopularTVShows, getTrendingAllWeek, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import HeroSection from '@/components/HeroSection';
import ContentSlider from '@/components/ContentSlider';

export default async function HomePage() {
  let popularMovies: ContentItem[] = [];
  let popularTVShows: ContentItem[] = [];
  let trendingItems: ContentItem[] = [];
  let heroItemsList: ContentItem[] = [];

  try {
    const [moviesData, tvShowsData, trendingData] = await Promise.all([
      getPopularMovies(),
      getPopularTVShows(),
      getTrendingAllWeek()
    ]);
    popularMovies = moviesData.results;
    popularTVShows = tvShowsData.results;
    trendingItems = trendingData.results;

    if (trendingItems.length > 0) {
      heroItemsList = trendingItems.slice(0, 5); // Use top 5 trending items for hero banner
    } else if (popularMovies.length > 0) {
      heroItemsList = popularMovies.slice(0,1); // Fallback to first popular movie if no trending
    }

  } catch (error) {
    console.error("Failed to load data for homepage:", error);
    // Data will remain empty, and components will handle their empty states.
  }

  return (
    <div className="space-y-12">
      <HeroSection items={heroItemsList} />
      
      {trendingItems.length > 0 && <ContentSlider items={trendingItems} title="Featured Recommendations" />}
      
      {trendingItems.length > 0 && <ContentGrid items={trendingItems} title="Trending This Week" />}
      {popularMovies.length > 0 && <ContentGrid items={popularMovies} title="Popular Movies" />}
      {popularTVShows.length > 0 && <ContentGrid items={popularTVShows} title="Popular TV Shows" />}
      
      {(popularMovies.length === 0 && popularTVShows.length === 0 && trendingItems.length === 0 && heroItemsList.length === 0) && (
         <div className="text-center py-10">
           <h2 className="text-2xl font-semibold mb-4">Could Not Load Content</h2>
           <p className="text-muted-foreground">There was an issue fetching movies and TV shows. Please try again later.</p>
         </div>
      )}
    </div>
  );
}
