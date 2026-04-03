import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import animeService from '../../services/animeService';

// --- Async Thunks ---
export const fetchTopAnime = createAsyncThunk(
  'anime/fetchTop',
  async (offset = 0, { rejectWithValue }) => {
    try {
      return await animeService.getTopAnime(offset);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSeasonalAnime = createAsyncThunk(
  'anime/fetchSeasonal',
  async (offset = 0, { rejectWithValue }) => {
    try {
      return await animeService.getSeasonalAnime(offset);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAnimeById = createAsyncThunk(
  'anime/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await animeService.getAnimeById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAnimeEpisodes = createAsyncThunk(
  'anime/fetchEpisodes',
  async (id, { rejectWithValue }) => {
    try {
      return await animeService.getAnimeEpisodes(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchAnime = createAsyncThunk(
  'anime/search',
  async (query, { rejectWithValue }) => {
    try {
      return await animeService.searchAnime(query);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const animeSlice = createSlice({
  name: 'anime',
  initialState: {
    top:      { data: [], loading: false, error: null },
    seasonal: { data: [], loading: false, error: null },
    detail:   { data: null, loading: false, error: null },
    episodes: { data: [], loading: false, error: null },
    search:   { data: [], loading: false, error: null },
  },
  reducers: {
    clearDetail(state) {
      state.detail = { data: null, loading: false, error: null };
    },
    clearSearch(state) {
      state.search = { data: [], loading: false, error: null };
    },
  },
  extraReducers: (builder) => {

    // Top Anime
    builder
      .addCase(fetchTopAnime.pending,   s => { s.top.loading = true;  s.top.error = null; })
      .addCase(fetchTopAnime.fulfilled, (s, a) => { 
        s.top.loading = false; 
        // Append if offset > 0 (pagination), otherwise replace (initial load)
        s.top.data = a.meta.arg > 0 ? [...s.top.data, ...a.payload] : a.payload;
      })
      .addCase(fetchTopAnime.rejected,  (s, a) => { s.top.loading = false; s.top.error = a.payload; });

    // Seasonal Anime
    builder
      .addCase(fetchSeasonalAnime.pending,   s => { s.seasonal.loading = true;  s.seasonal.error = null; })
      .addCase(fetchSeasonalAnime.fulfilled, (s, a) => { 
        s.seasonal.loading = false; 
        // Append if offset > 0 (pagination), otherwise replace (initial load)
        s.seasonal.data = a.meta.arg > 0 ? [...s.seasonal.data, ...a.payload] : a.payload;
      })
      .addCase(fetchSeasonalAnime.rejected,  (s, a) => { s.seasonal.loading = false; s.seasonal.error = a.payload; });

    // Anime Detail
    builder
      .addCase(fetchAnimeById.pending,   s => { s.detail.loading = true;  s.detail.error = null; })
      .addCase(fetchAnimeById.fulfilled, (s, a) => { s.detail.loading = false; s.detail.data = a.payload; })
      .addCase(fetchAnimeById.rejected,  (s, a) => { s.detail.loading = false; s.detail.error = a.payload; });

    // Episodes
    builder
      .addCase(fetchAnimeEpisodes.pending,   s => { s.episodes.loading = true;  s.episodes.error = null; })
      .addCase(fetchAnimeEpisodes.fulfilled, (s, a) => { s.episodes.loading = false; s.episodes.data = a.payload; })
      .addCase(fetchAnimeEpisodes.rejected,  (s, a) => { s.episodes.loading = false; s.episodes.error = a.payload; });

    // Search
    builder
      .addCase(searchAnime.pending,   s => { s.search.loading = true;  s.search.error = null; })
      .addCase(searchAnime.fulfilled, (s, a) => { s.search.loading = false; s.search.data = a.payload; })
      .addCase(searchAnime.rejected,  (s, a) => { s.search.loading = false; s.search.error = a.payload; });

  },
});

export const { clearDetail, clearSearch } = animeSlice.actions;

// Selectors
export const selectTop      = state => state.anime.top;
export const selectSeasonal = state => state.anime.seasonal;
export const selectDetail   = state => state.anime.detail;
export const selectEpisodes = state => state.anime.episodes;
export const selectSearch   = state => state.anime.search;

export default animeSlice.reducer;