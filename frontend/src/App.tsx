import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import axios from "axios";
import { FaComment, FaEye, FaHeart } from "react-icons/fa";
import Header from "./Components/Header";
import { BsEye } from "react-icons/bs";

export default function ReelsFeed() {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 7;
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
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div onClick={() => window.location.href = "/create-arts"} className="text-center text-3xl font-roboto-condensed text-red-600 bg-black rounded-xl px-1 py-1 hover:text-red-600/70 mb-2">
          Share Your Art's!
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arts.map((item) => (
          <div
            key={item._id}
            onClick={() => window.location.href = `/art/${item._id}`}
            className="group relative rounded-2xl overflow-hidden cursor-pointe bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-lg hover:shadow-purple-600/30 transition-all duration-500"
          >
            <div className="flex items-center gap- p-2 absolute top-2 bg-black/60 backdrop-blur-md rounded-full z-10">
              <img
                className="h-8 rounded-full"
                src={item.user.avatarUrl}
                alt="Avatar"
              />
              <span className="font-inter text-md text-white">{item.user.username}</span>
            </div>

            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
              <h2 className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition">
                {item.title}
              </h2>

              {item.tags.length > 0 && (
                <p className="text-xs text-gray-300 mt-1">
                  #{item.tags.join(" ,")}
                </p>
              )}

              <div className="flex gap-6 mt-3">
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition">
                  <FaHeart className="w-4 h-4" /> <span>{item.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition">
                  <FaComment className="w-4 h-4" /> <span>{item.comments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition">
                  <FaEye size={20} /> <span>{item.view}</span> 
                </button>
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