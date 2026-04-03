import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import animeService from "../services/animeService";
import AnimeCard from "../components/AnimeCard";

const Search = () => {
  const [searchParam] = useSearchParams();
  const query = searchParam.get("q") || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!query) return;

    let cancelled = false;

    const doSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await animeService.searchAnime(query);
        if (!cancelled) setResults(data);
      }
      catch (err) {
        if (!cancelled) setError(err.message);
      }
      finally {
        if (!cancelled) setLoading(false);
      }
    };

    doSearch();

    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <NavBar />
      <div className="pt-24 px-8">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Results for "${query}"` : 'Browse Anime'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {results.length > 0 ? `${results.length} results found` : ''}
        </p>

        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-[220px] bg-white/10 rounded-lg" />
                  <div className="h-3 bg-white/10 rounded mt-2 w-3/4" />
                </div>
              ))
            : results.map(anime => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))
          }
        </div>

        {!loading && !error && results.length === 0 && query && (
          <p className="text-gray-500 text-center mt-20">
            No results found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;