import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const STORAGE_KEYS = {
  watchlist: 'aniflux_watchlist',
  history:   'aniflux_history',
  prefs:     'aniflux_prefs',
};

const DEFAULT_PREFS = {
  language: 'sub',
  autoplay: true,
  theme: 'dark',
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const UserProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(
    () => loadFromStorage(STORAGE_KEYS.watchlist, [])
  );
  const [history, setHistory] = useState(
    () => loadFromStorage(STORAGE_KEYS.history, [])
  );
  const [prefs, setPrefs] = useState(
    () => loadFromStorage(STORAGE_KEYS.prefs, DEFAULT_PREFS)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(prefs));
  }, [prefs]);

  const addToWatchlist = (anime) => {
    setWatchlist(prev => {
      if (!Array.isArray(prev)) return [anime];
      if (prev.find(a => a.mal_id === anime.mal_id)) return prev;
      return [anime, ...prev];
    });
  };

  const removeFromWatchlist = (mal_id) => {
    setWatchlist(prev =>
      Array.isArray(prev) ? prev.filter(a => a.mal_id !== mal_id) : []
    );
  };

  const isInWatchlist = (mal_id) => {
    return Array.isArray(watchlist) && watchlist.some(a => a.mal_id === mal_id);
  };

  const addToHistory = (anime, episodeId = 1) => {
    setHistory(prev => {
      const base = Array.isArray(prev) ? prev : [];
      const filtered = base.filter(a => a.mal_id !== anime.mal_id);
      return [
        {
          ...anime,
          lastEpisode: episodeId,
          watchedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 50);
    });
  };

  const clearHistory = () => setHistory([]);

  const updatePrefs = (updates) => {
    setPrefs(prev => ({ ...(prev ?? DEFAULT_PREFS), ...updates }));
  };

  const safeWatchlist = Array.isArray(watchlist) ? watchlist : [];
  const safeHistory   = Array.isArray(history)   ? history   : [];
  const safePrefs     = prefs ?? DEFAULT_PREFS;

  return (
    <UserContext.Provider value={{
      watchlist:           safeWatchlist,
      history:             safeHistory,
      prefs:               safePrefs,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      addToHistory,
      clearHistory,
      updatePrefs,
    }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export { UserProvider, useUser };