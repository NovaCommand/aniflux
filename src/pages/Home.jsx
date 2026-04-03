import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import AnimeCarousel from '../components/AnimeCarousel';
import Footer from '../components/Footer';
import { fetchTopAnime, fetchSeasonalAnime, selectTop, selectSeasonal } from '../store/slices/animeSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { data: allTopAnime } = useSelector(selectTop);
  const [heroAnimes, setHeroAnimes] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    // Fetch hero carousel data independently to prevent interference with row carousel
    if (heroAnimes.length === 0) {
      setHeroLoading(true);
      dispatch(fetchTopAnime()).then((result) => {
        setHeroAnimes(result.payload?.slice(0, 10) || []);
        setHeroLoading(false);
      });
    }
  }, []);

  const topTenAnimes = heroAnimes;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />

      <HeroCarousel animes={topTenAnimes} loading={heroLoading} />

      <div className="mt-6 px-8">
        <AnimeCarousel
            title="⭐ Top Rated All Time"
            selector={selectTop}
            fetchAction={fetchTopAnime}
        />
        <AnimeCarousel
            title="🌸 Airing This Season"
            selector={selectSeasonal}
            fetchAction={fetchSeasonalAnime}
        />
      </div>

      <Footer />
    </div>
  );
}