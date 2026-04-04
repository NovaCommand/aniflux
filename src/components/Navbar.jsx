import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      {/* Logo */}
      <Link to="/" className="absolute left-4 top-3 text-2xl font-bold text-white tracking-tight z-50">
        ANI<span className="text-red-500">FLUX</span>
      </Link>

      {/* Right side nav */}
      <div className="absolute right-4 top-3 flex items-center gap-4 z-50">
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/search" className="hover:text-white transition">Browse</Link>
        </div>

        {/* Gear Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-gray-300 hover:text-white transition">
            ⚙️
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-lg z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar — now wrapped in a form */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-black/70 text-white placeholder-gray-500 text-sm px-4 py-2 pr-10 rounded-full outline-none focus:ring-2 focus:ring-red-500 focus:bg-black/80 w-96 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </nav>
  );
};

export default NavBar;