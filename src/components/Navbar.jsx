import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                    ANI<span className="text-red-500">FLUX</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/search" className="hover:text-white transition">Browse</Link>
                    <Link to="/profile" className="hover:text-white transition">Profile</Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-red-500 w-48 transition-all focus:w-64"
                    />
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-full transition">
                        Search
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default NavBar;