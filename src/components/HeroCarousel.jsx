import { useState, useEffect } from 'react';

export default function HeroCarousel({ animes, loading }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!animes || animes.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animes.length);
    }, 6000); // Auto-rotate every 6 seconds

    return () => clearInterval(interval);
  }, [animes]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + (animes?.length || 1)) % (animes?.length || 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % (animes?.length || 1));
  };

  const hero = animes?.[current];

  if (loading) {
    return (
      <div className="h-[70vh] bg-white/5 animate-pulse pt-16 flex items-end">
        <div className="px-8 pb-16 space-y-4 max-w-2xl">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-12 w-96 bg-white/10 rounded" />
          <div className="h-4 w-80 bg-white/10 rounded" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 bg-white/10 rounded-lg" />
            <div className="h-11 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] flex items-end pt-16 overflow-hidden group">
      {/* Background slides */}
      {animes?.map((anime, idx) => (
        <div
          key={anime.mal_id}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}>
          <img
            src={anime?.images?.jpg?.large_image_url}
            alt={anime?.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 px-8 pb-16 max-w-2xl w-full">
        <span className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
          ⭐ Top Rated
        </span>
        <h1 className="text-5xl font-black leading-tight mb-4">{hero?.title}</h1>
        <p className="text-gray-400 text-base mb-6 leading-relaxed line-clamp-3">
          {hero?.synopsis}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = `/watch/${hero?.mal_id}`)}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition">
            ▶ Watch Now
          </button>
          <button
            onClick={() => (window.location.href = `/anime/${hero?.mal_id}`)}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition">
            ℹ More Info
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-0 bottom-0 z-20 text-white transition opacity-0 group-hover:opacity-100 w-20 flex items-center justify-center bg-transparent hover:bg-black/50"
        aria-label="Previous slide">
        <span className="text-5xl font-bold drop-shadow-lg">‹</span>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 z-20 text-white transition opacity-0 group-hover:opacity-100 w-20 flex items-center justify-center bg-transparent hover:bg-black/50"
        aria-label="Next slide">
        <span className="text-5xl font-bold drop-shadow-lg">›</span>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {animes?.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition ${
              idx === current ? 'bg-red-600 w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-20 text-white/70 text-sm font-semibold">
        {current + 1} / {animes?.length || 0}
      </div>
    </div>
  );
}
