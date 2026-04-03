import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white">
      <p className="text-8xl font-black text-white/5 mb-0 select-none">404</p>
      <h1 className="text-3xl font-black -mt-6 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 text-center max-w-sm">
        Looks like this episode doesn't exist yet.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;