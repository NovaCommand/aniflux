const BASE_URL = "https://api.jikan.moe/v4";

// Cache: store results so we never call the same endpoint twice
const cache = new Map();

// Queue: ensure requests go out one at a time, 400ms apart
let requestQueue = Promise.resolve();

const queuedFetch = (endpoint) => {
    requestQueue = requestQueue.then(
        () => new Promise(resolve =>  setTimeout(resolve, 400))
    );
    
    return requestQueue.then(async () => {
        // Return cached result if available
        if (cache.has(endpoint)) {
            return cache.get(endpoint);
        }

         const response  = await fetch(`${BASE_URL}${endpoint}`);

         if (!response.ok) {
             throw new Error(`API error: ${response.status}`);
         }
         const json = await response.json();
         cache.set(endpoint, json.data);
         return json.data;
     });

};

const animeService = {
    getTopAnime: () => queuedFetch('/top/anime?limit=12'),
    getSeasonalAnime: () => queuedFetch('/seasons/now?limit=12'),
    searchAnime: (query) => queuedFetch(`/anime?q=${encodeURIComponent(query)}&limit=20`),
    getAnimeById: (id) => queuedFetch(`/anime/${id}`),
    getAnimeEpisodes: (id) => queuedFetch(`/anime/${id}/episodes`),
};

export default animeService;