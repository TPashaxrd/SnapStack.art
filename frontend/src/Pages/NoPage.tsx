export default function NoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] font-inter px-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 bg-[#1A1A1A] backdrop-blur-lg text-gray-100 rounded-2xl shadow-xl border border-gray-800/50 p-10 max-w-md w-full flex flex-col gap-6 items-center text-center">
        <h1 className="text-6xl font-extrabold text-[#6B46C1] drop-shadow-lg tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-100">
          Oops! Page not found.
        </h2>
        <p className="text-gray-300">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transform hover:-translate-y-1 transition-all duration-300"
        >
          Go Back Home
        </button>

        <p className="text-gray-400 text-sm mt-4">SnapStack.art &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}