# ANIFLUX 🎌

A full-featured anime streaming site built with React.js.

🔗 **Live Demo**: https://aniflux-nine.vercel.app

## Features
- Browse trending and seasonal anime powered by the Jikan (MyAnimeList) API
- Custom HLS video player with keyboard shortcuts
- Search across thousands of anime titles
- Watchlist and watch history saved to localStorage
- Fully responsive dark UI

## Tech Stack
- **React 18** with Vite
- **React Router v6** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **Jikan REST API** — anime data (no API key required)
- **HLS.js** — adaptive bitrate video streaming
- **React Context + localStorage** — persistent user state

## Architecture Highlights
- Custom `useFetch` hook with cancellation to prevent memory leaks
- Request queue + cache layer to respect Jikan's rate limits
- Lazy-loaded routes with `React.lazy` and `Suspense`
- Modular service layer (`animeService.js`) separating API logic from UI

## Running Locally
git clone https://github.com/NovaCommand/aniflux.git
cd aniflux
npm install
npm run dev
