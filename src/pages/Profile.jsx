import { Link } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { useUser } from '../context/UserContext';
import NavBar from '../components/NavBar';

const Section = ({ title, children }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
};

const EmptyState = ({ message, action, actionLabel, to }) => {
  return (
    <div className="text-center py-12 bg-white/5 rounded-xl">
      <p className="text-gray-500 mb-4">{message}</p>
      {to && (
        <Link to={to}
          className="text-red-400 hover:text-red-300 text-sm transition">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
};

const Profile = () => {
  const {
    watchlist,
    history,
    prefs,
    updatePrefs,
    clearHistory,
    removeFromWatchlist,
  } = useUser();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 pt-24">

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-black">
            A
          </div>
          <div>
            <h1 className="text-3xl font-black">My Profile</h1>
            <p className="text-gray-500 mt-1">
              {watchlist.length} in watchlist · {history.length} watched
            </p>
          </div>
        </div>

        {/* Preferences */}
        <Section title="⚙️ Preferences">
          <div className="bg-white/5 rounded-xl p-6 flex flex-wrap gap-8">

            {/* Sub/Dub */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Audio Preference</p>
              <div className="flex gap-2">
                {['sub', 'dub'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => updatePrefs({ language: opt })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      prefs.language === opt
                        ? 'bg-red-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}>
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Autoplay */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Autoplay Next Episode</p>
              <button
                onClick={() => updatePrefs({ autoplay: !prefs.autoplay })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  prefs.autoplay ? 'bg-red-600' : 'bg-white/20'
                }`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  prefs.autoplay ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

          </div>
        </Section>

        {/* Watchlist */}
        <Section title={`📋 Watchlist (${watchlist.length})`}>
          {watchlist.length === 0 ? (
            <EmptyState
              message="Your watchlist is empty."
              to="/"
              actionLabel="Browse anime"
            />
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {watchlist.map(anime => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </Section>

        {/* Watch History */}
        <Section title={`🕑 Watch History (${history.length})`}>
          {history.length === 0 ? (
            <EmptyState
              message="No watch history yet."
              to="/"
              actionLabel="Start watching"
            />
          ) : (
            <>
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition mb-4">
                Clear history
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map(anime => (
                  <Link
                    key={anime.mal_id}
                    to={`/watch/${anime.mal_id}`}
                    className="flex gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-16 h-22 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{anime.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Episode {anime.lastEpisode}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(anime.watchedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Section>

      </div>
    </div>
  );
};

export default Profile;