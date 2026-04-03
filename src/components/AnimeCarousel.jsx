import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimeCard from './AnimeCard';
import { useResponsiveCardsPerView } from '../hooks/useResponsiveCardsPerView';

export default function AnimeCarousel({ title, selector, fetchAction }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(selector);
  const responsiveCardsPerView = useResponsiveCardsPerView();
  const [startIdx, setStartIdx] = useState(0);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (data.length === 0 && !loading && !initialLoaded) {
      dispatch(fetchAction(0)).then((result) => {
        setHasMoreToLoad(result.payload?.length >= 12);
        setInitialLoaded(true);
      });
    }
  }, []);

  // Adjust startIdx when responsiveCardsPerView changes to prevent overflow
  useEffect(() => {
    setStartIdx((prev) => Math.max(0, Math.min(prev, Math.max(0, data.length - responsiveCardsPerView))));
  }, [responsiveCardsPerView, data.length]);

  // Pre-fetch next batch of data when approaching the end
  useEffect(() => {
    const nextPageStart = startIdx + responsiveCardsPerView;
    
    // If we're within 2 cards of the next batch boundary and have more to load, pre-fetch
    if (
      nextPageStart + responsiveCardsPerView + 2 >= data.length &&
      hasMoreToLoad &&
      !isLoadingMore &&
      data.length > 0 &&
      initialLoaded
    ) {
      setIsLoadingMore(true);
      const offset = Math.floor(data.length / 12) * 12;
      dispatch(fetchAction(offset)).then((result) => {
        setHasMoreToLoad(result.payload?.length >= 12);
        setIsLoadingMore(false);
      });
    }
  }, [startIdx, responsiveCardsPerView, data.length, hasMoreToLoad, isLoadingMore, initialLoaded]);

  const STEP_SIZE = 2; // Move 2 cards at a time

  const handleNext = () => {
    const nextIdx = startIdx + STEP_SIZE;
    
    // Fetch more data if we're approaching the end
    if (nextIdx + responsiveCardsPerView > data.length && hasMoreToLoad && !isLoadingMore) {
      setIsLoadingMore(true);
      const offset = Math.floor(data.length / 12) * 12;
      dispatch(fetchAction(offset)).then((result) => {
        setHasMoreToLoad(result.payload?.length >= 12);
        setIsLoadingMore(false);
      });
    }
    
    setStartIdx(nextIdx);
  };

  const handlePrev = () => {
    setStartIdx(Math.max(0, startIdx - STEP_SIZE));
  };

  const visibleAnimes = data.slice(startIdx, startIdx + responsiveCardsPerView);
  const canGoNext = startIdx + responsiveCardsPerView < data.length || (hasMoreToLoad && !isLoadingMore);
  const canGoPrev = startIdx > 0;

  // Show nothing while initial data is loading
  if (loading && !initialLoaded) {
    return (
      <section className="mb-10">
        <h2 className="text-white text-xl font-semibold mb-4 px-4">{title}</h2>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-white text-xl font-semibold mb-4 px-4">{title}</h2>
      {error && <p className="px-4 text-red-400 text-sm">Failed to load: {error}</p>}
      
      <div className="flex justify-center">
        <div className="relative px-4 w-full max-w-full">
          {/* Carousel Container */}
          <div className="flex gap-4 overflow-hidden justify-center min-h-[270px] bg-slate-900/80 border border-slate-700 py-4">
            <div className="flex gap-4 pb-2">
              {visibleAnimes.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`absolute left-0 inset-y-0 z-10 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 transition h-full flex items-center justify-center`}>
            ❮
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`absolute right-0 inset-y-0 z-10 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 transition h-full flex items-center justify-center`}>
            ❯
          </button>
        </div>
      </div>

      {/* Loading indicator - subtle, no layout shift */}
      {isLoadingMore && <p className="px-4 text-gray-500 text-xs mt-2">Loading...</p>}
    </section>
  );
}
