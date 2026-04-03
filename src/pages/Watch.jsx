import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import useFetch from "../hooks/useFetch";
import NavBar from '../components/NavBar';
import animeService from '../services/animeService';
import { useUser } from '../context/UserContext';

const Watch = () => {
  const { id } = useParams();
  const [selectedEp, setSelectedEp] = useState(1);
  const { addToHistory } = useUser();

  const { data: anime } = useFetch(
    () => animeService.getAnimeById(id), [id]
  );

  const { data: episodes, loading: epsLoading } = useFetch(
    () => animeService.getAnimeEpisodes(id), [id]
  );

  useEffect(() => {
    if (anime) {
      addToHistory(anime, selectedEp);
    }
  }, [anime, selectedEp]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <NavBar />

      <div className="pt-16 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 mt-6">

          {/* Left: Player + Info */}
          <div className="flex-1 min-w-0">

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <VideoPlayer
                title={`${anime?.title ?? ''} — Episode ${selectedEp}`}
              />
            </div>

            {/* Episode Title Bar */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{anime?.title}</h1>
                <p className="text-gray-500 text-sm mt-1">Episode {selectedEp}</p>
              </div>
              <Link
                to={`/anime/${id}`}
                className="text-sm text-red-400 hover:text-red-300 transition">
                View Details →
              </Link>
            </div>

            {/* Keyboard Shortcuts hint */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                ['Space', 'Play/Pause'],
                ['← →', 'Skip 10s'],
                ['↑ ↓', 'Volume'],
                ['F', 'Fullscreen'],
                ['M', 'Mute'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 text-xs text-gray-500">
                  <kbd className="bg-white/10 text-gray-300 px-2 py-1 rounded font-mono">
                    {key}
                  </kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Anime Info Strip */}
            {anime && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl flex gap-4 items-start">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-16 h-22 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {anime.genres?.slice(0, 4).map(g => (
                      <span key={g.mal_id}
                        className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">{anime.synopsis}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Episode List */}
          <div className="lg:w-80 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-3">Episodes</h2>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {epsLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                  ))
                : episodes?.length > 0
                  ? episodes.map((ep) => (
                      <button
                        key={ep.mal_id}
                        onClick={() => setSelectedEp(ep.episode_id)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedEp === ep.episode_id
                            ? 'bg-red-600/30 border border-red-500/50'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-xs text-gray-500 mb-0.5">
                          Episode {ep.episode_id}
                        </p>
                        <p className="text-sm font-medium truncate">
                          {ep.title ?? `Episode ${ep.episode_id}`}
                        </p>
                      </button>
                    ))
                  : (
                    // Fallback: generate episode buttons from anime.episodes count
                    Array.from({ length: anime?.episodes ?? 12 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedEp(i + 1)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedEp === i + 1
                            ? 'bg-red-600/30 border border-red-500/50'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-sm font-medium">Episode {i + 1}</p>
                      </button>
                    ))
                  )
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Watch;