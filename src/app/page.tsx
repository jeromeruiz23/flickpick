
import { getPopularMovies, getPopularTVShows, getTrendingAllWeek, type ContentItem } from '@/lib/tmdb';
import ContentGrid from '@/components/ContentGrid';
import HeroSection from '@/components/HeroSection';
import ContentSlider from '@/components/ContentSlider'; // New import

export default async function HomePage() {
  let popularMovies: ContentItem[] = [];
  let popularTVShows: ContentItem[] = [];
  let trendingItems: ContentItem[] = [];
  let heroItem: ContentItem | null = null;

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
      heroItem = trendingItems[0]; // Use the top trending item for hero
    } else if (popularMovies.length > 0) {
      heroItem = popularMovies[0];
    }

  } catch (error) {
    console.error("Failed to load data for homepage:", error);
    // Data will remain empty, and ContentGrid will show "No items found" or specific error message
  }

  return (
    <div className="space-y-12">
      {heroItem && <HeroSection item={heroItem} />}
      
      {/* New Slider Section for Recommendations */}
      {trendingItems.length > 0 && <ContentSlider items={trendingItems} title="Featured Recommendations" />}
      
      {trendingItems.length > 0 && <ContentGrid items={trendingItems} title="Trending This Week" />}
      {popularMovies.length > 0 && <ContentGrid items={popularMovies} title="Popular Movies" />}
      {popularTVShows.length > 0 && <ContentGrid items={popularTVShows} title="Popular TV Shows" />}
      
      {(popularMovies.length === 0 && popularTVShows.length === 0 && trendingItems.length === 0 && !heroItem) && (
         <div className="text-center py-10">
           <h2 className="text-2xl font-semibold mb-4">Could Not Load Content</h2>
           <p className="text-muted-foreground">There was an issue fetching movies and TV shows. Please try again later.</p>
         </div>
      )}
    </div>
  );
}
