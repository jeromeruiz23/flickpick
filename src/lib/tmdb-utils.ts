
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const getImageUrl = (path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) {
    // Updated placeholder to match requested dimensions if possible, but using a generic one.
    // For a 2:3 aspect ratio like posters, 500x750 is good. For backdrops, it varies.
    // Using a generic placeholder, specific aspect ratio placeholders can be complex.
    return 'https://placehold.co/500x750.png'; 
  }
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};
