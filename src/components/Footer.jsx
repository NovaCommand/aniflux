export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 border-t border-white/10 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold mb-3">AnimeHub</h3>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for anime streaming and discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-red-500 transition text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-400 hover:text-red-500 transition text-sm">
                  Search
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-red-500 transition text-sm">
                  My Watchlist
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Action</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Drama</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Romance</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Comedy</span>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition text-sm">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>
            © {currentYear} AnimeHub. All rights reserved. | Powered by Jikan API
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-red-500 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-red-500 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-red-500 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
