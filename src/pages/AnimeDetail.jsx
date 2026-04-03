import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import useFetch from "../hooks/useFetch";
import animeService from "../services/animeService";
import { useUser } from "../context/UserContext";

const AnimeDetail = () => {
  const { id } = useParams();
  const { data: anime, loading, error } = useFetch(() => animeService.getAnimeById(id), [id]);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const inList = isInWatchlist(anime?.mal_id);

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-white animate-pulse">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-red-400">Error: {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <NavBar />

      {/* Backdrop */}
      <div className="relative h-[50vh]"
        style={{
          backgroundImage: `url(${anime?.images.jpg.large_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 -mt-32 relative z-10">
        <div className="flex gap-8 items-start">

          {/* Poster */}
          <img
            src={anime?.images.jpg.image_url}
            alt={anime?.title}
            className="w-48 rounded-xl shadow-2xl flex-shrink-0 hidden md:block"
          />

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-black mb-2">{anime?.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{anime?.title_english}</p>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {anime?.score && (
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
                  ★ {anime.score}
                </span>
              )}
              {anime?.year && (
                <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                  📅 {anime.year}
                </span>
              )}
              {anime?.episodes && (
                <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                  🎬 {anime.episodes} eps
                </span>
              )}
              {anime?.status && (
                <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                  {anime.status}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {anime?.genres?.map(g => (
                <span key={g.mal_id}
                  className="bg-red-600/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-600/30">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              {anime?.synopsis}
            </p>

            {/* CTA */}
            <div className="flex gap-3 flex-wrap">
              <Link
                to={`/watch/${id}`}
                className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition">
                ▶ Watch Now
              </Link>

              <button
                onClick={() => inList
                  ? removeFromWatchlist(anime.mal_id)
                  : addToWatchlist(anime)
                }
                className={`px-8 py-3 rounded-lg font-semibold transition ${
                  inList
                    ? 'bg-white/20 hover:bg-white/10 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}>
                {inList ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;