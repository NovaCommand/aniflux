import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import AnimeCard from '../components/AnimeCard';
import { searchAnime, selectSearch, clearSearch } from '../store/slices/animeSlice';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const { data: results, loading, error } = useSelector(selectSearch);

  useEffect(() => {
    if (!query) return;
    dispatch(searchAnime(query));
    return () => dispatch(clearSearch());
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
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
}