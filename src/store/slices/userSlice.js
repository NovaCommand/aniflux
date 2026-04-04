import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  watchlist: loadFromStorage(STORAGE_KEYS.watchlist, []),
  history: loadFromStorage(STORAGE_KEYS.history, []),
  prefs: loadFromStorage(STORAGE_KEYS.prefs, DEFAULT_PREFS),
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
        const exists = state.watchlist.find(a => a.mal_id === action.payload.mal_id);
        if (!exists) {
            state.watchlist.unshift(action.payload);
        }
        localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(state.watchlist));
    },
    removeFromWatchlist: (state, action) => {
        state.watchlist = state.watchlist.filter(a => a.mal_id !== action.payload);
        localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(state.watchlist));
    },
    addToHistory: (state, action) => {
        const { anime, episodeId = 1 } = action.payload;
        state.history = state.history.filter(a => a.mal_id !== anime.mal_id);
        state.history.unshift({ ...anime, lastWatchedEpisode: episodeId });
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
    },
    clearHistory: (state) => {
        state.history = [];
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
    },
    updatePrefs: (state, action) => {
        state.prefs = { ...state.prefs, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(state.prefs));
    }
  }
});

export const { addToWatchlist, removeFromWatchlist, addToHistory, clearHistory, updatePrefs } = userSlice.actions;
export const selectWatchlist = state => state.user.watchlist;
export const selectHistory = state => state.user.history;
export const selectPrefs = state => state.user.prefs;
export const selectIsInWatchlist = mal_id => state => state.user.watchlist.some(a => a.mal_id === mal_id);

export default userSlice.reducer;