import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";

const Home        = lazy(() => import('./pages/Home'));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail'));
const Watch       = lazy(() => import('./pages/Watch'));
const Search      = lazy(() => import('./pages/Search'));
const Profile     = lazy(() => import('./pages/Profile'));
const NotFound    = lazy(() => import('./pages/NotFound'));


const PageLoader = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;