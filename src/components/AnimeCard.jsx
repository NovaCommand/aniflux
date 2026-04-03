import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "./Toast";

const AnimeCard = ({ anime }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const { showToast } = useToast();
  const inList = isInWatchlist(anime?.mal_id);

  const handleWatchlist = (e) => {
    e.preventDefault(); // prevent Link navigation
    if (inList) {
      removeFromWatchlist(anime.mal_id);
      showToast(`Removed from watchlist`, 'info');
    } else {
      addToWatchlist(anime);
      showToast(`Added to watchlist ✓`, 'success');
    }
  };

  return (
    <div className="flex-shrink-0 w-[150px] group relative">
      <Link to={`/anime/${anime.mal_id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {anime.score && (
            <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded">
              ★ {anime.score}
            </span>
          )}
          <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <p className="text-white text-sm font-medium mt-2 truncate">{anime.title}</p>
      </Link>

      <button
        onClick={handleWatchlist}
        className={`absolute top-2 left-2 text-xs px-2 py-1 rounded transition opacity-0 group-hover:opacity-100 ${
          inList ? 'bg-red-600 text-white' : 'bg-black/60 text-white hover:bg-red-600'
        }`}>
        {inList ? '✓' : '+'}
      </button>
    </div>
  );
};

export default AnimeCard;