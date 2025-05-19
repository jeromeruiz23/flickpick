
# FlickPick - Your Next Movie & TV Show Adventure!

FlickPick is a web application designed to help you discover your next favorite movie or TV show. Browse popular content, search for specific titles, get personalized AI-driven recommendations, watch trailers, and find streaming sources.

## Features

- **Browse Popular Content**: Discover trending movies and TV shows.
- **Detailed Information**: View details for movies and TV shows, including synopses, ratings, release dates, genres, and posters.
- **Search**: Find specific movies and TV shows using the search bar. Search results update as you type.
- **Genre Filtering**: Explore content by selecting specific genres from a dropdown menu.
- **Trailer Viewing**: Watch official trailers directly on the detail pages within a modal.
- **Video Player Integration**: "Watch on VidSrc" button on detail pages to stream content (availability depends on VidSrc).
  - Season and episode selection for TV shows.
- **Personalized Recommendations**:
  - AI-powered recommendations based on your viewing history and preferences.
- **Content Sliders & Hero Banner**:
  - Dynamic, auto-playing hero banner on the homepage featuring trending content with trailer playback.
  - Auto-scrolling content sliders with navigation for featured sections.
- **Anonymous Commenting**: Share your thoughts on movie/TV show pages (comments are session-based).
- **Static Pages**: FAQs and Privacy Policy pages.
- **Responsive Design**: Adapts to different screen sizes.

## Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) (App Router)
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
- **UI**:
  - [ShadCN UI](https://ui.shadcn.com/) (Component Library)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
  - [Lucide React](https://lucide.dev/) (Icons)
- **AI / Generative Features**:
  - [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit) for AI flow orchestration.
  - Google AI (Gemini models) for personalized recommendations.
- **Data Source**:
  - [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for movie and TV show information.
- **Deployment**:
  - Configured for Vercel deployment.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jeromeruiz23/flickpick.git
    cd flickpick
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your TMDB API Key:
    ```env
    TMDB_API_KEY=your_tmdb_api_v4_access_token_here
    ```
    You can get a TMDB API key by creating an account on [TMDB](https://www.themoviedb.org/settings/api) and requesting an API key (specifically, you'll want the "API Read Access Token (v4 auth)").

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **(Optional) Run Genkit development server (for AI features):**
    If you are developing or testing the AI recommendation features, you'll need to run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes
    npm run genkit:watch
    ```
    Ensure your Google AI credentials are set up if you plan to use Genkit features extensively. See the [Genkit documentation](https://firebase.google.com/docs/genkit) for more details.

## Available Scripts

-   `npm run dev`: Starts the Next.js development server (with Turbopack).
-   `npm run genkit:dev`: Starts the Genkit development server.
-   `npm run genkit:watch`: Starts the Genkit development server with auto-reloading.
-   `npm run build`: Creates an optimized production build of the application.
-   `npm run start`: Starts the Next.js production server (after running `build`).
-   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `npm run typecheck`: Runs TypeScript to check for type errors.

## Data Source

All movie and TV show data, including posters, descriptions, and ratings, is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). FlickPick is not endorsed or certified by TMDB.

## Contributing

This project is primarily a demonstration application. Contributions are welcome, but please open an issue first to discuss any major changes.
```