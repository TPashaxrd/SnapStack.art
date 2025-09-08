import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import axios from "axios";
import { FaComment, FaHeart, FaBell, FaUser, FaUpload } from "react-icons/fa";

export default function ReelsFeed() {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 2;
  const [hasMore, setHasMore] = useState(true);


  const fetchArts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/arts/all-arts?limit=${limit}&skip=${skip}`,
        { withCredentials: true }
      );
  
      if (res.data.length < limit) setHasMore(false);
      setArts(prev => [...prev, ...res.data]);
      setSkip(prev => prev + limit);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArts();
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!hasMore || loading) return;
  //     if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) {
  //       fetchArts();
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [hasMore, loading, skip]);

  if (loading)
    return (
      <p className="text-white text-2xl font-bold animate-pulse min-h-screen flex items-center justify-center">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-xl font-semibold min-h-screen flex items-center justify-center">
        {error}
      </p>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <header className="sticky top-0 bg-gray-800 z-50 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">SnapStack.art</h1>
        <div className="flex items-center gap-4">
          <FaUpload className="cursor-pointer hover:text-purple-300 transition" />
          <FaBell className="cursor-pointer hover:text-yellow-400 transition" />
          <FaUser className="cursor-pointer hover:text-blue-400 transition" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arts.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gray-800"
            >
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.title}
                className="w-full h-64 md:h-72 lg:h-80 object-cover"
              />
              <div className="p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent absolute bottom-0 w-full">
                <h2 className="text-lg md:text-xl font-bold text-purple-400">{item.title}</h2>
                {item.tags.length > 0 && (
                  <p className="text-sm md:text-base text-gray-300 mt-1">Tags: {item.tags.join(", ")}</p>
                )}
                <div className="flex gap-4 mt-2 text-gray-400">
                  <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition">
                    <FaHeart /> <span>{item.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition">
                    <FaComment /> <span>{item.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {hasMore && (
      <div className="flex justify-center mt-8">
        <button
          onClick={fetchArts}
          className="font-inter px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
          🚀 Show More
        </button>
      </div>
    )}



      <Footer />
    </div>
  );
}
