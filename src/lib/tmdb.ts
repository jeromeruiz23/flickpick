const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Ensure this is set in your .env.local file
if (!TMDB_API_KEY) {
  console.warn(
    "TMDB_API_KEY is not set. Please add it to your .env.local file. Some features may not work."
  );
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres?: { id: number; name: string }[];
  media_type?: 'movie';
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres?: { id: number; name: string }[];
  media_type?: 'tv';
}

export type ContentItem = Movie | TVShow;

interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not configured.");
  }
  const urlParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...params,
  });
  const url = `${TMDB_BASE_URL}/${endpoint}?${urlParams.toString()}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate data every hour
    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Network error or JSON parsing error fetching ${url}:`, error);
    throw error;
  }
}

export const getImageUrl = (path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://placehold.co/500x750.png'; // Default placeholder
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export async function getPopularMovies(page: number = 1): Promise<TMDBListResponse<Movie>> {
  return fetchTMDB<TMDBListResponse<Movie>>('movie/popular', { page: page.toString() });
}

export async function getPopularTVShows(page: number = 1): Promise<TMDBListResponse<TVShow>> {
  return fetchTMDB<TMDBListResponse<TVShow>>('tv/popular', { page: page.toString() });
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBListResponse<Movie>> {
  return fetchTMDB<TMDBListResponse<Movie>>('movie/top_rated', { page: page.toString() });
}

export async function getTrendingAllWeek(page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  return fetchTMDB<TMDBListResponse<ContentItem>>('trending/all/week', { page: page.toString() });
}

export async function searchContent(query: string, page: number = 1): Promise<TMDBListResponse<ContentItem>> {
  return fetchTMDB<TMDBListResponse<ContentItem>>('search/multi', { query, page: page.toString(), include_adult: 'false' });
}

export async function getMovieDetails(id: number): Promise<Movie> {
  return fetchTMDB<Movie>(`movie/${id}`);
}

export async function getTVShowDetails(id: number): Promise<TVShow> {
  return fetchTMDB<TVShow>(`tv/${id}`);
}
