export default function NoPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden p-6">
        
        <div className="absolute -top-24 -left-24 w-44 h-44 bg-purple-500 rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
        <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-pink-500 rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-700/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
  
        <div className="relative z-10 bg-black/60 backdrop-blur-xl text-white rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col gap-6 items-center text-center">
          
          <h1 className="text-6xl font-extrabold text-purple-400 drop-shadow-lg tracking-wide">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white/90">
            Oops! Page not found.
          </h2>
          <p className="text-gray-300">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
  
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Go Back Home
          </button>
  
          <p className="text-gray-400 text-sm mt-4">SnapStack.art &copy; 2025</p>
        </div>
      </div>
    );
  }
  