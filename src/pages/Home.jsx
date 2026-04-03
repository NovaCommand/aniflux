import NavBar from "../components/NavBar";
import AnimeCard from "../components/AnimeCard";
import useFetch from "../hooks/useFetch";
import animeService from "../services/animeService";

const AnimeRow = ({ title, fetchFn }) => {
    const { data, loading, error } = useFetch(fetchFn, []);
    return (
        <section className="mb-10">
            <h2 className="text-white text-xl font-semibold mb-4 px-4">{title}</h2>

            {error && (
                <p className="px-4 text-red-400 text-sm">Failed to load: {error}</p>
            )}

            <div className="flex gap-4 px-4 overflow-x-auto pb-2">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    : data?.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)
                }
            </div>
        </section>
    );
};

const SkeletonCard = () => {
    return (
        <div className="flex-shrink-0 w-[150px] animate-pulse">
            <div className="w-full h-[220px] bg-white/10 rounded-lg" />
            <div className="h-3 bg-white/10 rounded mt-2 w-3/4" />
        </div>
    );
};

const Home = () => {
    // Single call — AnimeRow for Top Rated will use the cached result
    const { data: topAnime, loading: heroLoading } = useFetch(animeService.getTopAnime, []);
    const hero = topAnime?.[0];

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <NavBar />

            {/* Hero Banner */}
            {heroLoading ? (
                // Skeleton while loading
                <div className="h-[70vh] bg-white/5 animate-pulse pt-16 flex items-end">
                <div className="px-8 pb-16 space-y-4 max-w-2xl">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-12 w-96 bg-white/10 rounded" />
                    <div className="h-4 w-80 bg-white/10 rounded" />
                    <div className="h-4 w-64 bg-white/10 rounded" />
                    <div className="flex gap-3 pt-2">
                    <div className="h-11 w-32 bg-white/10 rounded-lg" />
                    <div className="h-11 w-32 bg-white/10 rounded-lg" />
                    </div>
                </div>
                </div>
            ) : (
                <div
                className="relative h-[70vh] flex items-end pt-16"
                style={{
                    backgroundImage: hero?.images?.jpg?.large_image_url
                    ? `url(${hero.images.jpg.large_image_url})`
                    : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundColor: '#1a1a2e',
                }}
                >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />
                <div className="relative z-10 px-8 pb-16 max-w-2xl">
                    <span className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2 block">
                    ⭐ Top Rated
                    </span>
                    <h1 className="text-5xl font-black leading-tight mb-4">
                    {hero?.title}
                    </h1>
                    <p className="text-gray-400 text-base mb-6 leading-relaxed line-clamp-3">
                    {hero?.synopsis}
                    </p>
                    <div className="flex gap-3">
                    <button
                        onClick={() => window.location.href = `/watch/${hero?.mal_id}`}
                        className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition">
                        ▶ Watch Now
                    </button>
                    <button
                        onClick={() => window.location.href = `/anime/${hero?.mal_id}`}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition">
                        ℹ More Info
                    </button>
                    </div>
                </div>
                </div>
            )}

            {/* Anime Rows */}
            <div>
                <AnimeRow title="⭐ Top Rated All Time" fetchFn={animeService.getTopAnime} />
                <AnimeRow title="🌸 Airing This Season" fetchFn={animeService.getSeasonalAnime} />
            </div>
        </div>
    );
};

export default Home;